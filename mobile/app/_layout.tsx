import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: "#059669",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 5,
        },
        tabBarActiveTintColor: "#059669",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.6 }}>
              🌟
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.6 }}>
              📚
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.6 }}>
              📊
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="lesson"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="result"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
