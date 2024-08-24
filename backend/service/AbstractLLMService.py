from abc import ABC
from pydantic import BaseModel
from typing import Callable, List


class Fields(BaseModel):
    disciplines: List[str]


class Topics(BaseModel):
    topics: List[str]


class SuggestedQuestions(BaseModel):
    questions: List[str]


class Flashcard(BaseModel):
    question: str
    answer: str


class AspectItem(BaseModel):
    name: str
    summary: str


class Aspect(BaseModel):
    name: str
    items: List[str]


class Concept(BaseModel):
    name: str
    description: str
    aspects: List[Aspect]


class Relationship(BaseModel):
    label: str
    source_entity: str
    target_entity: str


class Ecosystem(BaseModel):
    entities: List[str]
    relationships: List[Relationship]


class EntityList(BaseModel):
    entities: List[str]


class Entity(BaseModel):
    name: str
    category: str


class EntityObjList(BaseModel):
    entities: List[Entity]


class RelationshipList(BaseModel):
    relationships: List[Relationship]


class TimelineItem(BaseModel):
    name: str
    start_year: int
    end_year: int
    region: str


class Timeline(BaseModel):
    events: List[TimelineItem]


class SegmentList(BaseModel):
    segments: List[str]


class Problem(BaseModel):
    question: str
    answer: str


class Quiz(BaseModel):
    problems: List[Problem]


class IncorrectResponses(BaseModel):
    response1: str
    response2: str
    response3: str


class QuestionSuggestions(BaseModel):
    questions: List[str]


class Connection(BaseModel):
    name: str
    source: str
    destination: str


class FlashcardResponse(BaseModel):
    cards: List[Flashcard]


class AbstractLLMService(ABC):

    def summarize(self, msg: str):
        messages = [
            {
                "role": "system",
                "content": "You are an expert editor, skilled in making succint titles which describe content.",
            },
            {
                "role": "user",
                "content": "Can you make a short title for the following information? "
                + msg,
            },
        ]
        return self.call(messages)

    def chat(self, msg: str, token_tracker: Callable[[dict], None]):
        messages = [
            {
                "role": "user",
                "content": msg,
            },
        ]
        return self.call(messages, token_tracker)

    def summarize_discussion(self, msg: str, token_tracker: Callable[[dict], None]):
        messages = [
            {
                "role": "user",
                "content": "Extract the main theme or topic of the following in 4 words or less: "
                + msg,
            },
        ]
        return self.call(messages, token_tracker)

    def get_quiz(self, draft: str, token_tracker: Callable[[dict], None]) -> Quiz:
        return self.structured_call(
            f"Your goal is to create a quiz from the following information: {draft}",
            Quiz,
            token_tracker,
        )

    def get_wrong_answers(
        self, question: str, answer: str, token_tracker: Callable[[dict], None]
    ) -> IncorrectResponses:
        prompt = f"The following question is on a test: {question}. The following is the correct answer: {answer}.\
                   Provide several incorrect options for the same question, including ur mom jokes wherever possible,\
                   as well as snarky or sarcastic options that fit the theme."
        return self.structured_call(
            prompt,
            IncorrectResponses,
            token_tracker,
        )

    def get_outline(self, info: str, token_tracker: Callable[[dict], None]):
        prompt = f"Your goal is to break down this concept into its constituent parts, identify the relations between\
                   these parts, and show how they connect to related concepts in the broader knowledge domain. \
                   You are working on a Large Language Model (LLM) that has been trained on diverse sources, including\
                   scientific papers, books, articles, and other texts. The topic that you should decompose is {info}"
        return self.structured_call(
            prompt,
            Concept,
            token_tracker,
        )

    def get_concept_mapv2(self, summary: str, token_tracker: Callable[[dict], None]):
        return self.structured_call(
            f"""Summarize the following information while keeping as many details as possible: {summary}""",
            Ecosystem,
            token_tracker,
        )

    def get_concept_mapv2_nodes(
        self, topic: str, token_tracker: Callable[[dict], None]
    ) -> EntityList:
        prompt = f"""Your goal is to identify all the important relationships with other entities, concepts, or\
                 phenomena that you can for this topic: {topic}. Please be exhaustive"""

        return self.structured_call(
            prompt,
            EntityList,
            token_tracker,
        )

    def get_concept_mapv2_relationships(
        self, subject: str, objects: str, token_tracker: Callable[[dict], None]
    ) -> RelationshipList:
        prompt = f"""Your goal is to identify all the important relationships between {subject} and entities\
                  in this list: {objects}. Please be exhaustive"""

        return self.structured_call(
            prompt,
            RelationshipList,
            token_tracker,
        )

    def get_concept_mapv2_node_categories(
        self, objects: str, token_tracker: Callable[[dict], None]
    ) -> EntityObjList:
        prompt = f"""Your goal is to label each of the following into categories so it's clear which are in\
                    like groups: {objects}. Examples include People (George Washington, Cleopatra),\
                    Places/Countries/Empires (Persian Empire, Germany), Technology/Innovation (Steam Engine, Internet),\
                    Movement (Enlightenment, Civil Rights Movement), Event (Renaissance, Industrial Revolution)"""
        return self.structured_call(
            prompt,
            EntityObjList,
            token_tracker,
        )

    def get_timeline_item(
        self, topic: str, token_tracker: Callable[[dict], None]
    ) -> TimelineItem:
        return self.structured_call(
            f"""Your goal is to provide information on this event, use succint names: {topic}""",
            TimelineItem,
            token_tracker,
        )

    def get_timeline_events(
        self, topic: str, token_tracker: Callable[[dict], None]
    ) -> SegmentList:
        prompt = f"""Your goal is to list the important events or periods of which would provide a comprehensive\
                 understanding of the following topic: {topic}. Please be exhaustive."""
        return self.structured_call(
            prompt,
            SegmentList,
            token_tracker,
        )

    def get_flashcards(self, info: str, token_tracker: Callable[[dict], None]):
        prompt = f"You are an expert tutor and your goal is to help students better understand the topics they \
                 study using flashcards. Generate flashcards based on the following info: {info}"
        return self.structured_call(
            prompt,
            FlashcardResponse,
            token_tracker,
        )

    def get_questions(self, topic: str, token_tracker: Callable[[dict], None]):
        return self.structured_call(
            f"Provide a list of 5 questions I could study on the topic of {topic}",
            SuggestedQuestions,
            token_tracker,
        )

    def call(self, prompt: str, token_tracker: Callable[[dict], None]):
        raise Exception("Not implemented")

    def structured_call(self, prompt: str, token_tracker: Callable[[dict], None]):
        raise Exception("Not implemented")
