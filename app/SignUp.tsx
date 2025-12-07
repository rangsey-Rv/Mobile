import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { createUser, signIn, signOut, getCurrentUser } from "../lib/appwrite";

const SignUp: React.FC = () => {
  const { theme } = useTheme();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    console.log("🔥 handleSignUp function called!");

    // Clear any existing session first
    try {
      await signOut();
      console.log("🚪 Existing session cleared");
    } catch (error) {
      console.log("ℹ️ No existing session to clear");
    }

    if (
      form.username === "" ||
      form.email === "" ||
      form.password === "" ||
      form.confirmPassword === ""
    ) {
      console.log("❌ Validation failed: Missing fields");
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      console.log("❌ Validation failed: Passwords do not match");
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      console.log("❌ Validation failed: Password too short");
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    console.log("✅ Validation passed, starting submission...");
    setIsSubmitting(true);

    try {
      console.log("🚀 Starting user creation with:", {
        email: form.email,
        username: form.username,
      });
      const result = await createUser(form.email, form.password, form.username);
      console.log("✅ User created successfully:", result);

      // Get current user (should be automatically signed in by createUser)
      const user = await getCurrentUser();
      console.log("👤 Current user:", user);
      setUser(user);

      console.log("🏠 Navigating to homescreen...");
      router.replace("/(tabs)/Homescreen");

      Alert.alert("Success", "Account created successfully");
    } catch (error) {
      console.error("❌ SignUp Error:", error);
      Alert.alert(
        "Error",
        (error as Error).message || "An error occurred during sign up"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.subText }]}>
            Join us to get started
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Username
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={theme.colors.subText}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={form.username}
                onChangeText={(e) => setForm({ ...form, username: e })}
                placeholder="Enter your username"
                placeholderTextColor={theme.colors.subText}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={theme.colors.subText}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={form.email}
                onChangeText={(e) => setForm({ ...form, email: e })}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.subText}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.colors.subText}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={form.password}
                onChangeText={(e) => setForm({ ...form, password: e })}
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.subText}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.subText}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Confirm Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={theme.colors.subText}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={form.confirmPassword}
                onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                placeholder="Confirm your password"
                placeholderTextColor={theme.colors.subText}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="new-password"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.colors.subText}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.signUpButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signUpButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: theme.colors.subText }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/SignIn")}>
              <Text
                style={[styles.signInLink, { color: theme.colors.primary }]}
              >
                {" "}
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  signUpButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUp;
