# Firebase Setup Guide for Investment Portal

This guide will help you set up Firebase for your Angular investment portal application.

## Prerequisites

- Node.js and npm installed
- Angular CLI installed
- A Google account

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "investment-portal")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication
1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Firestore Database
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database
5. Click "Done"

### Storage
1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for development
4. Select a location for your storage
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In the Firebase Console, click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "investment-portal-web")
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 4: Update Environment Files

Replace the placeholder values in the following files with your actual Firebase configuration:

### `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  }
};
```

### `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  }
};
```

## Step 5: Deploy Security Rules

1. Install Firebase CLI globally (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Firestore" and "Storage"
   - Use the existing project you created
   - Accept the default file names for rules

4. Deploy the security rules:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only storage
   ```

## Step 6: Test the Setup

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:4200`

3. Try to sign up with a new account to test the authentication

## Step 7: Production Deployment

When you're ready to deploy to production:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

## Security Considerations

1. **Update Security Rules**: The provided security rules are basic. Review and customize them based on your specific requirements.

2. **Environment Variables**: For production, consider using environment variables for sensitive configuration.

3. **Authentication**: Implement additional authentication methods as needed (Google, Facebook, etc.).

4. **Data Validation**: Add server-side validation rules in Firestore.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Firebase project settings allow your domain.

2. **Authentication Errors**: Verify that Email/Password authentication is enabled in Firebase Console.

3. **Permission Denied**: Check that your Firestore and Storage security rules are properly configured.

4. **Build Errors**: Ensure all Firebase dependencies are properly installed.

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular Fire Documentation](https://github.com/angular/angularfire)
- [Firebase Console](https://console.firebase.google.com/)

## Next Steps

1. Create authentication components (login, signup, profile)
2. Build investment management features
3. Add file upload functionality
4. Implement real-time updates
5. Add analytics and reporting features

## File Structure

```
src/
├── app/
│   ├── services/
│   │   └── firebase.service.ts    # Firebase service for all operations
│   └── guards/
│       └── auth.guard.ts          # Route protection
├── environments/
│   ├── environment.ts             # Development environment
│   └── environment.prod.ts        # Production environment
firebase.json                       # Firebase configuration
firestore.rules                     # Firestore security rules
storage.rules                       # Storage security rules
firestore.indexes.json             # Firestore indexes
```

Your Firebase setup is now complete! You can start building your investment portal features using the provided Firebase service.
