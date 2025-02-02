import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Calendar, Navigation2, MessageSquare, Heart, Camera, 
  Settings, Bell, CheckCircle, AlertTriangle, Clock, Volume2,
  Home, Briefcase, ArrowRight, User, BarChart, Map, Phone
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Components
import { TaskManager } from './components/TaskManager';
import { NavigationSupport } from './components/NavigationSupport';
import { CaregiverPortal } from './components/CaregiverPortal';
import { EmergencySupport } from './components/EmergencySupport';
import { AudioFeedback } from './components/AudioFeedback';
import { CognitiveLoadMonitor } from './components/monitoring/CognitiveLoadMonitor';
import { QuickActions } from './components/dashboard/QuickActions';
import { TodaySchedule } from './components/dashboard/TodaySchedule';
import { SupportInsights } from './components/dashboard/SupportInsights';
import { RecentActivities } from './components/dashboard/RecentActivities';

// Utils
import { 
  getEncryptionKey, 
  generateIV, 
  handleEncryptionError, 
  performAuthentication, 
  updateAuthenticationState 
} from './utils/security';
import {
  startHealthMonitoring,
  stopHealthMonitoring,
  checkDatabaseHealth,
  checkAPIHealth,
  checkMemoryUsage,
  checkProcessingLoad,
  checkNetworkLatency,
  updateHealthStatus
} from './utils/monitoring';

// Types
import {
  UserData,
  ErrorState,
  FeedbackState,
  TestState,
  HealthState,
  CognitiveLoadData
} from './types';

// Main App Component
const MentisPro = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userData, setUserData] = useState<UserData>({
    profile: null,
    tasks: [],
    routines: [],
    emotionalState: [],
    cognitiveLoad: [],
    locations: [],
    caregiverInfo: null,
    assessmentResults: null,
    preferences: {
      fontSize: 'medium',
      contrast: 'normal',
      audioEnabled: true,
      visualAids: true
    }
  });

  // Cognitive load monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const newLoad: CognitiveLoadData = {
        time: new Date().toLocaleTimeString(),
        load: Math.random() * 100,
        activity: getCurrentActivity()
      };

      setUserData(prev => ({
        ...prev,
        cognitiveLoad: [...prev.cognitiveLoad, newLoad].slice(-10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getCurrentActivity = () => {
    const activities = ['Reading', 'Task Planning', 'Navigation', 'Rest'];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header userData={userData} />
      <Navigation currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      
      <main className="container mx-auto p-4">
        {currentScreen === 'welcome' && <WelcomeScreen setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'assessment' && (
          <AssessmentQuiz setUserData={setUserData} setCurrentScreen={setCurrentScreen} />
        )}
        {currentScreen === 'dashboard' && (
          <Dashboard userData={userData} setUserData={setUserData} />
        )}
        {currentScreen === 'tasks' && (
          <TaskManager userData={userData} setUserData={setUserData} />
        )}
        {currentScreen === 'navigation' && (
          <NavigationSupport userData={userData} />
        )}
        {currentScreen === 'caregiver' && (
          <CaregiverPortal userData={userData} setUserData={setUserData} />
        )}
        {currentScreen === 'settings' && (
          <Settings userData={userData} setUserData={setUserData} />
        )}
      </main>

      <EmergencySupport userData={userData} />
      <AudioFeedback userData={userData} />
    </div>
  );
};

// Header Component
const Header = ({ userData }) => (
  <header className="bg-white shadow-lg p-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Brain className="w-8 h-8 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold">Mentis Pro</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
        <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
      </div>
    </div>
  </header>
);

// Navigation Component
const Navigation = ({ currentScreen, setCurrentScreen }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'tasks', icon: Calendar, label: 'Tasks' },
    { id: 'navigation', icon: Map, label: 'Navigate' },
    { id: 'caregiver', icon: Heart, label: 'Support' }
  ];

  return (
    <nav className="bg-white shadow-lg fixed bottom-0 w-full">
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

// Assessment Quiz Component
const AssessmentQuiz = ({ setUserData, setCurrentScreen }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
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
  ];

  const handleAnswer = (answerIndex) => {
    setAnswers({ ...answers, [currentQuestion]: answerIndex });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const results = analyzeAssessment(answers);
      setUserData(prev => ({
        ...prev,
        assessmentResults: results,
        profile: {
          primaryNeed: results.primaryNeed,
          supportLevel: results.supportLevel,
          recommendations: results.recommendations
        }
      }));
      setCurrentScreen('dashboard');
    }
  };

  const analyzeAssessment = (answers) => {
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
      categories[category] += answer;
    });

    // Determine primary need and support level
    const primaryNeed = Object.entries(categories)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const totalScore = Object.values(categories).reduce((a, b) => a + b, 0);
    const supportLevel = totalScore > 15 ? "high" : totalScore > 10 ? "medium" : "low";

    // Generate recommendations
    const recommendations: any[] = generateRecommendations(categories, supportLevel);

    return {
      categories,
      primaryNeed,
      supportLevel,
      recommendations
    };
  };

  const generateRecommendations = (categories, supportLevel) => {
    const recommendations: any[] = [];
    
    if (categories.memory > 2) {
      recommendations.push({
        type: 'memory',
        title: 'Memory Support',
        description: 'Regular reminders and task breakdowns',
        priority: 'high'
      });
    }
    
    // Add more recommendations based on categories...

    return recommendations;
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-800">Assessment</h2>
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-2 bg-blue-600 rounded transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl mb-4">{questions[currentQuestion].question}</h3>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-4 rounded border border-gray-200 hover:border-blue-500
                  hover:bg-blue-50 transition-colors duration-200"
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

// Dashboard Component
const Dashboard = ({ userData, setUserData }) => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    // Simulate AI insights generation
    generateInsights(userData);
  }, [userData]);

  const generateInsights = (data) => {
    // Simulated AI analysis of user patterns and needs
    setInsights({
      cognitiveStatus: "Stable",
      recommendations: [
        "Take a break after completing current task",
        "Good time for challenging activities",
        "Remember to check your calendar"
      ],
      progress: {
        daily: 75,
        weekly: 82,
        monthly: 68
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Cognitive Load Monitor */}
      <CognitiveLoadMonitor data={userData.cognitiveLoad} />

      {/* Quick Actions */}
      <QuickActions userData={userData} />

      {/* Today's Schedule */}
      <TodaySchedule userData={userData} />

      {/* Support Insights */}
      <SupportInsights insights={insights} />

      {/* Recent Activities */}
      <RecentActivities userData={userData} />
    </div>
  );
};

// Security and Privacy System
const SecuritySystem = () => {
  const [securityState, setSecurityState] = useState({
    encryption: {
      status: 'active',
      algorithm: 'AES-256',
      lastUpdated: null
    },
    authentication: {
      method: 'biometric',
      status: 'locked',
      lastAuthenticated: null
    },
    dataPrivacy: {
      sharingPreferences: {},
      consentStatus: {},
      dataRetention: {}
    }
  });

  const encryptData = async (data) => {
    try {
      const encryptionKey = await getEncryptionKey();
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: generateIV() },
        encryptionKey,
        data
      );
      return encrypted;
    } catch (error) {
      handleEncryptionError(error);
      return null;
    }
  };

  const authenticateUser = async (credentials) => {
    try {
      const authResult = await performAuthentication(credentials);
      updateAuthenticationState(authResult);
      return authResult.success;
    } catch (error) {
      handleAuthenticationError(error);
      return false;
    }
  };

  return (
    <div className="security-system">
      <EncryptionStatus status={securityState.encryption} />
      <AuthenticationControls
        status={securityState.authentication}
        onAuthenticate={authenticateUser}
      />
      <PrivacyControls
        preferences={securityState.dataPrivacy}
        onUpdate={updatePrivacyPreferences}
      />
      <SecurityAuditLog />
    </div>
  );
};

// Error Handling and Recovery System
const ErrorHandlingSystem = () => {
  const [errorState, setErrorState] = useState({
    active: false,
    errors: [],
    recoveryAttempts: [],
    systemStatus: 'stable'
  });

  const errorHandler = async (error) => {
    const errorInfo = await analyzeError(error);
    
    setErrorState(prev => ({
      ...prev,
      active: true,
      errors: [...prev.errors, errorInfo]
    }));

    if (errorInfo.severity === 'critical') {
      await initiateEmergencyRecovery(errorInfo);
    } else {
      await attemptRecovery(errorInfo);
    }
  };

  const attemptRecovery = async (errorInfo) => {
    const recoveryPlan = generateRecoveryPlan(errorInfo);
    
    for (const step of recoveryPlan.steps) {
      try {
        await executeRecoveryStep(step);
        updateRecoveryStatus(step, 'completed');
      } catch (retryError) {
        handleRecoveryFailure(retryError, step);
      }
    }
  };

  return (
    <div className="error-handling">
      <ErrorMonitor state={errorState} />
      <RecoveryStatus attempts={errorState.recoveryAttempts} />
      <SystemHealthCheck />
    </div>
  );
};

// Performance Optimization System
const PerformanceSystem = () => {
  const [metrics, setMetrics] = useState({
    cpu: [],
    memory: [],
    network: [],
    rendering: []
  });

  const performanceObserver = useRef(null);

  useEffect(() => {
    initializePerformanceMonitoring();
    return () => cleanupPerformanceMonitoring();
  }, []);

  const initializePerformanceMonitoring = () => {
    performanceObserver.current = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      processPerformanceEntries(entries);
    });

    performanceObserver.current.observe({
      entryTypes: ['resource', 'paint', 'layout-shift', 'largest-contentful-paint']
    });
  };

  const optimizePerformance = async () => {
    const optimizations = [
      optimizeMemoryUsage(),
      optimizeRendering(),
      optimizeNetworkRequests()
    ];

    await Promise.all(optimizations);
    updatePerformanceMetrics();
  };

  return (
    <div className="performance-optimization">
      <PerformanceMetrics metrics={metrics} />
      <OptimizationControls onOptimize={optimizePerformance} />
      <ResourceUsageMonitor />
    </div>
  );
};

// User Feedback System
const UserFeedbackSystem = () => {
  const [feedback, setFeedback] = useState({
    current: null,
    history: [],
    suggestions: [],
    ratings: {}
  });

  const collectFeedback = async (type, data) => {
    const processedFeedback = await processFeedback(type, data);
    
    setFeedback(prev => ({
      ...prev,
      history: [...prev.history, processedFeedback],
      ratings: updateRatings(prev.ratings, processedFeedback)
    }));

    if (processedFeedback.priority === 'high') {
      triggerImmediateResponse(processedFeedback);
    }

    analyzeFeedbackTrends(feedback.history);
  };

  return (
    <div className="feedback-system">
      <FeedbackForm onSubmit={collectFeedback} />
      <FeedbackAnalytics feedback={feedback} />
      <SuggestionsList suggestions={feedback.suggestions} />
    </div>
  );
};

// Testing and Monitoring System
const TestingSystem = () => {
  const [testState, setTestState] = useState({
    running: false,
    results: [],
    coverage: {},
    performance: {}
  });

  const runTests = async (testSuite) => {
    setTestState(prev => ({ ...prev, running: true }));

    try {
      const results = await executeTests(testSuite);
      const coverage = await calculateCoverage(results);
      const performance = await measureTestPerformance(results);

      setTestState({
        running: false,
        results,
        coverage,
        performance
      });

      generateTestReport(results, coverage, performance);
    } catch (error) {
      handleTestError(error);
    }
  };

  return (
    <div className="testing-system">
      <TestRunner
        onRun={runTests}
        state={testState}
      />
      <TestResults results={testState.results} />
      <CoverageReport coverage={testState.coverage} />
      <PerformanceMetrics metrics={testState.performance} />
    </div>
  );
};

// System Health Monitor
const SystemHealthMonitor = () => {
  const [health, setHealth] = useState({
    status: 'healthy',
    metrics: {},
    alerts: [],
    diagnostics: {}
  });

  useEffect(() => {
    const monitor = startHealthMonitoring();
    return () => stopHealthMonitoring(monitor);
  }, []);

  const checkSystemHealth = async () => {
    const checks = [
      checkDatabaseHealth(),
      checkAPIHealth(),
      checkMemoryUsage(),
      checkProcessingLoad(),
      checkNetworkLatency()
    ];

    const results = await Promise.all(checks);
    updateHealthStatus(results);
  };

  return (
    <div className="health-monitor">
      <HealthDashboard health={health} />
      <DiagnosticsPanel diagnostics={health.diagnostics} />
      <AlertCenter alerts={health.alerts} />
      <MaintenanceScheduler health={health} />
    </div>
  );
}; 