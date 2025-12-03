// app/(tabs)/Homescreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "../../lib/appwrite";

const { width, height } = Dimensions.get("window");

const SPACING = 16;
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;

// Responsive card sizing based on device width
const getCardDimensions = () => {
  if (isSmallDevice) {
    // 2 cards per row for small devices
    return {
      width: (width - SPACING * 3) / 2,
      cardsPerRow: 2,
    };
  } else if (isMediumDevice) {
    // 2 cards per row for medium devices
    return {
      width: (width - SPACING * 3) / 2,
      cardsPerRow: 2,
    };
  } else {
    // 3 cards per row for larger devices
    return {
      width: (width - SPACING * 4) / 3,
      cardsPerRow: 3,
    };
  }
};

const CARD_DIMENSIONS = getCardDimensions();

const CourseCard: React.FC<{ title: string; color?: string }> = ({
  title,
  color,
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.courseCard,
        {
          backgroundColor: color || theme.colors.primary,
        },
      ]}
    >
      <Text style={styles.courseText}>{title}</Text>
    </TouchableOpacity>
  );
};

const FeatureButton: React.FC<{
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}> = ({ title, subtitle, icon, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.featureButton, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.featureIconContainer}>
        <Ionicons
          name={icon}
          size={isSmallDevice ? 24 : 28}
          color={theme.colors.text}
        />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <TouchableOpacity onPress={onPress} style={styles.letGoButton}>
          <Text style={styles.letGoText}>{subtitle}</Text>
          <Ionicons
            name="arrow-forward-outline"
            size={isSmallDevice ? 12 : 14}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <Ionicons
        name="ellipsis-vertical"
        size={isSmallDevice ? 18 : 20}
        color={theme.colors.subText}
      />
    </TouchableOpacity>
  );
};

const Homescreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, setUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      router.replace("/SignIn");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const goToGenerate = () => router.push("/AI");
  const goToQuizTime = () => router.push("/Quiz");
  const goToCreateNote = () => router.push("/NotesList");
  const goToReview = () => router.push("/ReviewNote");

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarPlaceholder} />
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              Welcome, **{user?.name || "Student"}!**
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.text}
              style={{ marginRight: 15 }}
            />
            <TouchableOpacity onPress={handleSignOut}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Buttons */}
        <View style={styles.featuresSection}>
          <FeatureButton
            title="Generate with AI"
            subtitle="let's go"
            icon="bulb-outline"
            onPress={goToGenerate}
          />
          <FeatureButton
            title="Quiz Time"
            subtitle="let's go"
            icon="timer-outline"
            onPress={goToQuizTime}
          />
          <FeatureButton
            title="Create Note"
            subtitle="+ create"
            icon="create-outline"
            onPress={goToCreateNote}
          />
          <FeatureButton
            title="Review Note"
            subtitle="+ review"
            icon="book-outline"
            onPress={goToReview}
          />
        </View>

        {/* My Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                My Courses
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.colors.subText },
                ]}
              >
                Total: 4 courses
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons
                name="create-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.coursesRow}
            contentContainerStyle={styles.coursesContent}
          >
            <CourseCard title="Intro to AI" color="#E75AB7" />
            <CourseCard title="Machine Learning" color="#6FDB6F" />
            <CourseCard title="Web Development" color="#FF6B6B" />
            <CourseCard title="Data Science" color="#4ECDC4" />
            <CourseCard title="Mobile Dev" color="#45B7D1" />
          </ScrollView>
          <TouchableOpacity style={styles.addCourseButton}>
            <Text
              style={[styles.addCourseText, { color: theme.colors.primary }]}
            >
              + join new course
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Deadlines Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Upcoming Deadlines
          </Text>
          <View
            style={[
              styles.deadlineCard,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.deadlineTitle, { color: theme.colors.text }]}>
              Essay on Newton's Law
            </Text>
            <Text
              style={[styles.deadlineSubtitle, { color: theme.colors.subText }]}
            >
              11:59 pm
            </Text>
            <Text style={[styles.dueDate, { color: theme.colors.text }]}>
              Due Date: 21/09/2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING,
    paddingTop: 30,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: isSmallDevice ? 40 : 45,
    height: isSmallDevice ? 40 : 45,
    borderRadius: isSmallDevice ? 20 : 22.5,
    backgroundColor: "#7E69C7",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  welcomeText: {
    fontSize: isSmallDevice ? 15 : 17,
    fontWeight: "400",
    flexShrink: 1, // Allow text to shrink on small screens
  },
  featuresSection: {
    marginBottom: 15,
  },
  featureButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: isSmallDevice ? 10 : 12,
    borderRadius: 15,
    marginBottom: 8,
    // shadow / elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    width: isSmallDevice ? 45 : 50,
    height: isSmallDevice ? 45 : 50,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: isSmallDevice ? 15 : 17,
    fontWeight: "700",
    marginBottom: 4,
  },
  letGoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(126, 105, 199, 0.8)",
    paddingHorizontal: isSmallDevice ? 10 : 12,
    paddingVertical: isSmallDevice ? 5 : 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  letGoText: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: "600",
    marginRight: 4,
    color: "white",
  },

  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: isSmallDevice ? 12 : 13,
  },

  coursesRow: {
    marginBottom: 8,
  },
  coursesContent: {
    paddingRight: 16,
  },

  courseCard: {
    width: 120,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  courseText: {
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 12,
    paddingHorizontal: 8,
  },

  addCourseButton: {
    alignItems: "center",
    paddingVertical: isSmallDevice ? 8 : 10,
    borderWidth: 1,
    borderColor: "#7E69C7",
    borderRadius: 8,
    borderStyle: "dashed",
    marginTop: 5,
  },
  addCourseText: {
    fontWeight: "600",
    fontSize: isSmallDevice ? 13 : 14,
  },

  deadlineCard: {
    padding: isSmallDevice ? 10 : 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#7E69C7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  deadlineTitle: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  deadlineSubtitle: {
    fontSize: isSmallDevice ? 12 : 13,
    marginBottom: 8,
  },
  dueDate: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: "600",
  },
});

export default Homescreen;
