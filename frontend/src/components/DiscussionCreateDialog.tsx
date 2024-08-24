import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { getEnv } from "../utils/EnvUtil";
const backendUrl = getEnv("VITE_BACKEND_URL");

import React, { useState } from "react";
import { AuthProps } from "../models";

interface DiscussionCreateDialogProps {
  onDiscussionCreated: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  authProps: AuthProps;
}

const DiscussionCreateDialog: React.FC<DiscussionCreateDialogProps> = ({
  onDiscussionCreated,
  open,
  setOpen,
  authProps,
}) => {
  const [discussionName, setDiscussionName] = useState("");
  const handleClose = () => {
    setOpen(false);
  };

  const handleQuestionHelperSubmit = () => {
    let body = {
      topic: discussionName,
    };

    fetch(backendUrl + "/api/discussions", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authProps.token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((_data) => {
        onDiscussionCreated();
        setDiscussionName("");
        handleClose();
      })
      .catch((error) => {
        console.error("Error creating discussion:", error);
      });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
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
