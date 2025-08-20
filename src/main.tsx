  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import { BrowserRouter } from 'react-router-dom';
  import { UserProvider } from './context/UserContext';
  import App from './App';
  import './index.css';
import { CartProvider } from './context/CartContext';
import { CategoryProvider } from './context/CategoryContext';
import { AuthContext, AuthProvider } from './context/AuthContext';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <CartProvider>
              <CategoryProvider>
                <App />
              </CategoryProvider>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);