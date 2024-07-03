import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Container, Menu, MenuItem, Tooltip, styled } from '@mui/material'
import '../App.css'
import Chat from './Chat'
import { Menu as MenuIcon } from "@mui/icons-material";
import { Route, Routes,  useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import React, { useEffect } from 'react';
import NotesSearch from './NotesSearch';
import Study from './Study';
import FlashcardHome from './FlashcardHome';
import supabase from '../utils/supabase';
import { AppState, AuthProps, UserProps } from '../models';
import PendingUserScreen from './PendingUserScreen';
import AppDrawer from './AppDrawer';
import { Theme, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const DrawerWidth = 240;
interface MainContentProps {
    theme: Theme;
    isSmallScreen: boolean;
}

const MainContent = styled('main')<MainContentProps>(({ theme, isSmallScreen }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: (!isSmallScreen) ? DrawerWidth:0,
}));

function AppHolder({ authProps, userProps }: { authProps: AuthProps, userProps: UserProps }) {
    const [_anchorElNav, _setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [appState, setAppState] = React.useState<AppState>({activeDiscussionId:-1});
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleOpenNavMenu = () => {
        setDrawerOpen(!drawerOpen);
        // setAnchorElNav(event.currentTarget);
    }

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const handleLogout = () => {
        supabase.auth.signOut();
    }

    useEffect(() => {
        if (userProps.role === 'PENDING_USER') {
            navigate('/pendingAccess'); // Change '/pending' to the path you want to redirect to
        }
    }, [userProps, navigate]); // Adding navigate here is usually optional as it does not change


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    


    return (
        <>
            <AppBar
                component="nav"
                position="fixed"
                // color="#392032"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Container maxWidth="xl" >
                    <Toolbar disableGutters>
                        <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Learny
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            {/* <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >

                            </Menu> */}
                        </Box>
                        <MenuBookIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Learny
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {userProps.role !== 'PENDING_USER' && (
                                <>
                                </>
                            )}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                        {/* {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}  */}
                        <MenuItem key='logout' onClick={handleLogout}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>


            <AppDrawer authProps={authProps} userProps={userProps} appState={appState} setAppState={setAppState} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}></AppDrawer>

            <MainContent theme={theme} isSmallScreen={isSmallScreen}>


                <Routes>
                    <Route path="/" element={<Chat authProps={authProps} appState={appState} />} /> 
                    <Route path="/notes" element={<NotesSearch authProps={authProps} />} />
                    <Route path="/flashcards" element={<FlashcardHome authProps={authProps} />} />
                    <Route path="/study" element={<Study authProps={authProps} />} />
                    <Route path="/pendingAccess" element={<PendingUserScreen />} />
                </Routes>
            </MainContent>
        </>
    )
}

export default AppHolder
