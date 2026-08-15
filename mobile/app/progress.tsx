import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, RefreshControl } from "react-native";
import { loadProgress, calculateStreak } from "../storage/progress";
import { LocalProgress } from "../types/api";
import { ProgressCard } from "../components/ProgressCard";

export default function ProgressScreen() {
  const [progress, setProgress] = useState<LocalProgress | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProgress = async () => {
    const data = await loadProgress();
    setProgress(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProgress();
  };

  const streak = progress ? calculateStreak(progress.completedDates) : 0;
  const completedCount = progress?.completedDates.length || 0;
  const accuracy =
    progress && progress.totalQuestionsAnswered > 0
      ? Math.round(
          (progress.totalCorrectAnswers / progress.totalQuestionsAnswered) *
            100
        )
      : 0;

  // Calculate last 7 days activity
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isoStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "narrow" });
    const isDone = progress?.completedDates.includes(isoStr);
    return { dayName, isDone, isoStr };
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C084FC" />
      }
    >
      <Text style={styles.headerTitle}>Your Progress 📊</Text>
      <Text style={styles.subtitle}>Track your daily learning momentum</Text>

      {/* 7-Day Activity Visualizer */}
      <View style={styles.activityBox}>
        <Text style={styles.activityTitle}>Weekly Activity</Text>
        <View style={styles.weekRow}>
          {last7Days.map((day, idx) => (
            <View key={idx} style={styles.dayCol}>
              <View style={[styles.dayDot, day.isDone && styles.dayDotActive]}>
                <Text style={styles.dotIcon}>{day.isDone ? "✓" : ""}</Text>
              </View>
              <Text style={[styles.dayLabel, day.isDone && styles.dayLabelActive]}>
                {day.dayName}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.grid}>
        <ProgressCard
          title="Topics Completed"
          value={completedCount}
          icon="📚"
        />
        <ProgressCard
          title="Current Streak"
          value={`${streak} Days`}
          subtitle="Keep it going!"
          icon="🔥"
        />
        <ProgressCard
          title="Quiz Accuracy"
          value={`${accuracy}%`}
          subtitle={`${progress?.totalCorrectAnswers || 0} / ${
            progress?.totalQuestionsAnswered || 0
          } correct`}
          icon="🎯"
        />
        <ProgressCard
          title="Categories Explored"
          value={progress?.categoriesExplored.length || 0}
          icon="🧭"
        />
      </View>

      {/* Explored Categories List */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Explored Categories</Text>
        {progress?.categoriesExplored.length ? (
          <View style={styles.categoryList}>
            {progress.categoriesExplored.map((cat, idx) => (
              <View key={idx} style={styles.catChip}>
                <Text style={styles.catText}>{cat}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No categories explored yet. Start your first lesson!</Text>
        )}
      </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F291E",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
    marginBottom: 20,
    fontWeight: "500",
  },
  activityBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E6F4EA",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F291E",
    marginBottom: 14,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayCol: {
    alignItems: "center",
    gap: 6,
  },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dayDotActive: {
    backgroundColor: "#059669",
    borderColor: "#047857",
  },
  dotIcon: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  dayLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  dayLabelActive: {
    color: "#059669",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    marginBottom: 16,
  },
  sectionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E6F4EA",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F291E",
    marginBottom: 12,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  catChip: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  catText: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    fontStyle: "italic",
  },
});
