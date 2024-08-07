import logging

import instructor
from service.AbstractLLMService import AbstractLLMService
from openai import OpenAI


class GptLLMService(AbstractLLMService):
    def __init__(self, model:str):
        self.client = OpenAI()
        self.model = model

    def call(self, messages) -> str:
        # logging.debug(f"Calling OpenAI chat with: {msg}")
        completion = self.client.chat.completions.create(model=self.model, messages=messages)
        return completion.choices[0].message.content
    
    def structured_call(self, prompt: str, model):
        client = instructor.from_openai(
            OpenAI(),
            mode=instructor.Mode.JSON,
        )

        resp = client.chat.completions.create(
            model=self.model,
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