import logging
import instructor
import ollama
from openai import OpenAI
from service.AbstractLLMService import AbstractLLMService


class LocalLLMService(AbstractLLMService):
    # def __init__(self):

    def call(self, messages) -> str:
        logging.info(f"Calling local llm with: {messages}")
        response = ollama.chat(model="eas/nous-hermes-2-solar-10.7b", messages=messages)
        return response["message"]["content"]

    def structured_call(self, prompt: str, model):
        client = instructor.from_openai(
            OpenAI(
                base_url="http://localhost:11434/v1",
                api_key="ollama",
            ),
            mode=instructor.Mode.JSON,
        )

        resp = client.chat.completions.create(
            model="eas/nous-hermes-2-solar-10.7b",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            response_model=model,
            max_retries=3,
        )
        return resp
