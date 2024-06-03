import logging
import instructor
import ollama
from openai import OpenAI
from backend.service.AbstractLLMService import AbstractLLMService


class LocalLLMService(AbstractLLMService):
    # def __init__(self):

    def call(self, messages) -> str:
        logging.info(f"Calling local llm with: {msg}")
        response = ollama.chat(model="eas/nous-hermes-2-solar-10.7b", messages=messages)
        return response['message']['content']

    def structured_call(self, prompt: str, model):
        client = instructor.from_openai(
            OpenAI(
                base_url="http://localhost:11434/v1",
                api_key="ollama",  # required, but unused
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
            max_retries=3
        )
        return resp


    # completion = client.chat.completions.create(
    #     model="gpt-3.5-turbo",
    #     messages=[
    #         {"role": "system",
    #          "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
    #         {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
    #     ]
    # )

    # return completion.choices[0].message.content