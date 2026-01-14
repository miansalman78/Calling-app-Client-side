import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font} from '../utils/Constants';
import useAuth from '../hooks/useAuth';
import Toast from 'react-native-simple-toast';
import {_checkEmailStatus, _signupActivate} from '../utils/api'
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import BackAppHeader from '../components/BackAppHeader';
import UserAppHeader from '../components/UserAppHeader';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { getAuth, onAuthStateChanged, signInWithCredential, signInWithPhoneNumber, signOut } from '@react-native-firebase/auth';
import {  Recaptcha, RecaptchaAction } from '@google-cloud/recaptcha-enterprise-react-native';
import { useContext } from 'react';
import { MyContext } from '../context/MyContext';

export default function SignInScreen(props) {
  const {navigation,route} = props
  const { loginVerifyOTP } = useAuth();
  const [validphone, setValidphone] = useState('');
  const { recaptchaClient } = useContext(MyContext);

  const {params} = route
  let otp_context = params?.otp_context;
  let phone_number = params?.phone_number;
  let confirmation = params?.confirmation;

  const [mainotp, setMainotp] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [otp1, setOTP1] = useState('');
  const [otp2, setOTP2] = useState('');
  const [otp3, setOTP3] = useState('');
  const [otp4, setOTP4] = useState('');
  const [otp5, setOTP5] = useState('');
  const [otp6, setOTP6] = useState('');

  const [emailfocus1, setEmailfocus1] = useState(GlobalStyles.removeactiveTextInput);
  const [emailfocus2, setEmailfocus2] = useState(GlobalStyles.removeactiveTextInput);
  const [emailfocus3, setEmailfocus3] = useState(GlobalStyles.removeactiveTextInput);
  const [emailfocus4, setEmailfocus4] = useState(GlobalStyles.removeactiveTextInput);
  const [emailfocus5, setEmailfocus5] = useState(GlobalStyles.removeactiveTextInput);
  const [emailfocus6, setEmailfocus6] = useState(GlobalStyles.removeactiveTextInput);
  const [onblur, setBlur] = useState(true);

  const emailFocus1 = async() => {
    setEmailfocus1(GlobalStyles.activeTextInput)
  }
  const emailFocus2 = async() => {
    setEmailfocus2(GlobalStyles.activeTextInput)
  }
  const emailFocus3 = async() => {
    setEmailfocus3(GlobalStyles.activeTextInput)
  }
  const emailFocus4 = async() => {
    setEmailfocus4(GlobalStyles.activeTextInput)
  }
  const emailFocus5 = async() => {
    setEmailfocus5(GlobalStyles.activeTextInput)
  }
  const emailFocus6 = async() => {
    setEmailfocus6(GlobalStyles.activeTextInput)
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [navigation]); 

  const loginUser = async() => {
    console.log('login user');
    setIsLoading(true);
    /*if( otp6 == '' || otp5 == '' || otp4 == '' || otp3 == '' || otp2 == '' || otp1 == ''){
      setValidphone('Enter correct OTP !');
      return;
    }else{setValidphone('')}*/

    //let otp = otp1+otp2+otp3+otp4+otp5+otp6
    if (recaptchaClient) {
      recaptchaClient
        .execute(new RecaptchaAction('SIGNUP'), 10000)
        .then(async(newToken) => {
          console.log(newToken.startsWith('03A') || newToken.startsWith('0cA') ? 'ok'  : 'error');
          console.log(newToken.substring(0, 15) + '...');
          console.log('newToken =>', newToken);
          
          if (otp_context=="SIGNIN") {
            loginVerifyOTP(phone_number, parseInt(mainotp), newToken);
          }else if (otp_context=="SIGNUP") {
            try {
              let body = {
                "phone_number":params?.phone_number,
                "otp": mainotp,
                "action": 'SIGNUP',
                "token": newToken
              }

              let response = await _signupActivate({ body });
              if (response.code!=200) {
                Toast.show(response.error);
                setValidphone(response.error);
                setIsLoading(false);
                return;
              }
              Toast.show("Your authentication code has been accepted. You have successfully completed your registration, and may now sign in using your phone number and password or OTP code.");
              navigation.navigate(
                'SignIn',
                {
                  "phone_number": params?.phone_number
                }
              )
              setIsLoading(false);
            } catch (err) {
              Toast.show(getErrorMessage("Invalid OTP."));
              setValidphone(getErrorMessage("Invalid OTP."));
              setIsLoading(false);
            }
          }
        })
        .catch((error) => {
          console.log(`${error.code} ${error.message.substring(0, 15)}`);
          setIsLoading(false);
        });
      } else {
        console.log('Recaptcha Client is undefined');
        setIsLoading(false);
        setValidphone('An error occured please contact app support');
      } 
  }

  const phoneLogin = async() => {
    setIsLoading(true);
    try {
      await confirmation.confirm(mainotp);
    } catch (error) {
      console.log('Invalid code.', error);
      setValidphone('Invalid code.');
      setIsLoading(false);
    }
  }

  const handleAuthStateChanged = async(user) => {
    console.log('Cheking account status', user);
    if(user !== null){
      setUid(user._user.uid);
      console.log(user._user);
      console.log(user._user.uid); //"gUijMlaklPNvikBWfRM6xI2zcOU2"
      console.log('user account created successfully');
      //console.log('getToken =>',user.getToken())
       const id_token = await user.getIdToken();
      const resto = login(user._user.email,user._user.uid);
      loginVerifyOTP(phone_number, id_token);
      setIsLoading(false);
    }

    if (initializing) setInitializing(false);
  }

  const onBlur = async() => {
    if( otp1 !== '' && otp2 !== '' && otp3 !== '' && otp4 !== '' && otp5 !== ''){
      setBlur(false)
    }
  }

  if (initializing) return null;

  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
        <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#0512250D'}]}>
              <BackAppHeader />
              <Text className="ml-6 mb-[0.00px] mt-[8.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'Verify OTP'}
            </Text>
            <Text className="ml-6 mt-[8.00px] mb-[24.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[normal]" >
              {'Please type in the One Time Password (OTP) that you have received and click on Submit. We will verify the OTP and redirect you to Change Password Screen.'}
            </Text>
            <TextInput
                style={{display:'none'}}
                autoFocus
              />
          </View>

          <View style={[GlobalStyles.KeyboardcontainerPadLeftRight,{flex:1,}]}>
         
          <View style={[{flex:1,flexDirection:'row', justifyContent: 'center', marginTop:30}]}>
          <OTPInputView
              style={{width: '80%', height: 70}}
              pinCount={6}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled = {(code => {
                setBlur(false);
                setMainotp(code);
                console.log(`Code is ${code}, you are good to go!`)
              })} />

            </View>
          <View style={[GlobalStyles.nogreyContainer,{bottom:20, position:'absolute', width: '100%'}]}>
          
          <Text style={styles.errorText}>
              {validphone}
            </Text>
            
              <Button
              style={{ marginTop:5, marginBottom:10, borderRadius:32, lineHeight: 24, height: 55 }}
                title="Submit"
                disabled={onblur}
                onPress={() => loginUser()}
              />
              {isLoading && (
                <ActivityIndicator
                  size="large" // or "large" or a number
                  color={AppColors.textInputBg} // Customize color
                  style={styles.activityIndicator}
                />
              )}
            </View>
          </View>
          
            
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute', // Overlay the indicator
    right:5,
    top:45,
  },
  image: {
    maxHeight: 270,
    width: '110%',
  },
  errorText:{
    textAlign:'center',
    fontSize: 6,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    marginBottom:10,
    marginTop:0,
    color: 'red'
  },
  errorTextBottom:{
    textAlign:'center',
    fontSize: 6,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    marginBottom:5,
    marginTop:5,
    color: 'red'
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: AppColors.textBlack,
		fontSize: 16,
  },

  underlineStyleHighLighted: {
    borderColor: '#FF96D2',
  },
});
