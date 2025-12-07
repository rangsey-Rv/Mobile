// app/AI.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../context/ThemeContext";

// Define constants needed for layout
const { width } = Dimensions.get("window");
const SPACING = 16;

const QuizScreen: React.FC = () => {
  const { theme } = useTheme();
  const [textInput, setTextInput] = useState("");

  const handleQuiz = () => {
    // Logic for generating quiz questions
    console.log("Generate Quiz for:", textInput);
    // You would typically navigate to a Quiz loading/results screen here
  };

  const handleRandomQuestion = () => {
    // Logic for getting a random question
    console.log("Requesting Random Question");
  };

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            What can I help you?
          </Text>
          <View style={{ width: 30 }} /> {/* Spacer for alignment */}
        </View>

        {/* Text Input Area */}
        <View style={styles.inputSection}>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
              },
            ]}
            placeholder="Type here..........................................................................................."
            placeholderTextColor={theme.colors.subText}
            multiline
            value={textInput}
            onChangeText={setTextInput}
            textAlignVertical="top"
          />
          <View style={styles.inputToolbar}>
            <View style={styles.toolbarLeft}>
              <TouchableOpacity style={styles.toolbarIcon}>
                <Ionicons
                  name="add-circle-outline"
                  size={28}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.toolbarIcon}>
                <Ionicons
                  name="image-outline"
                  size={28}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.toolbarRight}>
              <TouchableOpacity style={styles.toolbarIcon}>
                <Ionicons
                  name="mic-outline"
                  size={28}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Send")}>
                <Ionicons name="send" size={28} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <CustomButton
          title="Quiz"
          onPress={handleQuiz}
          style={styles.quizButton}
          disabled={!textInput.trim()}
        />

        <CustomButton
          title="Random Question"
          onPress={handleRandomQuestion}
          variant="secondary"
          style={styles.randomButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Removed SPACING definition from here since it's now defined above
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING, // This now references the defined constant
    paddingTop: 50,
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  inputSection: {
    marginBottom: 40,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    minHeight: 200,
    padding: 20,
    fontSize: 15,
    textAlignVertical: "top",
  },
  inputToolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  toolbarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  toolbarIcon: {
    marginRight: 20,
  },
  quizButton: {
    marginBottom: 15,
    paddingVertical: 16,
    borderRadius: 12,
  },
  randomButton: {
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default QuizScreen;
