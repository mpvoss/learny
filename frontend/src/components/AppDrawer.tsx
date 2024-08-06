import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useImperativeHandle, useState, forwardRef } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
// import AccountTreeIcon from '@mui/icons-material/AccountTree';
// import RuleIcon from '@mui/icons-material/Rule';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import { getEnv } from '../utils/EnvUtil';
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

const AppDrawer = forwardRef((props: DrawerProps, ref) => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [_activeTopic, setActiveTopic] = useState<string>();
    const [_selectedChat, setSelectedChat] = useState(0);
    const navigate = useNavigate();

    const handleDrawerClose = () => {
        props.setDrawerOpen(false);
    };

    useImperativeHandle(ref, () => ({
        refreshData: () => {
            // Fetch the latest discussions from the DB and update the state
            reloadDiscussions();
        }
    }));

    const reloadDiscussions = () => {
        fetch(BACKEND_URL + '/api/discussions',
            {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${props.authProps.token}`
                }
            }
        )
            .then(result => result.json())
            .then(result => {
                if (discussions != result) {
                    setDiscussions(result);
                }
            })
    }

    const handleChatSelect = (chatId: number) => {
        setSelectedChat(chatId);
        const appState = props.appState;
        props.setAppState({ ...appState, activeDiscussionId: chatId });
        let asdf = (discussions.find((x) => x.id == chatId));
        setActiveTopic(asdf?.topic);
        props.setDrawerOpen(false);
        navigate('/chats/' + chatId);
    }

    useEffect(() => {
        reloadDiscussions();
    }, []);
    const drawer = (
        <div>
            <List>

                <ListItemButton to="/" component={Link} onClick={() => props.setDrawerOpen(false)}>
                    <ListItemIcon>
                        <ChatIcon></ChatIcon>
                    </ListItemIcon>
                    <ListItemText>Chat</ListItemText>
                </ListItemButton>
                <ListItemButton to="/flashcards" component={Link} onClick={() => props.setDrawerOpen(false)}>
                    <ListItemIcon>
                        <FilterNoneIcon></FilterNoneIcon>
                    </ListItemIcon>
                    <ListItemText>Flash Cards</ListItemText>
                </ListItemButton>


                <ListItemButton to="/documents" component={Link} onClick={() => props.setDrawerOpen(false)}>
                    <ListItemIcon>
                        <FolderCopyIcon></FolderCopyIcon>
                    </ListItemIcon>
                    <ListItemText>Documents</ListItemText>
                </ListItemButton>

                {/* <ListItemButton to="/quizzes" component={Link} onClick={() => props.setDrawerOpen(false)}>
                    <ListItemIcon>
                        <RuleIcon></RuleIcon>
                    </ListItemIcon>
                    <ListItemText>Quizzes</ListItemText>
                </ListItemButton>

                <ListItemButton to="/diagrams" component={Link} onClick={() => props.setDrawerOpen(false)}>
                    <ListItemIcon>
                        <AccountTreeIcon></AccountTreeIcon>
                    </ListItemIcon>
                    <ListItemText>Diagrams</ListItemText>
                </ListItemButton> */}

                <ListItemButton to="/notes" component={Link} divider={true} onClick={() => props.setDrawerOpen(false)}>
                    <ListItemIcon>
                        <DescriptionIcon></DescriptionIcon>
                    </ListItemIcon>
                    <ListItemText>Notes</ListItemText>
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
            <Drawer
                open={props.drawerOpen}
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
});
export default AppDrawer;