// app/NotesList.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useNotes } from "../context/NotesContext";

const NotesListScreen: React.FC = () => {
  const { theme } = useTheme();
  const { notes, deleteNote } = useNotes();

  const handleBack = () => {
    router.replace("/(tabs)/Homescreen");
  };

  const handleCreateNote = () => {
    router.push("/Note");
  };

  const handleEditNote = (noteId: string) => {
    router.push(`/Note?noteId=${noteId}`);
  };

  const handleDeleteNote = async (noteId: string, noteTitle: string) => {
    console.log("Delete button pressed for note:", noteId, noteTitle);

    const result = await new Promise<boolean>((resolve) => {
      Alert.alert(
        "Delete Note",
        `Are you sure you want to delete "${noteTitle}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              console.log("Delete cancelled");
              resolve(false);
            },
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              console.log("Delete confirmed");
              resolve(true);
            },
          },
        ],
        { cancelable: false }
      );
    });

    if (result) {
      console.log("Deleting note:", noteId);
      deleteNote(noteId);
      console.log("Note deleted successfully");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const renderNoteItem = ({ item: note }: { item: any }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: theme.colors.card }]}
      onPress={() => handleEditNote(note.id)}
    >
      <View style={styles.noteContent}>
        <Text
          style={[styles.noteTitle, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {note.title}
        </Text>
        <Text
          style={[styles.notePreview, { color: theme.colors.subText }]}
          numberOfLines={2}
        >
          {note.content}
        </Text>
        <View style={styles.noteMetadata}>
          <Text
            style={[
              styles.courseBadge,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            {note.course}
          </Text>
          <Text style={[styles.noteDate, { color: theme.colors.subText }]}>
            {formatDate(note.updatedAt)}
          </Text>
        </View>
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
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
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
          My Notes
        </Text>
        <TouchableOpacity onPress={handleCreateNote}>
          <Ionicons name="add" size={30} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Notes Count */}
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: theme.colors.subText }]}>
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </Text>
      </View>

      {/* Notes List */}
      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="document-outline"
            size={64}
            color={theme.colors.subText}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No notes yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.subText }]}>
            Tap the + button to create your first note
          </Text>
          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleCreateNote}
          >
            <Text style={styles.createButtonText}>Create Note</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  statsContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: 10,
  },
  statsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: 20,
  },
  noteCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  noteContent: {
    flex: 1,
    paddingRight: 12,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notePreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  noteMetadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseBadge: {
    fontSize: 12,
    fontWeight: "500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: "white",
    overflow: "hidden",
  },
  noteDate: {
    fontSize: 12,
  },
  noteActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContainer: {
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotesListScreen;
