import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CategoryCardProps {
  name: string;
  icon: string;
  isSelected?: boolean;
  onToggle: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon,
  isSelected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.selectedChip]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.name, isSelected && styles.selectedName]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedChip: {
    backgroundColor: "#059669",
    borderColor: "#047857",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  selectedName: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
