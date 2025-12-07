// app/Quiz.tsx

import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Corrected Path: Go up one level (out of 'app'), then into 'context'
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
// Corrected Path: Go up one level (out of 'app'), then into 'components'
import CustomButton from "../components/CustomButton";

const { width } = Dimensions.get("window");

// Define constants needed for layout
const SPACING = 16;

const JoinQuiz: React.FC = () => {
  const { theme } = useTheme();
  const [gamePin, setGamePin] = useState("");

  const handleEnter = () => {
    console.log("Entering quiz with PIN:", gamePin);
    // Logic to join the quiz
  };

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={30} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Quiz!!</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.gamePinLabel}>
            <Text style={styles.gamePinText}>Game Pin</Text>
          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.primary,
              },
            ]}
            placeholder="Enter"
            placeholderTextColor={theme.colors.subText}
            keyboardType="numeric"
            value={gamePin}
            onChangeText={setGamePin}
            maxLength={6}
          />

          <CustomButton
            title="Enter"
            onPress={handleEnter}
            style={styles.enterButton}
            disabled={gamePin.length < 4}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  gamePinLabel: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 25,
    alignItems: "center",
  },
  gamePinText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  input: {
    width: "100%",
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    borderWidth: 2,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  enterButton: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 10,
  },
});

// FIX: Export the correct component name
export default JoinQuiz;
