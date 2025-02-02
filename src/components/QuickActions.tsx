import React, { useState, useRef } from 'react';
import { Camera, MessageSquare, Volume2, Plus, Calendar, Brain, Download } from 'lucide-react';
import { UserData } from '../types';

interface QuickActionsProps {
  userData: UserData;
  onAddTask?: (task: any) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ userData, onAddTask }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResponse, setAIResponse] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAIAction = async (actionType: string) => {
    setIsProcessing(true);
    setShowAIModal(true);
    try {
      let response = '';
      switch (actionType) {
        case 'task':
          response = `Here are 3 suggested tasks:
1. Take medication - 9:00 AM - High
2. Doctor's appointment - 2:00 PM - High
3. Evening walk - 5:00 PM - Medium`;
          break;
        case 'schedule':
          response = `Suggested Schedule:
- Morning: Light activities and medication
- Afternoon: Important appointments
- Evening: Relaxation and exercise
- Night: Review tomorrow's tasks`;
          break;
        case 'guidance':
          response = `Based on your current cognitive load (${userData.cognitiveLoad.current}/10):
- Take regular breaks
- Focus on one task at a time
- Use reminders for important tasks
- Stay hydrated and maintain routine`;
          break;
        default:
          response = "How can I help you today?";
      }

      setAIResponse(response);
      speak(response);

      if (actionType === 'task' && onAddTask) {
        const tasks = response.split('\n')
          .filter(line => line.trim().match(/^\d+\./))
          .map(task => ({
            title: task.replace(/^\d+\.\s*/, '').split(' - ')[0],
            time: task.split(' - ')[1] || 'Today',
            priority: task.split(' - ')[2] || 'Medium',
            completed: false
          }));
        
        tasks.forEach(task => onAddTask(task));
      }

    } catch (error) {
      console.error('Error:', error);
      setAIResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageAnalysis = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setShowAIModal(true);
    try {
      // Simulated image analysis response
      const response = `Image Analysis Results:
- The image shows a clear and organized environment
- Recommended actions:
  1. Keep maintaining organized spaces
  2. Use visual labels if needed
  3. Consider color-coding for better recognition`;

      setAIResponse(response);
      speak(response);
    } catch (error) {
      console.error('Error:', error);
      setAIResponse('Sorry, I encountered an error analyzing the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window && userData.preferences.audioEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const downloadReport = () => {
    const report = `Cognitive Support Report
Generated on: ${new Date().toLocaleString()}

User Profile:
- Name: ${userData.profile.name}
- Current Cognitive Load: ${userData.cognitiveLoad.current}/10

Preferences:
- Theme: ${userData.preferences.theme}
- Font Size: ${userData.preferences.fontSize}
- Audio Enabled: ${userData.preferences.audioEnabled}
- Visual Aids: ${userData.preferences.visualAids}

Recommendations:
1. Maintain regular schedule
2. Use reminders for important tasks
3. Take breaks when cognitive load is high
4. Keep environment organized
5. Stay connected with support system`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cognitive_support_report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <button
          onClick={() => handleAIAction('task')}
          disabled={isProcessing}
          className="flex items-center justify-center p-4 bg-blue-100 hover:bg-blue-200 
                   rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <Plus className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-blue-800">Generate Tasks</span>
        </button>

        <button
          onClick={() => handleAIAction('schedule')}
          disabled={isProcessing}
          className="flex items-center justify-center p-4 bg-green-100 hover:bg-green-200 
                   rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <Calendar className="w-6 h-6 text-green-600 mr-2" />
          <span className="text-green-800">Plan Schedule</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="flex items-center justify-center p-4 bg-purple-100 hover:bg-purple-200 
                   rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <Camera className="w-6 h-6 text-purple-600 mr-2" />
          <span className="text-purple-800">Analyze Image</span>
        </button>

        <button
          onClick={() => handleAIAction('guidance')}
          disabled={isProcessing}
          className="flex items-center justify-center p-4 bg-yellow-100 hover:bg-yellow-200 
                   rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          <Brain className="w-6 h-6 text-yellow-600 mr-2" />
          <span className="text-yellow-800">AI Support</span>
        </button>

        <button
          onClick={downloadReport}
          className="flex items-center justify-center p-4 bg-indigo-100 hover:bg-indigo-200 
                   rounded-lg transition-colors duration-200"
        >
          <Download className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="text-indigo-800">Download Report</span>
        </button>
      </div>

      {/* AI Response Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">AI Assistant</h3>
              <button
                onClick={() => {
                  setShowAIModal(false);
                  window.speechSynthesis.cancel();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {aiResponse.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => speak(aiResponse)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowAIModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageAnalysis}
        ref={fileInputRef}
        className="hidden"
      />
    </>
  );
}; 