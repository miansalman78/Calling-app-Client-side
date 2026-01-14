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
  BackHandler
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import BackAppHeader from '../components/BackAppHeader';
import {_signinmobile, _signup} from '../utils/api' 
import Toast from 'react-native-simple-toast';
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import {CountryPicker} from "react-native-country-codes-picker";
import DeviceCountry from 'react-native-device-country';
import codes from 'country-calling-code';
import parsePhoneNumber from 'libphonenumber-js';


export default function SignupScreen(props) {
  const {navigation,route} = props
  const {params} = route
  const [phone_no,setPhoneNumber] = useState("")
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [fullname,setFullname] = useState("")
  const [validphone, setValidphone] = useState('');

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

      const addUser = async() => {
        var phone_number = countryCode+phone_no;
        try {

          if(fullname == '' ){
            setValidphone('Please enter your full names !');
            return;
          }else{setValidphone('')} 

          if(!validatePhoneNumber(phone_number)){
            setValidphone('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212');
            //Toast.show('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212',Toast.LONG);
            return;
          }else{setValidphone('')}

          navigation.navigate('ImageUpload', {
              phone_number: phone_number,
              name: fullname,
          });

        }catch (err) {
            console.log(getErrorMessage(err));
            let messe = getErrorMessage(err);
            if(messe.length > 200){
                setValidphone('An error occured please contact app support');
            }else{
                setValidphone(getErrorMessage(err));
            }
        }
      }

      return (
        <SafeAreaView style={GlobalStyles.safeAreaContainer}>
          <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 0,
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

            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
              <View style={{flexDirection:'row'}}>
                <View style={{backgroundColor: AppColors.buttonColor, borderRadius:60, width:25, height:25, alignItems:'center', justifyContent:'center',marginRight:5}}>
                  <Text className="p-[0.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#fff] text-[12px]" >
                  {'1'}
                  </Text>
                </View>
              
                <Text className="mt-[5.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#000] text-[12px]" >
                  {'General'}
                </Text>
              </View>

              <View style={{flexDirection:'column'}}>
                <View style={{height:1, backgroundColor:'#00000073', marginTop:12}}>
                  <Text className="p-[0.00px] mt-[15.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px]" >
                    {'----------'}
                    </Text>
                </View>
              </View>
              
              <View style={{flexDirection:'row'}}>
                <View style={{ borderWidth: 0.5, borderColor: '#00000073', borderRadius:60, width:25, height:25, alignItems:'center', justifyContent:'center',marginRight:5}}>
                    <Text className="p-[0.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px]" >
                    {'2'}
                    </Text>
                  </View>
                <Text className="mt-[5.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#00000073] text-[12px]" >
                  {'Profile image(optional)'}
                </Text>
              </View>
            </View>

          <Text className="mt-[50.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Full Name'}
          </Text>
          <TextInput
                style={[GlobalStyles.textBox]}
                placeholder="e.g John Doe Mark"
                onChangeText={setFullname}
                keyboardType={'email-address'}
                returnKeyType='done'
                autoCapitalize='none'
                value={fullname}
                //onBlur={onBlur}
                //onFocus={emailFocus}
                placeholderTextColor={AppColors.textGrey}
              />
            
          <Text className="mt-[0.00px] mb-[14.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
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
                title="Next"
                onPress={() => addUser()}
              />

              
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
              onPress={() => navigation.navigate('OTPLogin')}>
              
              <View style={[{flexDirection:'row', alignItems:'center', justifyContent:'center'}]}>
                <Text allowFontScaling={false}
                  style={[{color:'black', fontWeight:'400', fontSize:14}]}>
                  {"Already have an account?"}
                </Text><Text allowFontScaling={false}
                  style={[{color:AppColors.buttonColor, fontWeight:'400', fontSize:14}]}>
                  {" Sign in"}
                </Text>
              </View>
            </TouchableOpacity>
              
            </View>
          </View>

        </SafeAreaView>
      );
    }

    const styles = StyleSheet.create({
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

