import React from 'react';
import { Diagram } from '../models';
import TimelineDiagram from './TimelineDiagram';
import ConceptMapDiagram from './ConceptMapDiagram';

interface MessageDiagramProps{
    diagram: Diagram;
    handleSendMessage: (msg: string, activeDiscussionId:number) => void;
    activeDiscussionId: number;
}


const MessageDiagram: React.FC<MessageDiagramProps> = ({diagram, handleSendMessage, activeDiscussionId}) => {
    if (diagram.type === 'timeline') {
        return <TimelineDiagram {...diagram} />;
    }
    if (diagram.type === 'concept_map') {
        return <ConceptMapDiagram diagram={diagram} handleSendMessage={handleSendMessage} activeDiscussionId={activeDiscussionId} />;
    }
};

export default MessageDiagram;