import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, LinearProgress, Snackbar, IconButton, Alert, AlertProps } from '@mui/material';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Flashcard } from "../models";
import config from '../config.json'
import TagWizard from './TagWizard';

interface FlashCardSaveWizardProps {
    discussionId: number;
    messageId: number | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const FlashCardSaveWizard: React.FC<FlashCardSaveWizardProps> = ({ discussionId, messageId, open, setOpen }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [flashCards, setFlashCards] = useState<Flashcard[]>([]);
    const [selectedFlashCards, setSelectedFlashCards] = useState<number[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [statusText, setStatusText] = useState("Loading...");
    const [snackErrorMsg, setSnackErrorMsg] = useState('');
    const [isSnackOpen, setIsSnackOpen] = useState(false);
    const [didGenerateFail, setDidGenerateFail] = useState(false);
    const [snackSeverity, setSnackSeverity] = useState('error');
    const [tag, updateTag] = useState('');


    const handleClose = () => {
        setActiveStep(0)
        setFlashCards([]);
        setSelectedFlashCards([]);
        setOpen(false);
    };

    const handleSnackClose = () => {
        setIsSnackOpen(false);
    }

    const loadFlashcards = () => {
        if (messageId == -1 || discussionId == -1) { return }
        setDidGenerateFail(false);
        setIsThinking(true);
        fetch(config.BACKEND_URL + `/api/discussions/${discussionId}/messages/${messageId}/flashcards`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(result => {
            if (!result.ok) {
                throw new Error("Error from backend")
            }
            return result.json()
        }).then(result => {
            const data: Flashcard[] = result['cards'];
            setFlashCards(data);
            // set SelectedFlashCards to all cards

            setSelectedFlashCards(data.map((_card, index) => index));
            setIsThinking(false);
            setStatusText("Flashcards loaded");
            setActiveStep(1);
        }).catch(error => {
            {
                console.error('Error:', error);
                setSnackErrorMsg('Error loading flash cards');
                setIsThinking(false);
                setStatusText("Error loading flashcards");
                setDidGenerateFail(true);
            }
        })
    };

    useEffect(() => {
        setActiveStep(0)
        setStatusText("Loading...")
        loadFlashcards();
    }, [messageId, discussionId]);


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };


    const handleFlashCardSelect = (flashCardId: number) => {
        setSelectedFlashCards((prevSelectedFlashCards) => {
            if (prevSelectedFlashCards.includes(flashCardId)) {
                return prevSelectedFlashCards.filter((id) => id !== flashCardId);
            } else {
                return [...prevSelectedFlashCards, flashCardId];
            }
        });
    };

    const handleSave = async () => {
        if (tag == "") {
            setSnackErrorMsg('Please select a tag');
            setIsSnackOpen(true);
            setSnackSeverity('error');
            return;
        }
        const flashcardsToSave = selectedFlashCards.map((id) => flashCards[id]);
        const data = {
            flashCards: flashcardsToSave,
            tag: tag,
        };
        try {
            const response = await fetch(config.BACKEND_URL + '/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to save flashcards');
            }
            handleClose();
            setSnackErrorMsg('Flashcards saved!');
            setSnackSeverity('success');
            setIsSnackOpen(true);

        } catch (error) {
            console.error('Error saving flashcards:', error);
            setSnackErrorMsg('Error saving flashcards');
            setSnackSeverity('error');
            setIsSnackOpen(true);
        }
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Flashcard Wizard</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={activeStep}>
                        <Step>
                            <StepLabel>Generate</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Review</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Tag</StepLabel>
                        </Step>
                    </Stepper>

                    {activeStep === 0 && (
                        <div>
                            <h2>{statusText}</h2>
                            {isThinking &&
                                <LinearProgress sx={{ marginBottom: 2 }} />
                            }
                            {/* <div >
                                <Button variant="contained" color="primary">
                                    Centered Button
                                </Button>
                            </div> */}

                            {didGenerateFail &&
                                <Button style={{ textAlign: 'center' }} variant="contained" color="primary" onClick={loadFlashcards}>
                                    Retry
                                </Button>
                            }

                        </div>
                    )}

                    {activeStep === 1 && (
                        <div>
                            {/* <h2>Review Step</h2> */}
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Select</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {flashCards.map((flashCard, id) => (
                                            <TableRow key={id}>
                                                <TableCell>{flashCard.term}</TableCell>
                                                <TableCell>{flashCard.description}</TableCell>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFlashCards.includes(id)}
                                                        onChange={() => handleFlashCardSelect(id)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div>
                            {/* <TagSaveHelper></TagSaveHelper> */}
                            <TagWizard updateTag={updateTag}></TagWizard>
                            {/* Add tag selection or creation logic here */}
                        </div>
                    )}



                    <div style={{ paddingTop: "10px" }}>

                        <Button variant="outlined" onClick={handleClose}>Close</Button>

                        {activeStep == 1 && selectedFlashCards.length > 0 && (
                            <Button style={{ float: 'right' }} variant="contained" color="primary" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                        {activeStep == 2 && tag != "" && (
                            <Button style={{ float: 'right' }} variant="contained" color="primary" onClick={handleSave}>
                                Save
                            </Button>
                        )}

                    </div>
                </DialogContent>
            </Dialog>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={isSnackOpen}
                autoHideDuration={6000}
                onClose={handleSnackClose}
                action={
                    <>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleSnackClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                }
            >
                <Alert
                    onClose={handleSnackClose}
                    severity={snackSeverity as AlertProps['severity']} // Change the type of snackSeverity
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackErrorMsg}
                </Alert>
            </Snackbar>
        </div>

    );
};

export default FlashCardSaveWizard;