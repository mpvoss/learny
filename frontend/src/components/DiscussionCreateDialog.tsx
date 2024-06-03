import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import config from '../config.json'

import React, { useState } from 'react';

interface DiscussionCreateDialogProps {
    onDiscussionCreated: () => void; // Add this prop
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DiscussionCreateDialog: React.FC<DiscussionCreateDialogProps> = ({ onDiscussionCreated, open,setOpen }) => {
    const [discussionName, setDiscussionName] = useState(''); 
    const handleClose = () => {
        setOpen(false);
    };

    const handleQuestionHelperSubmit = () => {
        let body = {
            "topic": discussionName
        }
        
        fetch(config.BACKEND_URL + '/api/discussions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(_data => {
            // Handle response data here
            onDiscussionCreated();
            setDiscussionName('');
            handleClose();
        })
        .catch(error => {
            // Handle error here
            console.error('Error creating discussion:', error);
        });
    };

    return (
        <>
            
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        // const formData = new FormData(event.currentTarget);
                        // const formJson = Object.fromEntries((formData as any).entries());
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Create Discussion</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="Discussion Name"
                        value={discussionName}
                        onChange={(e) => setDiscussionName(e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleQuestionHelperSubmit} type="submit">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DiscussionCreateDialog;
