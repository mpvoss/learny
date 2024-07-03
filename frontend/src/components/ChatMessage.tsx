import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import QueueIcon from '@mui/icons-material/Queue';
import { styled } from "@mui/material";
import { Message } from "../models";
import MessageDiagram from "./MessageDiagram";

const StyledIconButton = styled(IconButton)({
    color: 'rgba(0, 0, 0, 0.54)',  // Subtle color
    padding: 8,                   // Reduces padding to make it less dominant
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'  // Subtle hover effect
    }
});

interface ChatMessageProps {
    msg: Message;
    index: number;
    handleFlashcardSaveDialogOpen: (id: number) => void;
    handleNoteSaveDialogOpen: (id: number) => void;
    handleSendMessage: (msg: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, index, handleFlashcardSaveDialogOpen, handleNoteSaveDialogOpen, handleSendMessage }) => {

    return (
        <>
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
                        maxWidth: {
                            xs: "85%", // 80% on small screens
                            sm: "60%", // 60% from sm breakpoint and up
                        },
                        whiteSpace: "pre-wrap",
                        textAlign: "left",

                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%'
                    }}
                >

                    <Stack direction="column">



                        <Typography>{msg.content}</Typography>
                        {msg.sender != "user" && msg.show_actions &&
                            <Stack direction="row" justifyContent="flex-end">

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
                            </Stack>
                        }
                    </Stack>
                </Box>
            </Box>
            {msg.diagrams && msg.diagrams.length > 0 && msg.diagrams.map((diagram, _index) => {
                return <MessageDiagram diagram={diagram} handleSendMessage={handleSendMessage}></MessageDiagram>
            }
            )}
        </>);
}

export default ChatMessage;