import React from 'react';
import { Brain, Target, Shield, Lightbulb, ChevronRight, Download, Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface AssessmentResultsProps {
  results: {
    categories: Record<string, number>;
    primaryNeed: string;
    supportLevel: 'low' | 'medium' | 'high';
    recommendations: Array<{
      type: string;
      title: string;
      description: string;
      priority: string;
    }>;
  };
  onContinue: () => void;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ results, onContinue }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const radarData = Object.entries(results.categories).map(([key, value]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    value: value
  }));

  const pieData = Object.entries(results.categories).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Assessment Results</h2>
        <p className="text-gray-600">
          Based on your responses, we've created a personalized support profile
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Brain className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="font-semibold">Primary Need</h3>
          </div>
          <p className="text-lg text-blue-700">{results.primaryNeed}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="font-semibold">Support Focus</h3>
          </div>
          <p className="text-lg text-green-700">
            {Object.entries(results.categories).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
          </p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Shield className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="font-semibold">Support Level</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getSupportLevelColor(results.supportLevel)}`}>
            {results.supportLevel.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="h-64">
          <h3 className="text-lg font-semibold mb-4">Support Areas Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h3 className="text-lg font-semibold mb-4">Capability Analysis</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar
                name="Capabilities"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
        </div>
        <div className="space-y-4">
          {results.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start">
                <div className="flex-grow">
                  <h4 className="font-medium text-gray-800">{rec.title}</h4>
                  <p className="text-gray-600 mt-1">{rec.description}</p>
                </div>
                <span className={`ml-4 px-2 py-1 rounded-full text-xs ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <Download className="w-4 h-4 mr-1" />
            Download Report
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <Share2 className="w-4 h-4 mr-1" />
            Share Results
          </button>
        </div>
        <button
          onClick={onContinue}
          className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Continue to Dashboard
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}; 