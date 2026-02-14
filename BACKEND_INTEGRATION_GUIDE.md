# Backend Integration Guide for Zego Offline Push

## Overview

This guide is intended for the backend developer. To support background and killed-state call notifications, the backend must integrate with Zego's Offline Push Notification Service (ZPNs).

## Required Backend/Admin Changes

### 1. Fresh Zego Project Setup (If access is lost)

If you are seeing "Verification Failed" on index.js login, it is recommended to create a new Zego account to ensure you have full administrative control.

1.  Sign up at [https://console.zego.im](https://console.zego.im).
2.  Create a new project (Voice & Video Call).
3.  Update the mobile app credentials in:
    *   `src/utils/Constants.ts`
    *   `KeyCenter.js`

### 2. Zego Console Configuration (Mandatory)

For the client-side ZPNs to work, you must upload the push certificates to the [Zego Admin Console](https://console.zego.im).

#### Android (FCM)
1.  Navigate to **Services → Offline Push**.
2.  Add a configuration for **Android (FCM)**.
3.  Provide the **FCM Server Key** and **Sender ID** (retrieved from your Firebase Console Project Settings).

#### iOS (APNs/VoIP)
1.  Generate a **VoIP Push Certificate (.p12)** from the Apple Developer Portal.
2.  Upload the certificate to the Zego Console under the iOS configuration.
3.  **Important:** Ensure you select **Product Type: VoIP Services**.
4.  Set the environment to **Development** (for Sandbox testing) or **Production** (for TestFlight/Store).

---

### 2. Verify Zego Console Setup

Once you have uploaded the certificates, the Mobile App (Client) will automatically:
1.  Get the FCM/APNs token from the OS.
2.  Register it with Zego's servers automatically upon Login.

You do not need to write Python code for this. Just ensure the **Console Certificates** matching the App's **Bundle ID** are correct.

When the caller initiates a call, the Zego SDK automatically handles the offline push if the callee is offline, provided the `notificationConfig` is included in the invitation.

**Note:** This is already configured in the client-side app code. No extra backend logic is needed for "sending" the push, as Zego's ZPNs handles it automatically once the tokens are registered.


The backend developer or admin must configure the following in the [Zego Admin Console](https://console.zego.im):

#### Android (FCM)
1. Navigate to **Services → Offline Push**.
2. Add a configuration for **Android (FCM)**.
3. Provide the **FCM Server Key** and **Sender ID** (retrieved from the Firebase Console).

#### iOS (APNs)
1. Generate a **VoIP Push Certificate (.p12)** from the Apple Developer Portal.
2. Upload the certificate to the Zego Console under the iOS configuration.
3. Set the environment to **Development** for testing and **Production** for the final release.

### 4. Verification

#### Test Token Registration
You can verify the integration by sending a test request to your new endpoint:
```bash
curl -X POST http://your-backend-api.com/api/register-push-token \
  -H "Content-Type: application/json" \
  -d '{
    "fcm_token": "actual_device_token",
    "platform": "android",
    "user_id": "test_user_001"
  }'
```

**Expected Success Response:**
```json
{
  "success": true,
  "data": {
    "Code": 0,
    "Message": "success"
  }
}
```

## Critical Success Factors

1.  **High Priority Pushes:** Ensure the push notifications are sent with high priority to wake the device from "Doze" mode (Android) or "Power Nap" (iOS).
2.  **Valid Certificates:** APNs certificates usually expire yearly. Ensure they are kept up to date.
3.  **Token Synchronization:** Tokens should be re-registered whenever they change (on app refresh or re-login).

## Integration Checklist (Troubleshooting)

If notifications are still not showing up, the developer must verify these 3 points:

1.  **Is the `PushRegister` API returning `Code: 0`?** 
    If not, the token is not linked to the user on Zego's side.
2.  **Is the Zego Console configured with the correct FCM Server Key?**
    FCM (Firebase Cloud Messaging) doesn't work through Zego unless the Key is provided in the Zego Admin Panel.
3.  **Is the Caller sending the `notificationConfig`?**
    The invitation must have the `resourceID` that matches the one configured in the Zego Console.
