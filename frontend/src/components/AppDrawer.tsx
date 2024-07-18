import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import '../App.css'
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RuleIcon from '@mui/icons-material/Rule';
import AddIcon from '@mui/icons-material/Add';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import { getEnv } from '../utils/EnvUtil';
import DiscussionCreateDialog from './DiscussionCreateDialog';
import { AppState, AuthProps, Discussion, UserProps } from '../models';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');
const drawerWidth = 240;


interface DrawerProps {
    authProps: AuthProps;
    userProps: UserProps;
    appState: AppState;
    setAppState: (appState: AppState) => void;
    drawerOpen: boolean;
    setDrawerOpen: (drawerOpen: boolean) => void;
}

const AppDrawer: React.FC<DrawerProps> = ({ authProps, appState, setAppState, drawerOpen, setDrawerOpen }) => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [_activeTopic, setActiveTopic] = useState<string>();
    const [_selectedChat, setSelectedChat] = useState(0);
    const [isDiscussionCreateDialogOpen, setIsDiscussionCreateDialogOpen] = useState(false);

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const reloadDiscussions = () => {
        fetch(BACKEND_URL + '/api/discussions',
            {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authProps.token}`
                }
            }
        )
            .then(result => result.json())
            .then(result => {
                if (discussions != result) {
                    setDiscussions(result);
                    if (result.length > 0) {
                        handleChatSelect(result[0].id);
                    }
                }
            })
    }


    const handleChatSelect = (chatId: number) => {
        setSelectedChat(chatId);
        setAppState({ ...appState, activeDiscussionId: chatId });
        // setActiveDiscussionId(chatId);
        let asdf = (discussions.find((x) => x.id == chatId));
        setActiveTopic(asdf?.topic);

        // fetch(BACKEND_URL + '/api/discussions/' + chatId + '/messages', {
        //     credentials: 'include',
        //     headers: {
        //         Authorization: `Bearer ${authProps.token}`
        //     }
        // })
        //     .then(result => result.json())
        //     .then(result => setAppState({ ...appState, messages: result }))

    };

    useEffect(() => {
        reloadDiscussions();
    }, []);

    const drawer = (
        <div>
            <List>

                <ListItemButton to="/" component={Link}>
                    <ListItemIcon>
                        <ChatIcon></ChatIcon>
                    </ListItemIcon>
                    <ListItemText>Chat</ListItemText>
                </ListItemButton>
                <ListItemButton to="/flashcards" component={Link}>
                    <ListItemIcon>
                        <FilterNoneIcon></FilterNoneIcon>
                    </ListItemIcon>
                    <ListItemText>Flash Cards</ListItemText>
                </ListItemButton>


                <ListItemButton to="/documents" component={Link}>
                    <ListItemIcon>
                        <FolderCopyIcon></FolderCopyIcon>
                    </ListItemIcon>
                    <ListItemText>Documents</ListItemText>
                </ListItemButton>

                <ListItemButton to="/quizzes" component={Link}>
                    <ListItemIcon>
                        <RuleIcon></RuleIcon>
                    </ListItemIcon>
                    <ListItemText>Quizzes</ListItemText>
                </ListItemButton>

                <ListItemButton to="/diagrams" component={Link}>
                    <ListItemIcon>
                        <AccountTreeIcon></AccountTreeIcon>
                    </ListItemIcon>
                    <ListItemText>Diagrams</ListItemText>
                </ListItemButton>

                <ListItemButton to="/notes" component={Link} divider={true}>
                    <ListItemIcon>
                        <DescriptionIcon></DescriptionIcon>
                    </ListItemIcon>
                    <ListItemText>Notes</ListItemText>
                </ListItemButton>
                <ListItemButton onClick={() => setIsDiscussionCreateDialogOpen(true)}>
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
        </div>)



    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <DiscussionCreateDialog authProps={authProps} open={isDiscussionCreateDialogOpen} setOpen={setIsDiscussionCreateDialogOpen} onDiscussionCreated={reloadDiscussions} ></DiscussionCreateDialog>
            <Drawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, paddingTop: 7 },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, paddingTop: 7 },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}
export default AppDrawer;