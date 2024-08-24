# import os
# import ollama
# from openai import OpenAI
# from qdrant_client import QdrantClient
# from service.AbstractLLMService import AbstractLLMService
# from llama_index.vector_stores.qdrant import QdrantVectorStore
# from llama_index.core import VectorStoreIndex, StorageContext
# from llama_index.core import Settings

# class QDrantService():
#     vector_store: QdrantVectorStore = None
#     client :QdrantClient = None

#     def __init__(self):
#         self.client = QdrantClient(
#             url=os.environ["QDRANT_URL"],
#             api_key= os.environ["QDRANT_API_KEY"],
#         )
#         # self.client.se
#         self.vector_store = QdrantVectorStore(
#             "learny_docs",
#             client=self.client,

#             enable_hybrid=True,
#             batch_size=20,
#         )

#         self.storage_context = StorageContext.from_defaults(vector_store=self.vector_store)
#         Settings.chunk_size = 512
