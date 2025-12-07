// app/Search.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useNotes } from "../context/NotesContext";

const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(notes);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const courses = [
    "Intro to AI",
    "Machine Learning",
    "Web Development",
    "Data Science",
    "Mobile Dev",
  ];
  const recentSearches = [
    "machine learning",
    "javascript",
    "react native",
    "algorithms",
  ];

  useEffect(() => {
    filterNotes();
  }, [searchQuery, selectedFilter, notes]);

  const filterNotes = () => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.course.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by course
    if (selectedFilter !== "all") {
      filtered = filtered.filter((note) => note.course === selectedFilter);
    }

    setFilteredNotes(filtered);
  };

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  const handleNotePress = (noteId: string) => {
    router.push(`/Note?noteId=${noteId}`);
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedFilter("all");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const renderNoteItem = ({ item: note }: { item: any }) => (
    <TouchableOpacity
      style={[styles.noteItem, { backgroundColor: theme.colors.card }]}
      onPress={() => handleNotePress(note.id)}
    >
      <View style={styles.noteHeader}>
        <Text
          style={[styles.noteTitle, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {note.title}
        </Text>
        <Text style={[styles.noteDate, { color: theme.colors.subText }]}>
          {formatDate(note.updatedAt)}
        </Text>
      </View>
      <Text
        style={[styles.notePreview, { color: theme.colors.subText }]}
        numberOfLines={2}
      >
        {note.content}
      </Text>
      <Text
        style={[styles.courseBadge, { backgroundColor: theme.colors.primary }]}
      >
        {note.course}
      </Text>
    </TouchableOpacity>
  );

  const renderFilterChip = (filter: string, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterChip,
        {
          backgroundColor:
            selectedFilter === filter
              ? theme.colors.primary
              : theme.colors.card,
        },
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterChipText,
          {
            color: selectedFilter === filter ? "white" : theme.colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
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
          Search
        </Text>
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch}>
            <Text style={[styles.clearButton, { color: theme.colors.primary }]}>
              Clear
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[styles.searchBar, { backgroundColor: theme.colors.card }]}
        >
          <Ionicons name="search" size={20} color={theme.colors.subText} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search notes, courses, topics..."
            placeholderTextColor={theme.colors.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.subText}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {renderFilterChip("all", "All")}
        {courses.map((course) => renderFilterChip(course, course))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content}>
        {!searchQuery && filteredNotes.length === 0 ? (
          // Empty state / Recent searches
          <View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Recent Searches
              </Text>
              {recentSearches.map((query, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => handleRecentSearch(query)}
                >
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={theme.colors.subText}
                  />
                  <Text
                    style={[
                      styles.recentSearchText,
                      { color: theme.colors.text },
                    ]}
                  >
                    {query}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Quick Actions
              </Text>
              <TouchableOpacity
                style={[
                  styles.quickAction,
                  { backgroundColor: theme.colors.card },
                ]}
                onPress={() => router.push("/Note")}
              >
                <Ionicons
                  name="add-circle"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.quickActionText, { color: theme.colors.text }]}
                >
                  Create New Note
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickAction,
                  { backgroundColor: theme.colors.card },
                ]}
                onPress={() => router.push("/AI")}
              >
                <Ionicons name="bulb" size={24} color={theme.colors.primary} />
                <Text
                  style={[styles.quickActionText, { color: theme.colors.text }]}
                >
                  Generate with AI
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : filteredNotes.length === 0 ? (
          // No results
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={64} color={theme.colors.subText} />
            <Text style={[styles.noResultsTitle, { color: theme.colors.text }]}>
              No results found
            </Text>
            <Text
              style={[
                styles.noResultsSubtitle,
                { color: theme.colors.subText },
              ]}
            >
              Try searching for different keywords or check your spelling
            </Text>
          </View>
        ) : (
          // Search results
          <View>
            <Text
              style={[styles.resultsCount, { color: theme.colors.subText }]}
            >
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "result" : "results"} found
            </Text>
            <FlatList
              data={filteredNotes}
              renderItem={renderNoteItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.resultsList}
            />
          </View>
        )}
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
  clearButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: SPACING,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: 16,
    gap: 8,
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  recentSearchText: {
    fontSize: 16,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  resultsList: {
    gap: 8,
  },
  noteItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  noteDate: {
    fontSize: 12,
  },
  notePreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
    color: "white",
    overflow: "hidden",
  },
});

export default SearchScreen;
