// app/Note.tsx

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
} from "react-native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../context/ThemeContext";
import { useNotes } from "../context/NotesContext";

const NoteCreationScreen: React.FC = () => {
  const { theme } = useTheme();
  const { addNote, updateNote, getNoteById } = useNotes();
  const { noteId } = useLocalSearchParams();

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Intro to AI");
  const [showCourseModal, setShowCourseModal] = useState(false);

  const isEditing = !!noteId;

  useEffect(() => {
    if (isEditing && typeof noteId === "string") {
      const note = getNoteById(noteId);
      if (note) {
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setSelectedCourse(note.course);
      }
    }
  }, [noteId, isEditing, getNoteById]);

  const handleSaveNote = async () => {
    console.log("Save button pressed");

    if (!noteTitle.trim() || !noteContent.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    console.log("Validation passed, saving note...", {
      title: noteTitle.trim(),
      content: noteContent.trim(),
      course: selectedCourse,
      isEditing,
    });

    try {
      if (isEditing && typeof noteId === "string") {
        updateNote(
          noteId,
          noteTitle.trim(),
          noteContent.trim(),
          selectedCourse
        );
        console.log("Note updated successfully");
      } else {
        addNote(noteTitle.trim(), noteContent.trim(), selectedCourse);
        console.log("Note saved successfully");
      }

      console.log("Navigating back to notes list...");
      // Navigate to notes list after saving
      router.replace("/NotesList");
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to save note");
    }
  };

  const handleBack = () => {
    router.replace("/NotesList");
  };

  const courses = [
    { name: "Intro to AI", color: "#E75AB7" },
    { name: "Machine Learning", color: "#6FDB6F" },
    { name: "Web Development", color: "#FF6B6B" },
    { name: "Data Science", color: "#4ECDC4" },
    { name: "Mobile Dev", color: "#45B7D1" },
  ];

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
            {isEditing ? "Edit Note" : "Create New Note"}
          </Text>
          <TouchableOpacity onPress={() => console.log("Settings")}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <TextInput
          style={[
            styles.titleInput,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
            },
          ]}
          placeholder="Note Title (e.g., Chapter 1 Summary)"
          placeholderTextColor={theme.colors.subText}
          value={noteTitle}
          onChangeText={setNoteTitle}
        />

        {/* Course/Metadata Section */}
        <View
          style={[styles.metaSection, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.metaLabel, { color: theme.colors.text }]}>
            Course:
          </Text>
          <TouchableOpacity
            style={styles.courseSelect}
            onPress={() => setShowCourseModal(true)}
          >
            <Text style={[styles.courseText, { color: theme.colors.primary }]}>
              {selectedCourse}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Content Input Area */}
        <TextInput
          style={[
            styles.contentInput,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
            },
          ]}
          placeholder="Start typing your lesson notes here..."
          placeholderTextColor={theme.colors.subText}
          multiline
          value={noteContent}
          onChangeText={setNoteContent}
        />

        {/* Save Button */}
        <CustomButton
          title={isEditing ? "Update Note" : "Save Note"}
          onPress={handleSaveNote}
          style={styles.saveButton}
          disabled={!noteTitle.trim() || !noteContent.trim()}
        />
      </ScrollView>

      {/* Course Selection Modal */}
      <Modal
        visible={showCourseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCourseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select Course
            </Text>
            <ScrollView style={styles.coursesList}>
              {courses.map((course, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.courseOption,
                    selectedCourse === course.name && {
                      backgroundColor: theme.colors.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    setSelectedCourse(course.name);
                    setShowCourseModal(false);
                  }}
                >
                  <View
                    style={[
                      styles.courseColorDot,
                      { backgroundColor: course.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.courseOptionText,
                      { color: theme.colors.text },
                      selectedCourse === course.name && { fontWeight: "600" },
                    ]}
                  >
                    {course.name}
                  </Text>
                  {selectedCourse === course.name && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setShowCourseModal(false)}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const SPACING = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING,
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
  },
  titleInput: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  metaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 16,
  },
  courseSelect: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseText: {
    fontSize: 16,
    marginRight: 5,
    fontWeight: "500",
  },
  contentInput: {
    flex: 1,
    minHeight: 300,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  saveButton: {
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  coursesList: {
    maxHeight: 300,
  },
  courseOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  courseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  courseOptionText: {
    fontSize: 16,
    flex: 1,
  },
  modalCloseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  modalCloseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NoteCreationScreen;
