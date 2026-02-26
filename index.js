/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidCategory } from '@notifee/react-native';

import * as ZIM from 'zego-zim-react-native';

import * as ZPNs from 'zego-zpns-react-native';

// Register background handler for Firebase Cloud Messaging
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);

    // Check if this is a Zego call invitation
    const isZegoCall = remoteMessage.data?.type === 'zego_call' ||
        remoteMessage.data?.payload ||
        remoteMessage.data?.call_id;

    if (isZegoCall) {
        // Handle incoming call notification
        const channelId = await notifee.createChannel({
            id: 'incoming_calls',
            name: 'Incoming Calls',
            importance: AndroidImportance.HIGH,
            sound: 'zego_incoming',
            vibration: true,
            vibrationPattern: [300, 500],
        });

        await notifee.displayNotification({
            title: remoteMessage.notification?.title || remoteMessage.data?.caller_name || 'Incoming Call',
            body: remoteMessage.notification?.body || 'Tap to answer',
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                    launchActivity: 'default',
                },
                category: 'call',
                fullScreenAction: {
                    id: 'incoming_call',
                },
                ongoing: true,
                autoCancel: false,
                sound: 'zego_incoming',
                vibrationPattern: [300, 500],
                actions: [
                    {
                        title: 'Answer',
                        pressAction: { id: 'answer' },
                    },
                    {
                        title: 'Decline',
                        pressAction: { id: 'decline' },
                    },
                ],
            },
            ios: {
                sound: 'zego_incoming.mp3',
                critical: true,
                criticalVolume: 1.0,
            },
        });
    } else {
        // Handle regular messages/notifications
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: remoteMessage.notification?.title || 'New Message',
            body: remoteMessage.notification?.body || 'You have a new message',
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
            },
        });
    }
});

ZegoUIKitPrebuiltCallService.useSystemCallingUI([ZIM, ZPNs]);

AppRegistry.registerComponent(appName, () => App);
