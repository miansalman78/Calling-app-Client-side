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
  ImageBackground
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import BackAppHeader from '../components/BackAppHeader';
import {_signinmobile, _signup, _signupImage, host} from '../utils/api' 
import Toast from 'react-native-simple-toast';
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import {CountryPicker} from "react-native-country-codes-picker";
import {IconOutline} from '@ant-design/icons-react-native';
import {launchImageLibrary} from 'react-native-image-picker'
import {Platform} from 'react-native';
import axios from "axios";
import {  Recaptcha, RecaptchaAction } from '@google-cloud/recaptcha-enterprise-react-native';
import { useContext } from 'react';
import { MyContext } from '../context/MyContext';


export default function SignupScreen(props) {
  const {navigation,route} = props
  const {params} = route
  const [show, setShow] = useState(false);
  const [fullname,setFullname] = useState(params?.name)
  const [phone_number,setPhoneNumber] = useState(params?.phone_number)
  const [validphone, setValidphone] = useState('');
  const [photo, setPhoto] = useState(null);
  const { recaptchaClient } = useContext(MyContext);
  


    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handlebackbtn);
      }, []);

    function handlebackbtn(){
      if(show){
        setShow(false);
      }
      console.log("back presseed");
    }

    const upimage = async() => {
        console.log("back presseed");
        const res = await launchImageLibrary();
        console.log(res.assets[0].uri);
        setPhoto(res.assets[0])
    }

    const register = async() => {
      if (recaptchaClient) {
        recaptchaClient
          .execute(new RecaptchaAction('SIGNIN'), 10000)
          .then(async(newToken) => {
            console.log(newToken.startsWith('03A') || newToken.startsWith('0cA') ? 'ok'  : 'error');
            console.log(newToken.substring(0, 15) + '...');
            console.log('newToken =>', newToken);

            const formData = new FormData();
            if(photo !== null){
                var photofull = {
                    name: photo.fileName,
                    type: photo.type,
                    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
                };
                formData.append('file', photofull);
            }
            formData.append("fullname", fullname)
            formData.append("phone_number", phone_number)
            formData.append("action", 'SIGNIN')
            formData.append("token", newToken)

            try{
              let res = await _signupImage({ body:formData });
              if(res.code == 400){
                setValidphone(res.error);
              }else{
                  setValidphone("");
                  Toast.show(`Hello ${fullname}. We have sent you an authentication code to your mobile number. Please enter the code on the screen that follows to complete this registration.`,Toast.LONG);
                  navigation.navigate('OTPPhone', {
                      phone_number: phone_number,
                      otp_context: "SIGNIN"
                  });
              }
            }catch (err) {
              console.log(getErrorMessage(err));
                let messe = getErrorMessage(err);
                if(messe.length > 200){
                    setValidphone('An error occured please contact app support');
                }else{
                    setValidphone(getErrorMessage(err));
                }
            }
        }).catch((error) => {
          console.log(`${error.code} ${error.message.substring(0, 15)}`);
          setIsLoading(false);
        });
      } else {
        console.log('Recaptcha Client is undefined');
        setIsLoading(false);
        setValidphone('An error occured please contact app support');
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
                <View style={{borderWidth: 0.5, borderColor: AppColors.buttonColor, borderRadius:60, width:25, height:25, alignItems:'center', justifyContent:'center',marginRight:5}}>
                <IconOutline
                    name="check"
                    color={AppColors.buttonColor}
                    size={14}
                    style={[{marginBottom:5, marginTop:5}]}
                  />
                </View>
              
                <Text className="mt-[5.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#000] text-[12px]" >
                  {'General'}
                </Text>
              </View>

              <View style={{flexDirection:'column'}}>
                <View style={{height:1, backgroundColor:AppColors.buttonColor, marginTop:12}}>
                  <Text className="p-[0.00px] mt-[15.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px]" >
                    {'----------'}
                    </Text>
                </View>
              </View>
              
              <View style={{flexDirection:'row'}}>
              <View style={{backgroundColor: AppColors.buttonColor, borderRadius:60, width:25, height:25, alignItems:'center', justifyContent:'center',marginRight:5}}>
                  <Text className="p-[0.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#fff] text-[12px]" >
                  {'2'}
                  </Text>
                </View>
                <Text className="mt-[5.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#000] text-[12px]" >
                  {'Profile image(optional)'}
                </Text>
              </View>
            </View>
          
            
          
            <View style={{flex: 1, borderRadius:22, justifyContent:'center', alignItems:'center', marginLeft:60, marginRight:60, marginTop:20}} >
            {photo !== null ? (
                <ImageBackground
                source={{uri: photo.uri}}
                resizeMode="cover"
                imageStyle={{borderRadius:60}}
                style={styles.container_start_bg}>

                <TouchableOpacity
                    onPress={() => upimage()}
                    style={{ }}>
                    
                    <IconOutline
                        name="picture"
                        color={'white'}
                        size={35}
                        style={[{marginBottom:0}]}/>
                    <Text style={{color:'white'}} className="mt-[5.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[12px]" >
                        {'Image'}
                    </Text>

                </TouchableOpacity>
            </ImageBackground>
            ):(
                <ImageBackground
                    source={require('../assets/new/imgcopy.png')}
                    //source={`${photo.uri}`}
                    //source={'file:///Users/anyangwe/Library/Developer/CoreSimulator/Devices/BE034B65-5A65-41F7-B1ED-1C7FF665D52B/data/Containers/Data/Application/8297369A-9F31-4FA5-9B2B-AA05878D1B71/tmp/911F51CE-D7CF-4950-B9FD-B5D6FAD0BCDA.jpg'}
                    resizeMode="cover"
                    imageStyle={{borderRadius:60}}
                    style={styles.container_start_bg}>

                    <TouchableOpacity
                        onPress={() => upimage()}
                        style={{ }}>
                        
                        <IconOutline
                            name="picture"
                            color={photo !== null ? 'white' : 'black'}
                            size={35}
                            style={[{marginBottom:0}]}/>
                        <Text style={{color: photo !== null ? 'white' : 'black'}} className="mt-[5.00px] mb-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[12px]" >
                            {'Image'}
                        </Text>

                    </TouchableOpacity>
                </ImageBackground>
            )}
                
                    
            </View>

                  <Text style={styles.errorText}>
                      {validphone}
                  </Text>

            <View style={[GlobalStyles.nogreyContainer,{bottom:0, position:'relative', width: '100%'}]}>
              <Button
              style={{ marginTop:5, marginBottom:10, borderRadius:32, lineHeight: 24, height: 55 }}
                title={photo !== null ? 'Register' : 'Skip & Register'}
                onPress={() => register()}
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
      },
      container_start_bg:{
        width:"100%",
        height: '90%',
        justifyContent:'center',
        alignItems:'center',
        },
    });

