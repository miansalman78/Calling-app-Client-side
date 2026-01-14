import React from 'react';
import ContactScreen from '../screens/ContactScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileDetails from '../screens/ProfileDetails';
import AccountHome from '../screens/AccountHome';
import ProfileEdit from '../screens/ProfileEdit';
import SecurityScreen from '../screens/SecurityScreen';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import HelpScreen from '../screens/HelpScreen';
 

const AccountStackNavigator = () => {

  const Stack = createNativeStackNavigator();

  return (

  <Stack.Navigator
    initialRouteName="AccountHome"
    headerMode="none"
    screenOptions={{
      headerShown: false,
    }}>

  <Stack.Screen name="AccountHome" component={AccountHome} />
  <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
  <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
  <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
  <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
  <Stack.Screen name="HelpScreen" component={HelpScreen} />
  </Stack.Navigator>
  );

};

export default AccountStackNavigator;
