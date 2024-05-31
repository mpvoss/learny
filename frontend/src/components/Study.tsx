import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button } from '@mui/material';
import config from '../config.json'

interface Flashcard {
    term: string;
    definition: string;
}

const cardStyle = {
    backgroundColor: '#F5F5F5', // light gray
    border: '1px solid #DDD', // light border
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // shadow for 3D effect
    borderRadius: '15px', // rounded corners
    padding: '20px',
    margin: '10px',
};


const Flashcard: React.FC = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);

    useEffect(() => {
        fetch(config.BACKEND_URL + '/flashcards')
            .then(response => response.json())
            .then(data => setFlashcards(data))
            .catch(error => console.error('Error:', error));
    }, []);

    const handleButtonClick = (status: string) => {
        // Make a POST request to the backend with the selected status
        // You can use a library like axios to handle the HTTP request

        // Advance to the next card
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
        setShowDefinition(false);
    };

    if (flashcards.length === 0) {
        return <div>Loading...</div>;
    }

    if (currentCardIndex >= flashcards.length) {
        return <div>No more flashcards</div>;
    }

    const currentCard = flashcards[currentCardIndex];

    return (
        <Card style={cardStyle}>
            <CardContent>
                <div onClick={() => setShowDefinition(!showDefinition)}>
                    {showDefinition ? currentCard.definition : currentCard.term}
                </div>
                <div>
                    <Button onClick={() => handleButtonClick('Great')}>Great</Button>
                    <Button onClick={() => handleButtonClick('Good')}>Good</Button>
                    <Button onClick={() => handleButtonClick('Pass')}>Pass</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Flashcard;