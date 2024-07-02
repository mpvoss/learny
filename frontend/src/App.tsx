import './index.css'
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from './utils/supabase'
import AppHolder from './components/AppHolder'
import { UserProps } from './models'
import { Box } from '@mui/material'
import { Session } from '@supabase/supabase-js'
import { getEnv } from './utils/EnvUtil';
const backendUrl = getEnv('VITE_BACKEND_URL');

export default function App() {
  const [session, setSession] = useState<Session>()
  const [userProps, setUserProps] = useState<UserProps>()

  useEffect(() => {
    console.log(backendUrl);
    supabase.auth.getSession().then(({ data: { session } }) => {

      if (session != null) {
      setSession(session);
      }

      fetch(backendUrl + '/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`
        },
        credentials: 'include',
        body: JSON.stringify({ session }),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response data
          const userPropsData = data as UserProps;
          setUserProps(userPropsData);
        })
        .catch(error => {
          // Handle any errors
          console.error('Error:', error);
        });

    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session != null) {
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        sx={{
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        }}
      >
        <Box bgcolor="background.paper" p={2}>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
        </Box>
      </Box>

    )
  }
  else {
    return userProps != null && 
      <AppHolder authProps={{session}} userProps={userProps}></AppHolder>
  }
}