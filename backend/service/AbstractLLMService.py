from abc import ABC, abstractmethod
from pydantic import BaseModel, Field
from typing import List


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


class AbstractLLMService(ABC):

    def summarize(self, msg: str):
        messages=[
        {
            'role': 'system',
            'content': 'You are an expert editor, skilled in making succint titles which describe content.',
        },
        {
            'role': 'user',
            'content': 'Can you make a short title for the following information? ' + msg,
        },  
        ]
        return self.call(messages)


    def chat(self, msg: str):
        messages=[
        {
            'role': 'user',
            'content': msg,
        },  
        ]
        return self.call(messages)


    def get_flashcards(self, info: str):
        return self.structured_call(f'Generate flashcards based on the following info: {info}', FlashcardResponse)

    def get_questions(self, topic: str):
        return self.structured_call(f'Provide a list of 5 questions I could study on the topic of {topic}', SuggestedQuestions)

    def call(self, prompt: str):
        raise Exception("Not implemented")

    def structured_call(self, prompt: str):
        raise Exception("Not implemented")


# def get_disciplines():
#     return call('Provide a list of 15 core disciplines I could study as an adult, include no whitespace in your answer only json', Fields)

# def get_topics(discipline: str):
#     return call(f'Provide a list of 10 topics I could study as an adult in the discipline of {discipline}, include no whitespace in your answer only json', Topics)




# def get_outline(topic: str):
#     return call(f'Provide an outline of the most important ideas in the topic of {topic} I could study as an adult, include no whitespace in your answer only json', Outline)



    # @abstractmethod
    # def to_anki(self, flashcard_text: str):
    #     pass

    