import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import './styles/tailwind.css';
import App from './App';
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);