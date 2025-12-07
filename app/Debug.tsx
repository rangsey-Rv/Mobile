import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  Clipboard,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import { appwriteService } from "../lib/appwrite";

const DebugScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { notes } = useNotes();

  const [status, setStatus] = useState("Checking configuration...");
  const [isRealService, setIsRealService] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    showSensitiveData: false,
    appVersion: "1.0.0",
    buildNumber: "1",
    deviceInfo: {
      screen: Dimensions.get("screen"),
      window: Dimensions.get("window"),
      platform: "mobile",
    },
    performance: {
      notesCount: 0,
      lastUpdate: new Date().toISOString(),
    },
  });

  const [logFilter, setLogFilter] = useState("");
  const [logs, setLogs] = useState([
    {
      level: "info",
      message: "App started successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      level: "debug",
      message: "User authentication loaded",
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
    {
      level: "info",
      message: "Notes context initialized",
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
  ]);

  useEffect(() => {
    checkConfiguration();
    setDebugInfo((prev) => ({
      ...prev,
      performance: {
        notesCount: notes.length,
        lastUpdate: new Date().toISOString(),
      },
    }));
  }, [notes]);

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
      setStatus("❌ Error checking configuration: " + (error as Error).message);
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
      setStatus("❌ Sign up test failed: " + (error as Error).message);
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
      setStatus("❌ Sign in test failed: " + (error as Error).message);
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
      setStatus("❌ Get user test failed: " + (error as Error).message);
    }
  };

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setString(text);
    Alert.alert("Copied", "Debug information copied to clipboard");
  };

  const exportDebugInfo = () => {
    const exportData = {
      appwriteStatus: { isRealService, status },
      user: debugInfo.showSensitiveData
        ? user
        : { id: (user as any)?.id || "anonymous" },
      notes: debugInfo.showSensitiveData ? notes : { count: notes.length },
      deviceInfo: debugInfo.deviceInfo,
      performance: debugInfo.performance,
      logs: logs.slice(-10),
      timestamp: new Date().toISOString(),
    };

    copyToClipboard(JSON.stringify(exportData, null, 2));
  };

  const addTestLog = (level: "info" | "debug" | "warning" | "error") => {
    const testMessages = {
      info: "Test info message generated",
      debug: "Test debug message with timestamp",
      warning: "Test warning - this is not a real issue",
      error: "Test error - simulated for debugging",
    };

    setLogs((prev) => [
      ...prev,
      {
        level,
        message: testMessages[level],
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case "error":
        return "#FF3B30";
      case "warning":
        return "#FF9500";
      case "debug":
        return "#007AFF";
      case "info":
        return "#34C759";
      default:
        return theme.colors.text;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.message.toLowerCase().includes(logFilter.toLowerCase()) ||
      log.level.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={30} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Debug Console
        </Text>
        <TouchableOpacity onPress={exportDebugInfo}>
          <Ionicons
            name="download-outline"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Appwrite Service Status */}
      <View style={[styles.statusCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
          Appwrite Service Status:
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

      {/* Appwrite Test Buttons */}
      <View style={styles.buttonContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Appwrite Tests
        </Text>
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

      {/* System Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          System Information
        </Text>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.subText }]}>
            App Version:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {debugInfo.appVersion}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.subText }]}>
            Build Number:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {debugInfo.buildNumber}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.subText }]}>
            Screen Size:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {debugInfo.deviceInfo.screen.width}x
            {debugInfo.deviceInfo.screen.height}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.subText }]}>
            Notes Count:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {debugInfo.performance.notesCount}
          </Text>
        </View>
      </View>

      {/* User Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            User Information
          </Text>
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: theme.colors.subText }]}>
              Show Sensitive
            </Text>
            <Switch
              value={debugInfo.showSensitiveData}
              onValueChange={(value) =>
                setDebugInfo((prev) => ({ ...prev, showSensitiveData: value }))
              }
              trackColor={{ false: "#E5E5E5", true: theme.colors.primary }}
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.subText }]}>
            User ID:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {debugInfo.showSensitiveData
              ? (user as any)?.id || "Not logged in"
              : "***"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: theme.colors.subText }]}>
            Email:
          </Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {debugInfo.showSensitiveData
              ? user?.email || "Not available"
              : "***"}
          </Text>
        </View>
      </View>

      {/* Debug Logs */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Debug Logs ({logs.length})
        </Text>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.background,
              borderColor: "#E5E5E5",
              color: theme.colors.text,
            },
          ]}
          placeholder="Filter logs..."
          placeholderTextColor={theme.colors.subText}
          value={logFilter}
          onChangeText={setLogFilter}
        />

        {/* Test Log Buttons */}
        <View style={styles.testButtons}>
          <TouchableOpacity
            style={[styles.miniTestButton, { backgroundColor: "#34C759" }]}
            onPress={() => addTestLog("info")}
          >
            <Text style={styles.miniButtonText}>Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.miniTestButton, { backgroundColor: "#007AFF" }]}
            onPress={() => addTestLog("debug")}
          >
            <Text style={styles.miniButtonText}>Debug</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.miniTestButton, { backgroundColor: "#FF9500" }]}
            onPress={() => addTestLog("warning")}
          >
            <Text style={styles.miniButtonText}>Warning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.miniTestButton, { backgroundColor: "#FF3B30" }]}
            onPress={() => addTestLog("error")}
          >
            <Text style={styles.miniButtonText}>Error</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logContainer}>
          {filteredLogs.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.colors.subText }]}>
              No logs found
            </Text>
          ) : (
            filteredLogs.slice(-10).map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text
                    style={[styles.logLevel, { color: getLogColor(log.level) }]}
                  >
                    {log.level.toUpperCase()}
                  </Text>
                  <Text
                    style={[styles.logTime, { color: theme.colors.subText }]}
                  >
                    {formatTimestamp(log.timestamp)}
                  </Text>
                </View>
                <Text style={[styles.logMessage, { color: theme.colors.text }]}>
                  {log.message}
                </Text>
              </View>
            ))
          )}
        </View>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  testButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  miniTestButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  miniButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  logContainer: {
    maxHeight: 250,
  },
  logItem: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  logLevel: {
    fontSize: 12,
    fontWeight: "600",
  },
  logTime: {
    fontSize: 10,
  },
  logMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
    paddingVertical: 20,
  },
  statusCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
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
    marginHorizontal: 20,
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
    marginHorizontal: 20,
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
