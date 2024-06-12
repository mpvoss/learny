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

interface Message {
    content: string;
    sender: string;
    id: number;
}

interface Note {
    id: number;
    content: string;
    title: string;
}

interface SuggestedQuestions {
    questions: string[];
}

interface Flashcard {
    term: string;
    description: string;
}


interface UserProps {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

type AuthProps = {
    session: Session;
};


export type { LLMResp, Discussion, Message, SuggestedQuestions, Tag, Note, Flashcard , UserProps, AuthProps }