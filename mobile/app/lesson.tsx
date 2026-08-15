import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DailyLesson } from "../types/api";
import { LessonSection } from "../components/LessonSection";
import { getCategoryIcon } from "../constants/categories";

export default function LessonScreen() {
  const router = useRouter();
  const { lessonJson } = useLocalSearchParams<{ lessonJson: string }>();

  if (!lessonJson) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No lesson content found.</Text>
      </View>
    );
  }

  const lesson: DailyLesson = JSON.parse(lessonJson);
  const categoryIcon = getCategoryIcon(lesson.category);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F9F5" }}>
      {/* Top Header Navigation */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerCategory}>{categoryIcon} {lesson.category}</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.durationPill}>
            <Text style={styles.durationText}>⏱️ ~{lesson.duration_minutes} min read</Text>
          </View>
        </View>

        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.description}>{lesson.description}</Text>

        {/* Sections */}
        <View style={styles.sectionContainer}>
          {lesson.sections.map((section, idx) => (
            <LessonSection key={idx} section={section} index={idx} />
          ))}
        </View>

        {/* Facts */}
        {lesson.facts.length > 0 && (
          <View style={styles.boxContainer}>
            <Text style={styles.boxTitle}>💡 Interesting Facts</Text>
            {lesson.facts.map((fact, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{fact}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Key Takeaways */}
        {lesson.takeaways.length > 0 && (
          <View style={[styles.boxContainer, styles.takeawaysBox]}>
            <Text style={styles.boxTitle}>🎯 Key Takeaways</Text>
            {lesson.takeaways.map((point, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.checkMark}>✓</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Source Attribution */}
        <View style={styles.sourceBox}>
          <Text style={styles.sourceLabel}>Source</Text>
          <Text style={styles.sourceText}>
            Sourced from Wikipedia article: "{lesson.title}"
          </Text>
          {lesson.source.url ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(lesson.source.url)}
            >
              <Text style={styles.sourceLink}>Read original article →</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Start Quiz Button */}
        <TouchableOpacity
          style={styles.quizButton}
          onPress={() =>
            router.push({
              pathname: "/quiz",
              params: { lessonJson },
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.quizButtonText}>TAKE THE QUIZ 📝</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9F5",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
  },
  backButtonText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 14,
  },
  headerCategory: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#F4F9F5",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 16,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  durationPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E6F4EA",
  },
  durationText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F291E",
    lineHeight: 34,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 24,
    fontStyle: "italic",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  boxContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E6F4EA",
  },
  takeawaysBox: {
    borderColor: "#A7F3D0",
    backgroundColor: "#ECFDF5",
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F291E",
    marginBottom: 14,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  bulletDot: {
    color: "#059669",
    fontSize: 16,
    marginRight: 10,
  },
  checkMark: {
    color: "#059669",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 10,
  },
  bulletText: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  sourceBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sourceLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sourceText: {
    color: "#374151",
    fontSize: 13,
  },
  sourceLink: {
    color: "#059669",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },
  quizButton: {
    backgroundColor: "#059669",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  quizButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
