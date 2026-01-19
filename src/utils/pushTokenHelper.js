/**
 * Helper utility to register device FCM token with backend
 * Backend must then register this token with Zego server
 */

export const registerDeviceTokenWithBackend = async (fcmToken, userId, platform) => {
    try {
        // Replace with your actual backend endpoint
        const response = await fetch('YOUR_BACKEND_URL/api/register-push-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                fcm_token: fcmToken,
                platform: platform, // 'ios' or 'android'
            }),
        });

        const result = await response.json();
        console.log('Device token registered:', result);
        return result;
    } catch (error) {
        console.error('Failed to register device token:', error);
        throw error;
    }
};

/**
 * Backend must implement this endpoint to register token with Zego:
 * 
 * POST https://rtc-api.zego.im/?Action=PushRegister
 * Headers:
 *   - AppId: YOUR_ZEGO_APP_ID
 *   - Signature: HMAC-SHA256 signature
 * 
 * Body:
 * {
 *   "AppId": YOUR_ZEGO_APP_ID,
 *   "UserId": "user123",
 *   "PushID": "fcm_token_here",
 *   "PushProvider": 1  // 1=FCM (Android), 2=APNs (iOS)
 * }
 */
