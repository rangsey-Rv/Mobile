import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { appwriteService } from "../lib/appwrite";

const DebugScreen = () => {
  const { theme } = useTheme();
  const [status, setStatus] = useState("Checking configuration...");
  const [isRealService, setIsRealService] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    try {
      // Check if we're using real or mock service
      const serviceType = appwriteService.constructor.name;
      setIsRealService(serviceType !== "MockAppwriteService");

      if (serviceType === "MockAppwriteService") {
        setStatus("🔧 Using Mock Service - Appwrite not configured yet");
      } else {
        setStatus("✅ Using Real Appwrite Service");
      }
    } catch (error) {
      setStatus("❌ Error checking configuration: " + error.message);
    }
  };

  const testSignUp = async () => {
    try {
      setStatus("Testing sign up...");
      const result = await appwriteService.createUserAccount(
        "test@example.com",
        "password123",
        "TestUser"
      );
      setStatus(
        "✅ Sign up test successful: " + JSON.stringify(result, null, 2)
      );
    } catch (error) {
      setStatus("❌ Sign up test failed: " + error.message);
    }
  };

  const testSignIn = async () => {
    try {
      setStatus("Testing sign in...");
      const result = await appwriteService.signIn(
        "test@example.com",
        "password123"
      );
      setStatus(
        "✅ Sign in test successful: " + JSON.stringify(result, null, 2)
      );
    } catch (error) {
      setStatus("❌ Sign in test failed: " + error.message);
    }
  };

  const testGetUser = async () => {
    try {
      setStatus("Testing get current user...");
      const result = await appwriteService.getCurrentUser();
      setStatus(
        "✅ Get user test successful: " + JSON.stringify(result, null, 2)
      );
    } catch (error) {
      setStatus("❌ Get user test failed: " + error.message);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Appwrite Debug Screen
      </Text>

      <View style={[styles.statusCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
          Service Status:
        </Text>
        <Text
          style={[
            styles.statusText,
            { color: isRealService ? "#4CAF50" : "#FF9800" },
          ]}
        >
          {isRealService ? "Real Appwrite Service" : "Mock Service"}
        </Text>
      </View>

      <View style={[styles.statusCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
          Last Action Result:
        </Text>
        <Text style={[styles.statusDetails, { color: theme.colors.subText }]}>
          {status}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: theme.colors.primary }]}
          onPress={checkConfiguration}
        >
          <Text style={styles.buttonText}>Check Configuration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: "#4CAF50" }]}
          onPress={testSignUp}
        >
          <Text style={styles.buttonText}>Test Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: "#2196F3" }]}
          onPress={testSignIn}
        >
          <Text style={styles.buttonText}>Test Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.testButton, { backgroundColor: "#FF9800" }]}
          onPress={testGetUser}
        >
          <Text style={styles.buttonText}>Test Get User</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.helpCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.helpTitle, { color: theme.colors.text }]}>
          Next Steps:
        </Text>
        <Text style={[styles.helpText, { color: theme.colors.subText }]}>
          1. If using Mock Service, update lib/appwriteService.ts with your real
          project details{"\n"}
          2. Make sure your Appwrite project has Email/Password auth enabled
          {"\n"}
          3. Create a database and users collection{"\n"}
          4. Test each function above to identify specific issues
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  statusCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusDetails: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "monospace",
  },
  buttonContainer: {
    marginVertical: 20,
  },
  testButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  helpCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default DebugScreen;
