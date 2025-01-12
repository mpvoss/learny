import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { AppState, AuthProps, Message } from "../models";
import { getEnv } from "../utils/EnvUtil";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { useEffect } from "react";
const BACKEND_URL = getEnv("VITE_BACKEND_URL");

interface BasicSpeedDialProps {
  authProps: AuthProps;
  appState: AppState;
  setAppState: (appState: AppState) => void;
  setIsThinking: (isThinking: boolean) => void;
  setSuggestedQuestions: (suggestedQuestions: string[]) => void;
  setSnackErrorMsg: (msg: string) => void;
  setIsSnackOpen: (isSnackOpen: boolean) => void;
  saveUserMessage: (message: string, discussionId: number) => void;
  activeDiscussionId: number;
  handleNewMessage: (message: Message) => void;
}

const BasicSpeedDial: React.FC<BasicSpeedDialProps> = ({
  authProps,
  setIsThinking,
  appState,
  setSuggestedQuestions,
  setAppState,
  setSnackErrorMsg,
  setIsSnackOpen,
  saveUserMessage,
  activeDiscussionId,
  handleNewMessage,
}) => {
  const [open, setOpen] = React.useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = React.useState(false);
  const [dialogInput, setDialogInput] = React.useState("");
  const [dialogDesc, setDialogDesc] = React.useState("");
  const [activeDialog, setActiveDialog] = React.useState("");
  const [docChatEnabled, setDocChatEnabled] = React.useState(false);
  const [_speedDialOpen, setSpeedDialOpen] = React.useState(false);

  const handleSpeeddialOpen = () => {
    console.log("gonna open bro");
  };

  const handleSpeeddialClose = () => {
    console.log("gonna close bro");
    setSpeedDialOpen(false);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDialogInput(event.target.value);
  };

  const handleSubmit = () => {
    setIsThinking(true);
    setSpeedDialOpen(false);
    if (activeDialog === "questionHelper") {
      getQuestions();
    } else if (activeDialog === "timeline") {
      getTimeline();
    } else if (activeDialog === "outline") {
      getOutline();
    }
  };

  useEffect(() => {
    fetch(BACKEND_URL + "/api/documents", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authProps.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDocChatEnabled(true);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const getTimeline = () => {
    saveUserMessage("Can you make a timeline diagram over this topic? " + dialogInput, activeDiscussionId);

    fetch(BACKEND_URL + "/api/discussions/" + activeDiscussionId + "/timeline", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authProps.token}`,
      },
      body: JSON.stringify({ content: dialogInput }),
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error("Error from backend");
        }
        return result.json();
      })
      .then((result) => {
        handleNewMessage(result);
      })
      .catch((error) => {
        console.log(error);
        setSnackErrorMsg("Network error occurred");
        setIsSnackOpen(true);
        setIsThinking(false);
      })
      .finally(() => setIsThinking(false));
  };

  const getOutline = () => {
    console.log(authProps);
    saveUserMessage("Can you make a outline over this topic: " + dialogInput + "?", activeDiscussionId);
    fetch(BACKEND_URL + "/api/discussions/" + activeDiscussionId + "/outline", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authProps.token}`,
      },
      body: JSON.stringify({ content: dialogInput }),
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error("Error from backend");
        }
        return result.json();
      })
      .then((result) => {
        handleNewMessage(result);
      })
      .catch((error) => {
        console.log(error);
        setSnackErrorMsg("Network error occurred");
        setIsSnackOpen(true);
        setIsThinking(false);
      })
      .finally(() => setIsThinking(false));
  };

  const getQuestions = () => {
    fetch(BACKEND_URL + "/api/questions?topic=" + dialogInput, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authProps.token}`,
      },
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error("Error from backend");
        }
        return result.json();
      })
      .then((result) => setSuggestedQuestions(result["questions"]))
      .catch((error) => {
        console.log(error);
        setSnackErrorMsg("Network error occurred");
        setIsSnackOpen(true);
      })
      .finally(() => setIsThinking(false));
  };

  const handleQuestionHelperClick = () => {
    setActiveDialog("questionHelper");
    setDialogDesc("Enter a topic to get suggested questions");
    setOpen(true);
  };

  const handleTimelineClick = () => {
    setActiveDialog("timeline");
    setDialogDesc("Enter a topic to get an AI Generated Timeline");
    setOpen(true);
  };

  const handleDocsClick = () => {
    if (!docChatEnabled) {
      setDocumentDialogOpen(true);
    } else {
      setAppState({ ...appState, isDocChatActive: !appState.isDocChatActive });
    }
  };

  const handleOutlineClick = () => {
    setActiveDialog("outline");
    setDialogDesc("Choose a topic to get an outline from the AI");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDocDialogClose = () => {
    setDocumentDialogOpen(false);
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
        <DialogContent>
          <DialogContentText>{dialogDesc}</DialogContentText>
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
          <Button onClick={handleSubmit} type="submit">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={documentDialogOpen}
        onClose={handleDocDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle> No documents available</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To use the DocChat feature, first go to the Documents screen and upload one oe more documents.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDocDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        onOpen={handleSpeeddialOpen}
        onClose={handleSpeeddialClose}
        sx={{ position: "fixed", bottom: 100, right: 32 }}
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
          key="outline"
          icon={<FormatListBulletedIcon />}
          tooltipOpen
          onClick={handleOutlineClick}
          tooltipTitle="Outline"
        />
        <SpeedDialAction
          key="docs"
          icon={<FolderSpecialIcon />}
          tooltipOpen
          onClick={handleDocsClick}
          tooltipTitle={(!appState.isDocChatActive ? "Start" : "Stop") + " DocChat"}
          FabProps={{
            style: {
              backgroundColor: appState.isDocChatActive ? "red" : "green",
            },
          }}
        />
      </SpeedDial>
    </>
  );
};

export default BasicSpeedDial;
