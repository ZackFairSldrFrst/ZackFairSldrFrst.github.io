# Firebase Setup Guide for Split the Tab

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "split-the-tab")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable "Google" authentication:
   - Click on "Google"
   - Toggle "Enable"
   - Add your project support email
   - Click "Save"

## Step 3: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "Split the Tab Web")
6. Copy the configuration object

## Step 5: Update Your Configuration

Replace the Firebase configuration in `index.html` with your own:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};
```

## Step 6: Configure Google Sign-In (Optional)

If you want to use Google Sign-In:

1. In Firebase Console, go to Authentication → Sign-in method
2. Click on "Google" provider
3. Add your authorized domains:
   - For local development: `localhost`
   - For production: your domain (e.g., `yoursite.com`)
4. Save the configuration

## Step 7: Set Up Security Rules (Optional)

For production, you should set up proper Firestore security rules. For now, the test mode will work for development.

## Troubleshooting

### "auth/configuration-not-found" Error
- Make sure you've enabled Authentication in your Firebase project
- Verify your Firebase configuration is correct
- Check that your project ID matches in the configuration

### "auth/email-already-in-use" Error
- This means an account with that email already exists
- Try logging in instead of signing up

### "auth/weak-password" Error
- Firebase requires passwords to be at least 6 characters long
- Try a stronger password

### Google Sign-In Issues
- Make sure Google provider is enabled in Firebase Authentication
- Check that your domain is authorized in Google provider settings
- Ensure popups are not blocked by the browser

## Testing

1. Open your app in a browser
2. Try to sign up with a new email and password
3. Try signing in with Google
4. Check the browser console for any errors
5. Verify that the user appears in your Firebase Authentication console

## Next Steps

Once Firebase is working:
1. Set up proper Firestore security rules
2. Configure email verification (optional)
3. Set up password reset functionality
4. Add more social login providers (Facebook, Twitter, etc.)
5. Set up proper domain restrictions for production 