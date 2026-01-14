import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';

import DrawerNavigator from './DrawerNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import useAuth from '../hooks/useAuth';
import navigationService from './navigationService';

import { ZegoUIKitPrebuiltCallWaitingScreen, ZegoUIKitPrebuiltCallInCallScreen, } from '@zegocloud/zego-uikit-prebuilt-call-rn'; 

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const StackApp = createNativeStackNavigator();

export default function Routes() {
  const {isLoggedIn, user} = useAuth();

  return (
    <StackApp.Navigator
      // initialRouteName="Contact"
      headerMode="none"
      screenOptions={{
        headerShown: false,
      }}>
      {isLoggedIn ? (
        <StackApp.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
      />
      ) : (
        <StackApp.Screen
        name="AuthStackNavigator"
        component={AuthStackNavigator}
      />
      )}  
      <StackApp.Screen 
        options={{headerShown: false}} 
        name="ZegoUIKitPrebuiltCallWaitingScreen" 
        component={ZegoUIKitPrebuiltCallWaitingScreen} /> 

      <StackApp.Screen 
        options={{headerShown: false}} 
        name="ZegoUIKitPrebuiltCallInCallScreen" 
        component={ZegoUIKitPrebuiltCallInCallScreen} /> 

    </StackApp.Navigator>
  );
  
  //return isLoggedIn ? <DrawerNavigator/> : <AuthStackNavigator />;
}
