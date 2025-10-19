import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// Capturar errores no manejados
window.addEventListener('error', (event) => {
  console.error('Error global capturado:', event.error);
  console.error('Mensaje:', event.message);
  console.error('Archivo:', event.filename);
  console.error('Línea:', event.lineno);
  console.error('Columna:', event.colno);
});

// Capturar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada:', event.reason);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);