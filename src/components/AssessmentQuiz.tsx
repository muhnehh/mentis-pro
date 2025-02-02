import React, { useState, useEffect, useMemo } from 'react';
import { UserData } from '../types';
import { AssessmentResults } from './assessment/AssessmentResults';
import { Volume2, Download } from 'lucide-react';

interface AssessmentQuizProps {
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setCurrentScreen: (screen: string) => void;
}

interface AssessmentResultsData {
  categories: Record<string, number>;
  primaryNeed: string;
  supportLevel: 'low' | 'medium' | 'high';
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
  }>;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ setUserData, setCurrentScreen }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssessmentResultsData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const questions = useMemo(() => [
    {
      id: 1,
      category: 'memory',
      question: "How often do you find it difficult to remember important appointments or tasks?",
      options: [
        "Rarely or never",
        "Sometimes (once or twice a week)",
        "Often (several times a week)",
        "Very frequently (daily)"
      ],
      visualAid: "calendar-icon"
    },
    {
      id: 2,
      category: 'planning',
      question: "Do you experience challenges with organizing and planning daily activities?",
      options: [
        "No difficulties",
        "Minor difficulties",
        "Moderate difficulties",
        "Significant difficulties"
      ],
      visualAid: "planning-icon"
    },
    {
      id: 3,
      category: 'attention',
      question: "How often do you feel overwhelmed by complex tasks or instructions?",
      options: [
        "Rarely",
        "Sometimes",
        "Frequently",
        "Almost always"
      ],
      visualAid: "complexity-icon"
    },
    {
      id: 4,
      category: 'navigation',
      question: "How would you describe your ability to navigate unfamiliar environments?",
      options: [
        "Comfortable and confident",
        "Slightly anxious but manageable",
        "Very anxious and challenging",
        "Extremely difficult, avoid if possible"
      ],
      visualAid: "navigation-icon"
    },
    {
      id: 5,
      category: 'communication',
      question: "How comfortable are you with expressing your needs to others?",
      options: [
        "Very comfortable",
        "Somewhat comfortable",
        "Somewhat uncomfortable",
        "Very uncomfortable"
      ],
      visualAid: "communication-icon"
    }
  ], []);

  const handleAnswer = (answerIndex: number) => {
    // Stop any ongoing speech when moving to next question
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    
    setAnswers({ ...answers, [currentQuestion]: answerIndex });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const assessmentResults = analyzeAssessment(answers);
      setResults(assessmentResults);
      setShowResults(true);
      setUserData((prev: UserData) => ({
        ...prev,
        assessmentResults: assessmentResults
      }));
    }
  };

  const analyzeAssessment = (answers: Record<number, number>): AssessmentResultsData => {
    const categories = {
      memory: 0,
      planning: 0,
      attention: 0,
      navigation: 0,
      communication: 0
    };

    // Calculate scores for each category
    Object.entries(answers).forEach(([questionId, answer]) => {
      const category = questions[parseInt(questionId)].category;
      categories[category as keyof typeof categories] = ((answer + 1) / 4) * 10;
    });

    // Determine primary need and support level
    const primaryNeed = Object.entries(categories)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const avgScore = Object.values(categories).reduce((a, b) => a + b, 0) / Object.keys(categories).length;
    const supportLevel = avgScore > 7.5 ? "high" : avgScore > 5 ? "medium" : "low";

    // Generate recommendations based on scores
    const recommendations = generateRecommendations(categories, supportLevel);

    return {
      categories,
      primaryNeed,
      supportLevel: supportLevel as 'low' | 'medium' | 'high',
      recommendations
    };
  };

  const generateRecommendations = (categories: Record<string, number>, supportLevel: string) => {
    const recommendations = [];

    if (categories.memory > 7) {
      recommendations.push({
        type: 'memory',
        title: 'Memory Support Tools',
        description: 'Implement digital reminders and memory aids for daily tasks and appointments',
        priority: 'high'
      });
    }

    if (categories.planning > 6) {
      recommendations.push({
        type: 'planning',
        title: 'Task Organization System',
        description: 'Use a structured daily planner with task breakdown and priority settings',
        priority: categories.planning > 8 ? 'high' : 'medium'
      });
    }

    if (categories.attention > 5) {
      recommendations.push({
        type: 'attention',
        title: 'Focus Enhancement',
        description: 'Regular breaks and distraction-free work environment setup',
        priority: categories.attention > 7 ? 'high' : 'medium'
      });
    }

    if (categories.navigation > 6) {
      recommendations.push({
        type: 'navigation',
        title: 'Navigation Assistance',
        description: 'Use of simplified navigation apps and pre-planning of routes',
        priority: categories.navigation > 8 ? 'high' : 'medium'
      });
    }

    if (categories.communication > 5) {
      recommendations.push({
        type: 'communication',
        title: 'Communication Support',
        description: 'Practice with communication aids and expression techniques',
        priority: categories.communication > 7 ? 'high' : 'medium'
      });
    }

    return recommendations;
  };

  const handleContinue = () => {
    setCurrentScreen('dashboard');
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      if (isPlaying) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleSpeakClick = (text: string) => {
    speak(text);
  };

  const downloadReport = async () => {
    if (!results) return;

    try {
      const response = await fetch('/api/download-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'assessment-report.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  useEffect(() => {
    // Only cleanup when unmounting
    return () => {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    };
  }, []);

  if (showResults && results) {
    return (
      <div>
        <AssessmentResults results={results} onContinue={handleContinue} />
        <div className="flex justify-center mt-4">
          <button
            onClick={downloadReport}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">Assessment</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleSpeakClick(questions[currentQuestion].question)}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isPlaying ? 'text-blue-500' : 'text-gray-500'
                }`}
                title={isPlaying ? "Stop Reading" : "Read Question Aloud"}
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
            <div 
              className="h-2 bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl mb-4 dark:text-white">{questions[currentQuestion].question}</h3>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded border border-gray-200 dark:border-gray-700 
                         hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 
                         transition-colors duration-200 dark:text-white"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 