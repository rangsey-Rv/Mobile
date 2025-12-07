// app/Profile.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Switch,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";
import { signOut } from "../lib/appwrite";

const ProfileScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();
  const { notes } = useNotes();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            setUser(null);
            router.replace("/SignIn");
          } catch (error) {
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings page coming soon!");
  };

  const handleHelp = () => {
    Alert.alert("Help", "Help and support coming soon!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = (user as any)?.username || (user as any)?.name || "Student";
  const userEmail = user?.email || "student@example.com";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={30} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Profile
        </Text>
        <TouchableOpacity onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Info */}
        <View
          style={[styles.profileCard, { backgroundColor: theme.colors.card }]}
        >
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {userName}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.subText }]}>
              {userEmail}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.editButton, { borderColor: theme.colors.primary }]}
            onPress={handleEditProfile}
          >
            <Text
              style={[styles.editButtonText, { color: theme.colors.primary }]}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {notes.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
              Notes Created
            </Text>
          </View>

          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              5
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
              Courses Enrolled
            </Text>
          </View>

          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              12
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subText }]}>
              Quizzes Taken
            </Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preferences
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
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={theme.dark ? "#fff" : "#f4f3f4"}
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
              trackColor={{ false: "#767577", true: theme.colors.primary }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push("/NotesList")}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="document-text"
                size={20}
                color={theme.colors.text}
              />
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                My Notes
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={handleSettings}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="settings" size={20} color={theme.colors.text} />
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Settings
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.subText}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={handleHelp}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="help-circle"
                size={20}
                color={theme.colors.text}
              />
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.subText}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: "#FF6B6B" }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

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
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: SPACING,
    paddingBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
