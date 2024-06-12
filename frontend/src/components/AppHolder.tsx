import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Container, Menu, MenuItem, Tooltip } from '@mui/material'
import '../App.css'
import Chat from './Chat'
import { Menu as MenuIcon } from "@mui/icons-material";
// import { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import React, { useEffect } from 'react';
import NotesSearch from './NotesSearch';
import Study from './Study';
import FlashcardHome from './FlashcardHome';
import ConceptMap from './ConceptMap';
import supabase from '../utils/supabase';
import { UserProps } from '../models';
import PendingUserScreen from './PendingUserScreen';
import { Session } from '@supabase/supabase-js';
// const settings = ['Profile'];




function AppHolder({ session,userProps }: {session:Session, userProps:UserProps}) {
    // const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        supabase.auth.signOut();
    }


    useEffect(() => {
        if (userProps.role === 'PENDING_USER') {
            navigate('/pendingAccess'); // Change '/pending' to the path you want to redirect to
        }
    }, [userProps, navigate]); // Adding navigate here is usually optional as it does not change


    // const handleDrawerToggle = () => {
    //   setMobileOpen(!mobileOpen);
    // };
    return (
        <>
        {/* <p>{{userProps.role}}</p> */}
            <AppBar
                component="nav"
                position="fixed"
                // color="#392032"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Container maxWidth="xl">
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
                            <Menu
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

                                <MenuItem key="fart1" component={Link} to="/asdf">Fart</MenuItem>
                            </Menu>
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
                            <MenuItem key="fart1" component={Link} to="/notes" sx={{ my: 2, color: 'white', display: 'block' }}>Notes</MenuItem>
                            <MenuItem key="fart2" component={Link} to="/flashcards" sx={{ my: 2, color: 'white', display: 'block' }}>Flash Cards</MenuItem>
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
                                ))} */}
                                <MenuItem key='logout' onClick={handleLogout}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Routes>
                <Route path="/" element={<Chat session={session}/>} />
                <Route path="/notes" element={<NotesSearch session={session}/>} />
                <Route path="/flashcards" element={<FlashcardHome session={session} />} />
                <Route path="/study" element={<Study session={session} />} />
                <Route path="/conceptMap" element={<ConceptMap session={session} />} />
                <Route path="/pendingAccess" element={<PendingUserScreen />}/>
            </Routes>
        </>
    )
}

export default AppHolder
