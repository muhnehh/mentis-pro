import React, { useState, useEffect, useCallback } from 'react';
import { Map, Navigation2, AlertTriangle, Check, Coffee } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'home' | 'medical' | 'store' | 'park' | 'restaurant';
  distance: number;
  directions: string[];
}

export const NavigationMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const savedLocations: Location[] = [
    {
      id: '1',
      name: 'Home',
      type: 'home',
      distance: 0,
      directions: ['You are at home']
    },
    {
      id: '2',
      name: 'Medical Center',
      type: 'medical',
      distance: 1.2,
      directions: [
        'Exit home and turn right',
        'Walk 2 blocks to Main Street',
        'Turn left at the traffic light',
        'Medical Center will be on your right',
      ]
    },
    {
      id: '3',
      name: 'Local Park',
      type: 'park',
      distance: 0.5,
      directions: [
        'Exit home and turn left',
        'Walk 1 block to Park Avenue',
        'Cross the street safely',
        'Enter the park through the main gate',
      ]
    },
    {
      id: '4',
      name: 'Grocery Store',
      type: 'store',
      distance: 0.8,
      directions: [
        'Exit home and turn right',
        'Walk 1 block to Market Street',
        'Turn right at the bakery',
        'Grocery store will be on your left',
      ]
    }
  ];

  const startNavigation = (location: Location) => {
    setSelectedLocation(location);
    setIsNavigating(true);
    setCurrentStep(0);
  };

  const nextStep = useCallback(() => {
    if (selectedLocation && currentStep < selectedLocation.directions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsNavigating(false);
      setCurrentStep(0);
    }
  }, [selectedLocation, currentStep]);

  // Simulate user movement
  useEffect(() => {
    if (isNavigating) {
      const interval = setInterval(nextStep, 5000);
      return () => clearInterval(interval);
    }
  }, [isNavigating, nextStep]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Navigation</h2>
          <Map className="w-5 h-5 text-blue-500" />
        </div>

        <div className="relative h-64 bg-gray-100 rounded-lg mb-4">
          {/* Simulated map view */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation2 className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-gray-600">
                {isNavigating ? 'Navigating to ' + selectedLocation?.name : 'Select a destination'}
              </p>
            </div>
          </div>
        </div>

        {isNavigating && selectedLocation && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Current Direction:</h3>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {selectedLocation.directions.length}
              </span>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">{selectedLocation.directions[currentStep]}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Saved Locations</h2>
        <div className="space-y-4">
          {savedLocations.map(location => (
            <div
              key={location.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-500 cursor-pointer"
              onClick={() => startNavigation(location)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  location.type === 'medical' ? 'bg-red-100' :
                  location.type === 'park' ? 'bg-green-100' :
                  location.type === 'store' ? 'bg-purple-100' :
                  'bg-blue-100'
                }`}>
                  {location.type === 'medical' ? <AlertTriangle className="w-4 h-4 text-red-500" /> :
                   location.type === 'park' ? <Coffee className="w-4 h-4 text-green-500" /> :
                   location.type === 'store' ? <Check className="w-4 h-4 text-purple-500" /> :
                   <Navigation2 className="w-4 h-4 text-blue-500" />}
                </div>
                <div>
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-gray-500">{location.distance} miles away</p>
                </div>
              </div>
              <button
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  startNavigation(location);
                }}
              >
                Navigate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 