export interface SurveyAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

export interface ScanResponse {
  answers: SurveyAnswers;
  confidence: Record<string, number>;
  status: string;
}

export interface QuestionDefinition {
  id: keyof SurveyAnswers;
  title: string;
  options: { key: string; text: string }[];
}

export interface DashboardStats {
  total_scanned: number;
  q1: Record<string, number>;
  q2: Record<string, number>;
  q3: Record<string, number>;
  q4: Record<string, number>;
  q5: Record<string, number>;
}