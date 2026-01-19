/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { AuthProvider } from './src/context/Auth';

import { StatusBar, useColorScheme, Text, View, Linking, NativeModules, NativeEventEmitter, PermissionsAndroid, Platform, DeviceEventEmitter } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/Routes';

import SplashScreen from 'react-native-splash-screen';
navigator.geolocation = require('@react-native-community/geolocation');
import { store } from './src/store';
import { Provider } from 'react-redux';
// Import the functions you need from the SDKs you need
import { initializeApp, apps } from 'firebase/app';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import navigationService from './src/Routes/navigationService';
import VoiceVideo from './src/screens/Voicevideo'
import Voicevideonoclass from './src/screens/Voicevideonoclass'
import { call_update_notification } from "./src/utils/videoCallFunction";
import { _deleteContact, _fetchContacts, _makeTwilioToken } from './src/utils/api';
import { sendLocalPushNotification } from './src/utils/localPushNotifications';
import OverlayPermissionModule from "videosdk-rn-android-overlay-permission";
import IncomingCall from 'react-native-incoming-call';
import PushNotification from "react-native-push-notification";

import { ZegoCallInvitationDialog, ZegoUIKitPrebuiltCallFloatingMinimizedView, } from '@zegocloud/zego-uikit-prebuilt-call-rn';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyALPemmpCYFpyPFLJzCtZi0JlK6LUTwVDk',
  authDomain: 'kalugogoa.firebaseapp.com',
  projectId: 'kalugogoa',
  storageBucket: 'kalugogoa.appspot.com',
  messagingSenderId: '108974893258',
  appId: '1:108974893258:web:28713f9d1924101a27ac33',
};

export const navigationRef = React.createRef();

const App = () => {
  const videoRef = useRef();
  const voiceRef = useRef();
  const childRef = useRef();
  const [callStatus, setcallStatus] = useState(false);
  const [callingStatus, setCallingStatus] = useState(true);
  const [callIDedS, setCallIDedS] = useState("");
  const [callers_fcm, setCallers_fcm] = useState("");
  const [tokenS, setTokenS] = useState("");
  const [isvideoS, setIsvideoS] = useState(true);
  const [usernamedS, setUsernamedS] = useState(true);
  const [opene, setOpener] = useState(false);
  let link = '';
  let room_id_remotefcm = '';
  //let callIDedS = '';
  //let tokenS = '';
  let statusS = 'connecting';
  let callAnwered = false;

  const { CalendarModule } = NativeModules;


  useEffect(() => {
    requestNotificationPermissions();
    getDeviceToken();
  }, []);

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'This app needs notification permission to show you incoming calls and messages',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        } catch (err) {
          console.warn('Notification permission error:', err);
        }
      }
    }
  };

  const getDeviceToken = async () => {
    const authStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      alert: true,
      badge: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const token = await messaging().getToken();
      console.log('Notification Token: ', token);

      // TODO: Register token with backend
      // Backend must then register this token with Zego server
      // Uncomment when backend endpoint is ready:
      /*
      try {
        await fetch('YOUR_BACKEND_URL/api/register-push-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fcm_token: token,
            platform: Platform.OS,
          }),
        });
        console.log('Token registered with backend');
      } catch (error) {
        console.error('Failed to register token:', error);
      }
      */
    }
  };

  const camAudiopermisions = async () => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
    }
  };

  //camAudiopermisions();

  const _requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: "Need permission to access microphone",
        message:
          "To run this demo we need permission to access your microphone",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
  };

  const _requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: "Need permission to access camera",
      message: "To run this demo we need permission to access your camera",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    });
  };

  useEffect(() => {

    console.log('hello');
    createLocalNotificationListeners().then(r => console.log("local push notification listeners created"));

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      //console.log('remoteMessage chat_id => ', remoteMessage.data.data.chat_id);
      if (remoteMessage != null) {

        if (remoteMessage?.data?.title == "Track Request Recieved") {
          const notificationData = {
            title: remoteMessage?.data?.title,
            message: remoteMessage?.data?.body,
            data: remoteMessage?.data,
          }
          sendLocalPushNotification(notificationData);
        }

        if (remoteMessage?.data?.title == "New Message Recieved") {
          const notificationData = {
            title: remoteMessage?.data?.title,
            message: remoteMessage?.data?.body,
            data: remoteMessage?.data,
          }
          sendLocalPushNotification(notificationData);
        }

        if (remoteMessage?.data?.title == "Missed Call") {
          const notificationData = {
            title: remoteMessage?.data?.title,
            message: remoteMessage?.data?.body,
            data: remoteMessage?.data,
          }
          sendLocalPushNotification(notificationData);
        }

        const userID = JSON.parse(remoteMessage.data.payload).invitees[0]
          .user_id;
        const userName = JSON.parse(remoteMessage.data.payload).invitees[0]
          .user_name;
        await onUserLogin(userID, userName);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log('detailonBackgroundEvent', detail);
      console.log('typeonBackgroundEvent', type);
      Linking.openURL('kalugogoaapp://').catch((err) => {
        console.log('Linking error', err);
      });
    });
  }, []);

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    let room_id = remoteMessage?.data?.room_id || '';
    let callers_fcm = remoteMessage?.data?.callers_fcm || '';
    let user = remoteMessage?.data?.user_name?.split(' ')[0] || '';
    let calluser = remoteMessage?.data?.callers_name || '';
    let voiceorvideo = remoteMessage.data.voice == 'true' ? false : true;
    let calltype = remoteMessage.data.voice == 'true' ? 'Voice' : 'Video';

    if (room_id != '') {
      console.log('Message fron firebaseListener!', remoteMessage);

      if (Platform.OS === "android") {

      }
    }
  });

  useEffect(() => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage != null) {
        const userID = JSON.parse(remoteMessage.data.payload).invitees[0]
          .user_id;
        const userName = JSON.parse(remoteMessage.data.payload).invitees[0]
          .user_name;
        await onUserLogin(userID, userName);
      }
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        if (remoteMessage != null) {
          const userID = JSON.parse(remoteMessage.data.payload).invitees[0]
            .user_id;
          const userName = JSON.parse(remoteMessage.data.payload).invitees[0]
            .user_name;
          await onUserLogin(userID, userName);
        }
      });
  }, []);

  /*const onUserLogin = async (userID, userName) => {
    console.log('initinitihdfjfbvksdbkjkddscxscsd');
    return ZegoUIKitPrebuiltCallService.init(
      590832720,
      '233db54f9ec37e98e9e9fe839232036b3e40ae62bf4aad1ea0dcfe62bdba0b80',
      userID,
      userName,
      [ZegoUIKitSignalingPlugin],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        notifyWhenAppRunningInBackgroundOrQuit: true,
        isIOSSandboxEnvironment: true,
        androidNotificationConfig: {
          channelID: 'traakme_incomingcall',
          channelName: 'traakme_incomingcall',
        },
      },
    );
  };*/

  const createLocalNotificationListeners = async () => {
    try {
      PushNotification.configure({
        // this will listen to your local push notifications on clicked 
        onNotification: (notification) => {
          console.log('called from onNotification Notification', notification);
          /*navigation.navigate('ChatScreen', {
            chat_id: notification.data.chat_id,
            selectedUser: notification.data.selectedUser,
            current_user: notification.data.current_user,
          });*/
          if (notification.data.type == 'message') {
            Linking.openURL(`kalugogoaapp://chatScreen/:${notification.data.chat_id}/:${notification.data.selectedUser}/:${notification.data.current_user}`).catch((err) => {
              console.log('Linking error', err);
            });
          }

          if (notification.data.type == 'tracker') {
            Linking.openURL(`kalugogoaapp://Tracker/:${notification.data.item}`).catch((err) => {
              console.log('Linking error', err);
            });
          }
        },
        popInitialNotification: true,
        requestPermissions: true,
      });
      PushNotification.popInitialNotification((notification) => {
        // this will listen to your local push notifications on opening app from background state
        console.log('called from Initial Notification', notification);
      });
    } catch (e) {
      console.log(e);
    }
  }

  const isDarkMode = useColorScheme() === 'dark';


  useEffect(() => {
    SplashScreen.hide();
    try {
      initializeApp(firebaseConfig);
    } catch (e) {
      console.log('already exist');
    }
    //
  });

  const linking = {
    prefixes: ['kalugogoaapp://'],
    config: {
      initialRouteName: 'SignInScreen',
      screens: {
        SignInScreen: {
          path: 'signIn'
        },
        Voicevideo: {
          path: 'chatScreen/:chat_id/:selectedUser/:current_user'
        }
      }
    }
  };

  const linkingnew = {
    prefixes: ['kalugogoaapp://'],
    config: {
      screens: {
        DrawerNavigator: {
          screens: {
            Home: {
              screens: {
                Home: {
                  screens: {
                    ChatScreen: 'chat/:sort',
                  },
                },
                Tracker: 'track/:chat_id/:selectedUser/:current_user'
              },
            },
          },
        },
      },
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  changeName = () => {
    console.log("am changing now");
    setOpener(false);
    CalendarModule.createCalendarEvent('close');
    room_id_remotefcm = '';
    callAnwered = false;
  }
  // const Drawer = createDrawerNavigator();
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <NavigationContainer ref={navigationRef} linking={linkingnew}>

            <ZegoCallInvitationDialog />
            <Routes />
            <ZegoUIKitPrebuiltCallFloatingMinimizedView />
          </NavigationContainer>

        </AuthProvider>
      </Provider>
    </>
  );
};

export default App;
