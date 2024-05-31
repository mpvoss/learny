import React from 'react'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import {createRoot} from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);