// Appwrite configuration - UPDATE THESE VALUES WITH YOUR ACTUAL PROJECT DETAILS
export const appwriteConfig = {
  endpoint: "https://syd.cloud.appwrite.io/v1", // Your Appwrite endpoint (UPDATED!)
  platform: "com.yourcompany.final", // Update with your app package name
  projectId: "69300a35003c405e2ccc", // Your NEW Project ID (UPDATED!)
  databaseId: "693041f900265ad49e1a", // Your NEW Database ID (UPDATED!)
  userCollectionId: "users", // Your Collection ID (UPDATED!)
  storageId: "PASTE_YOUR_STORAGE_ID_HERE", // Replace with your Storage Bucket ID (optional)
};

class AppwriteService {
  account;
  databases;
  client;

  constructor() {
    // Dynamically import Appwrite to avoid module resolution errors
    try {
      const {
        Account,
        Client,
        Databases,
        ID,
        Query,
      } = require("react-native-appwrite");

      this.client = new Client();

      this.client
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setPlatform(appwriteConfig.platform);

      this.account = new Account(this.client);
      this.databases = new Databases(this.client);
    } catch (error) {
      console.error("Failed to initialize Appwrite service:", error);
      throw new Error("Appwrite SDK not available");
    }
  }

  // Auth Services
  async createUserAccount(email: string, password: string, username: string) {
    try {
      const { ID } = require("react-native-appwrite");

      const newAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        username
      );

      if (!newAccount) throw Error;

      const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;

      await this.signIn(email, password);

      const newUser = await this.databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          username: username,
          email: email,
          firstName: username,
          lastName: "", // Empty for now
          phoneNumber: "", // Empty for now
        }
      );
      return newUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAccount() {
    try {
      const currentAccount = await this.account.get();
      return currentAccount;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getCurrentUser() {
    try {
      const { Query } = require("react-native-appwrite");

      const currentAccount = await this.getAccount();
      if (!currentAccount) throw Error;

      const currentUser = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );

      if (!currentUser) throw Error;

      return currentUser.documents[0];
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }

  async signOut() {
    try {
      const session = await this.account.deleteSession("current");
      return session;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // User Profile Services
  async updateUserProfile(
    userId: string,
    updates: {
      username?: string;
      avatar?: string;
      [key: string]: any;
    }
  ) {
    try {
      const updatedUser = await this.databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId,
        updates
      );
      return updatedUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // Password Reset
  async resetPassword(email: string) {
    try {
      return await this.account.createRecovery(
        email,
        "https://yourapp.com/reset-password" // Replace with your app's reset URL
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async completePasswordReset(
    userId: string,
    secret: string,
    newPassword: string,
    confirmPassword: string
  ) {
    try {
      return await this.account.updateRecovery(
        userId,
        secret,
        newPassword,
        confirmPassword
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // Session Management
  async getAllSessions() {
    try {
      const sessions = await this.account.listSessions();
      return sessions;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteSession(sessionId: string) {
    try {
      return await this.account.deleteSession(sessionId);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteAllSessions() {
    try {
      return await this.account.deleteSessions();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // Email Verification
  async sendVerificationEmail() {
    try {
      return await this.account.createVerification(
        "https://yourapp.com/verify-email" // Replace with your app's verification URL
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async verifyEmail(userId: string, secret: string) {
    try {
      return await this.account.updateVerification(userId, secret);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

// Export the class for instantiation and a default instance for convenience
export default AppwriteService;
export const appwriteServiceInstance = new AppwriteService();
