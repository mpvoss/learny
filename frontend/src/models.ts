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

interface OutlineEntity {
    name: string;
    category: string;
}

interface OutlineDiagramData {
    entities: OutlineEntity
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

interface RagSnippet {
    document_name: string;
    page_id: string;
    snippet:string;
    id: number;
}

interface Message {
    content: string;
    show_actions: boolean;
    sender: string;
    id: number;
    rag_snippets: RagSnippet[];
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
    didForget: boolean | null;
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
    OutlineDiagramData,
    OutlineEntity
}