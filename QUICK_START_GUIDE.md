# Quick Start Guide - Background Call Notifications

## Client-Side Implementation Status ✅

The mobile application has been fully updated to support background and killed-state calls. These changes include:

1.  **Auth.js:** Enabled Zego's offline push monitoring (`notifyWhenAppRunningInBackgroundOrQuit: true`).
2.  **index.js:** Implemented a robust background message handler that detects incoming calls, enables Full-Screen Intent (Android 10+), and adds Answer/Decline action buttons.
3.  **App.js:** Integrated the logic to retrieve the FCM device token and prepared the registration flow for the backend.
4.  **Backend Integration Guide:** Created a technical document for the backend team to complete the setup.

### Step 1: Fresh Zego Project Setup (Recommended)
If you cannot access the old Zego account, please create a new one to regain full control.

1.  **Create Account:** Sign up at [https://console.zego.im](https://console.zego.im).
2.  **Create Project:** Select 'Voice & Video Call' and use the 'UIKits' option.
3.  **Update Credentials:** Open the following files in the mobile app and replace the `appID` and `appSign` with your new project's credentials:
    *   `src/utils/Constants.ts`
    *   `KeyCenter.js`

### 2. Zego Console Configuration (Mandatory)
**This is the ONLY step required to enable background ringing.**

1.  Log in to the [Zego Admin Console](https://console.zego.im).
2.  Go to **Services → Offline Push**.
3.  **For Android:** Upload the `google-services.json` or configure the FCM Server Key and Sender ID.
4.  **For iOS:** Upload the VoIP Push Certificate (.p12) generated from the Apple Developer Portal.

**Correction:** The Mobile App (Client) SDK **automatically registers** the device token once these certificates are configured. You do **NOT** need to implement any "PushRegister" API on your backend.

### 3. Testing

#### Test 1: Foreground State (App is Open)
- **User A:** Keep the app open on the Home screen.
- **User B:** Initiate a call to User A.
- **Goal:** The call screen should appear immediately.

#### Test 2: Background State (App is Minimized)
- **User A:** Press the Home button (minimize the app).
- **User B:** Initiate a call to User A.
- **Goal:** A notification should appear with Answer/Decline buttons and a ringtone should play.

#### Test 3: Killed State (App is Closed)
- **User A:** Force-close the app from the "Recent Apps" menu.
- **User B:** Initiate a call to User A.
- **Goal:** The device should wake up, show a notification/full-screen UI, and play the ringtone.

## Troubleshooting

*   **No notification when app is closed:** Usually means the **FCM Key** or **VoIP Certificate** in Zego Console is incorrect or expired.
*   **Notification appears but screen doesn't pop up:** Ensure "Display over other apps" and Full-Screen notification permissions are allowed on the Android device settings.
*   **iOS specific issues:** Verify that the `isIOSSandboxEnvironment` setting in `Auth.js` matches your certificate type (Sandbox vs. Production).

## Summary
The client-side app is **100% ready**. The feature will become fully functional as soon as the **Zego Console certificates** are configured. No backend code changes are required.
