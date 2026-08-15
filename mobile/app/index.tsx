import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { fetchTodayLesson } from "../services/api";
import { DailyLesson, LocalProgress } from "../types/api";
import { TopicCard } from "../components/TopicCard";
import { loadProgress, calculateStreak } from "../storage/progress";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [lesson, setLesson] = useState<DailyLesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<LocalProgress | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setError(null);
      const [lessonData, progressData] = await Promise.all([
        fetchTodayLesson(),
        loadProgress(),
      ]);
      setLesson(lessonData);
      setProgress(progressData);
    } catch (err: any) {
      setError(err.message || "Failed to load today's topic");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const isCompleted =
    lesson && progress?.completedDates.includes(lesson.date);
  const streak = progress ? calculateStreak(progress.completedDates) : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#059669" />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Daily Discovery 🌟</Text>
          <Text style={styles.subtitle}>Learn something new in ~20 minutes</Text>
        </View>
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak}d</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Finding today's discovery...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>We couldn't load today's topic</Text>
          <Text style={styles.errorSub}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      ) : lesson ? (
        <>
          <TopicCard
            lesson={lesson}
            isCompleted={isCompleted}
            onStart={() =>
              router.push({
                pathname: "/lesson",
                params: { lessonJson: JSON.stringify(lesson) },
              })
            }
          />

          <View style={styles.progressSummary}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>
                {isCompleted ? "Completed! 🎉" : "0 / 20 min"}
              </Text>
              <Text style={styles.progressLabel}>
                {progress?.completedDates.length || 0} total finished
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: isCompleted ? "100%" : "0%" },
                ]}
              />
            </View>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9F5",
  },
  content: {
    padding: 20,
    paddingTop: 54,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F291E",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
    fontWeight: "500",
  },
  streakBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  streakText: {
    color: "#D97706",
    fontWeight: "800",
    fontSize: 14,
  },
  centerBox: {
    paddingVertical: 80,
    alignItems: "center",
  },
  loadingText: {
    color: "#4B5563",
    marginTop: 16,
    fontSize: 15,
    fontWeight: "500",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginVertical: 20,
  },
  errorTitle: {
    color: "#DC2626",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorSub: {
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#059669",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  progressSummary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E6F4EA",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F291E",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "500",
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#059669",
    borderRadius: 5,
  },
});
