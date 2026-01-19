# Quick Start Guide - Background Call Notifications

## Client-Side Implementation Status ✅

The mobile application has been fully updated to support background and killed-state calls. These changes include:

1.  **Auth.js:** Enabled Zego's offline push monitoring (`notifyWhenAppRunningInBackgroundOrQuit: true`).
2.  **index.js:** Implemented a robust background message handler that detects incoming calls, enables Full-Screen Intent (Android 10+), and adds Answer/Decline action buttons.
3.  **App.js:** Integrated the logic to retrieve the FCM device token and prepared the registration flow for the backend.
4.  **Backend Integration Guide:** Created a technical document for the backend team to complete the setup.

## Required Next Steps

### Step 1: Backend Integration
**Provide the `BACKEND_INTEGRATION_GUIDE.md` file to your backend developer.**
The backend must implement a simple API endpoint to register the user's device token with Zego's servers. Without this step, Zego cannot "find" the device when the app is closed.

### Step 2: Zego Console Configuration
1.  Log in to the [Zego Admin Console](https://console.zego.im).
2.  Go to **Services → Offline Push**.
3.  **For Android:** Upload the `google-services.json` or configure the FCM Server Key and Sender ID.
4.  **For iOS:** Upload the VoIP Push Certificate (.p12) generated from the Apple Developer Portal.

### Step 3: Activation
Once the backend API is ready, navigate to `App.js` (lines 124–136) and uncomment the code that sends the token to your backend:

```javascript
// Uncomment this block once your backend API is deployed
try {
  await fetch('YOUR_BACKEND_URL/api/register-push-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fcm_token: token,
      platform: Platform.OS,
    }),
  });
  console.log('Token registered successfully');
} catch (error) {
  console.error('Registration failed:', error);
}
```

## How to Test

### Test 1: Foreground State (App is Open)
- **User A:** Keep the app open on the Home screen.
- **User B:** Initiate a call to User A.
- **Goal:** The call screen should appear immediately.

### Test 2: Background State (App is Minimized)
- **User A:** Press the Home button (minimize the app).
- **User B:** Initiate a call to User A.
- **Goal:** A notification should appear with Answer/Decline buttons and a ringtone should play.

### Test 3: Killed State (App is Closed)
- **User A:** Force-close the app from the "Recent Apps" menu.
- **User B:** Initiate a call to User A.
- **Goal:** The device should wake up, show a notification/full-screen UI, and play the ringtone.

## Troubleshooting

*   **No notification when app is closed:** Check if the backend has successfully registered the token with Zego’s `PushRegister` API.
*   **Notification appears but screen doesn't pop up:** Ensure "Display over other apps" and Full-Screen notification permissions are allowed on the Android device settings.
*   **iOS specific issues:** Verify that the `isIOSSandboxEnvironment` setting in `Auth.js` matches your certificate type (Sandbox vs. Production).

## Summary
The client-side app is **100% ready**. The feature will become fully functional as soon as the **Backend API** is deployed and the **Zego Console certificates** are configured.
