from functools import partial
import random
from typing import List
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from llama_index.core import Settings, VectorStoreIndex
from models import Discussion, Message, MessageDiagram, RagSnippet, User
from pydantic import BaseModel
from requests import Session
from routers.api_models import (
    ChatMessage,
    CreateDiscussionModel,
    CreateDiscussionRequest,
    CreateMessageRequest,
    DiscussionSuggestionResponse,
)
from sqlalchemy import desc, func
from sqlalchemy.orm import joinedload
from utils import questions
from utils.utils import get_current_user
from utils.utils import capitalize_and_remove_period
from utils.utils import save_token_usage

router = APIRouter()


@router.get("/discussions", tags=["Chat"])
def get_discussions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    latest_message_times = (
        db.query(
            Message.discussion_id, func.max(Message.created_at).label("max_created_at")
        )
        .join(Discussion, Discussion.id == Message.discussion_id)
        .filter(Discussion.user_id == current_user.id)
        .group_by(Message.discussion_id)
        .subquery()
    )

    # Then, join this with the Discussion table and order by the latest message time
    discussions = (
        db.query(Discussion)
        .filter(Discussion.user_id == current_user.id)
        .outerjoin(
            latest_message_times, Discussion.id == latest_message_times.c.discussion_id
        )
        .order_by(desc(latest_message_times.c.max_created_at))
        .all()
    )
    return discussions


@router.post("/discussions", response_model=CreateDiscussionRequest, tags=["Chat"])
def create_discussion(
    request: Request,
    create_discussion_request: CreateDiscussionModel,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Discussion:
    txt = request.app.state.llm_service.summarize_discussion(
        create_discussion_request.topic,
        partial(save_token_usage, db, current_user.id, "summarize"),
    )
    txt = capitalize_and_remove_period(txt)
    new_discussion = Discussion(topic=txt, user_id=current_user.id)
    db.add(new_discussion)
    db.commit()
    db.refresh(new_discussion)
    return new_discussion


@router.post(
    "/discussions/{id}/messages", response_model=CreateMessageRequest, tags=["Chat"]
)
def create_message(
    id: int,
    request: CreateMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    find_discussion_or_404(db, id, current_user)

    # Continue with creating the new message
    new_message = Message(
        content=request.content,
        discussion_id=request.discussion_id,
        sender=request.sender,
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


@router.post(
    "/discussions/suggest", response_model=DiscussionSuggestionResponse, tags=["Chat"]
)
def suggest_quesitons(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {"questions": random.sample(questions.get_topics(), 3)}


class MessageDiagramDto(BaseModel):
    name: str
    type: str
    data: dict
    message_id: int


class RagSnippetDto(BaseModel):
    snippet: str
    document_name: str
    page_id: str
    message_id: int


class MessageDto(BaseModel):
    id: int
    content: str
    sender: str
    show_actions: bool
    diagrams: List[MessageDiagramDto]
    rag_snippets: List[RagSnippetDto]


@router.get("/discussions/{id}/messages", tags=["Chat"])
def get_msgs(
    request: Request,
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Page[MessageDto]:
    find_discussion_or_404(db, id, current_user)

    query = (
        db.query(Message)
        .options(
            joinedload(Message.diagrams), joinedload(Message.rag_snippets)
        )  # Add joinedload for rag_snippets
        .filter(Message.discussion_id == id)
        .order_by(Message.created_at.desc())
    )

    # return messages
    return paginate(query)


@router.post("/discussions/{id}/chat", tags=["Chat"])
def chat(
    request: Request,
    id: int,
    msg: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    find_discussion_or_404(db, id, current_user)

    reply = request.app.state.llm_service.chat(
        msg.content, partial(save_token_usage, db, current_user.id, "chat")
    )

    new_message = Message(
        content=reply, discussion_id=id, sender="ai", show_actions=True
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


@router.post(
    "/discussions/{discussion_id}/messages/{message_id}/flashcards", tags=["Chat"]
)
def create_flashcards(
    request: Request,
    discussion_id: int,
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    find_discussion_or_404(db, discussion_id, current_user)
    message = db.query(Message).filter(Message.id == message_id).first()
    reply = request.app.state.llm_service.get_flashcards(
        message.content, partial(save_token_usage, db, current_user.id, "flashcard_gen")
    )
    flashcards = []
    for card in reply.cards:
        flashcards.append({"term": card.question, "description": card.answer})

    return {"cards": flashcards}


@router.post("/discussions/{discussion_id}/docchat")
def doc_chat(
    request: Request,
    discussion_id: int,
    msg: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    find_discussion_or_404(db, discussion_id, current_user)
    index = VectorStoreIndex.from_vector_store(
        request.app.state.qdrant_service.vector_store, embed_model=Settings.embed_model
    )

    # Note: Can pass in LLM here
    query_engine = index.as_query_engine(
        similarity_top_k=2,
        sparse_top_k=12,
        vector_store_query_mode="hybrid",
    )

    response = query_engine.query(msg.content)

    msg = Message(
        content=response.response,
        discussion_id=discussion_id,
        sender="ai",
        show_actions=True,
    )
    db.add(msg)
    db.flush()

    for snippet in response.source_nodes:
        rag_snippet = RagSnippet(
            snippet=snippet.text, document_name="N/A", page_id="N/A", message_id=msg.id
        )

        if hasattr(snippet, "metadata"):
            rag_snippet.page_id = snippet.metadata.get("page_label", "N/A")
            rag_snippet.document_name = snippet.metadata.get("file_name", "N/A")

        db.add(rag_snippet)
    db.commit()
    db.refresh(msg)

    new_message = (
        db.query(Message)
        .options(joinedload(Message.rag_snippets))
        .filter(Message.id == msg.id)
        .first()
    )
    return new_message


@router.post("/discussions/{discussion_id}/timeline", tags=["Chat"])
def create_timeline(
    request: Request,
    msg: ChatMessage,
    discussion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    find_discussion_or_404(db, discussion_id, current_user)
    events = request.app.state.llm_service.get_timeline_events(
        msg.content, partial(save_token_usage, db, current_user.id, "timeline_events")
    )
    res = []

    for idx, x in enumerate(events.segments):
        print(str(idx) + "/" + str(len(events.segments)) + ": " + x)
        res.append(
            request.app.state.llm_service.get_timeline_item(
                x, partial(save_token_usage, db, current_user.id, "timeline_items")
            ).model_dump(mode="json")
        )

    new_message = Message(
        content=f"Sure, here's a timeline for the topic '{msg.content}'",
        discussion_id=discussion_id,
        sender="ai",
    )
    db.add(new_message)
    db.commit()

    msg_diagram = MessageDiagram(
        name=msg.content,
        type="timeline",
        data={"events": res},
        message_id=new_message.id,
    )
    db.add(msg_diagram)
    db.commit()

    new_message = (
        db.query(Message)
        .options(joinedload(Message.diagrams))
        .filter(Message.id == new_message.id)
        .first()
    )
    return new_message


@router.post("/discussions/{discussion_id}/outline", tags=["Chat"])
def create_outline(
    request: Request,
    msg: ChatMessage,
    discussion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    find_discussion_or_404(db, discussion_id, current_user)
    entityList = request.app.state.llm_service.get_concept_mapv2_nodes(
        msg.content, partial(save_token_usage, db, current_user.id, "outline_nodes")
    )
    entity_object_list = (
        request.app.state.llm_service.get_concept_mapv2_node_categories(
            entityList.entities,
            partial(save_token_usage, db, current_user.id, "outline_categories"),
        )
    )

    for entity in entity_object_list.entities:
        entity.name = capitalize_and_remove_period(entity.name)
        entity.category = capitalize_and_remove_period(entity.category)

    new_message = Message(
        content=f"Sure, here's an outline for the topic '{msg.content}'. Click any subtopic to learn more.",
        discussion_id=discussion_id,
        sender="ai",
    )
    db.add(new_message)
    db.commit()

    msg_diagram = MessageDiagram(
        name=msg.content,
        type="outline",
        data=entity_object_list,
        message_id=new_message.id,
    )
    db.add(msg_diagram)
    db.commit()

    new_message = (
        db.query(Message)
        .options(joinedload(Message.diagrams))
        .filter(Message.id == new_message.id)
        .first()
    )
    return new_message


def find_discussion_or_404(db, discussion_id, current_user):
    discussion = (
        db.query(Discussion)
        .filter(Discussion.id == discussion_id, Discussion.user_id == current_user.id)
        .first()
    )
    if not discussion:
        raise HTTPException(status_code=404, detail="Discussion not found")
    return discussion
