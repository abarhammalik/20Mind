import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DailyLesson } from "../types/api";
import { getCategoryIcon } from "../constants/categories";

interface TopicCardProps {
  lesson: DailyLesson;
  isCompleted?: boolean;
  onStart: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  lesson,
  isCompleted,
  onStart,
}) => {
  const icon = getCategoryIcon(lesson.category);

  return (
    <View style={styles.card}>
      <View style={[styles.topGlowBar, isCompleted ? styles.topGlowCompleted : styles.topGlowDefault]} />
      
      <View style={styles.badgeRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {icon} {lesson.category}
          </Text>
        </View>
        <View style={styles.rightBadges}>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>⏱️ ~{lesson.duration_minutes} min</Text>
          </View>
        </View>
      </View>

      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {lesson.description}
      </Text>

      <TouchableOpacity
        style={[styles.button, isCompleted && styles.buttonCompleted]}
        onPress={onStart}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>
          {isCompleted ? "✓ REVIEW LESSON" : "🚀 START LEARNING"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    marginVertical: 14,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E6F4EA",
    overflow: "hidden",
    position: "relative",
  },
  topGlowBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  topGlowDefault: {
    backgroundColor: "#059669",
  },
  topGlowCompleted: {
    backgroundColor: "#10B981",
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  categoryText: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "700",
  },
  rightBadges: {
    flexDirection: "row",
    gap: 6,
  },
  durationBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F291E",
    marginBottom: 10,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 22,
  },
  button: {
    backgroundColor: "#059669",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonCompleted: {
    backgroundColor: "#047857",
    shadowColor: "#047857",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
});
