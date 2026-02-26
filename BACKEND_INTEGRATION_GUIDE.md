# Backend Integration Guide for Zego Offline Push

## Overview

This guide is intended for the backend developer. To support background and killed-state call notifications, the backend must integrate with Zego's Offline Push Notification Service (ZPNs).

## Required Backend/Admin Changes

### 1. Fresh Zego Project Setup (If access is lost)

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

## Python / Django Implementation Guide

Since a Python developer is available, here is the exact logic to be added to the Django backend.

### 1. Requirements
Ensure you have `requests` installed:
```bash
pip install requests
```

### 2. Device Token Registration Logic (`views.py`)

This function should be called inside your `update_device_token` view.

```python
import requests
import hashlib
import time
import json

def register_with_zego(user_id, fcm_token, platform):
    """
    Registers the device token with Zego RTC Server.
    platform: 'android' or 'ios'
    """
    APP_ID = 508512713
    SERVER_SECRET = "YOUR_ZEGO_SERVER_SECRET" # Get from Zego Console
    
    # 1. Determine Provider
    # 1 for FCM (Android), 2 for APNs (iOS)
    provider = 1 if platform.lower() == 'android' else 2
    
    # 2. Prepare Parameters
    timestamp = int(time.time())
    # Note: Check Zego Admin Console for the exact Signature format required for your project type.
    # Standard format: md5(AppId + ServerSecret + Timestamp)
    sig_string = f"{APP_ID}{SERVER_SECRET}{timestamp}"
    signature = hashlib.md5(sig_string.encode('utf-8')).hexdigest()
    
    url = f"https://rtc-api.zego.im/?Action=PushRegister&AppId={APP_ID}&Signature={signature}&Timestamp={timestamp}"
    
    payload = {
        "AppId": APP_ID,
        "UserId": str(user_id),
        "PushID": fcm_token,
        "PushProvider": provider
    }
    
    try:
        response = requests.post(url, json=payload)
        result = response.json()
        print(f"Zego Registration Result: {result}")
        return result
    except Exception as e:
        print(f"Zego Registration Error: {e}")
        return None
```

### 3. Zego Console Configuration (CRITICAL)

The Python developer must verify these settings in the [Zego Console](https://console.zego.im):

1.  **Resource ID:** Ensure you have a resource ID named `ZegoUIKit` or `zego_call` configured.
2.  **FCM Server Key:** The backend CANNOT trigger pushes unless the Firebase Server Key is uploaded to Zego Project Settings -> Offline Push.

---

## Next Steps for the Python Developer

1.  **Update Endpoint:** Integrate the `register_with_zego` function into the Django API.
2.  **Verify Signature:** Double-check the Zego Server API documentation for any updates to the `Signature` algorithm.
3.  **Test:** Use the `curl` command to verify the token is being accepted by Zego.

## Conclusion

With a Python developer on board, we can bridge this gap immediately. The client-side (React Native) is already sending the tokens; we just need the backend to forward them to Zego. 2 weeks is more than enough time to wrap this up.
