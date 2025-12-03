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
import { signIn, getCurrentUser } from "../lib/appwrite";

const SignIn: React.FC = () => {
  const { theme } = useTheme();
  const { setUser, setIsLoading } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🔐 Starting sign in with:", form.email);
      await signIn(form.email, form.password);
      console.log("✅ Sign in successful");

      const user = await getCurrentUser();
      console.log("👤 Current user:", user);
      setUser(user);

      Alert.alert("Success", "User signed in successfully");
      console.log("🏠 Navigating to homescreen...");
      router.replace("/(tabs)/Homescreen");
    } catch (error) {
      console.error("❌ SignIn Error:", error);
      Alert.alert("Error", error.message || "An error occurred during sign in");
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
            Welcome Back!
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.subText }]}>
            Sign in to your account
          </Text>
        </View>

        <View style={styles.form}>
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
                autoComplete="password"
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

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => {
              /* Handle forgot password */
            }}
          >
            <Text
              style={[
                styles.forgotPasswordText,
                { color: theme.colors.primary },
              ]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, { color: theme.colors.subText }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/SignUp")}>
              <Text
                style={[styles.signUpLink, { color: theme.colors.primary }]}
              >
                {" "}
                Sign Up
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signInButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 16,
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignIn;
