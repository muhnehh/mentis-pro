export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  contrast: 'normal' | 'high';
  audioEnabled: boolean;
  visualAids: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  caregiverContact: string;
}

export interface CognitiveLoadData {
  time: string;
  load: number;
  activity: string;
}

export interface AssessmentResults {
  categories: Record<string, number>;
  primaryNeed: string;
  supportLevel: 'low' | 'medium' | 'high';
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    priority: string;
  }>;
}

export interface UserData {
  profile: {
    name: string;
    avatar: string;
    email: string;
  };
  cognitiveLoad: {
    current: number;
    history: CognitiveLoadData[];
    threshold: number;
  };
  preferences: {
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
    audioEnabled: boolean;
    visualAids: boolean;
  };
} 