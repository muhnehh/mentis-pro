import React, { useState } from 'react';
import { UserData } from '../types';
import { CognitiveLoadMonitor } from './monitoring/CognitiveLoadMonitor';
import { QuickActions } from './dashboard/QuickActions';
import { TodaySchedule } from './dashboard/TodaySchedule';
import { SupportInsights } from './dashboard/SupportInsights';
import { RecentActivities } from './dashboard/RecentActivities';
import { AlertTriangle, Brain, Calendar, Map, MessageSquare, X } from 'lucide-react';

interface DashboardProps {
  userData: UserData;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  type: 'task' | 'navigation' | 'chat' | 'break';
  priority: 'low' | 'medium' | 'high';
}

export const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  const suggestedActions: ActionItem[] = [
    {
      id: '1',
      title: 'Take a Break',
      description: 'Your cognitive load is high. Consider taking a 10-minute break.',
      type: 'break',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Review Today\'s Schedule',
      description: 'You have upcoming appointments. Check your schedule.',
      type: 'task',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Navigate to Medical Center',
      description: 'Your appointment is in 1 hour. Start navigation now.',
      type: 'navigation',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Chat with Assistant',
      description: 'Need help planning your afternoon activities?',
      type: 'chat',
      priority: 'low'
    }
  ];

  const handleActionClick = (action: ActionItem) => {
    setSelectedAction(action);
    setShowActionModal(true);
  };

  const handleActionConfirm = () => {
    if (selectedAction) {
      // Handle different action types
      switch (selectedAction.type) {
        case 'task':
          window.location.href = '#/tasks';
          break;
        case 'navigation':
          window.location.href = '#/navigation';
          break;
        case 'chat':
          window.location.href = '#/chat';
          break;
        case 'break':
          // Show break timer or meditation screen
          break;
      }
    }
    setShowActionModal(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <CognitiveLoadMonitor data={userData.cognitiveLoad.history} />
      <QuickActions userData={userData} />
      <TodaySchedule userData={userData} />
      <SupportInsights userData={userData} />
      <RecentActivities userData={userData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            {suggestedActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border hover:border-blue-500 ${
                  action.priority === 'high' ? 'bg-red-50' :
                  action.priority === 'medium' ? 'bg-yellow-50' :
                  'bg-blue-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {action.type === 'task' ? <Calendar className="w-5 h-5 text-blue-500" /> :
                   action.type === 'navigation' ? <Map className="w-5 h-5 text-green-500" /> :
                   action.type === 'chat' ? <MessageSquare className="w-5 h-5 text-purple-500" /> :
                   <Brain className="w-5 h-5 text-red-500" />}
                  <div className="text-left">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                {action.priority === 'high' && (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <SupportInsights userData={userData} />
      </div>

      {/* Action Modal */}
      {showActionModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedAction.title}</h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">{selectedAction.description}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleActionConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 