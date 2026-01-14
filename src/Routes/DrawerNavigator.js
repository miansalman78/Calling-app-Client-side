import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomTabNavigator from '../Routes/BottomTagNavigator';
import CustomSidebarMenu from '../components/CustomDrawer'

import { AppColors , Font} from '../utils/Constants';

//Screens
import HelpScreen from '../screens/HelpScreen'
import SettingScreen from '../screens/SettingScreen'
import MyAccountScreen from '../screens/MyAccountScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen'
import VideoCallPage from '../screens/VideoCallPage';
import VoiceCallPage from '../screens/VoiceCallPage';
import PrivacyPolicy from '../screens/PrivacyPolicy'
import VoiceVideo from '../screens/Voicevideo'
import ChatScreen from '../screens/ChatScreen'

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  const defaultOptions = {
    headerShown: false,
    swipeEdgeWidth: 0,
  };
  return (
    <Drawer.Navigator initialRouteName="Home"  screenOptions={defaultOptions} drawerContentOptions={{
      activeTintColor: AppColors.primaryColor,
      itemStyle: {marginVertical: 5,fontFamily: Font.family_bold},
    }}
    // Here we are setting our custom sidebar menu
    drawerContent={(props) => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen name="Home" component={BottomTabNavigator}/>
      <Drawer.Screen name="My Account" component={MyAccountScreen}/>
      <Drawer.Screen name="Help" component={HelpScreen}/>
      <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy}/>
      {/* <Drawer.Screen name="Settings" component={SettingScreen}/> */}
      <Drawer.Screen name="Change Password" component={ChangePasswordScreen}/>
      <Drawer.Screen name="ChatScreen" component={ChatScreen} options={{
        drawerItemStyle: {display:"none"} }} />
      {/* <Drawer.Screen name="VideoCallPage" component={VideoCallPage}/>
      <Drawer.Screen name="VoiceCallPage" component={VoiceCallPage}/> */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
