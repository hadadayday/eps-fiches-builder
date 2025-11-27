export enum GradeLevel {
  COLLEGE_1 = "Collège - 1ère année",
  COLLEGE_2 = "Collège - 2ème année",
  COLLEGE_3 = "Collège - 3ème année",
  LYCEE_TC = "Lycée - Tronc Commun",
  LYCEE_1 = "Lycée - 1ère année Bac",
  LYCEE_2 = "Lycée - 2ème année Bac"
}

export enum SportType {
  BASKETBALL = "Basketball",
  HANDBALL = "Handball",
  FOOTBALL = "Football",
  BADMINTON = "Badminton",
  RUGBY = "Rugby",
  ATHLETICS = "Athlétisme",
  GYMNASTICS = "Gymnastique",
  OTHER = "Autre"
}

export interface Worksheet {
  id: string;
  title: string;
  author: string;
  sport: SportType;
  grade: GradeLevel;
  type: 'PDF' | 'DOCX' | 'IMG';
  downloads: number;
  rating: number;
  thumbnailUrl: string;
  date: string;
  aiGenerated: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastActive: string;
  tags: string[];
}

export interface FicheActivity {
  name: string;
  duration: string;
  description: string;
  organization?: string;
  difficulty?: string;
  variations?: string;
}

export interface FicheData {
  title: string;
  subject: string;
  grade: string;
  sport: string;
  durationTotal: string;
  // APC Fields
  competences: string[];
  objectives: string[];
  activities: FicheActivity[];
  materials: string[];
  safety: string[];
  evaluation: string[];
  indicators: string[];
  differentiation: string;
  notes: string;
}