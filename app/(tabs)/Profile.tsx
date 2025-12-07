import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNotes } from "../../context/NotesContext";

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { notes } = useNotes();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/SignIn");
          } catch (error) {
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  const navigateToScreen = (screenName: string) => {
    router.push(`/${screenName}` as any);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const totalWords = notes.reduce(
    (sum, note) => sum + note.content.split(" ").length,
    0
  );
  const uniqueCourses = new Set(notes.map((note) => note.course)).size;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Profile
        </Text>
        <TouchableOpacity onPress={() => navigateToScreen("Debug")}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View
        style={[styles.profileCard, { backgroundColor: theme.colors.card }]}
      >
        <View style={styles.profileInfo}>
          <View
            style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
          >
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name || "User"}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.subText }]}>
              {user?.email || "user@example.com"}
            </Text>
            <TouchableOpacity
              style={[styles.editButton, { borderColor: theme.colors.border }]}
            >
              <Text
                style={[styles.editButtonText, { color: theme.colors.text }]}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Your Statistics
        </Text>
        <View style={styles.statsGrid}>
          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Ionicons name="document-text" size={24} color="#4A90E2" />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {notes.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
              Total Notes
            </Text>
          </View>

          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Ionicons name="library" size={24} color="#7ED321" />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {uniqueCourses}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
              Courses
            </Text>
          </View>

          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Ionicons name="text" size={24} color="#F5A623" />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {totalWords}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
              Words Written
            </Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Settings
        </Text>

        <View
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={20} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={theme.dark}
            onValueChange={toggleTheme}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>

        <View
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons
              name="notifications"
              size={20}
              color={theme.colors.text}
            />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>

        <View
          style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="sync" size={20} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              Auto Sync
            </Text>
          </View>
          <Switch
            value={autoSyncEnabled}
            onValueChange={setAutoSyncEnabled}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigateToScreen("Debug")}
        >
          <Ionicons name="bug" size={20} color={theme.colors.text} />
          <Text style={[styles.actionText, { color: theme.colors.text }]}>
            Debug Console
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.subText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
          onPress={() =>
            Alert.alert("Help", "Help documentation would appear here")
          }
        >
          <Ionicons name="help-circle" size={20} color={theme.colors.text} />
          <Text style={[styles.actionText, { color: theme.colors.text }]}>
            Help & Support
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.subText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={20} color="#FF3B30" />
          <Text style={[styles.actionText, { color: "#FF3B30" }]}>
            Sign Out
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const SPACING = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  profileCard: {
    marginHorizontal: SPACING,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  editButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statsSection: {
    marginHorizontal: SPACING,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  settingsSection: {
    marginHorizontal: SPACING,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  actionsSection: {
    marginHorizontal: SPACING,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  signOutButton: {
    marginTop: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#A1A1A1",
  },
});
