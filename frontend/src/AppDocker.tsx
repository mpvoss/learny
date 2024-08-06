import './index.css'
import { useState, useEffect } from 'react'
import AppHolder from './components/AppHolder'
import { KJUR } from 'jsrsasign';
import { AuthProps, UserProps } from './models'

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
  const [userProps, _setUserProps] = useState<UserProps>(createUserProps())
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
    const secret = 'dummy_secret_for_local_docker'; 

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