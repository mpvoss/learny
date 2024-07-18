import { Session } from "@supabase/supabase-js";

interface LLMResp {
    text: string; // URL of the backend endpoint
}

interface Discussion {
    topic: string;
    id: number;
}

interface Tag {
    name: string;
    id: number;
}

interface TimelineData {
    name: string;
    start_year: number;
    end_year: number;
    region: string;
}

interface Diagram {
    data: any;
    type: string;
    id: number;
    name: string;
}

interface ConceptMapEntity {
    name: string;
    category: string;
}

interface ConceptMapDiagramData {
    entities: ConceptMapEntity
}

interface Event {
    name: string;
    start_year: number;
    end_year: number;
    region: string;
}

interface TimelineDiagramData {
    data: Event[];
    type: string;
    id: number;
    name: string;
}

interface Message {
    content: string;
    show_actions: boolean;
    sender: string;
    id: number;
    diagrams: Diagram[];

}

interface Note {
    id: number;
    content: string;
    title: string;
    tags: Tag[];
}

interface SuggestedQuestions {
    questions: string[];
}

interface Flashcard {
    term: string;
    description: string;
    id: number;
    tags: Tag[];
}


interface UserProps {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

type AuthProps = {
    token: string;
}

interface GanttData {
    group: string;
    startYear: number;
    endYear: number;
    color: string;
}

interface GanttProps {
    data: GanttData[];
}

interface AppState {
    activeDiscussionId: number;
    isDocChatActive: boolean;
}

export type {
    LLMResp,
    Discussion,
    Message,
    SuggestedQuestions,
    Tag,
    Note,
    Flashcard,
    UserProps,
    AuthProps,
    GanttData,
    GanttProps,
    Diagram,
    TimelineData,
    AppState,
    TimelineDiagramData,
    ConceptMapDiagramData,
    ConceptMapEntity
}