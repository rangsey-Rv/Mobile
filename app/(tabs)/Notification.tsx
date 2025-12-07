import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "reminder";
  timestamp: Date;
  isRead: boolean;
  actionText?: string;
  onAction?: () => void;
}

export default function Notification() {
  const { theme } = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "New Quiz Available",
      message:
        'A new quiz for "Intro to AI" course is now available. Test your knowledge!',
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      actionText: "Take Quiz",
      onAction: () => router.push("/Quiz"),
    },
    {
      id: "2",
      title: "Note Saved Successfully",
      message:
        'Your note "Machine Learning Basics" has been saved successfully.',
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
    },
    {
      id: "3",
      title: "Study Reminder",
      message:
        'Don\'t forget to review your notes for "Web Development" course.',
      type: "reminder",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      isRead: true,
      actionText: "Review Notes",
      onAction: () => router.push("/ReviewNote"),
    },
    {
      id: "4",
      title: "Course Update",
      message:
        'New content has been added to "Data Science" course. Check it out!',
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      actionText: "View Course",
    },
    {
      id: "5",
      title: "Backup Reminder",
      message:
        "It's been a while since you backed up your notes. Consider syncing your data.",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const clearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return "information-circle";
      case "success":
        return "checkmark-circle";
      case "warning":
        return "warning";
      case "reminder":
        return "time";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "info":
        return "#4A90E2";
      case "success":
        return "#7ED321";
      case "warning":
        return "#F5A623";
      case "reminder":
        return "#BD10E0";
      default:
        return theme.colors.primary;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: theme.colors.card,
          borderLeftColor: getNotificationColor(item.type),
          opacity: item.isRead ? 0.7 : 1,
        },
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={getNotificationColor(item.type)}
          />
          <View style={styles.notificationContent}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.notificationTitle, { color: theme.colors.text }]}
              >
                {item.title}
              </Text>
              {!item.isRead && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.notificationMessage,
                { color: theme.colors.subText },
              ]}
            >
              {item.message}
            </Text>
            <Text
              style={[styles.notificationTime, { color: theme.colors.subText }]}
            >
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Ionicons name="close" size={16} color={theme.colors.subText} />
        </TouchableOpacity>
      </View>

      {item.actionText && item.onAction && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: getNotificationColor(item.type) },
          ]}
          onPress={item.onAction}
        >
          <Text style={styles.actionButtonText}>{item.actionText}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Notifications
        </Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <View
              style={[styles.badge, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
          <TouchableOpacity onPress={clearAll}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      {unreadCount > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[
              styles.markAllButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={markAllAsRead}
          >
            <Ionicons name="checkmark-done" size={16} color="white" />
            <Text style={styles.markAllButtonText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-outline"
            size={64}
            color={theme.colors.subText}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No notifications
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.subText }]}>
            You're all caught up! New notifications will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  actionBar: {
    paddingHorizontal: SPACING,
    marginBottom: 16,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  markAllButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: SPACING,
    paddingBottom: 20,
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationHeader: {
    padding: 16,
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingRight: 32,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  actionButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
