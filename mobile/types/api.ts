/**
 * TypeScript interfaces mirroring the backend Pydantic models.
 */

export interface HealthResponse {
  status: string;
}

export interface CategoryResponse {
  categories: string[];
}

export interface LessonSection {
  title: string;
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_option: number; // 0-indexed
  explanation: string;
}

export interface SourceInfo {
  name: string;
  url: string;
}

export interface DailyLesson {
  date: string;
  title: string;
  category: string;
  duration_minutes: number;
  description: string;
  source: SourceInfo;
  sections: LessonSection[];
  facts: string[];
  takeaways: string[];
  quiz: QuizQuestion[];
}

export interface LocalProgress {
  completedDates: string[];
  quizScores: Record<string, number>;
  categoriesExplored: string[];
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
}
