import React,{useState, useEffect} from 'react';
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
  BackHandler,
  ActivityIndicator
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import BackAppHeader from '../components/BackAppHeader';
import {_signinmobile} from '../utils/api' 
import Toast from 'react-native-simple-toast';
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import {CountryPicker} from "react-native-country-codes-picker";
import DeviceCountry from 'react-native-device-country';
import codes from 'country-calling-code';
import parsePhoneNumber from 'libphonenumber-js';
import { getAuth, onAuthStateChanged, signInWithCredential, signInWithPhoneNumber, signOut } from '@react-native-firebase/auth';
import {  Recaptcha, RecaptchaAction } from '@google-cloud/recaptcha-enterprise-react-native';
import { useContext } from 'react';
import { MyContext } from '../context/MyContext';


export default function AddEditContactScreen(props) {
  const {navigation,route} = props
  const {params} = route
  const { recaptchaClient } = useContext(MyContext);
  const [phone_no,setPhoneNumber] = useState("")
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [validphone, setValidphone] = useState('');

  const [confirm, setConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //const [recaptchaClient, setRecaptchaClient] =useState(null);

  const [emailfocus, setEmailfocus] = useState(GlobalStyles.removeactiveTextInput);
  const [passfocus, setPassfocus] = useState(GlobalStyles.removeactiveTextInput);

  const onBlur = async() => {
    setFocusblur(GlobalStyles.removeactiveTextInput)
  }

  const emailFocus = async() => {
    setEmailfocus(GlobalStyles.activeTextInput)
  }

  const passFocus = async() => {
    setPassfocus(GlobalStyles.activeTextInput)
  }

  useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", handlebackbtn);
  }, []);

  function handlebackbtn(){
    if(show){
      setShow(false);
    }
    console.log("back presseed");
  }

      const addContact = async() => {
        setIsLoading(true);
        var phone_number = countryCode+phone_no;
        if(!validatePhoneNumber(phone_number)){
          setValidphone('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212');
          //Toast.show('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212',Toast.LONG);
          return;
        }else{setValidphone('')}
        //const token = await client.execute(RecaptchaAction.LOGIN());
        //console.log('recaptcha token =>', token);
        if (recaptchaClient) {
          recaptchaClient
            .execute(new RecaptchaAction('LOGIN'), 10000)
            .then(async(newToken) => {
              console.log(newToken.startsWith('03A') || newToken.startsWith('0cA') ? 'ok'  : 'error');
              console.log(newToken.substring(0, 15) + '...');
              console.log('newToken =>', newToken);
              let body = {
                phone_number: phone_number,
                action: 'LOGIN',
                token: newToken
              }
              try {
                let response = await _signinmobile({ body });
                console.log(response);
                if (response.code!=200) {
                  Toast.show(response.error);
                  return;
                } 
                Toast.show("A One Time Password (OTP) code has been sent to your mobile number. On the next screen please enter the OTP that you received.",Toast.LONG);
                navigation.navigate('OTPPhone', {
                  phone_number: phone_number,
                  otp_context: "SIGNIN"
                });
                setIsLoading(false);
              }catch (err) {
                setIsLoading(false);
                console.log(getErrorMessage(err));
                let messe = getErrorMessage(err);
                if(messe.length > 200){
                    setValidphone('An error occured please contact app support');
                }else{
                    setValidphone(getErrorMessage(err));
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

        
        /*
        try {

          if(!validatePhoneNumber(phone_number)){
            setValidphone('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212');
            //Toast.show('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212',Toast.LONG);
            return;
          }else{setValidphone('')}

          let body = {
            phone_number:phone_number
            }
            let response = await _signinmobile({ body });
            console.log(response);
            if (response.code!=200) {
                Toast.show(response.error);
                
                return;
            } 
            Toast.show("A One Time Password (OTP) code has been sent to your mobile number. On the next screen please enter the OTP that you received.",Toast.LONG);
            navigation.navigate('OTPPhone', {
                phone_number: phone_number,
                otp_context: "SIGNIN"
            });
        }catch (err) {
            console.log(getErrorMessage(err));
            let messe = getErrorMessage(err);
            if(messe.length > 200){
                setValidphone('An error occured please contact app support');
            }else{
                setValidphone(getErrorMessage(err));
            }
        }*/
      }

      const phoneSignIn = async() => {
        setIsLoading(true);
        var phone_number = countryCode+phone_no;
        console.log('phone started for => '+phone_number);
        try {

          if(!validatePhoneNumber(phone_number)){
            setValidphone('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212');
            //Toast.show('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212',Toast.LONG);
            return;
          }else{setValidphone('')}

          //const confirmation = await auth().signInWithPhoneNumber('+237'+number);
          const confirmation = await signInWithPhoneNumber(getAuth(), phone_number);
          
          if (confirmation) {
            setConfirm(confirmation);
            console.log(confirmation);

            Toast.show("A One Time Password (OTP) code has been sent to your mobile number. On the next screen please enter the OTP that you received.",Toast.LONG);
            navigation.navigate('OTPPhone', {
                phone_number: phone_number,
                otp_context: "SIGNIN",
                confirmation: confirmation
            });
            setIsLoading(false);
          }
        } catch (err) {
          setIsLoading(false);
          console.log('Check Exist Error2 - ' + err.message);
          console.log('error Code - ' + err.code);
          //setErrorOccured(true);
          if (err.code === 'missing-phone-number') {
            console.log('Missing Phone Number.');
            setValidphone('Missing Phone Number.');
          } else if (err.code === 'auth/invalid-phone-number') {
            console.log('Invalid Phone Number.');
            setValidphone('Invalid Phone Number.');
          } else if (err.code === 'auth/quota-exceeded') {
            console.log('SMS quota exceeded.');
            setValidphone('SMS quota exceeded.Please try again later.');
          } else if (err.code === 'auth/user-disabled') {
            console.log('User disabled.');
            setValidphone('Phone Number disabled. Please contact support.');
          } else if (err.code === 'auth/too-many-requests') {
            console.log('User disabled.');
            setValidphone('We have blocked all requests from this device due to unusual activity. Try again later.');
          }else if (err.code === 'auth/missing-recaptcha-token') {
            console.log('User disabled.');
            setValidphone('The request is missing a reCAPTCHA token.');
          }else if (err.code === 'auth/app-not-authorized') {
            console.log('User disabled.');
            setValidphone('This app is not authorized to use Firebase Authentication. Please verify that the correct package name, SHA-1, and SHA-256 are configured in the Firebase Console.');
          } else {
            console.log('Unexpected Error.' + err.code);
            setValidphone('Unexpected Error Occured. Please contact support.');
          }
        }
      }

      return (
        <SafeAreaView style={GlobalStyles.safeAreaContainer}>
          <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#0512250D'}]}>
              <BackAppHeader />
              <Text className="ml-6 mb-[0.00px] mt-[8.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'Welcome on Board'}
            </Text>
            <Text className="ml-6 mt-[8.00px] mb-[24.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[normal]" >
              {'Enjoy the features on our App'}
            </Text>
          </View>
          <View style={[GlobalStyles.KeyboardcontainerPadLeftRight,{flex:1,}]}>

          <Text className="mt-[28.00px] mb-[14.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Phone Number'}
          </Text>
          
            <View style={{flex: 1, flexDirection: 'row'}} >
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      style={{
                          width: '27%',
                          height: 50,
                          padding: 10,
                          borderTopLeftRadius: 32,
                          borderBottomLeftRadius: 32,
                          backgroundColor: AppColors.uigreybackground,
                          marginTop:0,
                          alignItems: 'center',
                          lineHeight:50,
                          justifyContent:'center',
                          borderWidth: 1,
                          borderColor: AppColors.uitextborder,
                      }}
                    >
                      <Text style={{
                          fontSize: 20,
                          paddingLeft:10,
                          color: AppColors.textBlack,
                          fontSize: Font.textSize,
                      }}>
                          {countryCode}
                      </Text>
                      

                    </TouchableOpacity>
                    
                    
                    <TextInput
                      style={[styles.textBoxCode, emailfocus]}
                      placeholder="e.g 0123456789"
                      onChangeText={setPhoneNumber}
                      keyboardType={'phone-pad'}
                      returnKeyType='done'
                      autoCapitalize='none'
                      value={phone_no}
                      //onBlur={onBlur}
                      //onFocus={emailFocus}
                      placeholderTextColor={AppColors.textGrey}
                    />
                    <CountryPicker
                      show={show}
                      pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code);
                        console.log(item.dial_code);
                        setShow(false);
                      }}
                      onBackdropPress={() =>{
                        setShow(false);
                      }}
                      enableModalAvoiding={false}
                      androidWindowSoftInputMode={'pan'}
                      style={{
                        modal:{
                          height:500
                        }
                      }}
                      popularCountries={['en', 'ua', 'pl']}
                    />
                  </View>
                  <Text style={styles.errorText}>
                      {validphone}
                  </Text>

            <View style={[GlobalStyles.nogreyContainer,{bottom:0, position:'relative', width: '100%'}]}>
              <Button
              style={{ marginTop:5, marginBottom:10, borderRadius:32, lineHeight: 24, height: 55 }}
                title="Continue"
                onPress={() => addContact()}
                disabled={isLoading}
              />
              {isLoading && (
                  <ActivityIndicator
                    size="large" // or "large" or a number
                    color={AppColors.buttonColor} // Customize color
                    style={styles.activityIndicator}
                  />
                )}

            <TouchableOpacity
              style={[
                styles.actionSheetView,{
                    backgroundColor: 'white',
                    marginTop: 0,
                    marginBottom: 26,
                    borderRadius: 32,
                    justifyContent: 'center',
                    marginLeft:0,
                    marginRight:0,
                    borderWidth: 1,
                    paddingTop:18,
                    paddingBottom:18,
                    borderColor: '#05122514',
                },
              ]}
              underlayColor={'#f7f7f7'}
              onPress={() => navigation.navigate('SignUp')}>
              
              <View style={[{flexDirection:'row', alignItems:'center', justifyContent:'center'}]}>
                <Text allowFontScaling={false}
                  style={[{color:'black', fontWeight:'400', fontSize:14}]}>
                  {"Don't have an account?"}
                </Text><Text allowFontScaling={false}
                  style={[{color:AppColors.buttonColor, fontWeight:'400', fontSize:14}]}>
                  {" Sign up"}
                </Text>
              </View>
            </TouchableOpacity>
              
            </View>
          </View>

        </SafeAreaView>
      );
    }

    const styles = StyleSheet.create({
      activityIndicator: {
        position: 'absolute', // Overlay the indicator
        right:5,
        top:15,
      },
      image: {
        height: 250,
        width: '100%',
      },
      textBoxCode: {
        height: 50,
        width: '73%',
        borderTopRightRadius: 32,
        borderBottomRightRadius: 32,
        paddingLeft:20,
        color: AppColors.textBlack,
        fontSize: Font.textSize,
        // fontFamily: Font.family,
        backgroundColor: AppColors.uigreybackground,
        marginTop:0,
        borderWidth: 1,
        borderColor: AppColors.uitextborder,
        fontFamily: Font.family_regular
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

