import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Activity, Heart } from 'lucide-react';

interface CognitiveLoadMonitorProps {
  data: any[];
}

interface MLPrediction {
  mentalState: string;
  confidence: number;
  heartRate: number;
  stressLevel: 'low' | 'medium' | 'high';
  focusScore: number;
}

export const CognitiveLoadMonitor: React.FC<CognitiveLoadMonitorProps> = ({ data }) => {
  const [prediction, setPrediction] = useState<MLPrediction>({
    mentalState: 'Focused',
    confidence: 0.85,
    heartRate: 75,
    stressLevel: 'low',
    focusScore: 8.5
  });

  // Simulate real-time WiFi CSI signal processing and ML predictions
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate ML model predictions based on WiFi CSI data
      const newPrediction = {
        mentalState: ['Focused', 'Relaxed', 'Stressed', 'Distracted'][Math.floor(Math.random() * 4)],
        confidence: 0.7 + Math.random() * 0.3,
        heartRate: 65 + Math.random() * 20,
        stressLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        focusScore: 5 + Math.random() * 5
      };
      setPrediction(newPrediction);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCognitiveLoadExplanation = (load: number, trend: 'increasing' | 'decreasing' | 'stable') => {
    if (load > 80) {
      return "High cognitive load detected. Consider taking a break or simplifying current tasks.";
    } else if (load > 60) {
      return "Moderate cognitive load. You're engaged but not overwhelmed.";
    } else if (load > 40) {
      return "Optimal cognitive load range. Good time for focused work.";
    } else {
      return "Low cognitive load. Good time for learning new tasks or complex problem solving.";
    }
  };

  const getCurrentTrend = () => {
    if (data.length < 2) return 'stable';
    const lastTwo = data.slice(-2);
    const diff = lastTwo[1].load - lastTwo[0].load;
    if (Math.abs(diff) < 5) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  };

  const currentLoad = data[data.length - 1]?.load || 0;
  const trend = getCurrentTrend();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Cognitive Load Monitor</h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Brain className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium">{prediction.mentalState}</span>
          </div>
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-sm font-medium">{Math.round(prediction.heartRate)} BPM</span>
          </div>
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium">Focus: {prediction.focusScore.toFixed(1)}/10</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700">
          {getCognitiveLoadExplanation(currentLoad, trend)}
        </p>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="load" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${
          prediction.stressLevel === 'low' ? 'bg-green-100' :
          prediction.stressLevel === 'medium' ? 'bg-yellow-100' : 'bg-red-100'
        }`}>
          <h4 className="font-semibold mb-2">Stress Level</h4>
          <p className="capitalize">{prediction.stressLevel}</p>
        </div>
        <div className="p-4 rounded-lg bg-blue-100">
          <h4 className="font-semibold mb-2">ML Confidence</h4>
          <p>{(prediction.confidence * 100).toFixed(1)}%</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-100">
          <h4 className="font-semibold mb-2">WiFi CSI Signal</h4>
          <p>Strong</p>
        </div>
      </div>
    </div>
  );
}; 