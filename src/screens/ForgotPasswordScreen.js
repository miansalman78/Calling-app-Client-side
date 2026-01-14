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
import {_passwordForgotten} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper'



export default function ForgotPasswordScreen(props) {
  const {navigation} = props
  const [email,setEmail] = useState('')
  const [empty, setEmpty] = useState('');

  const forgotPassword = async () => {
    try {
      if( email == ''){
        setEmpty('Please enter an email address !');
        return;
      }else{setEmpty('')} 

      if(!(/\S+@\S+\.\S+/).test(email)){
        setEmpty('Please enter valid email address !');
        return;
      }else{setEmpty('')}

      let body = {
        "email": email
      }

      let res = await _passwordForgotten({ body });
      console.log(res);
      Toast.show("We have sent a OTP to your email. Please use that to reset the password !");
      navigation.navigate(
        "OTPScreen",
        {
          "email":email
        }
      )
    } catch (err) {
      setEmpty(getErrorMessage(err));
      console.log(err)
      //Toast.show(getErrorMessage(err));
      console.log(getErrorMessage(err));
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

            <Text style={[GlobalStyles.heading,{"marginTop":30,marginBottom:30}]}>{'Password Reset'}</Text>
            <Text style={[GlobalStyles.descriptionText]}>
              {'Please type in your email address below, and click on '}
                <Text style={[GlobalStyles.descriptionText,{fontFamily:Font.family_bold}]}>
                  {'"Request Password Reset. "'}
                </Text>
               {'We will send you an email with instructions on how to reset your password and log in.'}
            </Text>
            <View style={[GlobalStyles.greyContainer,{marginTop:40}]}>
              <TextInput
                style={GlobalStyles.textBox}
                placeholder="Email"
                onChangeText={setEmail}
                keyboardType={'email-address'}
                autoCapitalize='none'
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                    {empty}
              </Text>

              <Button
                title="REQUEST PASSWORD RESET"
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
