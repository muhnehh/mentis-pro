import React from 'react';
import { Clock, Calendar, Bell, Tag, CheckCircle } from 'lucide-react';

interface TodayScheduleProps {
  userData: any;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'task' | 'appointment' | 'reminder' | 'break';
  status: 'pending' | 'completed' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
  supportNeeded: boolean;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ userData }) => {
  // Simulated schedule data
  const schedule: ScheduleItem[] = [
    {
      id: '1',
      time: '09:00 AM',
      title: 'Morning Medication',
      type: 'reminder',
      status: 'completed',
      priority: 'high',
      supportNeeded: true
    },
    {
      id: '2',
      time: '10:00 AM',
      title: 'Doctor Appointment',
      type: 'appointment',
      status: 'pending',
      priority: 'high',
      supportNeeded: true
    },
    {
      id: '3',
      time: '12:00 PM',
      title: 'Lunch Break',
      type: 'break',
      status: 'pending',
      priority: 'medium',
      supportNeeded: false
    },
    {
      id: '4',
      time: '02:00 PM',
      title: 'Work Task: Report Review',
      type: 'task',
      status: 'in-progress',
      priority: 'medium',
      supportNeeded: true
    },
    {
      id: '5',
      time: '04:00 PM',
      title: 'Evening Medication',
      type: 'reminder',
      status: 'pending',
      priority: 'high',
      supportNeeded: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'reminder':
        return <Bell className="w-4 h-4" />;
      case 'break':
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Today's Schedule</h3>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-16 text-sm text-gray-600">{item.time}</div>
            
            <div className="flex-grow ml-4">
              <div className="flex items-center space-x-2">
                <span className={`p-1 rounded ${getStatusColor(item.status)}`}>
                  {getTypeIcon(item.type)}
                </span>
                <h4 className="font-medium">{item.title}</h4>
              </div>
              
              <div className="flex items-center mt-2 space-x-2 text-sm">
                <span className={`flex items-center ${getPriorityColor(item.priority)}`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {item.priority} priority
                </span>
                {item.supportNeeded && (
                  <span className="text-purple-600">
                    • Support available
                  </span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 ml-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>5 items scheduled today</span>
          <button className="text-blue-500 hover:text-blue-600">
            + Add New Item
          </button>
        </div>
      </div>
    </div>
  );
}; 