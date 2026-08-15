import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DailyLesson } from "../types/api";
import { QuizQuestion } from "../components/QuizQuestion";

export default function QuizScreen() {
  const router = useRouter();
  const { lessonJson } = useLocalSearchParams<{ lessonJson: string }>();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    []
  );

  if (!lessonJson) return null;
  const lesson: DailyLesson = JSON.parse(lessonJson);
  const questions = lesson.quiz || [];

  const currentQuestion = questions[currentIndex];
  const currentSelection = selectedAnswers[currentIndex] ?? null;

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate score
      let score = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct_option) {
          score += 1;
        }
      });

      router.replace({
        pathname: "/result",
        params: {
          lessonJson,
          score: score.toString(),
          total: questions.length.toString(),
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F9F5" }}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Exit Quiz</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Quiz 📝</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.topicSub}>{lesson.title}</Text>

        {/* Progress Dots */}
        <View style={styles.dotRow}>
          {questions.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentIndex && styles.activeDot,
                selectedAnswers[idx] !== undefined &&
                  selectedAnswers[idx] !== null &&
                  styles.answeredDot,
              ]}
            />
          ))}
        </View>

        {currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOption={currentSelection}
            onSelectOption={handleSelectOption}
          />
        )}

        {currentSelection !== null && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === questions.length - 1
                ? "VIEW RESULTS 🏆"
                : "NEXT QUESTION →"}
            </Text>
          </TouchableOpacity>
        )}
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
    backgroundColor: "#FEF2F2",
  },
  backButtonText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 13,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F291E",
  },
  topicSub: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
    marginBottom: 16,
    fontWeight: "500",
  },
  dotRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: "#10B981",
  },
  answeredDot: {
    backgroundColor: "#059669",
  },
  nextButton: {
    backgroundColor: "#059669",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});
