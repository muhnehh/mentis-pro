import React from 'react';
import { Coffee, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-600 dark:text-gray-300 text-sm">
            © 2024 MentisPro. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <a
              href="https://buymeacoffee.com/truemune"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy me a coffee</span>
            </a>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" />
              <span>by truemune</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 