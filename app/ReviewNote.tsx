// app/ReviewNote.tsx

import React, { useState, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useNotes } from "../context/NotesContext";

interface CourseColor {
  [key: string]: string;
}

const ReviewNoteScreen: React.FC = () => {
  const { theme } = useTheme();
  const { notes, deleteNote, getNoteById } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"date" | "course" | "title">("date");
  const [refreshing, setRefreshing] = useState(false);

  const courseColors: CourseColor = {
    "Intro to AI": "#4A90E2",
    "Web Development": "#7ED321",
    "Data Science": "#F5A623",
    "Mobile Development": "#BD10E0",
    "Machine Learning": "#9013FE",
    Default: "#6C7B7F",
  };

  // Get unique courses for filtering
  const uniqueCourses = useMemo(() => {
    const courses = ["All", ...new Set(notes.map((note) => note.course))];
    return courses;
  }, [notes]);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse =
        selectedCourse === "All" || note.course === selectedCourse;
      return matchesSearch && matchesCourse;
    });

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "course":
          return a.course.localeCompare(b.course);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, searchQuery, selectedCourse, sortBy]);

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  const handleCreateNote = () => {
    router.push("/Note");
  };

  const handleEditNote = (noteId: string) => {
    router.push(`/Note?id=${noteId}&edit=true`);
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${noteTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteNote(noteId);
            Alert.alert("Success", "Note deleted successfully");
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getCourseColor = (course: string): string => {
    return courseColors[course] || courseColors.Default;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPreviewText = (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const renderNoteCard = ({ item: note }: { item: any }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: theme.colors.card }]}
      onPress={() => handleEditNote(note.id)}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteLeft}>
          <View
            style={[
              styles.courseBadge,
              { backgroundColor: getCourseColor(note.course) },
            ]}
          >
            <Text style={styles.courseBadgeText}>{note.course}</Text>
          </View>
          <Text style={[styles.noteDate, { color: theme.colors.subText }]}>
            {formatDate(note.createdAt)}
          </Text>
        </View>
        <View style={styles.noteActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleEditNote(note.id);
            }}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteNote(note.id, note.title);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.noteTitle, { color: theme.colors.text }]}>
        {note.title}
      </Text>

      <Text style={[styles.notePreview, { color: theme.colors.subText }]}>
        {getPreviewText(note.content)}
      </Text>

      <View style={styles.noteFooter}>
        <View style={styles.noteStats}>
          <Text style={[styles.wordCount, { color: theme.colors.subText }]}>
            {note.content.split(" ").length} words
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.colors.subText}
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="document-text-outline"
        size={64}
        color={theme.colors.subText}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {searchQuery || selectedCourse !== "All"
          ? "No notes found"
          : "No notes yet"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.subText }]}>
        {searchQuery || selectedCourse !== "All"
          ? "Try adjusting your search or filter"
          : "Start creating your first note to see it here"}
      </Text>
      {!searchQuery && selectedCourse === "All" && (
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleCreateNote}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Create First Note</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
          My Notes ({filteredAndSortedNotes.length})
        </Text>
        <TouchableOpacity onPress={handleCreateNote}>
          <Ionicons name="add" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View
          style={[styles.searchBar, { backgroundColor: theme.colors.card }]}
        >
          <Ionicons name="search" size={20} color={theme.colors.subText} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search notes..."
            placeholderTextColor={theme.colors.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.subText}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Course Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {uniqueCourses.map((course) => (
            <TouchableOpacity
              key={course}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedCourse === course
                      ? theme.colors.primary
                      : theme.colors.card,
                },
              ]}
              onPress={() => setSelectedCourse(course)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedCourse === course ? "white" : theme.colors.text,
                  },
                ]}
              >
                {course}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort Options */}
        <View style={styles.sortSection}>
          <Text style={[styles.sortLabel, { color: theme.colors.subText }]}>
            Sort by:
          </Text>
          <View style={styles.sortButtons}>
            {[
              { key: "date", label: "Date" },
              { key: "course", label: "Course" },
              { key: "title", label: "Title" },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortButton,
                  {
                    backgroundColor:
                      sortBy === option.key
                        ? theme.colors.primary
                        : "transparent",
                    borderColor: "#E5E5E5",
                  },
                ]}
                onPress={() => setSortBy(option.key as any)}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    {
                      color:
                        sortBy === option.key ? "white" : theme.colors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Notes List */}
      <FlatList
        data={filteredAndSortedNotes}
        renderItem={renderNoteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Floating Action Button */}
      {filteredAndSortedNotes.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateNote}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const SPACING = 16;
const { width: screenWidth } = Dimensions.get("window");

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
  searchSection: {
    paddingHorizontal: SPACING,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  notesList: {
    paddingHorizontal: SPACING,
    paddingBottom: 100, // Account for FAB
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  noteLeft: {
    flex: 1,
  },
  courseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  courseBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  noteDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  noteActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 24,
  },
  notePreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: SPACING,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ReviewNoteScreen;
