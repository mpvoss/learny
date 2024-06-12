import React, { useEffect, useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import QueueIcon from '@mui/icons-material/Queue';
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    TextField,
    Button,
    Toolbar,
    Typography,
    DialogTitle,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    LinearProgress,
    Snackbar,
    Alert,
    styled,
    Tooltip,
    ListItemButton,
    ListItemIcon
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { AuthProps, Discussion, Message } from "../models";
import NoteSaveDialog from "./NoteSaveDialog";
import DiscussionCreateDialog from "./DiscussionCreateDialog";
import FlashCardSaveWizard from "./FlashCardSaveWizard";
import { getEnv } from '../utils/EnvUtil';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');
const drawerWidth = 240;




const Chat: React.FC<AuthProps> = ({ session }) => {
    const [activeDiscussionId, setActiveDiscussionId] = useState<number>();
    const [_activeTopic, setActiveTopic] = useState<string>();
    const [_selectedChat, setSelectedChat] = useState(0);
    const [input, setInput] = useState("");
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [open, setOpen] = React.useState(false);
    const [dialogText, setDialogText] = React.useState<string>("");
    const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>();
    const [isThinking, setIsThinking] = React.useState<boolean>(false);
    const [isSnackOpen, setIsSnackOpen] = React.useState<boolean>(false);
    const [snackErrorMsg, setSnackErrorMsg] = React.useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isNoteSaveDialogOpen, setIsNoteSaveDialogOpen] = useState(false);
    const [isFlashcardSaveDialogOpen, setIsFlashcardSaveDialogOpen] = useState(false);
    const [isDiscussionCreateDialogOpen, setIsDiscussionCreateDialogOpen] = useState(false);
    const [actionMessageId, setActionMessageId] = useState<number>(-1);


    //-----------------------------------------------------------------
    // Misc
    //-----------------------------------------------------------------
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleNoteSaveDialogOpen = (msgId: number) => {
        setActionMessageId(msgId)
        setIsNoteSaveDialogOpen(true);
    }

    const handleNoteSaveDialogClose = () => {
        setIsNoteSaveDialogOpen(false);
    }

    const handleFlashcardSaveDialogOpen = (msgId: number) => {
        setActionMessageId(msgId)
        setIsFlashcardSaveDialogOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleTextChange = (event: any) => {
        setDialogText(event.target.value);
    }

    const handleSnackClose = () => {
        setIsSnackOpen(false);
    }

    const handleQhelper = () => {
        handleClickOpen();
    };

    const StyledIconButton = styled(IconButton)({
        color: 'rgba(0, 0, 0, 0.54)',  // Subtle color
        padding: 8,                   // Reduces padding to make it less dominant
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'  // Subtle hover effect
        }
    });

    //-----------------------------------------------------------------
    // Workers
    //-----------------------------------------------------------------
    const handleSendMessageBtn = () => {
        handleSendMessage(input);
    }

    const handleSendMessage = (input: string) => {
        let firstMessage = { sender: "user", content: input, discussion_id: activeDiscussionId };
        setIsThinking(true);
        // Save user message to db
        fetch(BACKEND_URL + '/api/discussions/' + activeDiscussionId + '/messages', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(firstMessage)
        }).then(result => {
            if (!result.ok) {
                throw new Error("Error from backend")
            }
            return result.json()
        }).then(result => {
            setMessages(prevMessages => [...prevMessages, result]);
        }).catch(error => {
            console.log(error);
            setSnackErrorMsg("Network error occurred")
            setIsSnackOpen(true)
            setIsThinking(false)
        })


        // Get AI Response
        let secondMessage = { content: input };

        fetch(BACKEND_URL + '/api/discussions/' + activeDiscussionId + '/chat', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(secondMessage)
        }).then(result => {
            if (!result.ok) {
                throw new Error("Error from backend")
            }
            return result.json()
        }).then(result => {
            setMessages(prevMessages => [...prevMessages, result]);
        }).catch(error => {
            console.log(error);
            setSnackErrorMsg("Network error occurred")
            setIsSnackOpen(true)
            setIsThinking(false)
        }).finally(
            () => setIsThinking(false)
        )


        setInput("");
    }

    // ai reply from button click causes purge
    const handleSuggestedQuestionClick = (id: number) => {
        if (suggestedQuestions) {
            handleSendMessage(suggestedQuestions[id]);
        }

        setInput("");
        setSuggestedQuestions([])
    }




    const handleQuestionHelperSubmit = () => {
        setIsThinking(true);

        fetch(BACKEND_URL + '/api/questions?topic=' + dialogText, {
            method: "GET",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
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

    const handleChatSelect = (chatId: number) => {
        setSelectedChat(chatId);

        setActiveDiscussionId(chatId);
        let asdf = (discussions.find((x) => x.id == chatId));
        setActiveTopic(asdf?.topic);

        fetch(BACKEND_URL + '/api/discussions/' + chatId + '/messages', {
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        })
            .then(result => result.json())
            .then(result => setMessages(result))

    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSendMessageBtn();
        }
        if (event.key === '*') {
            event.preventDefault();
            setInput("tell me an interesting fact I've never heard before");
        }
    };


    const saveNoteWithTags = (tag: string) => {
        // get message with id equal to actionMessageId
        let msg = messages.find(x => x.id == actionMessageId)

        fetch(BACKEND_URL + '/api/notes', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ content: msg?.content, tag: tag })
        }).then(result => {
            if (!result.ok) {
                throw new Error("Error from backend")
            }
            return result.json()
        }).then(result => {
            console.log("Note saved with tags", result);
        }).catch(error => {
            console.log(error);
            setSnackErrorMsg("Network error occurred")
            setIsSnackOpen(true)
        })
    }

    const reloadDiscussions = () => {
        fetch(BACKEND_URL + '/api/discussions',
            {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            }
        )
            .then(result => result.json())
            .then(result => {
                setDiscussions(result);
                if (result.length > 0) {
                    handleChatSelect(result[0].id);
                }
            })
    }


    useEffect(() => {
        reloadDiscussions();
    }, []);

    // Scroll to the bottom every time messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    //-----------------------------------------------------------------
    // Render
    //-----------------------------------------------------------------
    return (
        <Box sx={{ display: "flex" }}>
            <NoteSaveDialog open={isNoteSaveDialogOpen} saveWithTag={saveNoteWithTags} onClose={() => { handleNoteSaveDialogClose() }}></NoteSaveDialog>

            {activeDiscussionId != null &&
                <FlashCardSaveWizard session={session} open={isFlashcardSaveDialogOpen} discussionId={activeDiscussionId} messageId={actionMessageId} setOpen={setIsFlashcardSaveDialogOpen}></FlashCardSaveWizard>
            }
            <DiscussionCreateDialog session={session} open={isDiscussionCreateDialogOpen} setOpen={setIsDiscussionCreateDialogOpen} onDiscussionCreated={reloadDiscussions} ></DiscussionCreateDialog>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        // const formData = new FormData(event.currentTarget);
                        // const formJson = Object.fromEntries((formData as any).entries());
                        // const email = formJson.email;
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Question Helper</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Let the AI suggest questions you can ask about the topic below
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        // label="Email Address"
                        // value={activeTopic}
                        onChange={handleTextChange}

                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleQuestionHelperSubmit} type="submit">Submit</Button>
                </DialogActions>
            </Dialog>


            <CssBaseline />
            {/* https://mui.com/material-ui/react-drawer/ */}

            {/* <Grid container>
                <Grid item xs={4} > */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>

                        <ListItemButton
                            divider={true}
                            onClick={() => setIsDiscussionCreateDialogOpen(true)}
                        >
                            <ListItemIcon>
                                <AddIcon></AddIcon>
                            </ListItemIcon>
                            <ListItemText>New Discussion</ListItemText>
                        </ListItemButton>

                        {discussions.map((discussion) => (
                            <ListItem
                                key={discussion.id}
                                disablePadding
                                // selected={selectedChat === discussion.id}
                                onClick={() => handleChatSelect(discussion.id)}
                            >
                                <ListItemButton>
                                    <ListItemIcon></ListItemIcon>
                                    <ListItemText primary={discussion.topic} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>



                </Box>
            </Drawer>


            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    // width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Toolbar />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        // height: "calc(100vh - 112px)"
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            marginBottom: "8px",
                            // border: "1px solid lightgray",
                            borderRadius: "8px",
                            padding: "8px"
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                    marginBottom: "8px"
                                }}
                            >
                                <Box
                                    sx={{
                                        backgroundColor: msg.sender === "user" ? "#3f51b5" : "#e0e0e0",
                                        color: msg.sender === "user" ? "white" : "black",
                                        padding: "8px 12px",
                                        borderRadius: "16px",
                                        maxWidth: "60%",
                                        whiteSpace: "pre-wrap",
                                        textAlign: "left",

                                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%'
                                    }}
                                >

                                    <Typography>{msg.content}</Typography>
                                    {msg.sender != "user" &&
                                        <>
                                            <Tooltip title="Create flashcards">
                                                <StyledIconButton onClick={() => handleFlashcardSaveDialogOpen(msg.id)}>
                                                    <QueueIcon />
                                                </StyledIconButton>
                                            </Tooltip>
                                            <Tooltip title="Save note">
                                                <StyledIconButton onClick={() => handleNoteSaveDialogOpen(msg.id)}>
                                                    <BookmarksIcon />
                                                </StyledIconButton >
                                            </Tooltip>
                                        </>
                                    }

                                </Box>
                            </Box>
                        ))}
                        {suggestedQuestions?.map((msg, index) => (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSuggestedQuestionClick(index)}
                                sx={{ marginLeft: "8px", marginTop: "8px" }}
                            >
                                {msg}
                            </Button>))}
                        <div ref={messagesEndRef} />
                        {isThinking &&
                            <LinearProgress sx={{ marginTop: 2 }} />
                        }
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            // border: "1px solid lightgray",
                            borderRadius: "8px",
                            padding: "8px"
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Type a message..."
                            variant="outlined"
                            value={input}
                            onKeyPress={handleKeyPress}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SendIcon />}
                            onClick={handleSendMessageBtn}
                            sx={{ marginLeft: "8px" }}
                        >
                            Send
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<AutoAwesomeIcon />}
                            onClick={handleQhelper}
                            sx={{ marginLeft: "8px" }}
                        >
                            QHelper
                        </Button>


                    </Box>
                </Box>
            </Box>

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
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackErrorMsg}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default Chat;
