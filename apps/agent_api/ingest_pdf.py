import sys
import os
from pathlib import Path
from pypdf import PdfReader
from dotenv import load_dotenv
from gemini_embedder import GeminiEmbedder
from vector_database import VectorDatabase


def extract_text_pdf(path: str):
    reader = PdfReader(path)
    pages = []
    for i, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text:
            pages.append({"page": i, "text": text})

    return pages


def chunk_text(text: str, size: int = 500, overlap: int = 100) -> list[str]:
    chunks = []
    start = 0

    while start < len(text):
        end = start + size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap

    return chunks


def main():
    pdf_path = sys.argv[1] if len(sys.argv) > 1 else None

    if not pdf_path or not os.path.exists(pdf_path):
        raise ValueError("PDf path invalid.")

    pdf_file_path = Path(pdf_path)
    is_pdf = True if pdf_file_path.suffix.lower() == ".pdf" else False

    if not is_pdf:
        raise ValueError("Provide a PDF file.")

    pages = extract_text_pdf(pdf_path)

    load_dotenv()
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    VECTOR_DATABASE_URL = os.environ.get("VECTOR_DATABASE_URL")

    if not GEMINI_API_KEY or not VECTOR_DATABASE_URL:
        raise NotImplementedError("GEMINI API KEY IS REQUIRED")

    embedder = GeminiEmbedder(api_key=GEMINI_API_KEY)
    vector_database = VectorDatabase(database_url=VECTOR_DATABASE_URL)

    for page in pages:
        chunks = chunk_text(page["text"])

        for chunk in chunks:
            vectors = embedder.embed_document(chunk)
            vector_database.insert_chunk(chunk, {"page": page["page"]}, vectors)
            print(vectors)

    if not chunks:
        raise ValueError("There is not chunks")

    print("chunks inserted in database correctly.")


if __name__ == "__main__":
    main()
