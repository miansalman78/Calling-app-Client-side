# Backend Integration Guide for Zego Offline Push

## Overview

This guide is intended for the backend developer. To support background and killed-state call notifications, the backend must integrate with Zego's Offline Push Notification Service (ZPNs).

## Required Backend Changes

### 1. Register Device Tokens with Zego

When a user logs in and the app retrieves an FCM (Android) or APNs (iOS) token, this token must be registered with Zego's servers via their REST API.

#### API Endpoint to Create on Your Backend

```
POST /api/register-push-token
```

**Request Body:**
```json
{
  "user_id": "user123",
  "fcm_token": "fcm_device_token_here",
  "platform": "android" // or "ios"
}
```

#### Backend Implementation (Python - Django/Flask Example)

If you are using Python, you can use the `requests` library to communicate with Zego's API.

```python
import hashlib
import hmac
import time
import uuid
import requests

ZEGO_APP_ID = "YOUR_ZEGO_APP_ID"
ZEGO_SERVER_SECRET = "YOUR_ZEGO_SERVER_SECRET"

def generate_zego_signature(params):
    # Sort keys alphabetically
    sorted_keys = sorted(params.keys())
    # Create query string: key1=val1&key2=val2...
    query_string = "&".join([f"{k}={params[k]}" for k in sorted_keys])
    
    # HMAC-SHA256 signature
    signature = hmac.new(
        ZEGO_SERVER_SECRET.encode('utf-8'),
        query_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return signature

def register_zego_push_token(user_id, fcm_token, platform):
    params = {
        "AppId": ZEGO_APP_ID,
        "UserId": user_id,
        "PushID": fcm_token,
        "PushProvider": 1 if platform == "android" else 2, # 1=FCM, 2=APNs
        "Timestamp": int(time.time()),
        "Nonce": str(uuid.uuid4())[:8],
    }
    
    signature = generate_zego_signature(params)
    
    headers = {
        "Content-Type": "application/json",
        "AppId": ZEGO_APP_ID,
        "Signature": signature
    }
    
    response = requests.post(
        "https://rtc-api.zego.im/?Action=PushRegister",
        json=params,
        headers=headers
    )
    
    return response.json()

# Example usage in your API view:
# result = register_zego_push_token("user123", "fcm_token_from_client", "android")
# print(result)
```

### 2. Configure Offline Push in Call Invitations

When the caller initiates a call, the Zego SDK automatically handles the offline push if the callee is offline, provided the `notificationConfig` is included in the invitation.

**Note:** This is already configured in the client-side app code. No extra backend logic is needed for "sending" the push, as Zego's ZPNs handles it automatically once the tokens are registered.

### 3. Zego Console Configuration (Mandatory)

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
