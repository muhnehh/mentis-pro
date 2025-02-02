import React, { useEffect, useState } from 'react';
import { MentisPro } from './components/MentisPro';
import { UserData } from './types';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    profile: {
      name: "User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
      email: "user@example.com"
    },
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      audioEnabled: true,
      visualAids: true
    },
    cognitiveLoad: {
      current: 0,
      history: [],
      threshold: 7
    }
  });

  useEffect(() => {
    // Apply dark mode to root element
    document.documentElement.classList.toggle('dark', userData.preferences.theme === 'dark');
    // Apply dark mode to body
    document.body.classList.toggle('dark:bg-gray-900', userData.preferences.theme === 'dark');
  }, [userData.preferences.theme]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      userData.preferences.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <MentisPro userData={userData} setUserData={setUserData} />
    </div>
  );
};

export default App; 