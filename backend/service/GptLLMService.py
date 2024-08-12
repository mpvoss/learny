import logging
from typing import Callable

import instructor
from service.AbstractLLMService import AbstractLLMService
from openai import OpenAI


class GptLLMService(AbstractLLMService):
    def __init__(self, model:str):
        self.client = OpenAI()
        self.model = model

    def call(self, messages, token_tracker:Callable[[dict],None]) -> str:
        # logging.debug(f"Calling OpenAI chat with: {msg}")
        completion = self.client.chat.completions.create(model=self.model, messages=messages)
        
        token_tracker(completion.usage)
        return completion.choices[0].message.content
    
    def structured_call(self, prompt: str, model, token_tracker:Callable[[dict],None]):
        client = instructor.from_openai(
            OpenAI(),
            mode=instructor.Mode.JSON,
        )

        resp, completion = client.chat.completions.create_with_completion(
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
        token_tracker(completion.usage)
        
        return resp