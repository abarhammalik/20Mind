/**
 * Local progress tracking using AsyncStorage (or localStorage fallback for Web/Expo web).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalProgress } from "../types/api";

const PROGRESS_KEY = "@daily_learn_progress";

const DEFAULT_PROGRESS: LocalProgress = {
  completedDates: [],
  quizScores: {},
  categoriesExplored: [],
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
};

/**
 * Load progress from storage.
 */
export async function loadProgress(): Promise<LocalProgress> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return JSON.parse(raw) as LocalProgress;
  } catch (error) {
    console.error("Failed to load progress:", error);
    return DEFAULT_PROGRESS;
  }
}

/**
 * Record completed lesson and quiz score.
 */
export async function saveLessonCompletion(
  date: string,
  category: string,
  score: number,
  totalQuestions: number = 5
): Promise<LocalProgress> {
  const current = await loadProgress();

  const completedDates = current.completedDates.includes(date)
    ? current.completedDates
    : [...current.completedDates, date];

  const categoriesExplored = current.categoriesExplored.includes(category)
    ? current.categoriesExplored
    : [...current.categoriesExplored, category];

  const updated: LocalProgress = {
    completedDates,
    quizScores: {
      ...current.quizScores,
      [date]: score,
    },
    categoriesExplored,
    totalQuestionsAnswered: current.totalQuestionsAnswered + totalQuestions,
    totalCorrectAnswers: current.totalCorrectAnswers + score,
  };

  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }

  return updated;
}

/**
 * Calculate current consecutive day streak.
 */
export function calculateStreak(completedDates: string[]): number {
  if (!completedDates || completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const today = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  // If latest completion is neither today nor yesterday, streak is 0
  if (sorted[0] !== today && sorted[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(sorted[0]);

  for (const dateStr of sorted) {
    const dateObj = new Date(dateStr);
    const diffDays = Math.round(
      (checkDate.getTime() - dateObj.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays <= 1) {
      streak++;
      checkDate = dateObj;
    } else {
      break;
    }
  }

  return streak;
}
