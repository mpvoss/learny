import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { getEnv } from '../utils/EnvUtil';
const backendUrl = getEnv('VITE_BACKEND_URL');

import React, { useState } from 'react';
import { Session } from "@supabase/supabase-js";

interface DiscussionCreateDialogProps {
    onDiscussionCreated: () => void; // Add this prop
    open: boolean;
    setOpen: (open: boolean) => void;
    session: Session;
}

const DiscussionCreateDialog: React.FC<DiscussionCreateDialogProps> = ({ onDiscussionCreated, open, setOpen, session }) => {
    const [discussionName, setDiscussionName] = useState(''); 
    const handleClose = () => {
        setOpen(false);
    };

    const handleQuestionHelperSubmit = () => {
        let body = {
            "topic": discussionName
        }
        
        fetch(backendUrl + '/api/discussions', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
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
