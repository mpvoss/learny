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
import { AppState, AuthProps, Discussion, Message } from "../models";
import CloseIcon from "@mui/icons-material/Close";
import NoteSaveDialog from "./NoteSaveDialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FlashCardSaveWizard from "./FlashCardSaveWizard";
import { getEnv } from '../utils/EnvUtil';
import BasicSpeedDial from "./Speeddial";
import ChatMessage from "./ChatMessage";
import ChatWelcome from "./ChatWelcome";
const BACKEND_URL = getEnv('VITE_BACKEND_URL');

interface ChatProps {
    authProps: AuthProps;
    appState: AppState;
    setAppState: (appState: AppState) => void;
    onNewDiscussion: () => void;
}

const Chat: React.FC<ChatProps> = ({ authProps, appState, setAppState, onNewDiscussion }) => {

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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { id } = useParams<{ id: string }>();
    const [discussionId, setDiscussionId] = useState(-1);
    const location = useLocation();
    const hasHandledInitialMessage = useRef(false);
    const navigate = useNavigate();



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
        if (id != null) {
            handleSendMessage(input, Number.parseInt(id));
        } else {
            setIsThinking(true);
            fetch(BACKEND_URL + '/api/discussions', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authProps.token}`
                },
                body: JSON.stringify({ topic: input })
            })
                .then(result => result.json())

                .then((data: Discussion) => {
                    navigate(`/chats/${data.id}`, { state: { firstMessage: input } });
                })
        }
    }

    const handleSendMessage = (input: string, discussionId: number | undefined) => {
        if (discussionId == null) {
            discussionId = discussionId;
        }
        saveUserMessage(input, discussionId);

        // Get AI Response
        let secondMessage = { content: input };

        fetch(BACKEND_URL + '/api/discussions/' + discussionId + (appState.isDocChatActive ? '/docchat' : '/chat'), {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.token}`
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

    const saveUserMessage = (input: string, discussionId: number | undefined) => {
        if (discussionId == null) {
            discussionId = discussionId;
        }

        let firstMessage = { sender: "user", content: input, discussion_id: discussionId };
        setIsThinking(true);
        // Save user message to db
        fetch(BACKEND_URL + '/api/discussions/' + discussionId + '/messages', {
            method: "POST",
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authProps.token}`
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
            handleSendMessage(suggestedQuestions[id], discussionId);
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
            // get current time
            const currentTime = new Date().toLocaleTimeString();
            // setInput(currentTime + " " + appState.isDocChatActive);
            setInput("Tell me a fun fact");
            console.log(appState.isDocChatActive)
            // setPage(2);
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
                'Authorization': `Bearer ${authProps.token}`
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
        let isCancelled = false;
        if (id == null) {
            return;
        }
        setDiscussionId(Number.parseInt(id));

        const loadMsgs = async () => {
            fetch(BACKEND_URL + '/api/discussions/' + id + '/messages?size=20&page=' + page, {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authProps.token}`
                }
            })
                .then(result => result.json())
                .then(result => {
                    setTotalPages(result.pages);

                    if (!isCancelled) {
                        setMessages([...result.items.reverse()]);
                    }
                }
                )
        }

        if (!hasHandledInitialMessage.current && location.state != null && location.state.firstMessage != null) {
            handleSendMessage(location.state.firstMessage, Number.parseInt(id));
            hasHandledInitialMessage.current = true;
            onNewDiscussion();
        } else if (location.state == null || (location.state != null && location.state.firstMessage == null)) {
            loadMsgs();
        }

        return () => {
            isCancelled = true;
        };

    }, [id]);

    const handleScroll = (event: { currentTarget: { scrollTop: any; clientHeight: any; scrollHeight: any; }; }) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        // console.log(scrollHeight-scrollTop)
        // console.log(scrollHeight-scrollTop)
        console.log('scrollTop ' + scrollTop)
        console.log('clientHeight ' + clientHeight)
        console.log('scrollHeight ' + scrollHeight)
        // console.log(clientHeight)
        // console.log(scrollTop)
        console.log("0000000000000000000000")



        if (scrollTop === 0) {
            if (page < totalPages) {
                setPage(oldPage => oldPage + 1);
            }
        }
    };

    //-----------------------------------------------------------------
    // Render
    //-----------------------------------------------------------------
    return (

        appState ? (
            <Box
            // sx={{ display: "flex" }}
            >
                <NoteSaveDialog authProps={authProps} open={isNoteSaveDialogOpen} saveWithTag={saveNoteWithTags} onClose={() => { handleNoteSaveDialogClose() }}></NoteSaveDialog>

                {discussionId != null &&
                    <FlashCardSaveWizard authProps={authProps} open={isFlashcardSaveDialogOpen} discussionId={discussionId} messageId={actionMessageId} setOpen={setIsFlashcardSaveDialogOpen}></FlashCardSaveWizard>
                }
                <CssBaseline />
                <Box
                      onScroll={handleScroll}
                    component="main"
                    sx={{
                        // flexGrow: 1,
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
                            height: "calc(100vh - 112px)"
                            // height: '100vh',
                        }}
                    >
                        <Box

                            sx={{
                                // flexGrow: 1,
                                //  overflowY: "auto",
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

                            {
                                id == null ? <ChatWelcome authProps={authProps} ></ChatWelcome> : null
                            }


                            <div
                            //    onScroll={handleScroll} 
                            //    style={{ overflow: 'auto', height: '100%' }}
                            >
                                {messages.map((msg, index) => (
                                    <ChatMessage
                                        msg={msg}
                                        index={index}
                                        handleFlashcardSaveDialogOpen={handleFlashcardSaveDialogOpen}
                                        handleNoteSaveDialogOpen={handleNoteSaveDialogOpen}
                                        handleSendMessage={handleSendMessage}
                                        activeDiscussionId={discussionId}
                                    ></ChatMessage>
                                ))}


                            </div>
                            {/* page={page}<br></br>
                            appstate= {appState.activeDiscussionId} */}

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
                                padding: "8px",
                                // flexDirection: 'column', // Stack the children vertically
                                // justifyContent: 'space-between',
                                // height: '100vh',
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
                                appState={appState}
                                setAppState={setAppState}
                                setIsThinking={setIsThinking}
                                setSuggestedQuestions={setSuggestedQuestions}
                                setSnackErrorMsg={setSnackErrorMsg}
                                setIsSnackOpen={setIsSnackOpen}
                                saveUserMessage={saveUserMessage}
                                activeDiscussionId={discussionId}
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
