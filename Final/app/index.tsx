import { useEffect } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Index() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  // TEMPORARY: Skip directly to homescreen for testing
  return <Redirect href="/(tabs)/Homescreen" />;

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/SignIn" />;
  }

  return <Redirect href="/(tabs)/Homescreen" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
