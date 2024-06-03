import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import config from '../config.json'
import { Flashcard } from "../models";
import ReactCardFlip from 'react-card-flip';

const cardStyle = {
    backgroundColor: '#F5F5F5', // light gray
    border: '1px solid #DDD', // light border
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // shadow for 3D effect
    borderRadius: '15px', // rounded corners
    padding: '20px',
    margin: '10px',
};


const FlashcardComponent: React.FC = () => {
    const location = useLocation();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tagsFromQueryParams = queryParams.getAll('tag');
        


        // const queryParams = new URLSearchParams();
        // tags.forEach((tag) => {
        //     queryParams.append('tag', tag);
        // });
        
        fetch(config.BACKEND_URL + '/flashcards?' + tagsFromQueryParams)
            .then(response => response.json())
            .then(data => setFlashcards(data))
            .catch(error => console.error('Error:', error));
    }, []);


    const handleButtonClick = (status: string) => {
        // Make a POST request to the backend with the selected status
        // You can use a library like axios to handle the HTTP request
        console.log(status);
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
<div style={{paddingTop: '64px' }} >


<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    

    <Button variant="outlined"  to="/flashcards" component={Link}>Back</Button>

    <Typography color='black'>Selected: History</Typography>
    <Typography color='black'>{currentCardIndex + 1}/{flashcards.length}</Typography>
</div>

   
        <ReactCardFlip isFlipped={showDefinition} flipDirection="vertical" >
        
        <Card style={cardStyle}>
            <CardContent>
                <div onClick={() => setShowDefinition(!showDefinition)}>
                    { currentCard.term}
                </div>
               
            </CardContent>
        </Card>
        <Card style={cardStyle}>
            <CardContent>
                <div >
                    {currentCard.description }
                </div>
                <div >
                    <Button style={{margin: '5px'}} color="error" variant="contained" onClick={() => handleButtonClick('Great')}>IDK</Button>
                    <Button style={{margin: '5px'}} color="secondary" variant="outlined" onClick={() => handleButtonClick('Great')}>HARD</Button>
                    <Button style={{margin: '5px'}} color="primary" variant="outlined" onClick={() => handleButtonClick('Great')}>OK</Button>
                    <Button style={{margin: '5px'}} color="success" variant="contained" onClick={() => handleButtonClick('Great')}>EASY</Button>
                </div>
            </CardContent>
        </Card>
        </ReactCardFlip> 
        </div>
    );
};

export default FlashcardComponent;