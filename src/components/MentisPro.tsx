import React, { useState, useEffect } from 'react';
import { UserData, CognitiveLoadData } from '../types';
import { Header } from './Header';
import { AssessmentQuiz } from './AssessmentQuiz';
import { Dashboard } from './Dashboard';
import { Tasks } from './tasks/Tasks';
import { Settings } from './Settings';
import { AIAssistant } from './chat/AIAssistant';
import { BottomToolbar } from './navigation/BottomToolbar';
import { NavigationMap } from './navigation/NavigationMap';
import { Footer } from './Footer';

interface MentisProProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const MentisPro: React.FC<MentisProProps> = ({ userData, setUserData }) => {
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');

  // Cognitive load monitoring
  useEffect(() => {
    const getCurrentActivity = () => {
      const activities = ['Reading', 'Task Planning', 'Navigation', 'Rest'];
      return activities[Math.floor(Math.random() * activities.length)];
    };

    const updateCognitiveLoad = () => {
      const newLoad: CognitiveLoadData = {
        time: new Date().toLocaleTimeString(),
        load: Math.random() * 100,
        activity: getCurrentActivity()
      };

      setUserData(prev => ({
        ...prev,
        cognitiveLoad: {
          ...prev.cognitiveLoad,
          current: newLoad.load,
          history: [...prev.cognitiveLoad.history, newLoad].slice(-10)
        }
      }));
    };

    const interval = setInterval(updateCognitiveLoad, 3000);
    return () => clearInterval(interval);
  }, [setUserData]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <div className="max-w-2xl mx-auto mt-20 p-6 text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-6">Welcome to MentisPro</h1>
            <p className="text-lg text-gray-600 mb-8">
              Let's start by understanding your needs through a quick assessment.
            </p>
            <button
              onClick={() => setCurrentScreen('assessment')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Start Assessment
            </button>
          </div>
        );
      case 'assessment':
        return (
          <AssessmentQuiz
            setUserData={setUserData}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'dashboard':
        return <Dashboard userData={userData} />;
      case 'tasks':
        return <Tasks />;
      case 'navigation':
        return <NavigationMap />;
      case 'chat':
        return <AIAssistant userData={userData} />;
      case 'settings':
        return <Settings userData={userData} setUserData={setUserData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        userData={userData} 
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
      />
      
      <main className="flex-1 container mx-auto p-4">
        {renderScreen()}
      </main>

      {currentScreen !== 'welcome' && currentScreen !== 'assessment' && (
        <BottomToolbar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          userData={userData}
        />
      )}

      <Footer />
    </div>
  );
}; 