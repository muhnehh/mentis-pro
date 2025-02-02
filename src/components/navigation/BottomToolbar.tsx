import React from 'react';
import { Home, Calendar, MessageSquare, Settings, Brain } from 'lucide-react';
import { UserData } from '../../types';

interface BottomToolbarProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  userData: UserData;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  currentScreen,
  setCurrentScreen,
  userData
}) => {
  const getInsightMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Morning cognitive load is typically lower. Good time for challenging tasks.";
    } else if (currentHour < 17) {
      return "Afternoon focus may vary. Take regular breaks to maintain productivity.";
    } else {
      return "Evening is best for relaxing activities and planning tomorrow.";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1 flex items-center space-x-2 text-sm text-gray-600">
            <Brain className="w-5 h-5 text-blue-500" />
            <span>{getInsightMessage()}</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentScreen('dashboard')}
              className={`p-2 rounded-full ${
                currentScreen === 'dashboard' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentScreen('tasks')}
              className={`p-2 rounded-full ${
                currentScreen === 'tasks' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentScreen('chat')}
              className={`p-2 rounded-full ${
                currentScreen === 'chat' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentScreen('settings')}
              className={`p-2 rounded-full ${
                currentScreen === 'settings' ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 