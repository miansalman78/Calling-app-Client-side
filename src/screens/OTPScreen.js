import React , {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font} from '../utils/Constants';
import {_validateToken} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper'



export default function OTPScreen(props) {
  const {navigation,route} = props
  const [otp,setOTP] = useState('');
  const [empty, setEmpty] = useState('');

  const {params} = route

  const forgotPassword = async () => {
    try {

      if( otp == ''){
        setEmpty('Please enter OTP !');
        return;
      }else{setEmpty('')}

      let body = {
        "token": otp,
        "email":params?.email
      }

      let res = await _validateToken({ body });

      Toast.show(res?.detail || "OTP Successfully Verified. Please change password in next step !");
      navigation.navigate(
        'ConfirmChangePasswordScreen',
        {
          "email":params?.email,
          "token":otp
        }
      )

    } catch (err) {
      //Toast.show(getErrorMessage("Invalid OTP."));
      setEmpty(getErrorMessage("Invalid OTP."));
      // Toast.show(getErrorMessage(err));
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
    <KeyboardAvoidingView style={GlobalStyles.keyboardViewContainer}  enabled>
      <ScrollView
        style={GlobalStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={[GlobalStyles.container_start,GlobalStyles.paddingAll]}>
            <View style={{width:"100%",flexDirection:"row",alignContent:"flex-start"}}>
            <Image
              source={require('../assets/logo.png')}
              resizeMode="contain"
              style={styles.image}
            />
            </View>

            <Text style={[GlobalStyles.heading,{"marginTop":30,marginBottom:30}]}>{'Verify OTP'}</Text>
            <Text style={[GlobalStyles.descriptionText]}>
              {'Please type in the One Time Password (OTP) that you have received, and click on '}
                <Text style={[GlobalStyles.descriptionText,{fontFamily:Font.family_bold}]}>
                  {'Submit '}
                </Text>
               {'We will verify the OTP and redirect you to Change Password Screen.'}
            </Text>
            <View style={[GlobalStyles.greyContainer,{marginTop:40}]}>
              <TextInput
                style={[GlobalStyles.textBox,{textAlign:"center",fontSize:25,height:60}]}
                placeholder="XXXX"
                onChangeText={setOTP}
                keyboardType={'number-pad'}
                autoCapitalize='none'
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                    {empty}
              </Text>

              <Button
                title="SUBMIT"
                onPress={forgotPassword}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: "50%",
    marginTop:70,
    marginLeft:-20
  },
  errorText:{
    textAlign:'center',
    fontSize: 6,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    marginBottom:0,
    marginTop:0,
    color: 'red'
  }
});
