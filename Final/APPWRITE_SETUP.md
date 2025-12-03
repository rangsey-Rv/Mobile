# Appwrite Setup Instructions

## 1. Create Appwrite Account

1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up for a free account
3. Create a new project

## 2. Get Project Configuration

1. In your Appwrite console, go to your project settings
2. Copy the following values:
   - **Project ID**: Found in project settings
   - **Endpoint**: Usually `https://cloud.appwrite.io/v1`

## 3. Create Database and Collections

1. Go to "Databases" in your Appwrite console
2. Create a new database
3. Create a collection called "users" with the following attributes:
   - `accountId` (String, required)
   - `email` (Email, required)
   - `username` (String, required)

## 4. Configure Authentication

1. Go to "Auth" in your Appwrite console
2. Enable "Email/Password" authentication method

## 5. Update Configuration

Update the file `lib/appwrite.ts` with your actual values:

```typescript
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1", // Your Appwrite endpoint
  platform: "com.yourcompany.final", // Your app package name (replace with your actual package name)
  projectId: "YOUR_ACTUAL_PROJECT_ID", // Replace with your project ID
  databaseId: "YOUR_ACTUAL_DATABASE_ID", // Replace with your database ID
  userCollectionId: "YOUR_ACTUAL_COLLECTION_ID", // Replace with your users collection ID
  storageId: "YOUR_ACTUAL_STORAGE_ID", // Replace with your storage bucket ID (optional for now)
};
```

## 6. Test Authentication

1. Run your app
2. Try signing up with a test account
3. Check if the user appears in your Appwrite console under "Auth" → "Users"

## Features Included:

- ✅ User registration (Sign Up)
- ✅ User authentication (Sign In)
- ✅ Session management
- ✅ Sign out functionality
- ✅ Protected routes (redirects to sign in if not authenticated)
- ✅ Loading states and error handling
- ✅ Responsive design matching your app theme

## Next Steps:

1. Configure your Appwrite project with the settings above
2. Update the configuration values in `lib/appwrite.ts`
3. Test the authentication flow
4. Optionally add forgot password functionality
5. Add profile management features
