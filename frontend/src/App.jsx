import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { isAuthenticated } from './utils/auth';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
}
