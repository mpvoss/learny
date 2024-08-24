import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import TagWizard from "./TagWizard";
import { AuthProps } from "../models";

interface NoteSaveDialogProps {
  open: boolean;
  onClose: () => void;
  saveWithTag: (tag: string) => void;
  authProps: AuthProps;
}

const NoteSaveDialog: React.FC<NoteSaveDialogProps> = ({ open, onClose, saveWithTag, authProps }) => {
  const [tag, updateTag] = useState<string>();

  const handleSave = () => {
    if (tag !== undefined) {
      saveWithTag(tag);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Note</DialogTitle>
      <DialogContent>
        <TagWizard authProps={authProps} updateTag={updateTag}></TagWizard>

        <br></br>
        <Button sx={{ float: "right" }} onClick={handleSave}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NoteSaveDialog;
