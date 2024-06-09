import logging

import instructor
from service.AbstractLLMService import AbstractLLMService
from openai import OpenAI


class GptLLMService(AbstractLLMService):
    def __init__(self):
        self.client = OpenAI()

    def call(self, messages) -> str:
        # logging.debug(f"Calling OpenAI chat with: {msg}")
        completion = self.client.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
        return completion.choices[0].message.content
    
    def structured_call(self, prompt: str, model):
        client = instructor.from_openai(
            OpenAI(),
            mode=instructor.Mode.JSON,
        )

        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
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