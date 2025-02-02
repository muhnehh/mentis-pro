import React from 'react';
import { UserData } from '../types';
import { Menu, X, Home, Settings as SettingsIcon, MessageSquare, Calendar } from 'lucide-react';

interface HeaderProps {
  userData: UserData;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ userData, currentScreen, setCurrentScreen }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: Calendar },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src={userData.profile.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-3 font-semibold text-gray-900 dark:text-white">
              {userData.profile.name}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentScreen(id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium
                  ${currentScreen === id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentScreen(id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 text-left text-sm font-medium
                  ${currentScreen === id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}; 