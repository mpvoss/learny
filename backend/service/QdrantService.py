import os
from typing import List, Tuple
from openai import OpenAI
from qdrant_client import QdrantClient
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.core import StorageContext
from llama_index.core import Settings


client = OpenAI()


def sparse_doc_vectors(
    texts: List[str],
) -> Tuple[List[List[int]], List[List[float]]]:
    indices_list = []
    values_list = []

    for text in texts:
        embedding = (
            client.embeddings.create(input=[text], model="text-embedding-ada-002")
            .data[0]
            .embedding
        )
        indices = []
        values = []

        # Assuming the embedding returns a dense list, we convert it to a sparse representation
        for index, value in enumerate(embedding):
            if value != 0:
                indices.append(index)
                values.append(float(value))

        indices_list.append(indices)
        values_list.append(values)

    return indices_list, values_list


def sparse_query_vectors(
    texts: List[str],
) -> Tuple[List[List[int]], List[List[float]]]:
    return sparse_doc_vectors(texts)


class QDrantService:
    vector_store: QdrantVectorStore = None
    client: QdrantClient = None

    def __init__(self):
        self.client = QdrantClient(
            url=os.environ["QDRANT_URL"],
            api_key=os.environ["QDRANT_API_KEY"],
        )

        self.vector_store = QdrantVectorStore(
            "learny_docs",
            client=self.client,
            sparse_doc_fn=sparse_doc_vectors,
            sparse_query_fn=sparse_query_vectors,
            enable_hybrid=True,
            batch_size=20,
        )

        self.storage_context = StorageContext.from_defaults(
            vector_store=self.vector_store
        )
        Settings.chunk_size = 512
