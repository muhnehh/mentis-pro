import React, { useState, useEffect } from 'react';
import { Calendar, Navigation2, MessageSquare, Heart, Settings, Bell, CheckCircle, AlertTriangle } from 'lucide-react';

// Main App Component
const MentisApp = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userData, setUserData] = useState({
    profile: null,
    tasks: [],
    locations: [],
    caregiverInfo: null
  });

  return (
    <div className="min-h-screen bg-blue-50">
      <Navigation 
        currentScreen={currentScreen} 
        setCurrentScreen={setCurrentScreen} 
      />
      <main className="p-4">
        {currentScreen === 'welcome' && <WelcomeScreen setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'assessment' && <AssessmentQuiz setUserData={setUserData} setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'tasks' && <TaskManager userData={userData} setUserData={setUserData} />}
        {currentScreen === 'context' && <ContextAwareness userData={userData} />}
        {currentScreen === 'caregiver' && <CaregiverPortal userData={userData} setUserData={setUserData} />}
      </main>
    </div>
  );
};

// Navigation Component
const Navigation = ({ currentScreen, setCurrentScreen }) => {
  const navItems = [
    { id: 'tasks', icon: Calendar, label: 'Tasks' },
    { id: 'context', icon: Navigation2, label: 'Location' },
    { id: 'caregiver', icon: Heart, label: 'Caregiver' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="flex justify-around p-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex flex-col items-center ${
              currentScreen === item.id ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-sm mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// Welcome Screen Component
const WelcomeScreen = ({ setCurrentScreen }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-3xl font-bold text-blue-800 mb-6">Welcome to Mentis</h1>
    <p className="text-center text-gray-600 mb-8">
      Let's start by understanding how we can best support you.
    </p>
    <button
      onClick={() => setCurrentScreen('assessment')}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      Begin Assessment
    </button>
  </div>
);

// Assessment Quiz Component
const AssessmentQuiz = ({ setUserData, setCurrentScreen }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      question: "How often do you find it difficult to remember tasks?",
      options: ["Rarely", "Sometimes", "Often", "Very Often"],
      category: "memory"
    },
    {
      question: "Do you struggle with organizing daily activities?",
      options: ["Rarely", "Sometimes", "Often", "Very Often"],
      category: "organization"
    },
    {
      question: "How often do you feel overwhelmed by complex tasks?",
      options: ["Rarely", "Sometimes", "Often", "Very Often"],
      category: "complexity"
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Process assessment results
      const profile = analyzeAnswers(answers);
      setUserData(prev => ({ ...prev, profile }));
      setCurrentScreen('tasks');
    }
  };

  const analyzeAnswers = (answers) => {
    // Simple analysis logic - would be replaced with more sophisticated AI analysis
    const supportNeeds = {
      memory: 0,
      organization: 0,
      complexity: 0
    };

    Object.entries(answers).forEach(([q, a]) => {
      const category = questions[parseInt(q)].category;
      supportNeeds[category] += a;
    });

    return {
      primaryNeed: Object.entries(supportNeeds).reduce((a, b) => a[1] > b[1] ? a : b)[0],
      supportNeeds
    };
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h2>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full p-3 text-left rounded bg-gray-50 hover:bg-blue-50"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Task Manager Component
const TaskManager = ({ userData, setUserData }) => {
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (!newTask.trim()) return;

    // Break down complex tasks using simulated AI
    const subtasks = breakDownTask(newTask);
    const newTasks = subtasks.map(subtask => ({
      id: Date.now() + Math.random(),
      text: subtask,
      completed: false,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
    }));

    setTasks([...tasks, ...newTasks]);
    setNewTask('');
  };

  const breakDownTask = (task) => {
    // Simulated AI task breakdown - would be replaced with actual LLM
    if (task.toLowerCase().includes('grocery')) {
      return [
        "Get shopping bag",
        "Check shopping list",
        "Go to store",
        "Buy items",
        "Return home"
      ];
    }
    return [task];
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 rounded-r"
          >
            Add
          </button>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center p-3 bg-gray-50 rounded"
            >
              <CheckCircle 
                className={`w-6 h-6 mr-2 ${
                  task.completed ? 'text-green-600' : 'text-gray-400'
                }`}
                onClick={() => {
                  setTasks(tasks.map(t => 
                    t.id === task.id ? { ...t, completed: !t.completed } : t
                  ));
                }}
              />
              <span className={task.completed ? 'line-through' : ''}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Context Awareness Component
const ContextAwareness = ({ userData }) => {
  const [currentLocation, setCurrentLocation] = useState('home');
  const [nearbyPlaces, setNearbyPlaces] = useState([
    { id: 1, name: 'Grocery Store', distance: '0.3 miles' },
    { id: 2, name: 'Pharmacy', distance: '0.5 miles' },
    { id: 3, name: 'Bus Stop', distance: '0.2 miles' }
  ]);

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Current Location</h2>
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Navigation2 className="w-6 h-6 text-blue-600 mr-2" />
            <span className="capitalize">{currentLocation}</span>
          </div>
        </div>
        <h3 className="font-bold mb-2">Nearby Places</h3>
        <div className="space-y-3">
          {nearbyPlaces.map(place => (
            <div key={place.id} className="flex justify-between p-3 bg-gray-50 rounded">
              <span>{place.name}</span>
              <span className="text-gray-600">{place.distance}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Caregiver Portal Component
const CaregiverPortal = ({ userData, setUserData }) => {
  const [caregiver, setCaregiver] = useState({
    name: "Sarah Johnson",
    role: "Family Member",
    contactNumber: "+1 (555) 123-4567"
  });

  const [updates, setUpdates] = useState([
    {
      id: 1,
      type: 'task',
      message: 'Completed grocery shopping',
      timestamp: new Date().toLocaleString()
    },
    {
      id: 2,
      type: 'location',
      message: 'Arrived at pharmacy',
      timestamp: new Date().toLocaleString()
    }
  ]);

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Caregiver Portal</h2>
        <div className="mb-6">
          <h3 className="font-bold mb-2">Caregiver Information</h3>
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Name:</strong> {caregiver.name}</p>
            <p><strong>Role:</strong> {caregiver.role}</p>
            <p><strong>Contact:</strong> {caregiver.contactNumber}</p>
          </div>
        </div>
        <h3 className="font-bold mb-2">Recent Updates</h3>
        <div className="space-y-3">
          {updates.map(update => (
            <div key={update.id} className="p-3 bg-gray-50 rounded">
              <div className="flex items-center mb-1">
                {update.type === 'task' ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                ) : (
                  <Navigation2 className="w-4 h-4 text-blue-600 mr-2" />
                )}
                <span className="font-medium">{update.message}</span>
              </div>
              <span className="text-sm text-gray-600">{update.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentisApp;
