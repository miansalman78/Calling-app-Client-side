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
  TouchableOpacity,
  ImageBackground,
  StatusBar
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import { AppColors, Font, SpaceConstants } from '../utils/Constants';
import { backgrounimg } from '../assets/welcomemain.png';
// import {scrollViewProperties} from './src/utils/Constants'

export default function WelcomeScreen({navigation}) {
  return (
    <ImageBackground
                  source={require('../assets/welcomemain.png')}
                  resizeMode="cover"
                  style={styles.container_start_bg}>

    <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          
          <StatusBar 
            backgroundColor="transparent"
            translucent={true}
          />
          <View style={styles.container_start}>
          <ImageBackground
            source={require('../assets/seemeglobal_logo.png')}
            resizeMode="contain"
            style={styles.headerimage}
          />
          <ImageBackground
            source={require('../assets/twosweetbabes.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.heading}>{'Communication & Location'}</Text>
          <Text style={styles.heading}>{'Sharing App'}</Text>

          <View style={styles.paddingAll}>
            <Text style={styles.descriptionText}>
              {
                'Connect across the world and or around the corner.'
              }
            </Text>

            <Text style={styles.descriptionText}>
              {
                'Chat, voice call, video call, track, and use GPS navigation - for free. '
              }
            </Text>

            <Text style={styles.descriptionText}>
              {'Share location with '}
                <Text
                  style={[
                    GlobalStyles.hyperlinkText,
                    {fontSize: Font.subheadingSize, color: AppColors.newPink},
                  ]}>
                  {'SeeMe'}
                </Text>
                {' - anywhere in the world.'}
            </Text>
            
          </View>

          

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}>
          <View style={{flexDirection: 'row', alignItems: 'center', textAlign:'center', justifyContent: 'center'}}>
            <Image
              source={require('../assets/getstartedbutton.png')}
              resizeMode="contain"
              style={styles.buttonimage}
            />
          </View>
        </TouchableOpacity>


        

          <TouchableOpacity onPress={() => navigation.navigate(
              'SignIn',
              )}>
              <Text
                style={[
                  GlobalStyles.hyperlinkText,
                  {fontSize: Font.subheadingSize, paddingBottom: 30},
                ]}>
                {"Already have an account? "}
                <Text
                  style={[
                    GlobalStyles.hyperlinkText,
                    {fontSize: Font.subheadingSize, color: AppColors.newPink,},
                  ]}>
                  {'Sign in '}
                </Text>
              </Text>
            </TouchableOpacity>

        </View>
         
        </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 280,
    width: '100%',
    marginTop: -40,
    marginBottom: 40,
  },
  headerimage: {
    height: 220,
    width: '85%',
    marginTop:-30,
    marginLeft:20,
  },
  buttonimage: {
    height: 50,
    width: '65%',
    marginTop:40,
    marginBottom:40,
  },
  heading:{
    fontSize:Font.headingSize,
    color: AppColors.newPink,
    marginBottom:0,
    paddingLeft: 10,
    paddingRight: 10,
   textAlign:'center',
    fontFamily:Font.family_bold
  },
  descriptionText:{
    fontSize:Font.subheadingSize,
    color: AppColors.textGrey,
    fontFamily: Font.family_regular,
    textAlign:'center',
    lineHeight:18,
    marginTop:15,
    paddingRight: 20,
    paddingLeft: 20,
    // textAlign:"center"
  },
  container_start_bg:{
   width:"100%",
    height: '100%'
  },
  container_start_butto:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 70,
    paddingRight:70,
  },
  paddingAll:{
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },
  safeAreaContainer:{
    flex:1,
    marginTop:0,
    marginBottom:0,
  },
  scrollContainer:{
    flex:1,
  },
});
