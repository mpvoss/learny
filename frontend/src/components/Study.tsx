import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Typography, Container, Box, DialogActions, DialogContentText } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Divider } from '@mui/material';
import { AuthProps, Flashcard } from "../models";
import { getEnv } from '../utils/EnvUtil';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');
import { LinearProgress } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
// import { Chip } from '@mui/material';
const cardStyle = {
    backgroundColor: '#F5F5F5', // light gray
    border: '1px solid #DDD', // light border
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // shadow for 3D effect
    borderRadius: '15px', // rounded corners
    // padding: '20px',
    width: '100%',
    // margin: '10px',
    marginTop: '200px',
};

interface FlashcardComponentProps {
    authProps: AuthProps;
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({ authProps }) => {
    const location = useLocation();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const [_selectedTags, setSelectedTags] = useState<string>();
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tagsFromQueryParams = queryParams.getAll('tag');

        const tagsString = tagsFromQueryParams.length >= 2 ? tagsFromQueryParams.join(', ') : tagsFromQueryParams[0];
        setSelectedTags(tagsString);


        fetch(BACKEND_URL + '/api/flashcards?due_filter=true&' + queryParams.toString(),
            {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authProps.token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => setFlashcards(data))
            .catch(error => console.error('Error:', error));
    }, []);


    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleButtonClick = (flashcardId: number, score: number) => {
        // Make a POST request to the backend with the selected status
        // You can use a library like axios to handle the HTTP request
        fetch(`${BACKEND_URL}/api/flashcards/${flashcardId}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.token}`
            },
            body: JSON.stringify({ quality: score })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

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
        <Container maxWidth="lg" style={{ paddingTop: '90px' }}>

            <Dialog open={openDialog} onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Help"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        learn fast spaced repitition idk
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleCloseDialog} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <Button variant="outlined" to="/flashcards" component={Link}>Back</Button> */}
                {/* <div>
                    {selectedTags && selectedTags.split(',').map((tag, index) => (
                       <Chip key={index} label={tag} color="primary" style={{ margin: '5px' }} />
                    ))}
                    </div> */}
                {/* <Typography color='black'>Selected: {selectedTags}</Typography> */}




                <IconButton onClick={handleOpenDialog}>
                    <HelpOutline />
                </IconButton>
                <Typography color='grey'>{currentCardIndex + 1}/{flashcards.length}</Typography>


            </div>




            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" sx={{ height: 10, borderRadius: 5, }} value={(currentCardIndex / flashcards.length) * 100} style={{ marginTop: 15, paddingTop: 3 }} />
                </Box>
                {/* <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" sx={{ paddingTop: 2 }} color="text.secondary">{`${Math.round(
                        (currentCardIndex / flashcards.length) * 100
                    )}%`}</Typography>
                </Box> */}
            </Box>





            {/* <LinearProgress variant="determinate" value={(currentCardIndex / flashcards.length) * 100} style={{marginTop: 15,paddingTop: 3}} /> */}
            {/* <ReactCardFlip isFlipped={showDefinition} flipDirection="vertical" > */}
            <Card style={cardStyle}>
                <CardContent>
                    <div>
                        {/* onClick={() => setShowDefinition(!showDefinition) */}
                        {currentCard.term}
                    </div>






                    {!showDefinition &&

                        <div >
                            <Button style={{ margin: '5px', marginTop: '20px' }} color="primary" variant="outlined" onClick={() => setShowDefinition(!showDefinition)}>Show Answer</Button>
                        </div>
                    }

                    {showDefinition &&

                        <div >


                            <Divider style={{ margin: '10px 0' }} />
                            {currentCard.description}
                            <br></br>
                            <Button style={{ margin: '5px' }} color="error" variant="contained" onClick={() => handleButtonClick(currentCard.id, 0)}>IDK</Button>
                            <Button style={{ margin: '5px' }} color="secondary" variant="outlined" onClick={() => handleButtonClick(currentCard.id, 1)}>HARD</Button>
                            <Button style={{ margin: '5px' }} color="primary" variant="outlined" onClick={() => handleButtonClick(currentCard.id, 3)}>OK</Button>
                            <Button style={{ margin: '5px' }} color="success" variant="contained" onClick={() => handleButtonClick(currentCard.id, 5)}>EASY</Button>
                        </div>
                    }
                </CardContent>
            </Card>


            {/* </ReactCardFlip> */}
        </Container>
    );
};

export default FlashcardComponent;