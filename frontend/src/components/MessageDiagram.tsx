import React from 'react';
import { Diagram } from '../models';
import TimelineDiagram from './TimelineDiagram';
import ConceptMapDiagram from './ConceptMapDiagram';

interface MessageDiagramProps{
    diagram: Diagram;
    handleSendMessage: (msg: string) => void;
}


const MessageDiagram: React.FC<MessageDiagramProps> = ({diagram, handleSendMessage}) => {
    if (diagram.type === 'timeline') {
        return <TimelineDiagram {...diagram} />;
    }
    if (diagram.type === 'concept_map') {
        return <ConceptMapDiagram diagram={diagram} handleSendMessage={handleSendMessage} />;
    }
};

export default MessageDiagram;