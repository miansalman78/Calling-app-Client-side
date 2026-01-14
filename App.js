/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import { NewAppScreen } from '@react-native/new-app-screen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, {useEffect, useRef, useState} from 'react';
import {AuthProvider} from './src/context/Auth';
import {StatusBar, useColorScheme, Text, View, Linking, NativeModules, NativeEventEmitter, PermissionsAndroid} from 'react-native';
import {NavigationContainer, createStackNavigator} from '@react-navigation/native';
import Routes from './src/Routes';

import SplashScreen from 'react-native-splash-screen';
navigator.geolocation = require('@react-native-community/geolocation');
import {store} from './src/store';
import {Provider} from 'react-redux';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import navigationService from './src/Routes/navigationService';
import VoiceVideo from './src/screens/Voicevideo'
import Voicevideonoclass from './src/screens/Voicevideonoclass'
import {call_update_notification} from "./src/utils/videoCallFunction";
import {_deleteContact, _fetchContacts, _makeTwilioToken} from './src/utils/api';
import {sendLocalPushNotification} from './src/utils/localPushNotifications';
import {DeviceEventEmitter, Platform} from 'react-native';
import PushNotification from "react-native-push-notification";
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ZegoCallInvitationDialog, ZegoUIKitPrebuiltCallFloatingMinimizedView, } from '@zegocloud/zego-uikit-prebuilt-call-rn'; 
import {  Recaptcha, RecaptchaAction } from '@google-cloud/recaptcha-enterprise-react-native';
import {getDBConnection, createTable, getLocalData, updateHobies, addHobies, checkInsert} from "./src/utils/helper";
import { RECAPTCHA_SITE_KEY } from "./src/utils/Constants";
import { MyContext } from './src/context/MyContext';

const firebaseConfig = {
  apiKey: 'AIzaSyALPemmpCYFpyPFLJzCtZi0JlK6LUTwVDk',
  authDomain: 'kalugogoa.firebaseapp.com',
  databaseURL: "https://kalugogoa-default-rtdb.firebaseio.com",
  projectId: 'kalugogoa',
  storageBucket: 'kalugogoa.appspot.com',
  messagingSenderId: '108974893258',
  appId: '1:108974893258:web:28713f9d1924101a27ac33',
  measurementId: "G-ZM2S34XW1Z"
};


export const navigationRef = React.createRef();

function App() {
  
  const [recaptchaClient, setRecaptchaClient] =useState(null);
  
  useEffect(() => {
    SplashScreen.hide();
    //_requestNotificationsPermission();
    _requestContactPermission();
    camAudiopermisions();
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('initializeApp =>', app);
    //const analytics = getAnalytics(app);
    getDeviceToken();
    if (Platform.OS === "ios"){
      requestUserPermission();
    }
    initinitcapcha();
  },[]);

  const initinitcapcha = async() => {
      try {
        const client = await Recaptcha.fetchClient(RECAPTCHA_SITE_KEY);
        setRecaptchaClient(client);
        console.log('client =>', client)
        //return client;
      } catch (error) {
        console.log(`${error.code} ${error.message.substring(0, 15)}`);
        //return null;
      }
  }
  
  const getDeviceToken = async () => {
    const token = await messaging().getToken();
      console.log('Notification Token: ', token);
  };

  const camAudiopermisions = async () => {
    if (Platform.OS === "android") {
      await _requestAudioPermission();
      await _requestCameraPermission();
      await _requestWriteStoragePermission();
      await _requestReadStoragePermission();
    }
  };

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

  const _requestReadStoragePermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
      title: "Need permission to read files",
      message: "To run this app we need permission to create files",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    });
  };

  const _requestWriteStoragePermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
      title: "Need permission to create files",
      message: "To run this app we need permission to create files",
      buttonNegative: "Cancel",
      buttonPositive: "OK",
    });
  };

  const _requestContactPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Allow Access Contact?',
          message:
            'allow this app to read contact information',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted');
        //this.getPhoneNumber();
      } else {
        console.log('denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const dboperations = async() => {
    const db = await getDBConnection();
    createTable(db);
    const updateTodos = { user: '83', count: 1 };
    updateHobies(db, updateTodos);
    const fcmdata = { user: '7', count: 2 };
  }
    useEffect(() => {
  
      console.log('hello');
      
      //dboperations();
      createLocalNotificationListeners().then(r => console.log("local push notification listeners created"));
  
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('remoteMessage =>', remoteMessage);
        //console.log('remoteMessage chat_id => ', remoteMessage.data.data.chat_id);
        if (remoteMessage != null) {    
            const notificationData = {
              title: remoteMessage?.notification.title,
              message: remoteMessage?.notification.body,
              data: remoteMessage?.data
            }
            sendLocalPushNotification(notificationData);
        }
      });
      return unsubscribe;
    }, []);
  
    useEffect(() => {
      return notifee.onBackgroundEvent(async ({type, detail}) => {
        console.log('detailonBackgroundEvent', detail);
        console.log('typeonBackgroundEvent', type);
        Linking.openURL('kalugogoaapp://').catch((err)=>{
            console.log('Linking error', err);
          });
      });
    }, []);
  
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message fron firebaseListener!', remoteMessage);
      if (Platform.OS === "android") {
          
      }
  });
  
    useEffect(() => {
      messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );
        
        if(remoteMessage != null){
          if(remoteMessage.data.type == 'message'){
            let chat_id = remoteMessage?.data.chat_id
            let selectedUser = {
              id: remoteMessage?.data.selectedUserID,
              email: remoteMessage?.data.selectedUserEmail,
              fullname: remoteMessage?.data.selectedUserFullname,
              device_token: remoteMessage?.data.selectedUserDevice
            }
            let currentUser = {
              id: remoteMessage?.data.current_userID,
              fullname: remoteMessage?.data.current_userFullname
            }
            Linking.openURL(`kalugogoaapp://chat/${remoteMessage.data.type}/${chat_id}/${selectedUser.id}/${selectedUser.email}/${selectedUser.fullname}/${selectedUser.device_token}/${currentUser.id}/${currentUser.fullname}`).catch((err)=>{
                console.log('Linking error', err);
            });
            console.log(chat_id, selectedUser, currentUser);
          }
  
          if(remoteMessage.data.type == 'tracker'){
            Linking.openURL(`kalugogoaapp://track/${remoteMessage.data.type}/${remoteMessage.data.device_token}/${remoteMessage.data.email}/${remoteMessage.data.fullname}/${remoteMessage.data.id}/${remoteMessage.data.phone_number}/${remoteMessage.data.room_id}/${remoteMessage.data.user}`).catch((err)=>{
                console.log('Linking error', err);
            });
          }
  
        }
        
      });
  
      messaging()
        .getInitialNotification()
        .then(async remoteMessage => {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          if(remoteMessage != null){
            if(remoteMessage.data.type == 'message'){
              let chat_id = remoteMessage?.data.chat_id
              let selectedUser = {
                id: remoteMessage?.data.selectedUserID,
                email: remoteMessage?.data.selectedUserEmail,
                fullname: remoteMessage?.data.selectedUserFullname,
                device_token: remoteMessage?.data.selectedUserDevice
              }
              let currentUser = {
                id: remoteMessage?.data.current_userID,
                fullname: remoteMessage?.data.current_userFullname
              }
              Linking.openURL(`kalugogoaapp://chat/${remoteMessage.data.type}/${chat_id}/${selectedUser.id}/${selectedUser.email}/${selectedUser.fullname}/${selectedUser.device_token}/${currentUser.id}/${currentUser.fullname}`).catch((err)=>{
                  console.log('Linking error', err);
              });
              console.log(chat_id, selectedUser, currentUser);
            }
  
            if(remoteMessage.data.type == 'tracker'){
              Linking.openURL(`kalugogoaapp://track/${remoteMessage.data.type}/${remoteMessage.data.device_token}/${remoteMessage.data.email}/${remoteMessage.data.fullname}/${remoteMessage.data.id}/${remoteMessage.data.phone_number}/${remoteMessage.data.room_id}/${remoteMessage.data.user}`).catch((err)=>{
                  console.log('Linking error', err);
              });
            }
  
          }
          
        });
    }, []);

    const createLocalNotificationListeners = async () => {
      try {
        PushNotification.configure({
        // this will listen to your local push notifications on clicked 
          onNotification: (notification) => {
            console.log('called from onNotification Notification', notification);
            
            if(notification.data.type == 'message'){
              let chat_id = notification?.data.chat_id
              let selectedUser = {
                id: notification?.data.selectedUserID,
                email: notification?.data.selectedUserEmail,
                fullname: notification?.data.selectedUserFullname,
                device_token: notification?.data.selectedUserDevice
              }
              let currentUser = {
                id: notification?.data.current_userID,
                fullname: notification?.data.current_userFullname
              }
              Linking.openURL(`kalugogoaapp://chat/${notification.data.type}/${chat_id}/${selectedUser.id}/${selectedUser.email}/${selectedUser.fullname}/${selectedUser.device_token}/${currentUser.id}/${currentUser.fullname}`).catch((err)=>{
                  console.log('Linking error', err);
              });
              console.log(chat_id, selectedUser, currentUser);
            }
    
            if(notification.data.type == 'tracker'){
              Linking.openURL(`kalugogoaapp://track/${notification.data.type}/${notification.data.device_token}/${notification.data.email}/${notification.data.fullname}/${notification.data.id}/${notification.data.phone_number}/${notification.data.room_id}/${notification.data.user}`).catch((err)=>{
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
    

  const linkingold = {
    prefixes:['kalugogoaapp://'],
    config:{
          screens:{
            DrawerNavigator: {
            screens: {
              Help: 'help',
              Home:{
                screens: {
                  SeeMe: 'see'
                },
              }
            },
          },
            ZegoUIKitPrebuiltCallInCallScreen:'call',
            AuthStackNavigator:'auth'
          }
      }
  };
 
  const linkingnew = {
    prefixes:['kalugogoaapp://'],
    config:{
      screens:{
        initialRouteName: 'DrawerNavigator',
        DrawerNavigator:{
          screens: {
            Home: {
              screens: {
                Tracker: 'track/:type/:device_token/:email/:fullname/:id/:phone_number/:room_id/:user',
                Account: {
                  screens: {
                    AccountHome: 'accountHome',
                  },
                },
                Home: {
                  screens: {
                    ChatScreen: 'chat/:type/:chat_id/:selectedUserID/:selectedUserEmail/:selectedUserFullname/:selectedUserDevice/:current_userID/:current_userFullname',
                    Contacts: 'contacts',
                  },
                }
              },
            }
          },
        },
      }
    }
  };

  const sharedData = { recaptchaClient: recaptchaClient };

  return (
    <Provider store={store}>
      <AuthProvider>
        <MyContext.Provider value={sharedData}>
         
          <NavigationContainer ref={navigationRef} linking={linkingnew}>
            
            <ZegoCallInvitationDialog /> 
            <Routes /> 
            <ZegoUIKitPrebuiltCallFloatingMinimizedView /> 
          </NavigationContainer>

          </MyContext.Provider>
        </AuthProvider>
      </Provider>
  );
}


export default App;
