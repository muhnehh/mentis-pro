import React from 'react';
import { UserData } from '../types';
import { Sun, Moon, Type, Volume2, Eye } from 'lucide-react';

interface SettingsProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const Settings: React.FC<SettingsProps> = ({ userData, setUserData }) => {
  const isDarkMode = userData.preferences.theme === 'dark';

  const updatePreferences = (key: keyof UserData['preferences'], value: any) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const toggleDarkMode = () => {
    updatePreferences('theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Settings</h2>
        
        {/* Theme Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-medium dark:text-white">Theme</label>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-medium dark:text-white">Font Size</label>
            <Type className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <select
            value={userData.preferences.fontSize}
            onChange={(e) => updatePreferences('fontSize', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Audio Feedback */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-medium dark:text-white">Audio Feedback</label>
            <Volume2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userData.preferences.audioEnabled}
              onChange={(e) => updatePreferences('audioEnabled', e.target.checked)}
              className="mr-2"
            />
            <span className="dark:text-white">Enable audio feedback</span>
          </label>
        </div>

        {/* Visual Aids */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-medium dark:text-white">Visual Aids</label>
            <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userData.preferences.visualAids}
              onChange={(e) => updatePreferences('visualAids', e.target.checked)}
              className="mr-2"
            />
            <span className="dark:text-white">Enable visual aids</span>
          </label>
        </div>
      </div>
    </div>
  );
}; 