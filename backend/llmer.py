import logging

import ollama
from openai import OpenAI
from pydantic import BaseModel, Field
from typing import List

import instructor
logging.basicConfig(level=logging.DEBUG)



class Fields(BaseModel):
    disciplines: List[str]


class Topics(BaseModel):
    topics: List[str]


class Outline(BaseModel):
    ideas: List[str]


class SuggestedQuestions(BaseModel):
    questions: List[str]


class Flashcard(BaseModel):
    name: str
    description: str


class FlashcardResponse(BaseModel):
    cards: List[Flashcard]


###########################################################
# Requests
###########################################################

def get_disciplines():
    return call('Provide a list of 15 core disciplines I could study as an adult, include no whitespace in your answer only json', Fields)

def get_topics(discipline: str):
    return call(f'Provide a list of 10 topics I could study as an adult in the discipline of {discipline}, include no whitespace in your answer only json', Topics)


def get_questions(topic: str):
    return call(f'Provide a list of 5 questions I could study on the topic of {topic}', SuggestedQuestions)


def get_outline(topic: str):
    return call(f'Provide an outline of the most important ideas in the topic of {topic} I could study as an adult, include no whitespace in your answer only json', Outline)


def get_flashcards(info: str):
    return call(f'Generate flashcards based on the following info: {info}', FlashcardResponse)


def summarize(msg: str):
    response = ollama.chat(model="eas/nous-hermes-2-solar-10.7b", messages=[
        {
            'role': 'user',
            'content': 'Make a 2 to 5 word title for the following study notes: '+msg,
        },
    ])
    return response['message']['content']


def chat(msg: str):
    response = ollama.chat(model="eas/nous-hermes-2-solar-10.7b", messages=[
        {
            'role': 'user',
            'content': msg,
        },
    ])
    return {'text': response['message']['content']}


def to_anki(flashcard_text: str) -> FlashcardResponse:
    return call(f'Generate flashcards based on the following: {flashcard_text}', FlashcardResponse)


def call(prompt: str, model):
    # enables `response_model` in create call
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

def use_web():
    from openai import OpenAI
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system",
             "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair."},
            {"role": "user", "content": "Compose a poem that explains the concept of recursion in programming."}
        ]
    )

    return completion.choices[0].message.content