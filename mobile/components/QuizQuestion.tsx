import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { QuizQuestion as QuizQuestionType } from "../types/api";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
}) => {
  const letters = ["A", "B", "C", "D"];
  const isAnswered = selectedOption !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>
        Question {questionIndex + 1} of {totalQuestions}
      </Text>
      <Text style={styles.questionText}>{question.question}</Text>

      <View style={styles.optionsContainer}>
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = question.correct_option === idx;

          let optionStyle = styles.optionCard;
          let textStyle = styles.optionText;

          if (isAnswered) {
            if (isCorrect) {
              optionStyle = { ...styles.optionCard, ...styles.correctOption };
              textStyle = { ...styles.optionText, ...styles.correctText };
            } else if (isSelected) {
              optionStyle = { ...styles.optionCard, ...styles.wrongOption };
              textStyle = { ...styles.optionText, ...styles.wrongText };
            }
          }

          return (
            <TouchableOpacity
              key={idx}
              style={optionStyle}
              onPress={() => !isAnswered && onSelectOption(idx)}
              activeOpacity={0.7}
              disabled={isAnswered}
            >
              <View style={styles.letterBadge}>
                <Text style={styles.letterText}>{letters[idx]}</Text>
              </View>
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isAnswered && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>
            {selectedOption === question.correct_option
              ? "✅ Correct!"
              : "❌ Incorrect"}
          </Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  progressText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F291E",
    lineHeight: 28,
    marginBottom: 22,
    letterSpacing: -0.3,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  correctOption: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  wrongOption: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
  },
  letterBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  letterText: {
    color: "#374151",
    fontWeight: "800",
  },
  optionText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
    flex: 1,
  },
  correctText: {
    color: "#047857",
    fontWeight: "700",
  },
  wrongText: {
    color: "#B91C1C",
    fontWeight: "600",
  },
  explanationBox: {
    marginTop: 22,
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#047857",
    marginBottom: 6,
  },
  explanationText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
});
