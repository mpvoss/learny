import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    CssBaseline,
    IconButton,
    TextField,
    Button,
    Toolbar,
    LinearProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { AppState, AuthProps, Message } from "../models";
import CloseIcon from "@mui/icons-material/Close";
import NoteSaveDialog from "./NoteSaveDialog";
import FlashCardSaveWizard from "./FlashCardSaveWizard";
import { getEnv } from '../utils/EnvUtil';
import BasicSpeedDial from "./Speeddial";
import ChatMessage from "./ChatMessage";
const BACKEND_URL = getEnv('VITE_BACKEND_URL');

interface ChatProps {
    authProps: AuthProps;
    appState: AppState;
}

const Chat: React.FC<ChatProps>= ({ authProps, appState }) => {

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>();
    const [isThinking, setIsThinking] = React.useState<boolean>(false);
    const [isSnackOpen, setIsSnackOpen] = React.useState<boolean>(false);
    const [snackErrorMsg, setSnackErrorMsg] = React.useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isNoteSaveDialogOpen, setIsNoteSaveDialogOpen] = useState(false);
    const [isFlashcardSaveDialogOpen, setIsFlashcardSaveDialogOpen] = useState(false);
    const [actionMessageId, setActionMessageId] = useState<number>(-1);


    //-----------------------------------------------------------------
    // Misc
    //-----------------------------------------------------------------
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

    const handleSnackClose = () => {
        setIsSnackOpen(false);
    }


    //-----------------------------------------------------------------
    // Workers
    //-----------------------------------------------------------------
    const handleSendMessageBtn = () => {
        handleSendMessage(input);
    }

    const handleSendMessage = (input: string) => {
        saveUserMessage(input);


        // Get AI Response
        let secondMessage = { content: input };

        fetch(BACKEND_URL + '/api/discussions/' + appState.activeDiscussionId + '/chat', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.session.access_token}`
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

    const handleNewMessage = (result: Message) => {
        setMessages(prevMessages => [...prevMessages, result]);
    }

    const saveUserMessage = (input: string) => {
        let firstMessage = { sender: "user", content: input, discussion_id: appState.activeDiscussionId };
        setIsThinking(true);
        // Save user message to db
        fetch(BACKEND_URL + '/api/discussions/' + appState.activeDiscussionId + '/messages', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.session.access_token}`
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
    }

    // ai reply from button click causes purge
    const handleSuggestedQuestionClick = (id: number) => {
        if (suggestedQuestions) {
            handleSendMessage(suggestedQuestions[id]);
        }

        setInput("");
        setSuggestedQuestions([])
    }



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
                'Authorization': `Bearer ${authProps.session.access_token}`
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

    // Scroll to the bottom every time messages change
    useEffect(() => {
        // setSelectedChat(chatId);

        // setActiveDiscussionId(chatId);
        // let asdf = (discussions.find((x) => x.id == chatId));
        // setActiveTopic(asdf?.topic);
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    useEffect(() => {
        console.log("APP STATE CHANGED")
        console.log(messages)
        if (appState == null || appState.activeDiscussionId == null) {
            console.log("BRO IDK WHAT DISCUSSION IS");
            return;
        }
        fetch(BACKEND_URL + '/api/discussions/' + appState.activeDiscussionId + '/messages', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${authProps.session.access_token}`
            }
        })
            .then(result => result.json())
            .then(result => setMessages(result))
    }, [appState])


    //-----------------------------------------------------------------
    // Render
    //-----------------------------------------------------------------
    return (

        appState ? (
            <Box sx={{ display: "flex" }}>
                <NoteSaveDialog authProps={authProps} open={isNoteSaveDialogOpen} saveWithTag={saveNoteWithTags} onClose={() => { handleNoteSaveDialogClose() }}></NoteSaveDialog>

                {appState.activeDiscussionId != null &&
                    <FlashCardSaveWizard authProps={authProps} open={isFlashcardSaveDialogOpen} discussionId={appState.activeDiscussionId} messageId={actionMessageId} setOpen={setIsFlashcardSaveDialogOpen}></FlashCardSaveWizard>
                }
                <CssBaseline />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        // p: 3,
                        //  width: { sm: `calc(100% - ${drawerWidth}px)` }
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
                                
                                "@media (min-width: 1024px)": {
                                    padding: "16px",
                                    maxWidth: "1200px",
                                    margin: "auto"
                                },

                                
                                  
                                
                                // padding: "8px"
                            }}
                        >
                            {messages.map((msg, index) => (
                                <ChatMessage
                                    msg={msg}
                                    index={index}
                                    handleFlashcardSaveDialogOpen={handleFlashcardSaveDialogOpen}
                                    handleNoteSaveDialogOpen={handleNoteSaveDialogOpen}
                                    handleSendMessage={handleSendMessage}
                                ></ChatMessage>
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

                            <IconButton
                                color="primary"
                                aria-label="delete"
                                size="large"
                                onClick={handleSendMessageBtn}
                                sx={{
                                    marginLeft: "8px",
                                    // marginRight: "70px",
                                    backgroundColor: theme => theme.palette.primary.main, // set background color to primary color
                                    color: theme => theme.palette.common.white, // set icon color to white
                                    '&:hover': {
                                        backgroundColor: theme => theme.palette.primary.dark, // change background color on hover
                                    },
                                }}
                            >
                                <SendIcon fontSize="inherit" />
                            </IconButton>
                            <BasicSpeedDial
                                authProps={authProps}
                                setIsThinking={setIsThinking}
                                setSuggestedQuestions={setSuggestedQuestions}
                                setSnackErrorMsg={setSnackErrorMsg}
                                setIsSnackOpen={setIsSnackOpen}
                                saveUserMessage={saveUserMessage}
                                activeDiscussionId={appState.activeDiscussionId}
                                handleNewMessage={handleNewMessage}
                            ></BasicSpeedDial>
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
        ) : null
    );
};

export default Chat;
