// Mock service for development when Appwrite is not configured

class MockAppwriteService {
  // Mock Auth Services
  async createUserAccount(email: string, password: string, username: string) {
    console.log("🔧 Mock: Creating user account", { email, username });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      $id: "mock-user-id-" + Date.now(),
      accountId: "mock-account-id-" + Date.now(),
      email: email,
      username: username,
      avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${username}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };
  }

  async signIn(email: string, password: string) {
    console.log("🔧 Mock: Signing in user", { email });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      $id: "mock-session-id-" + Date.now(),
      userId: "mock-user-id",
      expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
  }

  async getAccount() {
    console.log("🔧 Mock: Getting account");

    return {
      $id: "mock-account-id",
      name: "Test User",
      email: "test@example.com",
      emailVerification: true,
      registration: new Date().toISOString(),
    };
  }

  async getCurrentUser() {
    console.log("🔧 Mock: Getting current user");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      $id: "mock-user-id",
      accountId: "mock-account-id",
      email: "test@example.com",
      username: "TestUser",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=TestUser",
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };
  }

  async signOut() {
    console.log("🔧 Mock: Signing out user");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      $id: "mock-session-id",
    };
  }

  // Mock User Profile Services
  async updateUserProfile(userId: string, updates: any) {
    console.log("🔧 Mock: Updating user profile", { userId, updates });

    return {
      $id: userId,
      ...updates,
      $updatedAt: new Date().toISOString(),
    };
  }

  async getUserById(userId: string) {
    console.log("🔧 Mock: Getting user by ID", { userId });

    return {
      $id: userId,
      email: "test@example.com",
      username: "TestUser",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=TestUser",
    };
  }

  // Mock Password Reset
  async resetPassword(email: string) {
    console.log("🔧 Mock: Password reset requested for", email);

    return {
      $id: "mock-recovery-id",
      expire: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    };
  }

  async completePasswordReset(
    userId: string,
    secret: string,
    newPassword: string,
    confirmPassword: string
  ) {
    console.log("🔧 Mock: Completing password reset", { userId });

    return {
      $id: userId,
    };
  }

  // Mock Session Management
  async getAllSessions() {
    console.log("🔧 Mock: Getting all sessions");

    return {
      total: 1,
      sessions: [
        {
          $id: "mock-session-id",
          userId: "mock-user-id",
          expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };
  }

  async deleteSession(sessionId: string) {
    console.log("🔧 Mock: Deleting session", { sessionId });

    return {
      $id: sessionId,
    };
  }

  async deleteAllSessions() {
    console.log("🔧 Mock: Deleting all sessions");

    return {};
  }

  // Mock Email Verification
  async sendVerificationEmail() {
    console.log("🔧 Mock: Sending verification email");

    return {
      $id: "mock-verification-id",
      expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async verifyEmail(userId: string, secret: string) {
    console.log("🔧 Mock: Verifying email", { userId });

    return {
      $id: userId,
      emailVerification: true,
    };
  }
}

export default MockAppwriteService;
