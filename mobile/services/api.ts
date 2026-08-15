/**
 * API service layer for communicating with the FastAPI backend.
 */

import { Platform } from "react-native";
import {
  DailyLesson,
  CategoryResponse,
  HealthResponse,
} from "../types/api";

// For Android emulator, 10.0.2.2 points to host machine's localhost
const API_BASE = Platform.OS === "android"
  ? "http://10.0.2.2:8000/api"
  : "http://localhost:8000/api";

/**
 * Generic fetch wrapper with error handling.
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API Error ${response.status}: ${errorBody || response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Network request failed") {
      throw new Error(
        "Unable to connect to the server. Please check your connection."
      );
    }
    throw error;
  }
}

/**
 * Check if the backend is running.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/health");
}

/**
 * Get all supported learning categories.
 */
export async function fetchCategories(): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>("/categories");
}

/**
 * Get today's structured lesson.
 */
export async function fetchTodayLesson(): Promise<DailyLesson> {
  return apiFetch<DailyLesson>("/today");
}
