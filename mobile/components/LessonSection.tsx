import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LessonSection as SectionType } from "../types/api";

interface LessonSectionProps {
  section: SectionType;
  index: number;
}

export const LessonSection: React.FC<LessonSectionProps> = ({
  section,
  index,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <Text style={styles.title}>{section.title}</Text>
      </View>
      <Text style={styles.content}>{section.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E6F4EA",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  numberBadge: {
    backgroundColor: "#059669",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  numberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F291E",
    flex: 1,
    lineHeight: 24,
  },
  content: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
  },
});
