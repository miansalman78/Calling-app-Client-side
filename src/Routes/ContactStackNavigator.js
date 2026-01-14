import React from 'react'; 
import ContactScreen from '../screens/ContactScreen'; 
import AddEditContactScreen from '../screens/AddEditContactScreen'; 
import {createNativeStackNavigator} from '@react-navigation/native-stack'; 
import ChatScreen from '../screens/ChatScreen'; 
import SearchContacts from '../screens/SearchContacts';
import ContactDetails from '../screens/ContactDetails';
import ProfileDetails from '../screens/ProfileDetails';
 

const ContactStackNavigator = () => { 

  const Stack = createNativeStackNavigator(); 

  return ( 

  <Stack.Navigator 
    initialRouteName="Contacts" 
    headerMode="none" 
    screenOptions={{ 
      headerShown: false, 
    }}> 

  <Stack.Screen name="Contacts" component={ContactScreen} /> 
  <Stack.Screen name="AddEditContact" component={AddEditContactScreen} /> 
  <Stack.Screen name="ChatScreen" component={ChatScreen} />
  <Stack.Screen name="SearchContacts" component={SearchContacts} />
  <Stack.Screen name="ContactDetails" component={ContactDetails} />
  <Stack.Screen name="ProfileDetails" component={ProfileDetails} /> 
  </Stack.Navigator> 
  ); 

}; 

export default ContactStackNavigator; 