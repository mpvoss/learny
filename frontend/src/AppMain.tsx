import "./index.css";
import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./utils/supabase";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AppHolder from "./components/AppHolder";
import { UserProps } from "./models";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import ScaleLoader from "react-spinners/ScaleLoader";
import { getEnv } from "./utils/EnvUtil";
const backendUrl = getEnv("VITE_BACKEND_URL");

export default function AppMain() {
  const [session, setSession] = useState<Session>();
  const [userProps, setUserProps] = useState<UserProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [getSessionToggle, setGetSessionToggle] = useState(false);

  const loadSesh = () => {
    fetch(backendUrl + "/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      credentials: "include",
      body: JSON.stringify({ session }),
    })
      .then((response) => response.json())
      .then((data) => {
        const userPropsData = data as UserProps;
        setUserProps(userPropsData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadSesh();
  }, [getSessionToggle]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session != null) {
        setSession(session);
        setGetSessionToggle(!getSessionToggle);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session != null) {
        setSession(session);
        setGetSessionToggle(!getSessionToggle);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
        mt={2}
      >
        <AppBar
          component="nav"
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <MenuBookIcon sx={{ display: "flex", mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Learny
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <ScaleLoader width={10} color="grey" speedMultiplier={0.7} />
      </Box>
    );
  }
  if (!session && !isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        }}
      >
        <Box bgcolor="background.paper" p={2}>
          <Auth
            supabaseClient={supabase}
            redirectTo={import.meta.env.VITE_SUPABASE_REDIRECT_TO}
            appearance={{ theme: ThemeSupa }}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      userProps != null &&
      session != null && <AppHolder authProps={{ token: session.access_token }} userProps={userProps}></AppHolder>
    );
  }
}
