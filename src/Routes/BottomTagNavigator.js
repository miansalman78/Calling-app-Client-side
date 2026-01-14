import React,{useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {StyleSheet, View, Text, Image, TouchableOpacity,PermissionsAndroid, Platform} from 'react-native';

import ContactStackNavigator from './ContactStackNavigator'
import AuthStackNavigator from './AuthStackNavigator'
import SeemeScreen from '../screens/SeemeScreen';
import NavigationScreen from '../screens/NavigationScreen';
import TrackerScreen from '../screens/TrackerScreen';

import { AppColors,Font } from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';

import NavigationStackNavigator from './NavigationNavigator'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from 'react-redux'
import AccountStackNavigator from './AccountStackNavigator'
import {IconOutline} from '@ant-design/icons-react-native';


const BottomTabNavigator = (props) => {
  const Tab = createBottomTabNavigator()
  const current_request = useSelector((state) => state.requestStatus?.requestStatus || {});
  const {navigation,route} = props
  let body = {
    seeme: 'latitude',
  };


  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        // getOneTimeLocation();
        // subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );

          if (granted == PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            // getOneTimeLocation();
            // subscribeLocationLocation();
            AsyncStorage.setItem("locationStatus", "allowed")
          } else {
            AsyncStorage.setItem("locationStatus", "not_allowed")
          }
        } catch (err) {
          console.warn(err);
          AsyncStorage.setItem("locationStatus", "not_allowed")
        }
      }
    };
    requestLocationPermission();
    return () => {
      // Geolocation.clearWatch(watchID);
    };
  }, []);


  return (
    <>
    <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel:false,
          unmountOnBlur: true,
          tabBarStyle:{
            bottom:0,
            height:75,
            paddingTop:15,
            borderBottomColor: '#0512250D',
            borderTopWidth:0,
            elevation: 4,   // for Android
              shadowOffset: {
                  width: 0, height: 1 // for iOS
              },
              //shadowColor: '#0512250D',
              shadowColor: 'black',
              shadowRadius: 8,
              shadowOpacity: 0.2,
          }
        }}
      >
       <Tab.Screen
           name="Home"
           component={ContactStackNavigator}
           
           options={({ route }) => ({
            tabBarIcon:({focused}) => {
              return <View style={{alignItems:'center',justifyContent:'center', width:'1900%'}}>
                <IconOutline
                  name="phone"
                  color={focused ? AppColors.buttonColor : AppColors.uiBottomNavInactive}
                  size={23}
                  style={[{marginBottom:0, marginTop:5}]}
                />
                <Text style={focused ? GlobalStyles.bottomTabTextActive : GlobalStyles.bottomTabText}>
                    {"Contacts"}
                </Text>
              </View>
           },
            /*tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
              console.log(routeName)
              if (routeName === 'ChatScreen') {
                return { display:'none',height:0, marginBottom:0 }
              }
              return
            })(route),*/
          })}
        />

<Tab.Screen
            name="Tracker"
            component={TrackerScreen}
            options={{
              tabBarIcon:({focused}) => {
                 return <View style={{alignItems:'center',justifyContent:'center', width:'190%'}}>
                    <IconOutline
                    name="environment"
                    color={focused ? AppColors.buttonColor : AppColors.uiBottomNavInactive}
                    size={23}
                    style={[{marginBottom:0, marginTop:5}]}
                  />
                   <Text style={focused ? GlobalStyles.bottomTabTextActive : GlobalStyles.bottomTabText}>
                             {"Tracker"}
                   </Text>
                 </View>
              }
            }}
            listeners={({ navigation1, route }) => ({
              tabPress: e => {
                if(current_request?.active_request == false){
                  return e.preventDefault();
                }
              },
            })}
            initialParams={body}

        />

        <Tab.Screen
            name="Navigation"
            component={NavigationStackNavigator}
            options={{
              tabBarIcon:({focused}) => {
                 return <View style={{alignItems:'center',justifyContent:'center', width:'220%'}}>
                    <IconOutline
                    name="compress"
                    color={focused ? AppColors.buttonColor : AppColors.uiBottomNavInactive}
                    size={23}
                    style={[{marginBottom:0, marginTop:5}]}
                  />
                   <Text style={focused ? GlobalStyles.bottomTabTextActive : GlobalStyles.bottomTabText}>
                             {"Navigation"}
                   </Text>
                 </View>
              }
            }}
        />

        <Tab.Screen
            name="SeeMe"
            component={SeemeScreen}
            options={{
              tabBarIcon:({focused}) => {
                 return <View style={{alignItems:'center',justifyContent:'center', width:'190%'}}>
                    <IconOutline
                    name="pull-request"
                    color={focused ? AppColors.buttonColor : AppColors.uiBottomNavInactive}
                    size={23}
                    style={[{marginBottom:0, marginTop:5}]}
                  />
                   <Text style={focused ? GlobalStyles.bottomTabTextActive : GlobalStyles.bottomTabText}>
                             {"SeeMe"}
                   </Text>
                 </View>
              }
            }}
        />

        <Tab.Screen
            name="Account"
            component={AccountStackNavigator}
            options={{
              tabBarIcon:({focused}) => {
                 return <View style={{alignItems:'center',justifyContent:'center', width:'190%'}}>
                    <IconOutline
                    name="user-switch"
                    color={focused ? AppColors.buttonColor : AppColors.uiBottomNavInactive}
                    size={23}
                    style={[{marginBottom:0, marginTop:5}]}
                  />
                   <Text style={focused ? GlobalStyles.bottomTabTextActive : GlobalStyles.bottomTabText}>
                             {"Account"}
                   </Text>
                 </View>
              }
            }}
        />

    </Tab.Navigator>
    {/* <View style={{backgroundColor:"#FF9CAE"}}>
        <Image
              source={require('../assets/bottomBar.png')}
              resizeMode="contain"
              style={{
                height:25,
                width:"100%",
                bottom:0
              }}
        />
      </View> */}
    </>
  )

}

export default BottomTabNavigator