import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import { Font } from '../utils/Constants';
// import {scrollViewProperties} from './src/utils/Constants'
import {AppColors} from '../utils/Constants';

export default function WelcomeScreen({navigation}) {
  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <KeyboardAvoidingView style={GlobalStyles.keyboardViewContainer}  enabled>
        <ScrollView
          style={GlobalStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={GlobalStyles.container_start}>
          <Image
            source={require('../assets/welcome.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={GlobalStyles.heading}>{'Location Tracker'}</Text>
          <Text style={[GlobalStyles.subHeading,{fontSize:Font.headingSize}]}>{'Multi-Trip GPS'}</Text>
          <View style={GlobalStyles.paddingAll}>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                'Traakme is a mobile application that has the ability to track the real-time geographical locations of its users, with the following incredible features: '
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left',marginTop:10}]}>
              {
                '* Realtime tracking'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* Departure and arrival alerts'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* Chat'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* Audio call'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* SOS alerts'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* Video call'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* Recording of time spent at visited locations'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* Ability to print records'
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                '* Multiple trips GPS '
              }
            </Text>


          <Text style={[GlobalStyles.descriptionText,{textAlign:'left',marginTop:10}]}>
              {
                'And many more features. Get started now for a safer life and better accuracy in accountabilities. '
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                'And many more features. Get started now for a safer life and better accuracy in accountabilities. '
              }
            </Text>
            <Text style={[GlobalStyles.descriptionText,{textAlign:'left'}]}>
              {
                'And many more features. Get started now for a safer life and better accuracy in accountabilities. '
              }
            </Text>
          </View>


          <Button
            title="GET STARTED"
            onPress={() => navigation.navigate('SignIn')}
            style={{width:"80%", marginBottom: 20}}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
  },
});
