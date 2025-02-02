import React from 'react';
import { Brain } from 'lucide-react';

interface WelcomeScreenProps {
  setCurrentScreen: (screen: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setCurrentScreen }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6">
        <Brain className="w-20 h-20 text-blue-600 mx-auto" />
        <h1 className="text-4xl font-bold text-blue-800">Welcome to Mentis Pro</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Your personalized cognitive support companion. Let's start by understanding
          how we can best assist you.
        </p>
        <button
          onClick={() => setCurrentScreen('assessment')}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold
            shadow-lg hover:bg-blue-700 transition-colors"
        >
          Begin Assessment
        </button>
      </div>
    </div>
  );
}; 