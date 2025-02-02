export interface CognitiveLoadData {
  time: string;
  load: number;
  activity: string;
}

export interface UserPreferences {
  fontSize: string;
  contrast: string;
  audioEnabled: boolean;
  visualAids: boolean;
}

export interface UserData {
  profile: any | null;
  tasks: any[];
  routines: any[];
  emotionalState: any[];
  cognitiveLoad: CognitiveLoadData[];
  locations: any[];
  caregiverInfo: any | null;
  assessmentResults: any | null;
  preferences: UserPreferences;
}

export interface ErrorState {
  active: boolean;
  errors: any[];
  recoveryAttempts: any[];
  systemStatus: string;
}

export interface FeedbackState {
  current: any | null;
  history: any[];
  suggestions: any[];
  ratings: Record<string, any>;
}

export interface TestState {
  running: boolean;
  results: any[];
  coverage: Record<string, any>;
  performance: Record<string, any>;
}

export interface HealthState {
  status: 'healthy' | 'warning' | 'error';
  metrics: Record<string, any>;
  alerts: any[];
  diagnostics: Record<string, any>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  primaryNeed: string;
  supportLevel: 'low' | 'medium' | 'high';
  created: Date;
  updated: Date;
}

// ... more type definitions 