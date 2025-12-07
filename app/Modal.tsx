// app/Modal.tsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NotesContext";

interface Course {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  progress?: number;
  estimatedTime?: string;
}

const Modal: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { notes, addNote } = useNotes();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  // Quick Note Modal States
  const [quickNoteTitle, setQuickNoteTitle] = useState("");
  const [quickNoteContent, setQuickNoteContent] = useState("");
  const [quickNoteCourse, setQuickNoteCourse] = useState<Course | null>(null);
  const [showCourseSelector, setShowCourseSelector] = useState(false);

  const courses: Course[] = [
    {
      id: "1",
      title: "Intro to AI",
      description: "Learn the fundamentals of artificial intelligence",
      color: "#4A90E2",
      icon: "brain",
      progress: 65,
      estimatedTime: "2 hours",
    },
    {
      id: "2",
      title: "Web Development",
      description: "Build modern web applications",
      color: "#7ED321",
      icon: "code",
      progress: 40,
      estimatedTime: "4 hours",
    },
    {
      id: "3",
      title: "Data Science",
      description: "Analyze and visualize data effectively",
      color: "#F5A623",
      icon: "stats-chart",
      progress: 80,
      estimatedTime: "3 hours",
    },
    {
      id: "4",
      title: "Mobile Development",
      description: "Create cross-platform mobile apps",
      color: "#BD10E0",
      icon: "phone-portrait",
      progress: 25,
      estimatedTime: "5 hours",
    },
  ];

  const modalActions = [
    {
      id: "quick-note",
      title: "Quick Note",
      description: "Quickly capture your thoughts",
      icon: "create",
      color: theme.colors.primary,
      action: () => openQuickNoteModal(),
    },
    {
      id: "course-overview",
      title: "Course Overview",
      description: "View all available courses",
      icon: "library",
      color: "#4A90E2",
      action: () => showCourseOverview(),
    },
    {
      id: "settings",
      title: "Quick Settings",
      description: "Adjust app preferences",
      icon: "settings",
      color: "#FF9500",
      action: () => showQuickSettings(),
    },
    {
      id: "help",
      title: "Help & Support",
      description: "Get help or contact support",
      icon: "help-circle",
      color: "#34C759",
      action: () => showHelp(),
    },
  ];

  useEffect(() => {
    // Auto-show modal when component mounts
    showModal();
  }, []);

  const showModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      router.back();
    });
  };

  const openQuickNoteModal = () => {
    setSelectedAction("quick-note");
  };

  const showCourseOverview = () => {
    setSelectedAction("course-overview");
  };

  const showQuickSettings = () => {
    setSelectedAction("settings");
    Alert.alert("Quick Settings", "This would open quick settings panel");
  };

  const showHelp = () => {
    setSelectedAction("help");
    Alert.alert("Help & Support", "Help documentation would appear here");
  };

  const handleQuickNoteSave = () => {
    if (!quickNoteTitle.trim()) {
      Alert.alert("Error", "Please enter a title for your note");
      return;
    }

    if (!quickNoteCourse) {
      Alert.alert("Error", "Please select a course");
      return;
    }

    const newNote = {
      title: quickNoteTitle,
      content: quickNoteContent,
      course: quickNoteCourse.title,
    };

    addNote(quickNoteTitle, quickNoteContent, quickNoteCourse.title);

    // Reset form
    setQuickNoteTitle("");
    setQuickNoteContent("");
    setQuickNoteCourse(null);
    setSelectedAction(null);

    Alert.alert("Success", "Note saved successfully!", [
      {
        text: "View All Notes",
        onPress: () => {
          hideModal();
          router.replace("/ReviewNote");
        },
      },
      {
        text: "OK",
        onPress: () => hideModal(),
      },
    ]);
  };

  return (
    <RNModal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={hideModal}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.overlayTouch}
          activeOpacity={1}
          onPress={hideModal}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.colors.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {!selectedAction && (
            <>
              <View style={styles.modalHeader}>
                <View
                  style={[styles.modalHandle, { backgroundColor: "#E5E5E5" }]}
                />
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Quick Actions
                </Text>
              </View>

              <ScrollView style={styles.modalContent}>
                {modalActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.actionItem,
                      { borderBottomColor: "#E5E5E5" },
                    ]}
                    onPress={action.action}
                  >
                    <View style={styles.actionLeft}>
                      <View
                        style={[
                          styles.actionIcon,
                          { backgroundColor: action.color },
                        ]}
                      >
                        <Ionicons
                          name={action.icon as any}
                          size={24}
                          color="white"
                        />
                      </View>
                      <View style={styles.actionInfo}>
                        <Text
                          style={[
                            styles.actionTitle,
                            { color: theme.colors.text },
                          ]}
                        >
                          {action.title}
                        </Text>
                        <Text
                          style={[
                            styles.actionDescription,
                            { color: theme.colors.subText },
                          ]}
                        >
                          {action.description}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.subText}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {selectedAction === "quick-note" && (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.quickNoteContainer}
            >
              <View
                style={[
                  styles.quickNoteHeader,
                  { borderBottomColor: "#E5E5E5" },
                ]}
              >
                <TouchableOpacity onPress={() => setSelectedAction(null)}>
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
                <Text
                  style={[styles.quickNoteTitle, { color: theme.colors.text }]}
                >
                  Quick Note
                </Text>
                <TouchableOpacity onPress={handleQuickNoteSave}>
                  <Text
                    style={[styles.saveButton, { color: theme.colors.primary }]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.quickNoteContent}>
                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>
                    Title
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.colors.card,
                        borderColor: "#E5E5E5",
                        color: theme.colors.text,
                      },
                    ]}
                    placeholder="Enter note title..."
                    placeholderTextColor={theme.colors.subText}
                    value={quickNoteTitle}
                    onChangeText={setQuickNoteTitle}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>
                    Course
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.courseSelector,
                      {
                        backgroundColor: theme.colors.card,
                        borderColor: "#E5E5E5",
                      },
                    ]}
                    onPress={() => setShowCourseSelector(true)}
                  >
                    {quickNoteCourse ? (
                      <View style={styles.selectedCourse}>
                        <View
                          style={[
                            styles.courseColorDot,
                            { backgroundColor: quickNoteCourse.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.courseName,
                            { color: theme.colors.text },
                          ]}
                        >
                          {quickNoteCourse.title}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.coursePlaceholder,
                          { color: theme.colors.subText },
                        ]}
                      >
                        Select a course
                      </Text>
                    )}
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={theme.colors.subText}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.label, { color: theme.colors.text }]}>
                    Content
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        backgroundColor: theme.colors.card,
                        borderColor: "#E5E5E5",
                        color: theme.colors.text,
                      },
                    ]}
                    placeholder="Write your note content..."
                    placeholderTextColor={theme.colors.subText}
                    value={quickNoteContent}
                    onChangeText={setQuickNoteContent}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              </ScrollView>

              {/* Course Selector Modal */}
              <RNModal
                visible={showCourseSelector}
                transparent
                animationType="slide"
                onRequestClose={() => setShowCourseSelector(false)}
              >
                <View style={styles.courseSelectorOverlay}>
                  <View
                    style={[
                      styles.courseSelectorModal,
                      { backgroundColor: theme.colors.card },
                    ]}
                  >
                    <View
                      style={[
                        styles.courseSelectorHeader,
                        { borderBottomColor: "#E5E5E5" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.courseSelectorTitle,
                          { color: theme.colors.text },
                        ]}
                      >
                        Select Course
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowCourseSelector(false)}
                      >
                        <Ionicons
                          name="close"
                          size={24}
                          color={theme.colors.text}
                        />
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.courseList}>
                      {courses.map((course) => (
                        <TouchableOpacity
                          key={course.id}
                          style={[
                            styles.courseItem,
                            { borderBottomColor: "#E5E5E5" },
                          ]}
                          onPress={() => {
                            setQuickNoteCourse(course);
                            setShowCourseSelector(false);
                          }}
                        >
                          <View style={styles.courseInfo}>
                            <View
                              style={[
                                styles.courseColorDot,
                                { backgroundColor: course.color },
                              ]}
                            />
                            <View style={styles.courseDetails}>
                              <Text
                                style={[
                                  styles.courseTitle,
                                  { color: theme.colors.text },
                                ]}
                              >
                                {course.title}
                              </Text>
                              <Text
                                style={[
                                  styles.courseDescription,
                                  { color: theme.colors.subText },
                                ]}
                              >
                                {course.description}
                              </Text>
                            </View>
                          </View>
                          {quickNoteCourse?.id === course.id && (
                            <Ionicons
                              name="checkmark"
                              size={20}
                              color={theme.colors.primary}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </RNModal>
            </KeyboardAvoidingView>
          )}

          {selectedAction === "course-overview" && (
            <View style={styles.courseOverviewContainer}>
              <View
                style={[
                  styles.overviewHeader,
                  { borderBottomColor: "#E5E5E5" },
                ]}
              >
                <TouchableOpacity onPress={() => setSelectedAction(null)}>
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
                <Text
                  style={[styles.overviewTitle, { color: theme.colors.text }]}
                >
                  Course Overview
                </Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.courseOverviewContent}>
                {courses.map((course) => (
                  <View
                    key={course.id}
                    style={[
                      styles.courseCard,
                      { backgroundColor: theme.colors.card },
                    ]}
                  >
                    <View style={styles.courseCardHeader}>
                      <View style={styles.courseCardLeft}>
                        <Ionicons
                          name={course.icon as any}
                          size={24}
                          color={course.color}
                        />
                        <View style={styles.courseCardInfo}>
                          <Text
                            style={[
                              styles.courseCardTitle,
                              { color: theme.colors.text },
                            ]}
                          >
                            {course.title}
                          </Text>
                          <Text
                            style={[
                              styles.courseCardDescription,
                              { color: theme.colors.subText },
                            ]}
                          >
                            {course.description}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.estimatedTime,
                          { color: theme.colors.subText },
                        ]}
                      >
                        {course.estimatedTime}
                      </Text>
                    </View>

                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              backgroundColor: course.color,
                              width: `${course.progress || 0}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.progressText,
                          { color: theme.colors.subText },
                        ]}
                      >
                        {course.progress}%
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouch: {
    flex: 1,
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
    minHeight: screenHeight * 0.4,
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalContent: {
    paddingHorizontal: 20,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Quick Note Styles
  quickNoteContainer: {
    flex: 1,
  },
  quickNoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  quickNoteTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  quickNoteContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 20,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  courseSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedCourse: {
    flexDirection: "row",
    alignItems: "center",
  },
  courseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  courseName: {
    fontSize: 16,
  },
  coursePlaceholder: {
    fontSize: 16,
  },
  // Course Selector Modal
  courseSelectorOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  courseSelectorModal: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.6,
    borderRadius: 12,
  },
  courseSelectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  courseSelectorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  courseList: {
    maxHeight: screenHeight * 0.4,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  courseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  courseDetails: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  // Course Overview Styles
  courseOverviewContainer: {
    flex: 1,
  },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  courseOverviewContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  courseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  courseCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  courseCardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  courseCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  courseCardDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  estimatedTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E5E5",
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    minWidth: 30,
    textAlign: "right",
  },
});

export default Modal;
