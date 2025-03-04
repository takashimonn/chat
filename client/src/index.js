// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Estilos globales, si los tienes
import App from './App';  // El componente principal de la app
import reportWebVitals from './reportWebVitals';  // Si lo necesitas, si no, puedes eliminarlo

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres empezar a medir el rendimiento en tu app, puedes usar reportWebVitals
// reportWebVitals(console.log); // o lo que necesites
