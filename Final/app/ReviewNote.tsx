// app/ReviewNote.tsx

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 1. FIXED PATH: Assumes the file is now in 'app/' and 'context/' is a sibling folder
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";

// Sample data structure for a Note Card
interface NoteData {
  id: string;
  course: string;
  title: string;
  date: string;
  summary: string;
}

const sampleNotes: NoteData[] = [
  {
    id: "1",
    course: "Intro to AI",
    title: "Introduction to AI",
    date: "08/10/2025",
    summary:
      "AI stands for Artificial Intelligence. The usage of AI is now really popular.",
  },
  {
    id: "2",
    course: "Intro to AI",
    title: "Introduction to AI",
    date: "08/10/2025",
    summary:
      "AI stands for Artificial Intelligence. The usage of AI is now really popular.",
  },
  {
    id: "3",
    course: "Intro to AI",
    title: "Introduction to AI",
    date: "08/10/2025",
    summary:
      "AI stands for Artificial Intelligence. The usage of AI is now really popular.",
  },
  {
    id: "4",
    course: "Intro to AI",
    title: "Introduction to AI",
    date: "09/10/2025",
    summary:
      "AI stands for Artificial Intelligence. The usage of AI is now really popular.",
  },
  {
    id: "5",
    course: "Intro to AI",
    title: "Introduction to AI",
    date: "09/10/2025",
    summary:
      "AI stands for Artificial Intelligence. The usage of AI is now really popular.",
  },
];

// Define constants needed for layout, placed here for cleaner code execution
const SPACING = 16;
const CARD_SIZE = 70;

const NoteCard: React.FC<{ note: NoteData; onPress: () => void }> = ({
  note,
  onPress,
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.noteCardIcon}>
        <Ionicons name="document-text-outline" size={28} color="#FFF" />
      </View>
      <View style={styles.noteCardContent}>
        <Text style={styles.noteCardTitle}>{note.title}</Text>
        <Text style={styles.noteCardDate}>{note.date}</Text>
        <Text style={styles.noteCardSummary} numberOfLines={2}>
          {note.summary}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ReviewNoteScreen: React.FC = () => {
  const { theme } = useTheme();

  const goToNoteDetail = (note: NoteData) => {
    // Navigate to the Note Detail screen (you should create a file app/Note.tsx)
    router.push({
      pathname: "/Note",
      params: { noteId: note.id, noteTitle: note.title },
    });
  };

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  // Filter to get unique courses for "My Courses" section
  const uniqueCourses = [
    ...new Set(sampleNotes.map((note) => note.course)),
  ].slice(0, 4);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={30} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Note</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* My Courses Section (Similar to Home screen) */}
        <View style={styles.courseSection}>
          <Text style={styles.courseSectionTitle}>My Courses</Text>
          <Text style={styles.courseSectionSubtitle}>
            Total: {uniqueCourses.length} courses
          </Text>
          <View style={styles.courseChipsContainer}>
            {uniqueCourses.map((course, index) => {
              const colors = ["#E75AB7", "#6FDB6F", "#7E69C7", "#FF9B73"];
              return (
                <View
                  key={index}
                  style={[
                    styles.courseChip,
                    { backgroundColor: colors[index % colors.length] },
                  ]}
                >
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color="white"
                    style={{ position: "absolute", top: 5, right: 5 }}
                  />
                  <Text style={styles.courseChipText}>{course}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Latest Note Section */}
        <View style={styles.latestNoteSection}>
          <Text style={styles.latestNoteTitle}>Latest Note</Text>
          {sampleNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPress={() => goToNoteDetail(note)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Removed the duplicate SPACING and CARD_SIZE definitions here
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING,
    paddingTop: 50,
    paddingBottom: 20,
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

  // Courses
  courseSection: {
    marginBottom: 30,
  },
  courseSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  courseSectionSubtitle: {
    fontSize: 13,
    color: "#A1A1A1",
    marginBottom: 12,
  },
  courseChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 10,
  },
  courseChip: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  courseChipText: {
    color: "#FFF",
    fontWeight: "700",
    textAlign: "center",
    padding: 8,
    fontSize: 13,
  },

  // Notes List
  latestNoteSection: {
    marginBottom: 20,
  },
  latestNoteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 10,
  },
  noteCard: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  noteCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  noteCardContent: {
    flex: 1,
  },
  noteCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  noteCardDate: {
    fontSize: 12,
    color: "#A1A1A1",
    position: "absolute",
    top: 0,
    right: 0,
  },
  noteCardSummary: {
    fontSize: 13,
    color: "#D1D1D1",
    marginTop: 5,
  },
});

export default ReviewNoteScreen;
