import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchCategories } from "../services/api";
import { CATEGORY_GROUPS } from "../constants/categories";
import { CategoryCard } from "../components/CategoryCard";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        setCategories(res.categories);
        // Default: select all categories
        setSelected(res.categories);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Explore Categories 📚</Text>
      <Text style={styles.subtitle}>
        Select topics you are interested in exploring
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7C3AED" style={styles.loader} />
      ) : (
        CATEGORY_GROUPS.map((group) => (
          <View key={group.title} style={styles.groupSection}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.chipRow}>
              {group.items.map((item) => (
                <CategoryCard
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  isSelected={selected.includes(item.name)}
                  onToggle={() => toggleCategory(item.name)}
                />
              ))}
            </View>
          </View>
        ))
      )}
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
    marginBottom: 24,
    fontWeight: "500",
  },
  loader: {
    marginVertical: 40,
  },
  groupSection: {
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
  groupTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
