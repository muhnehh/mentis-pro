import React, { useState } from 'react';
import { Camera, Brain, Calendar, Navigation2, MessageSquare, Heart } from 'lucide-react';

const MentisApp = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [disabilityType, setDisabilityType] = useState(null);
  
  // Quiz questions designed to identify cognitive disability patterns
  const quizQuestions = [
    {
      id: 1,
      question: "How often do you find it difficult to remember important appointments or tasks?",
      options: [
        "Rarely or never",
        "Sometimes (once or twice a week)",
        "Often (several times a week)",
        "Very frequently (daily)"
      ]
    },
    {
      id: 2,
      question: "Do you experience challenges with organizing and planning daily activities?",
      options: [
        "No difficulties",
        "Minor difficulties",
        "Moderate difficulties",
        "Significant difficulties"
      ]
    },
    {
      id: 3,
      question: "How often do you feel overwhelmed by complex tasks or instructions?",
      options: [
        "Rarely",
        "Sometimes",
        "Frequently",
        "Almost always"
      ]
    },
    {
      id: 4,
      question: "Do you find it challenging to maintain focus during activities?",
      options: [
        "No challenges",
        "Occasional challenges",
        "Regular challenges",
        "Constant challenges"
      ]
    },
    {
      id: 5,
      question: "How would you describe your ability to navigate unfamiliar environments?",
      options: [
        "Comfortable and confident",
        "Slightly anxious but manageable",
        "Very anxious and challenging",
        "Extremely difficult, avoid if possible"
      ]
    }
  ];

  const handleQuizSubmit = () => {
    // Analysis logic to determine cognitive disability type based on answers
    const analysis = analyzeQuizResponses(quizAnswers);
    setDisabilityType(analysis);
    setCurrentScreen('dashboard');
  };

  const analyzeQuizResponses = (answers) => {
    // Simplified analysis for demo - would be replaced with more sophisticated AI analysis
    const scoreMap = {
      memory: 0,
      planning: 0,
      attention: 0,
      navigation: 0
    };
    
    // Map responses to potential disability indicators
    if (answers[1] >= 2) scoreMap.memory += 1;
    if (answers[2] >= 2) scoreMap.planning += 1;
    if (answers[3] >= 2) scoreMap.attention += 1;
    if (answers[4] >= 2) scoreMap.attention += 1;
    if (answers[5] >= 2) scoreMap.navigation += 1;
    
    // Return primary area of support needed
    return Object.entries(scoreMap).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-blue-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Welcome to Mentis</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your personalized cognitive support companion
        </p>
        <button 
          onClick={() => setCurrentScreen('quiz')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700"
        >
          Start Assessment
        </button>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="min-h-screen p-6 bg-blue-50">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Initial Assessment</h2>
      <div className="space-y-6">
        {quizQuestions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded-lg shadow">
            <p className="font-medium mb-3">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuizAnswers({...quizAnswers, [q.id]: idx});
                  }}
                  className={`w-full text-left p-3 rounded ${
                    quizAnswers[q.id] === idx 
                      ? 'bg-blue-100 border-blue-500' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(quizAnswers).length === quizQuestions.length && (
          <button
            onClick={handleQuizSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700"
          >
            Complete Assessment
          </button>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-blue-50">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Your Personalized Support</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-3">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold">Task Manager</h3>
            </div>
            <p className="text-sm text-gray-600">Organize your daily activities</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-3">
              <Navigation2 className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold">Navigation</h3>
            </div>
            <p className="text-sm text-gray-600">Get help with directions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-3">
              <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold">Communication</h3>
            </div>
            <p className="text-sm text-gray-600">Express yourself easily</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-3">
              <Heart className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="font-semibold">Emotional Support</h3>
            </div>
            <p className="text-sm text-gray-600">Access help when needed</p>
          </div>
        </div>
        
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">AI Assistant</h3>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm">
              "Based on your assessment, I'll focus on helping you with {disabilityType}. 
              Would you like to start by setting up your daily schedule?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-blue-50 min-h-screen">
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'quiz' && renderQuiz()}
      {currentScreen === 'dashboard' && renderDashboard()}
    </div>
  );
};

export default MentisApp;
