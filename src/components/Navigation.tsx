import React from 'react';
import { Home, Calendar, Map, Heart } from 'lucide-react';

interface NavigationProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentScreen, setCurrentScreen }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'tasks', icon: Calendar, label: 'Tasks' },
    { id: 'navigation', icon: Map, label: 'Navigate' },
    { id: 'caregiver', icon: Heart, label: 'Support' }
  ];

  return (
    <nav className="bg-white shadow-lg fixed bottom-0 w-full">
      <div className="flex justify-around p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center ${
                currentScreen === item.id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}; 