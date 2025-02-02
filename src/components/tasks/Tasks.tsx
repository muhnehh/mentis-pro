import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Take morning medication', time: '08:00', completed: false, priority: 'high' },
    { id: '2', title: 'Doctor appointment', time: '10:30', completed: false, priority: 'high' },
    { id: '3', title: 'Daily walk', time: '15:00', completed: false, priority: 'medium' },
  ]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: false,
        priority: 'medium'
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white">Tasks</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Add new task..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={handleAddTask}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                task.completed ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`p-1 rounded-full ${
                    task.completed ? 'bg-green-500' : 'border-2'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <span className={task.completed ? 'line-through text-gray-500' : 'dark:text-white'}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{task.time}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 