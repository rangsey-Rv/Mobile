import React, { useState, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useNotes } from "../../context/NotesContext";

export default function Search() {
  const { theme } = useTheme();
  const { notes } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Machine Learning",
    "React Native",
    "Data Science",
    "AI Fundamentals",
  ]);

  const courseColors: { [key: string]: string } = {
    "Intro to AI": "#4A90E2",
    "Web Development": "#7ED321",
    "Data Science": "#F5A623",
    "Mobile Development": "#BD10E0",
    "Machine Learning": "#9013FE",
    Default: "#6C7B7F",
  };

  // Get unique courses
  const uniqueCourses = useMemo(() => {
    return ["All", ...new Set(notes.map((note) => note.course))];
  }, [notes]);

  // Filter notes based on search and course
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.course.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCourse !== "All") {
      filtered = filtered.filter((note) => note.course === selectedCourse);
    }

    return filtered;
  }, [notes, searchQuery, selectedCourse]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const getCourseColor = (course: string): string => {
    return courseColors[course] || courseColors.Default;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleNotePress = (noteId: string) => {
    router.push(`/Note?id=${noteId}&edit=true`);
  };

  const renderNote = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: theme.colors.card }]}
      onPress={() => handleNotePress(item.id)}
    >
      <View style={styles.noteHeader}>
        <View
          style={[
            styles.courseBadge,
            { backgroundColor: getCourseColor(item.course) },
          ]}
        >
          <Text style={styles.courseBadgeText}>{item.course}</Text>
        </View>
        <Text style={[styles.noteDate, { color: theme.colors.subText }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>

      <Text
        style={[styles.noteTitle, { color: theme.colors.text }]}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      <Text
        style={[styles.notePreview, { color: theme.colors.subText }]}
        numberOfLines={3}
      >
        {item.content}
      </Text>

      <View style={styles.noteFooter}>
        <Text style={[styles.wordCount, { color: theme.colors.subText }]}>
          {item.content.split(" ").length} words
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.colors.subText}
        />
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.recentItem, { backgroundColor: theme.colors.card }]}
      onPress={() => handleRecentSearch(item)}
    >
      <Ionicons name="time-outline" size={16} color={theme.colors.subText} />
      <Text style={[styles.recentText, { color: theme.colors.text }]}>
        {item}
      </Text>
      <Ionicons
        name="arrow-up-outline"
        size={16}
        color={theme.colors.subText}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Search Notes
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="search" size={20} color={theme.colors.subText} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search notes, courses, or content..."
          placeholderTextColor={theme.colors.subText}
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
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
      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: theme.colors.text }]}>
          Filter by course:
        </Text>
        <FlatList
          horizontal
          data={uniqueCourses}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedCourse === item
                      ? theme.colors.primary
                      : theme.colors.card,
                },
              ]}
              onPress={() => setSelectedCourse(item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedCourse === item ? "white" : theme.colors.text,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Content */}
      {!searchQuery.trim() && filteredNotes.length === 0 ? (
        // Recent Searches
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Searches
            </Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text
                  style={[styles.clearButton, { color: theme.colors.primary }]}
                >
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {recentSearches.length > 0 ? (
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearch}
              keyExtractor={(item, index) => `recent-${index}`}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyRecent}>
              <Ionicons
                name="time-outline"
                size={48}
                color={theme.colors.subText}
              />
              <Text style={[styles.emptyText, { color: theme.colors.subText }]}>
                No recent searches
              </Text>
            </View>
          )}
        </View>
      ) : (
        // Search Results
        <View style={styles.resultsSection}>
          <Text style={[styles.resultsHeader, { color: theme.colors.text }]}>
            {searchQuery.trim()
              ? `Found ${filteredNotes.length} result${
                  filteredNotes.length !== 1 ? "s" : ""
                } for "${searchQuery}"`
              : `Showing ${filteredNotes.length} note${
                  filteredNotes.length !== 1 ? "s" : ""
                } in ${selectedCourse}`}
          </Text>

          {filteredNotes.length > 0 ? (
            <FlatList
              data={filteredNotes}
              renderItem={renderNote}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.notesList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyResults}>
              <Ionicons
                name="document-outline"
                size={64}
                color={theme.colors.subText}
              />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                No notes found
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: theme.colors.subText }]}
              >
                Try adjusting your search or filter criteria
              </Text>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => router.push("/Note")}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.createButtonText}>Create Note</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const SPACING = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: SPACING,
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: SPACING,
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
  recentSection: {
    flex: 1,
    paddingHorizontal: SPACING,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    fontSize: 14,
    fontWeight: "500",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  emptyRecent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: SPACING,
    marginBottom: 16,
  },
  notesList: {
    paddingHorizontal: SPACING,
    paddingBottom: 20,
  },
  noteCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 22,
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
  wordCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  emptyResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING * 2,
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
