import React from 'react'
import NavigationScreen from '../screens/NavigationScreen';
// import SelectLocationScreen from '../screens/SelectLocationScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ChooseLocation from '../screens/ChooseLocation';
// import Home from '../screens/Home';


const NavigationStackNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator initialRouteName="NavigationScreen" headerMode='none' screenOptions={{
        headerShown: false,
      }} >
              <Stack.Screen name="NavigationScreen" component={NavigationScreen} />
              {/* <Stack.Screen name="home" component={Home} />
              <Stack.Screen name="chooseLocation" component={ChooseLocation} /> */}
              {/* <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} /> */}
    </Stack.Navigator>
  )
}

export default NavigationStackNavigator