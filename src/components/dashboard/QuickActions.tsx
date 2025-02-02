import React, { useState } from 'react';
import { Home, Navigation2, Briefcase, Camera, Headphones, Settings } from 'lucide-react';

interface QuickActionsProps {
  userData: any;
}

interface SupportArea {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  actions: string[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ userData }) => {
  const [selectedArea, setSelectedArea] = useState<string>('home');

  const supportAreas: SupportArea[] = [
    {
      id: 'home',
      title: 'Home',
      icon: <Home className="w-6 h-6" />,
      description: 'Organization and cleaning assistance',
      actions: [
        'Create cleaning schedule',
        'Set medication reminders',
        'Organize living space',
        'Manage daily routines'
      ]
    },
    {
      id: 'mobility',
      title: 'Mobility',
      icon: <Navigation2 className="w-6 h-6" />,
      description: 'Safe navigation in cities and public transport',
      actions: [
        'Plan safe routes',
        'Public transport schedules',
        'Emergency contacts',
        'Location sharing'
      ]
    },
    {
      id: 'work',
      title: 'Work',
      icon: <Briefcase className="w-6 h-6" />,
      description: 'Detailed guides for job tasks',
      actions: [
        'Task breakdown',
        'Meeting reminders',
        'Work schedule',
        'Break timer'
      ]
    }
  ];

  const features = [
    {
      icon: <Camera className="w-5 h-5" />,
      title: 'Image Analysis',
      description: 'Take a photo for contextual advice'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'AI Guidance',
      description: 'Get personalized instructions'
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: 'Audio Guide',
      description: 'Listen to task instructions'
    }
  ];

  const currentArea = supportAreas.find(area => area.id === selectedArea)!;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {supportAreas.map(area => (
          <button
            key={area.id}
            onClick={() => setSelectedArea(area.id)}
            className={`p-4 rounded-lg transition-all ${
              selectedArea === area.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="flex flex-col items-center">
              {area.icon}
              <span className="mt-2 font-medium">{area.title}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-lg mb-2">{currentArea.title} Support</h4>
        <p className="text-gray-600 mb-4">{currentArea.description}</p>
        <div className="grid grid-cols-2 gap-3">
          {currentArea.actions.map((action, index) => (
            <button
              key={index}
              className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-lg mb-4">Available Features</h4>
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
              {feature.icon}
              <h5 className="font-medium mt-2">{feature.title}</h5>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 