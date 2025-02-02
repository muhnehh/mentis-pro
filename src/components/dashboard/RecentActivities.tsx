import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Activity, BarChart } from 'lucide-react';

interface RecentActivitiesProps {
  userData: any;
}

interface ActivityItem {
  id: string;
  type: 'task' | 'interaction' | 'support' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'failure' | 'warning' | 'info';
  metrics?: {
    completion?: number;
    accuracy?: number;
    duration?: string;
  };
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ userData }) => {
  // Simulated activities data
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'task',
      title: 'Morning Routine Completed',
      description: 'Successfully followed all steps in the morning routine checklist',
      timestamp: '2 hours ago',
      status: 'success',
      metrics: {
        completion: 100,
        duration: '45 minutes'
      }
    },
    {
      id: '2',
      type: 'interaction',
      title: 'Support Request',
      description: 'Requested assistance with public transport navigation',
      timestamp: '3 hours ago',
      status: 'info'
    },
    {
      id: '3',
      type: 'support',
      title: 'Cognitive Load Alert',
      description: 'High cognitive load detected during video meeting',
      timestamp: '4 hours ago',
      status: 'warning',
      metrics: {
        accuracy: 85
      }
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Weekly Goal Progress',
      description: 'Completed 80% of scheduled tasks this week',
      timestamp: '1 day ago',
      status: 'success',
      metrics: {
        completion: 80
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failure':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failure':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Recent Activities</h3>
          <p className="text-sm text-gray-500 mt-1">Track your progress and interactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">Activity Score: 85</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`p-4 border rounded-lg ${getStatusColor(activity.status)} bg-opacity-50`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getStatusIcon(activity.status)}
              </div>
              
              <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
                
                <p className="mt-1 text-gray-600">{activity.description}</p>
                
                {activity.metrics && (
                  <div className="mt-3 flex items-center space-x-4 text-sm">
                    {activity.metrics.completion !== undefined && (
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${activity.metrics.completion}%` }}
                          />
                        </div>
                        <span>{activity.metrics.completion}% complete</span>
                      </div>
                    )}
                    {activity.metrics.accuracy !== undefined && (
                      <span className="text-blue-600">
                        {activity.metrics.accuracy}% accuracy
                      </span>
                    )}
                    {activity.metrics.duration && (
                      <span className="text-gray-500">
                        Duration: {activity.metrics.duration}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Showing last 24 hours of activity
          </span>
          <button className="text-blue-500 hover:text-blue-600">
            View Full History
          </button>
        </div>
      </div>
    </div>
  );
}; 