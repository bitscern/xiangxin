
export enum FiveElement {
  WOOD = "木",
  FIRE = "火",
  EARTH = "土",
  METAL = "金",
  WATER = "水"
}

export interface PalaceData {
  name: string;
  status: string;
  analysis: string;
}

export interface RiskMetric {
  label: string;
  value: string;
  traditionalTerm: string;
  description: string;
}

export interface KarmaData {
  past: string;
  present: string;
  future: string;
}

export interface WorkplaceData {
  role: string;
  strengths: string[];
  advice: string;
  compatibility: string;
}

export interface AnalysisResult {
  score: number;
  fiveElement: FiveElement;
  elementAnalysis: string;
  palaces: PalaceData[];
  riskMetrics: RiskMetric[];
  karma: KarmaData;
  workplace: WorkplaceData;
  personalityProfile: string;
  socialGuide: string;
  hobbies: string[];
  auraStatus: string;
  auraMessage: string;
}

export type AppView = 'home' | 'scanner' | 'report' | 'library' | 'about';
