import psycopg
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb
from pgvector.psycopg import register_vector
from typing import Any, Dict, List


class VectorDatabase:
    def __init__(self, database_url: str):
        self.database_url = database_url

    def _conn(self):
        conn = psycopg.connect(self.database_url, row_factory=dict_row)  # type: ignore
        register_vector(conn)
        return conn

    def insert_chunk(
        self, content: str, metadata: Dict[str, Any], embedding: List[float]
    ):
        sql = """
    INSERT INTO public.documents1 (content,metadata,embedding)
    values (%s,%s,%s)
    """

        with self._conn() as conn, conn.cursor() as cursor:
            cursor.execute(sql, (content, Jsonb(metadata), embedding))

    def search(self, query_emb, similarity_results: int = 3):
        sql = """
    SELECT * FROM public.match_documents1 (%s::vector(3072), %s, %s)
    """

        with self._conn() as conn, conn.cursor() as cursor:
            cursor.execute(sql, (query_emb, similarity_results, Jsonb({})))
            rows = cursor.fetchall()

        return [
            {
                "id": int(r["id"]),  # type: ignore
                "content": r["content"],  # type: ignore
                "metadata": r["metadata"] or {},  # type: ignore
                "similarity": float(r["similarity"]),  # type: ignore
            }
            for r in rows
        ]
