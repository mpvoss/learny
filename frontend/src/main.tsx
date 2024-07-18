import React from 'react'
import AppMain from './AppMain.tsx'
import AppDocker from './AppDocker.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import {createRoot} from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);

const App = () => {
  if (import.meta.env.VITE_APP_MODE === 'docker') {
    return <AppDocker />;
  } else {
    return <AppMain />;
  }
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);