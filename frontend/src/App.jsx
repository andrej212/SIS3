import { useState } from 'react';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import './App.css';

function App() {
  const [screen, setScreen] = useState('login');

  return screen === 'login' ? (
    <LoginPage onSwitch={() => setScreen('register')} />
  ) : (
    <RegisterPage onSwitch={() => setScreen('login')} />
  );
}

export default App;
