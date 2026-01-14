import React from 'react';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OTPScreen from '../screens/OTPScreen'
import ConfirmChangePasswordScreen from '../screens/ConfirmChangePasswordScreen'
import OTPPhone from '../screens/OTPPhone';
import OnboardAnimated from '../screens/OnboardAnimated';
import OTPLogin from '../screens/OTPLogin';
import ImageUpload from '../screens/ImageUpload';

const AuthStackNavigator = (props) => {
  const Stack = createNativeStackNavigator();
  const defaultOptions = {
    headerShown: false,
  };

  return (
    <Stack.Navigator
      //initialRouteName={onboarded == undefined  ? "OnboardAnimated" : "SignIn"}
      initialRouteName={'OnboardAnimated'}
      headerMode="none"
      screenOptions={defaultOptions}>
      <Stack.Screen name="OnboardAnimated" component={OnboardAnimated} options={{headerShown: false}}/>
      <Stack.Screen name="ImageUpload" component={ImageUpload} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="OTPLogin" component={OTPLogin} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPPhone" component={OTPPhone} />
      <Stack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="ConfirmChangePasswordScreen" component={ConfirmChangePasswordScreen} />

    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
