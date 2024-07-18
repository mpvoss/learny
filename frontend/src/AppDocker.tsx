import './index.css'
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from './utils/supabase'
import AppHolder from './components/AppHolder'
import { KJUR } from 'jsrsasign';
import { AuthProps, UserProps } from './models'
import { Box } from '@mui/material'
import { Session } from '@supabase/supabase-js'
import { getEnv } from './utils/EnvUtil';
const backendUrl = getEnv('VITE_BACKEND_URL');

const createUserProps= () => {
  return {
    id: '3',
    first_name: 'admin',
    last_name: 'admin',
    email: 'admin@admin.com',
    role: 'ADMIN'
  } as UserProps;
  
}

export default function AppDocker() {
  // const [session, setSession] = useState<Session>()
  const [userProps, setUserProps] = useState<UserProps>(createUserProps())
  const [isLoading,setIsLoading] = useState(true);
  const [authProps, setAuthProps] = useState<AuthProps>();

   // Function to create JWT
   const createToken = () => {
    const header = {alg: 'HS256', typ: 'JWT'};
    const data = {
        id: "1234567890",
        email: "matthewpvoss@gmail.com", // TODO HACKY
        sub: '123345456'
    };
    const secret = 'your-256-bit-secret'; // Use a secure way to handle your secret key in production

    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(data);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secret);

    console.log("Generated JWT:", sJWT);
    return sJWT;
};



useEffect(() => {
  setIsLoading(true)
  let token = createToken();
  setAuthProps({token: token});
  setIsLoading(false)
}, [])



  if (authProps && !isLoading) {
    return (
      <AppHolder authProps={authProps} userProps={userProps}></AppHolder>
  );
  }else{
    return <h2>oh no</h2>
  }
}