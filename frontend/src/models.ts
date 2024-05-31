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

interface Message {
    content: string;
    sender: string;
    id: number;
}

interface Note{
    id: number;
    content: string;
    title   : string;
}

interface SuggestedQuestions {
    questions: string[];
}


export type{LLMResp, Discussion, Message, SuggestedQuestions, Tag, Note}