import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Activity, Eye, MousePointer } from 'lucide-react';
import { cognitiveLoadModel, MLPrediction } from '../../services/mlService';

interface CognitiveLoadMonitorProps {
  data: any[];
}

export const CognitiveLoadMonitor: React.FC<CognitiveLoadMonitorProps> = ({ data }) => {
  const [prediction, setPrediction] = useState<MLPrediction>({
    cognitiveLoad: 0.5,
    attentionLevel: 0.5,
    stressLevel: 'medium',
    confidence: 0.8,
    metrics: {
      focusQuality: 0.7,
      mentalFatigue: 0.3,
      learningProgress: 0.6,
      workloadIntensity: 0.4
    }
  });

  const [sensorData, setSensorData] = useState<any[]>([]);

  useEffect(() => {
    // Initialize the ML model when component mounts
    const initModel = async () => {
      await cognitiveLoadModel.initialize();
      console.log('Cognitive Load ML Model initialized');
    };
    initModel();
  }, []);

  // Real-time monitoring using ML model and sensor data
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Get prediction from our ML model
        const newPrediction = await cognitiveLoadModel.predict();
        setPrediction(newPrediction);

        // Get the latest sensor readings
        const latestSensorData = cognitiveLoadModel.getLastSensorData();
        if (latestSensorData) {
          setSensorData(prev => [...prev.slice(-19), {
            time: new Date().toLocaleTimeString(),
            eyeMovement: latestSensorData.eyeMovement,
            headPosition: latestSensorData.headPosition,
            keyboardActivity: latestSensorData.keyboardActivity,
            focusQuality: newPrediction.metrics.focusQuality,
            mentalFatigue: newPrediction.metrics.mentalFatigue
          }]);
        }
      } catch (error) {
        console.error('Error predicting cognitive load:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getCognitiveLoadExplanation = (load: number) => {
    if (load > 0.8) {
      return "High cognitive load detected. Consider taking a break or simplifying current tasks.";
    } else if (load > 0.5) {
      return "Moderate cognitive load. You're engaged but not overwhelmed.";
    } else {
      return "Low cognitive load. Good time for learning new tasks or complex problem solving.";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Cognitive Load Monitor (ML-powered)</h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Brain className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium">
              Attention: {(prediction.attentionLevel * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center">
            <Activity className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium">
              Load: {(prediction.cognitiveLoad * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700">
          {getCognitiveLoadExplanation(prediction.cognitiveLoad)}
        </p>
      </div>

      {/* Cognitive Load Chart */}
      <div className="h-64 mb-6">
        <h4 className="text-sm font-semibold mb-2">Cognitive Load Trend</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="focusQuality" stroke="#3B82F6" name="Focus Quality" />
            <Line type="monotone" dataKey="mentalFatigue" stroke="#EF4444" name="Mental Fatigue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-blue-50">
          <h4 className="font-semibold mb-2">Focus Quality</h4>
          <p className="text-lg">{(prediction.metrics.focusQuality * 100).toFixed(1)}%</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50">
          <h4 className="font-semibold mb-2">Learning Progress</h4>
          <p className="text-lg">{(prediction.metrics.learningProgress * 100).toFixed(1)}%</p>
        </div>
        <div className="p-4 rounded-lg bg-red-50">
          <h4 className="font-semibold mb-2">Mental Fatigue</h4>
          <p className="text-lg">{(prediction.metrics.mentalFatigue * 100).toFixed(1)}%</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-50">
          <h4 className="font-semibold mb-2">Workload Intensity</h4>
          <p className="text-lg">{(prediction.metrics.workloadIntensity * 100).toFixed(1)}%</p>
        </div>
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
          <h4 className="font-semibold mb-2">Sensor Status</h4>
          <p className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            <MousePointer className="w-4 h-4 mx-1" />
            Active
          </p>
        </div>
      </div>
    </div>
  );
}; 