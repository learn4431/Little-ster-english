export interface Word {
  id: string;
  text: string;
  phonetic: string;
  definition: string;
  example: string;
  masteryLevel: number; // 0-100
  lastPracticed?: number;
}

export interface EvaluationResult {
  score: number;
  feedback: string;
  suggestion: string; // Specific phoneme correction
  encouragement: string;
}

export enum AppView {
  LEARN = 'LEARN',
  ADD_WORD = 'ADD_WORD',
  STATS = 'STATS'
}

export interface AudioState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
}
