import React, { useState } from 'react';
import { Plus, Check, Trash2, Clock, Brain } from 'lucide-react';
import { UserData } from '../types';
import { openAIService } from '../services/openai';

interface Task {
  id: string;
  title: string;
  time: string;
  priority: string;
  completed: boolean;
}

interface TodayScheduleProps {
  userData: UserData;
  setUserData: (data: UserData) => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ userData, setUserData }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', time: '', priority: 'medium' });
  const [isGenerating, setIsGenerating] = useState(false);
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';

  const addTask = (task: Partial<Task>) => {
    const newTaskItem: Task = {
      id: Date.now().toString(),
      title: task.title || '',
      time: task.time || 'Today',
      priority: task.priority || 'medium',
      completed: false
    };
    setTasks([...tasks, newTaskItem]);
    setShowAddTask(false);
    setNewTask({ title: '', time: '', priority: 'medium' });
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const generateAITasks = async () => {
    setIsGenerating(true);
    try {
      const response = await openAIService.chat([
        {
          role: 'system',
          content: `You are a cognitive support assistant. The user's current cognitive load is ${userData.cognitiveLoad.current}/10. 
                   Consider their assessment results and current state when suggesting tasks.`
        },
        {
          role: 'user',
          content: `Based on my cognitive load and needs, suggest 3-5 important tasks for today. 
                   Consider my energy levels and include self-care activities. 
                   Format each task as: Task - Time - Priority`
        }
      ], apiKey);

      const suggestedTasks = response.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [title, time, priority] = line.split('-').map(s => s.trim());
          return {
            title: title.replace(/^\d+\.\s*/, ''),
            time,
            priority: priority?.toLowerCase() || 'medium'
          };
        });

      suggestedTasks.forEach(task => addTask(task));
    } catch (error) {
      console.error('Error generating tasks:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Today's Schedule</h2>
        <div className="flex space-x-2">
          <button
            onClick={generateAITasks}
            disabled={isGenerating}
            className="flex items-center px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-100 
                     rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200"
          >
            <Brain className="w-5 h-5 mr-1" />
            {isGenerating ? 'Generating...' : 'AI Suggest'}
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 
                     rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Task
          </button>
        </div>
      </div>

      {showAddTask && (
        <div className="mb-6 p-4 border dark:border-gray-700 rounded-lg">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full mb-2 p-2 border dark:border-gray-700 dark:bg-gray-700 rounded"
          />
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Time (e.g., 2:00 PM)"
              value={newTask.time}
              onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
              className="flex-1 p-2 border dark:border-gray-700 dark:bg-gray-700 rounded"
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="p-2 border dark:border-gray-700 dark:bg-gray-700 rounded"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddTask(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => addTask(newTask)}
              disabled={!newTask.title}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Add Task
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg 
                      ${task.completed ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleTask(task.id)}
                className={`p-1 rounded-full border ${
                  task.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {task.completed && <Check className="w-4 h-4 text-white" />}
              </button>
              <div className={task.completed ? 'line-through text-gray-500' : ''}>
                <div className="font-medium dark:text-white">{task.title}</div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {task.time}
                  <span className={`ml-2 ${getPriorityColor(task.priority)}`}>
                    • {task.priority} priority
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No tasks for today. Click 'Add Task' or use AI suggestions to get started.
          </div>
        )}
      </div>
    </div>
  );
}; 