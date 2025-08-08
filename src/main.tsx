  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { BrowserRouter } from 'react-router-dom';
  import { UserProvider } from './context/UserContext';
  import App from './App';
  import './index.css';
import { CartProvider } from './context/CartContext';
import { CategoryProvider } from './context/CategoryContext';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <UserProvider>
          <CartProvider>
            <CategoryProvider>
             <App />
            </CategoryProvider>
          </CartProvider>
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  );