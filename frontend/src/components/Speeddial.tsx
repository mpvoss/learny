import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { AuthProps, Message } from '../models';
import { getEnv } from '../utils/EnvUtil';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import React from 'react';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');

interface BasicSpeedDialProps {
    authProps: AuthProps;
    setIsThinking: (isThinking: boolean) => void;
    setSuggestedQuestions: (suggestedQuestions: string[]) => void;
    setSnackErrorMsg: (msg: string) => void;
    setIsSnackOpen: (isSnackOpen: boolean) => void;
    saveUserMessage: (message: string) => void;
    activeDiscussionId: number;
    handleNewMessage: (message: Message) => void;
}

const BasicSpeedDial: React.FC<BasicSpeedDialProps> = ({ authProps, setIsThinking, setSuggestedQuestions, setSnackErrorMsg, setIsSnackOpen, saveUserMessage, activeDiscussionId,handleNewMessage }) => {

    const [open, setOpen] = React.useState(false);
    const [dialogInput, setDialogInput] = React.useState('');
    const [dialogTitle, setDialogTitle] = React.useState('');
    const [dialogDesc, setDialogDesc] = React.useState('');
    const [activeDialog, setActiveDialog] = React.useState('');

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDialogInput(event.target.value);
    }

    const handleSubmit = () => {
        setIsThinking(true);

        if (activeDialog === "questionHelper") {
            getQuestions();
        }
        else if (activeDialog === "timeline") {
            getTimeline();
        }
        else if (activeDialog === "diagram") {
            getDiagram();
        }
    }


    const getTimeline = () => {
        saveUserMessage("Can you make a timeline diagram over this topic? " + dialogInput)
        
        fetch(BACKEND_URL + '/api/discussions/' + activeDiscussionId + '/timeline', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.session.access_token}`
            },
            body: JSON.stringify({'content':dialogInput})
        }).then(result => {
            if (!result.ok) {
                throw new Error("Error from backend")
            }
            return result.json()
        }).then(result => {
            handleNewMessage(result);
        }).catch(error => {
            console.log(error);
            setSnackErrorMsg("Network error occurred")
            setIsSnackOpen(true)
            setIsThinking(false)
        }).finally(
            () => setIsThinking(false)
        )
    }
    
    const getDiagram = () => {
        console.log(authProps);
        saveUserMessage("Can you make a concept map over this topic: " + dialogInput + "?")
        fetch(BACKEND_URL + '/api/discussions/' + activeDiscussionId + '/concept_map', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.session.access_token}`
            },
            body: JSON.stringify({'content':dialogInput})
        }).then(result => {
            if (!result.ok) {
                throw new Error("Error from backend")
            }
            return result.json()
        }).then(result => {
            handleNewMessage(result);
        }).catch(error => {
            console.log(error);
            setSnackErrorMsg("Network error occurred")
            setIsSnackOpen(true)
            setIsThinking(false)
        }).finally(
            () => setIsThinking(false)
        )
    }

    const getQuestions = () => {
        fetch(BACKEND_URL + '/api/questions?topic=' + dialogInput, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.session.access_token}`
            }
        })
            .then(result => {
                if (!result.ok) {
                    throw new Error("Error from backend")
                }
                return result.json()
            }
            )
            .then(result => setSuggestedQuestions(result['questions']))
            .catch(error => {
                console.log(error);
                setSnackErrorMsg("Network error occurred")
                setIsSnackOpen(true)
            })
            .finally(
                () => setIsThinking(false)
            )
    }

    const handleQuestionHelperClick = () => {
        setActiveDialog("questionHelper")
        setDialogTitle("Question Helper");
        setDialogDesc("Enter a topic to get suggested questions");
        setOpen(true);
    }

    const handleTimelineClick = () => {
        setActiveDialog("timeline")
        setDialogTitle("Generate Timeline");
        setDialogDesc("Enter a topic to get an AI Generated Timeline");
        setOpen(true);
    }

    const handleDiagramClick = () => {
        setActiveDialog("diagram")
        setDialogTitle("Generate Diagram");
        setDialogDesc("Choose a topic to get a Concept Map from the AI");
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        handleClose();
                    },
                }}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogDesc}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        onChange={handleTextChange}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} type="submit">Submit</Button>
                </DialogActions>
            </Dialog>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 100, right: 32 }}
                icon={<AutoAwesomeIcon />}
            >
                <SpeedDialAction
                    key="inspire"
                    icon={<PsychologyAltIcon />}
                    tooltipOpen
                    onClick={handleQuestionHelperClick}
                    tooltipTitle="Inspire"
                />
                <SpeedDialAction
                    key="timeline"
                    icon={<ViewTimelineIcon />}
                    tooltipOpen
                    onClick={handleTimelineClick}
                    tooltipTitle="Timeline"
                />
                <SpeedDialAction
                    key="diagram"
                    icon={<AccountTreeIcon />}
                    tooltipOpen
                    onClick={handleDiagramClick}
                    tooltipTitle="Diagram"
                />
            </SpeedDial>
        </>
    );
}

export default BasicSpeedDial;