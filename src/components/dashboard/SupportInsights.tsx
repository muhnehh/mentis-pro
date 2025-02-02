import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowUpRight } from 'lucide-react';

interface SupportInsightsProps {
  userData: any;
}

interface Insight {
  id: string;
  type: 'cognitive' | 'behavioral' | 'alert' | 'recommendation';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  timestamp: string;
}

export const SupportInsights: React.FC<SupportInsightsProps> = ({ userData }) => {
  // Simulated insights data
  const insights: Insight[] = [
    {
      id: '1',
      type: 'cognitive',
      title: 'Peak Performance Time',
      description: 'Your cognitive load is typically lowest between 9 AM and 11 AM. Consider scheduling complex tasks during this window.',
      impact: 'high',
      actionable: true,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'behavioral',
      title: 'Routine Consistency',
      description: "You have maintained a consistent morning routine for 5 days. This stability is positively affecting your stress levels.",
      impact: 'medium',
      actionable: false,
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Elevated Stress Detected',
      description: 'WiFi CSI signals indicate increased stress levels during video calls. Consider taking short breaks between calls.',
      impact: 'high',
      actionable: true,
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Environment Optimization',
      description: 'Based on your cognitive patterns, a quieter workspace might help reduce mental fatigue during afternoon tasks.',
      impact: 'medium',
      actionable: true,
      timestamp: '30 minutes ago'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'cognitive':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'behavioral':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Support Insights</h3>
        <span className="text-sm text-gray-500">Updated just now</span>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <span className="text-sm text-gray-500">{insight.timestamp}</span>
                </div>
                
                <p className="mt-1 text-gray-600">{insight.description}</p>
                
                <div className="mt-3 flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                  
                  {insight.actionable && (
                    <button className="flex items-center text-sm text-blue-500 hover:text-blue-600">
                      Take action
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Based on WiFi CSI signal analysis and behavioral patterns
          </span>
          <button className="text-blue-500 hover:text-blue-600 text-sm">
            View All Insights
          </button>
        </div>
      </div>
    </div>
  );
}; 