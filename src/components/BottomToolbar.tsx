import React from 'react';
import { UserData } from '../types';
import { Home, Calendar, MessageSquare, Settings as SettingsIcon, Activity } from 'lucide-react';

interface BottomToolbarProps {
  userData: UserData;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  userData,
  currentScreen,
  setCurrentScreen,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: Calendar },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const getCognitiveLoadColor = (load: number) => {
    if (load <= 3) return 'text-green-500';
    if (load <= 7) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentScreen(id)}
              className={`flex flex-col items-center justify-center flex-1 py-1
                ${currentScreen === id
                  ? 'text-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
          <div className="flex flex-col items-center justify-center flex-1 py-1">
            <Activity className={`w-6 h-6 ${getCognitiveLoadColor(userData.cognitiveLoad.current)}`} />
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Load: {userData.cognitiveLoad.current}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 