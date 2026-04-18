from contextlib import asynccontextmanager
from dataclasses import dataclass
from fastapi import Body, FastAPI
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from langchain.agents import AgentState, create_agent
from langchain.chat_models import init_chat_model
from langchain.tools import ToolRuntime, tool
from typing import Annotated, Any, Literal
from pydantic import BaseModel, Field
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.store.postgres import PostgresStore
from langchain.agents.middleware import Runtime, SummarizationMiddleware, after_model
from rich.console import Console
import json
import os
from psycopg_pool import ConnectionPool
from psycopg.rows import dict_row

console = Console()

load_dotenv(override=True)
advanced_model = init_chat_model(model="openai/gpt-oss-120b", model_provider="groq")
basic_model = init_chat_model(model="openai/gpt-oss-20b", model_provider="groq")

agent = None


cities = {
    "tegucigalpa": "40 grados celcios, caliente",
    "comayaguela": "29 grados celcios, clima un poco caliente",
    "san pedro sula": "34 grados, caliente",
}


# def search_vector(query: str):
#     GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or ""
#     gemini_client = gemini_embedder.GeminiEmbedder(GEMINI_API_KEY)

#     VECTOR_DATABASE_URL = os.environ.get("VECTOR_DATABASE_URL") or ""
#     vector_database_client = VectorDatabase(database_url=VECTOR_DATABASE_URL)

#     emb = gemini_client.embed_query(query)
#     hits = vector_database_client.search(emb)

#     result = {"query": query, "matches": hits}
#     return result


@dataclass
class UserContext:
    """Custom user data"""

    user_id: str


@after_model
def validate_response(
    state: AgentState, runtime: Runtime[UserContext | None]
) -> dict | None:
    """Remove messages containing sensitive words."""
    STOP_WORDS = ["password", "secret", "wtf"]
    last_message = state["messages"][-1]

    messages = state["messages"]
    console.print(messages)

    for word in STOP_WORDS:
        if word in last_message.content:
            console.print(f"Agent response: {word}")

    return None


@tool
def get_user_info(runtime: ToolRuntime[UserContext]) -> str:
    """Look user information"""

    assert runtime.store is not None  # Is this is false, then return error
    user_id = runtime.context.user_id

    console.print({"user_id": user_id})
    namespace = ("users", "memories")
    user_info = runtime.store.get(namespace, user_id)

    user_data = str(user_info.value) if user_info else "Unknown user"

    console.print(user_data)
    return user_data


class UserInfo(BaseModel):
    """User information to save"""

    model_config = {"extra": "forbid"}

    name: str = Field(description="User's name")
    preferences: str = Field(description="User's preferences")
    notes: str = Field(description="Additional notes about the user")


@tool
def save_user_info(user_info: UserInfo, runtime: ToolRuntime[UserContext]) -> str:
    """Save user information"""

    assert runtime.store is not None

    store = runtime.store
    user_id = runtime.context.user_id

    namespace = ("users", "memories")

    existing = store.get(namespace, user_id)
    existing_data = existing.value if existing else {}
    existing_data.update(user_info.model_dump(exclude_defaults=True))

    console.print(f"[*] User memories {existing_data}")

    store.put(namespace, user_id, dict(existing_data))
    return "Succesfully saved user information"


class ResponseFormat(BaseModel):
    """Response format for the agent. The response field is ALWAYS required and must be a non-empty string."""

    response: str | None = Field(
        default=None,
        description="Conversational response.",
    )
    code: str | None = Field(
        default=None,
        description="The generated code. Set to null when operation_type is 'normal'.",
    )
    operation_type: Literal["code", "normal"]


class ResumeFormat(BaseModel):
    """Format to respond"""

    code_explanation: str = Field(description="Explanation code")


SHORT_TERM_DB_URI = os.environ.get("SHORT_TERM_MEMORY_DB_URL") or ""
LONG_TERM_DB_URI = os.environ.get("LONG_TERM_MEMORY_DATABASE_URL") or ""


# LangGraph requires these settings on every connection it uses.
POOL_KWARGS = {
    "autocommit": True,
    "prepare_threshold": 0,
    "row_factory": dict_row,
}


@asynccontextmanager
async def lifespan(_):
    global agent
    global summarizer_agent

    with (
        ConnectionPool(
            conninfo=SHORT_TERM_DB_URI,
            min_size=0,
            max_size=10,
            max_idle=300,
            check=ConnectionPool.check_connection,
            kwargs=POOL_KWARGS,
        ) as short_term_pool,
        ConnectionPool(
            conninfo=LONG_TERM_DB_URI,
            min_size=0,
            max_size=10,
            max_idle=300,
            check=ConnectionPool.check_connection,
            kwargs=POOL_KWARGS,
        ) as long_term_pool,
    ):
        checkpointer = PostgresSaver(short_term_pool)  # type: ignore
        store = PostgresStore(long_term_pool)  # type: ignore

        store.setup()
        checkpointer.setup()

        agent = create_agent(
            model="gpt-5",
            system_prompt="""\
You are a senior developer specialized in creating email templates using React Email. Use emojis at the first message

## React Email Code Generation

### Format Rules
1. Do NOT use `import` or `require` statements. All components from `@react-email/components` are already available as global variables.
2. The final component MUST be assigned to a variable called `Email` or `Default`.
3. Use arrow functions or function declarations for the component.
4. Do NOT use `export default`, `export`, or `module.exports`.
5. Do NOT use `process`, `eval`, `Function()`, `globalThis`, `__proto__`, `fs`, `child_process`, `exec`, or `spawn` — these are blocked and will cause an error.
6. The code will be transpiled by Babel with `@babel/preset-react`, so JSX is supported.

### Available Components (global, no imports needed)
- `Html` — Root wrapper for the email document
- `Head` — Place `<meta>` tags, `<title>`, `Font`, etc.
- `Body` — The `<body>` of the email
- `Container` — Centered content wrapper with max-width
- `Section` — Groups related content (like a `<table>` row)
- `Row` — A row inside a `Section`
- `Column` — A column inside a `Row`
- `Text` — Paragraph text (`<p>`)
- `Heading` — Heading (`<h1>`–`<h6>`)
- `Link` — Anchor link (`<a>`)
- `Button` — Call-to-action button styled as a link
- `Img` — Image (`<img>`)
- `Hr` — Horizontal rule
- `Preview` — Preview text shown in email clients before opening
- `Font` — Load custom fonts (place inside `Head`)
- `CodeBlock` — Code block with syntax highlighting
- `CodeInline` — Inline code
- `Markdown` — Render markdown content

### Correct Example
```jsx
const Email = ({ recipientName = "there", ... } = {}) => (
  <Html>
    <Head />
    <Preview>Welcome to our platform</Preview>
    <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
      <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <Heading style={{ color: "#333", textAlign: "center" }}>Welcome!</Heading>
        <Text style={{ color: "#555", fontSize: "16px" }}>
          Thanks for signing up. We are excited to have you on board.
        </Text>
        <Section style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            href="https://example.com/get-started"
            style={{
              backgroundColor: "#5469d4",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            Get Started
          </Button>
        </Section>
        <Hr style={{ borderColor: "#e6ebf1", margin: "20px 0" }} />
        <Text style={{ color: "#8898aa", fontSize: "12px", textAlign: "center" }}>
          © 2026 Our Company. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);
```

### Common Mistakes to AVOID
- ❌ `import { Html, Body } from "@react-email/components"` → Components are already global
- ❌ `export default Email` → Just define `const Email = ...`
- ❌ Using `className` → Use inline `style` objects instead (email clients don't support CSS classes well)
- ❌ Using `require()` or dynamic `import()` → Blocked for security

### Response Format for Email Generation
When generating email code:
- Set `operation_type` to `"code"`
- Put the JSX code in the `code` field
- Set `response` to `null`

## General Behavior
- At the start of every conversation, call `get_user_info` to retrieve user context.
- When the user shares personal information or preferences, call `save_user_info` to persist it.
- Respond in the same language the user writes in.
""",
            checkpointer=checkpointer,
            response_format=ResponseFormat,
            middleware=[
                validate_response,
                SummarizationMiddleware(
                    model=basic_model,
                    trigger=("tokens", 4000),
                    keep=("messages", 10),
                ),
            ],
            tools=[get_user_info, save_user_info],
            store=store,  # type: ignore
            context_schema=UserContext,
        )

        summarizer_agent = create_agent(
            model=advanced_model,
            system_prompt="""You are system agent that explain what did you do when edit the code. make list, be short in most of the cases""",
            response_format=ResumeFormat,
            checkpointer=checkpointer,
        )

        yield


app = FastAPI(lifespan=lifespan)


class UserInteractionData(BaseModel):
    message: str = Field(min_length=1, max_length=10000)
    user_id: str = Field(min_length=10)
    thread_id: str = Field(min_length=10)

    model_config = {"extra": "forbid"}


@app.post("/")
def send_message_to_agent(data: Annotated[UserInteractionData, Body()]):
    user_data = data.model_dump()

    console.print({"thread_id": user_data["thread_id"]})

    response = agent.invoke(  # type: ignore
        {
            "messages": [
                {
                    "role": "user",
                    "content": user_data["message"],
                }
            ]
        },
        {"configurable": {"thread_id": user_data["thread_id"]}},
        context=UserContext(user_id=user_data["user_id"]),
    )

    structured = response["structured_response"]

    if structured.operation_type == "code":
        global summarization
        global code_explanation

        # for chunk in summarizer_agent.stream(
        #     {
        #         "messages": [
        #             {
        #                 "role": "assistant",
        #                 "content": f"""
        #                 This is the code that the agent (you) made explain it:
        #                 {structured.code}
        #                 """,
        #             }
        #         ]
        #     },
        #     {"configurable": {"thread_id": user_data["thread_id"]}},
        #     context=UserContext(user_id=user_data["user_id"]),
        #     stream_mode="messages",
        #     version="v2",
        # ):
        #     if chunk["type"] == "messages":
        #         token, metadata = chunk["data"]

        #         if token.content:
        #             console.print(token.content, end="")
        #     pass

        # summarization_structured = summarization["structured_response"]
        # code_explanation = summarization_structured.code_explanation

        summarization = summarizer_agent.invoke(
            {
                "messages": [
                    {
                        "role": "assistant",
                        "content": f"""
                            This is the code that the agent (you) made explain it:
                            {structured.code} 
                            """,
                    }
                ]
            },
            {"configurable": {"thread_id": user_data["thread_id"]}},
            context=UserContext(user_id=user_data["user_id"]),
        )

        summarization_structured = summarization["structured_response"]
        code_explanation = summarization_structured.code_explanation

    return {
        "response": structured.response or code_explanation,
        "code": structured.code,
        "operation_type": structured.operation_type,
    }
