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
    term: str
    description: str


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

# class AspectItem(BaseModel):
#     name: str
#     summary: str

# class Aspect(BaseModel):
#     name: str
#     items: List[AspectItem]


# class Concept(BaseModel):
#     name: str
#     description: str
#     aspects: List[Aspect]


class Connection(BaseModel):
    name: str
    source: str
    destination: str

class ConceptMap(BaseModel):
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


    def get_concept_map(self, info: str):
        return self.structured_call(f'Your goal is to break down this concept into its constituent parts, identify the relations between these parts, and show how they connect to related concepts in the broader knowledge domain. You are working on a Large Language Model (LLM) that has been trained on diverse sources, including scientific papers, books, articles, and other texts. The topic that you should decompose is {info}', Concept)

    def get_concept_mapv2(self, summary: str):
        return self.structured_call(f'''Summarize the following information while keeping as many details as possible: {summary}''', Ecosystem)

    def get_concept_mapv2_nodes(self, topic: str) -> EntityList:
        return self.structured_call(f'''Your goal is to identify all the important relationships with other entities, concepts, or phenomena that you can for this topic: {topic}. Please be exhaustive''', EntityList)

    def get_concept_mapv2_relationships(self, subject: str, objects:str) -> RelationshipList:
        return self.structured_call(f'''Your goal is to identify all the important relationships between {subject} and entities in this list: {objects}. Please be exhaustive''', RelationshipList)

    def get_concept_mapv2_node_categories(self, objects:str) -> EntityObjList:
        return self.structured_call(f'''Your goal is to label each of the following into categories so it's clear which are in like groups: {objects}. Examples include People (George Washington, Cleopatra), Places/Countries/Empires (Persian Empire, Germany), Technology/Innovation (Steam Engine, Internet), Movement (Enlightenment, Civil Rights Movement), Event (Renaissance, Industrial Revolution)''', EntityObjList)

    def get_timeline_item(self, topic:str) -> TimelineItem:
        return self.structured_call(f'''Your goal is to provide information on this event, use succint names: {topic}''', TimelineItem)

    def get_timeline_events(self, topic:str) -> SegmentList:
        return self.structured_call(f'''Your goal is to list the important events or periods of which would provide a comprehensive understanding of the following topic: {topic}. Please be exhaustive.''', SegmentList)

    def get_flashcards(self, info: str):
        return self.structured_call(f'Generate flashcards based on the following info: {info}', FlashcardResponse)

    def get_questions(self, topic: str):
        return self.structured_call(f'Provide a list of 5 questions I could study on the topic of {topic}', SuggestedQuestions)

    def call(self, prompt: str):
        raise Exception("Not implemented")

    def structured_call(self, prompt: str):
        raise Exception("Not implemented")

