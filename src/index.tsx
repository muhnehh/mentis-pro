import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MentisPro } from './components/MentisPro';
import { UserData } from './types';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = () => {
  const [userData, setUserData] = useState<UserData>({
    profile: {
      name: "User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
      email: "user@example.com"
    },
    preferences: {
      theme: 'light' as const,
      fontSize: 'medium' as const,
      audioEnabled: true,
      visualAids: true
    },
    cognitiveLoad: {
      current: 0,
      history: [],
      threshold: 7
    }
  });

  return (
    <React.StrictMode>
      <MentisPro userData={userData} setUserData={setUserData} />
    </React.StrictMode>
  );
};

root.render(<App />); 