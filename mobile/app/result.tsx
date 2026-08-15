import React, { useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DailyLesson } from "../types/api";
import { saveLessonCompletion } from "../storage/progress";

export default function ResultScreen() {
  const router = useRouter();
  const { lessonJson, score, total } = useLocalSearchParams<{
    lessonJson: string;
    score: string;
    total: string;
  }>();

  const numScore = parseInt(score || "0", 10);
  const numTotal = parseInt(total || "5", 10);
  const percentage = Math.round((numScore / numTotal) * 100);

  if (!lessonJson) return null;
  const lesson: DailyLesson = JSON.parse(lessonJson);

  useEffect(() => {
    // Save completion to local AsyncStorage
    saveLessonCompletion(lesson.date, lesson.category, numScore, numTotal);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.emojiHeader}>
          {percentage >= 80 ? "🏆" : percentage >= 60 ? "👏" : "📚"}
        </Text>
        <Text style={styles.title}>Lesson Complete!</Text>
        <Text style={styles.topicName}>{lesson.title}</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreBig}>{numScore} / {numTotal}</Text>
          <Text style={styles.percentageText}>{percentage}% Score</Text>
        </View>

        <View style={styles.learnedBox}>
          <Text style={styles.learnedTitle}>What You Learned Today:</Text>
          {lesson.takeaways.map((takeaway, idx) => (
            <View key={idx} style={styles.learnedRow}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.learnedText}>{takeaway}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/")}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>BACK TO HOME 🏠</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6F4EA",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  emojiHeader: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F291E",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  topicName: {
    fontSize: 15,
    color: "#059669",
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  scoreContainer: {
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    paddingHorizontal: 36,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  scoreBig: {
    fontSize: 40,
    fontWeight: "800",
    color: "#047857",
    letterSpacing: -0.5,
  },
  percentageText: {
    fontSize: 14,
    color: "#059669",
    marginTop: 4,
    fontWeight: "700",
  },
  learnedBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  learnedTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F291E",
    marginBottom: 14,
  },
  learnedRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  checkIcon: {
    color: "#059669",
    fontWeight: "800",
    marginRight: 10,
  },
  learnedText: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  homeButton: {
    backgroundColor: "#059669",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
