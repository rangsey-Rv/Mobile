// Main Appwrite service entry point
import { appwriteConfig } from "./appwriteService";
import MockAppwriteService from "./mockAppwriteService";

// Check if Appwrite is configured
const isAppwriteConfigured = appwriteConfig.projectId !== "YOUR_PROJECT_ID";

let appwriteService: any;

if (isAppwriteConfigured) {
  try {
    // Import the real service class and create an instance
    const { default: AppwriteService } = require("./appwriteService");
    appwriteService = new AppwriteService();
    console.log("✅ Using real Appwrite service");
  } catch (error) {
    console.warn("⚠️ Appwrite not available, using mock service");
    appwriteService = new MockAppwriteService();
  }
} else {
  console.log("🔧 Appwrite not configured, using mock service");
  appwriteService = new MockAppwriteService();
}

// Export convenient functions that use the service
export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  return await appwriteService.createUserAccount(email, password, username);
};

export const signIn = async (email: string, password: string) => {
  return await appwriteService.signIn(email, password);
};

export const getCurrentUser = async () => {
  return await appwriteService.getCurrentUser();
};

export const signOut = async () => {
  return await appwriteService.signOut();
};

export const getAccount = async () => {
  return await appwriteService.getAccount();
};

export const updateUserProfile = async (userId: string, updates: any) => {
  return await appwriteService.updateUserProfile(userId, updates);
};

export const resetPassword = async (email: string) => {
  return await appwriteService.resetPassword(email);
};

export const sendVerificationEmail = async () => {
  return await appwriteService.sendVerificationEmail();
};

// Export the service instance for direct access if needed
export { appwriteService };

// Export config for other files that might need it
export { appwriteConfig } from "./appwriteService";
