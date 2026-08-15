import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flex: 1,
    minWidth: "45%",
    margin: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6F4EA",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    backgroundColor: "#ECFDF5",
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  icon: {
    fontSize: 22,
  },
  value: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F291E",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
    marginTop: 4,
  },
});
