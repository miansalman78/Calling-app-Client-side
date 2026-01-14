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
import {_postContact, _patchContact} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import {IconOutline} from '@ant-design/icons-react-native';
import { useSelector, useDispatch } from 'react-redux'
import {_patchUser,_me, _updateImage, host} from '../utils/api'
import { useNavigation } from '@react-navigation/native';
import { updateRequestStatus ,updateCurrentUser} from '../slices/requestSlice'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker'
import {Platform} from 'react-native';
import axios from "axios";

export default function AddEditContactScreen(props) {
  const {route} = props
  const {params} = route
  const navigation = useNavigation();
  const [fullname,setFullname] = useState('')
  const [validall, setValidall] = useState('');
  const [photo, setPhoto] = useState(null);
  const [serverphoto, setServerPhoto] = useState('');
  const [emailfocus, setEmailfocus] = useState(GlobalStyles.removeactiveTextInput);
  const [passfocus, setPassfocus] = useState(GlobalStyles.removeactiveTextInput);

  const current_user = useSelector((state) => state.requestStatus?.currentUser || {});
  const dispatchRedux = useDispatch()
  useEffect(()=>{
    setFullname(current_user?.fullname || '')
    setServerPhoto(current_user?.image_url || '')
    //console.log(current_user?.image_url);
  },[])

  const onBlur = async() => {
    setFocusblur(GlobalStyles.removeactiveTextInput)
  }

  const emailFocus = async() => {
    setEmailfocus(GlobalStyles.activeTextInput)
  }

  const upimage = async() => {
    console.log("back presseed");
    const res = await launchImageLibrary();
    console.log(res.assets[0].uri);
    setPhoto(res.assets[0])
}

const upload = async () => {
   
    var photofull = {
        name: photo.fileName,
        type: photo.type,
        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    };
    const formData = new FormData();
    formData.append('file', photofull);
    formData.append("fullname", fullname)
    formData.append("phone_number", current_user?.phone_number)

    const client = axios.create();
    const headers = {
      'Content-Type': 'multipart/form-data'
    }
    
    /*client.post(`${host}/auth/mobile/uploadphoto`, formData, headers).then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err)
    });*/
    let res = await _updateImage({ body:formData });
    console.log(res)
}

const updateProfile = async () => {
    
    try {

        if( fullname == ''){
            setValidall('Please enter all the fields !');
            return;
        }else{setValidall('')}

        if(photo !== null){
            upload();
        }else{
            let body = {
                "fullname": fullname
            }
            let res = await _patchUser({ pk:current_user?.id ,body:body });
        }

        Toast.show("Profile Successfully Updated");
        let currentUserDetails = await _me()
        //console.log(currentUserDetails)
        dispatchRedux(updateCurrentUser(currentUserDetails))
        setFullname(fullname)
        navigation.navigate('AccountHome')

        } catch (err) {
        console.log(err)
        setValidall(getErrorMessage(err));
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
          </View>
          <View style={[{flexDirection:'column',marginRight:20, marginLeft:20}]}>
            <Text className="mb-[16.00px] mt-[24.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'Edit Profile'}
            </Text>
            </View>
          <View style={[GlobalStyles.KeyboardcontainerPadLeftRight,{flex:1,}]}>
          <Text className="mt-[16.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Contact’s Full Name'}
          </Text>
          <TextInput
                style={[GlobalStyles.textBox, emailfocus]}
                placeholder="e.g John Doe Mark"
                onChangeText={setFullname}
                keyboardType={'email-address'}
                autoCapitalize='none'
                value={fullname}
                //onBlur={onBlur}
                //onFocus={emailFocus}
                placeholderTextColor={AppColors.textGrey}
              />
            <Text style={styles.errorText}>
                {validall}
            </Text>

          {/*<Text className="mt-[0.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Contact’s Email'}
          </Text>
          <TextInput
                style={[GlobalStyles.textBox, emailfocus]}
                placeholder="e.g contactEmail@mail.com"
                onChangeText={setEmail}
                keyboardType={'email-address'}
                autoCapitalize='none'
                value={email}
                //onBlur={onBlur}
                //onFocus={emailFocus}
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                      {validemail}
                </Text> */}

            <View style={styles.viewlist}>
                <Text className="text-[16px]" style={[styles.textAccount,{flex:3}]}>
                    {'Display Picture'}
                </Text>
                <View style={{flex:1,flexDirection:'column'}}>
                {photo !== null ? (
                    <Image
                    source={{uri: photo.uri}}
                    resizeMode={"cover"}
                    style={styles.textAccountImage}
                    />
                ):(
                    <Image
                    source={{uri: serverphoto}}
                    resizeMode={"cover"}
                    style={styles.textAccountImage}
                    />
                )}
                <TouchableOpacity className="w-6 h-6 bg-[#F40ADB] rounded-[38px]"
                    onPress={() => {
                        upimage()
                    }} style={{top:-10, right:-35, borderColor:'white', borderWidth:1}} >
                    <IconOutline
                    name="edit"
                    color={'white'}
                    size={16}
                    style={{textAlign:'center', marginTop:5 }}
                    />
                </TouchableOpacity>
                </View>
            </View>

            <View style={[GlobalStyles.nogreyContainer,{bottom:0, position:'relative', width: '100%'}]}>
              <Button
              style={{ marginTop:5, marginBottom:10, borderRadius:32, lineHeight: 24, height: 55 }}
                title="Save Changes"
                onPress={() => updateProfile()}
              />
              
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
        fontSize: 12,
        color: AppColors.textBlack,
        marginBottom:4,
        marginTop:0,
        color: 'red'
      },
      textAccountImage:{
        width: '80%',
        height:45,
        marginBottom:-10,
        marginTop:15,
        borderRadius:50
    },
    textAccount:{
        fontSize: 14,
        color: '#05122599',
        paddingTop:33,
        paddingBottom:25
    },
    viewlist:{
        flexDirection:'row',
        marginLeft:25,
        marginRight:25,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderBottomColor: '#0512250D',
        borderTopColor: '#0512250D'
    }
    });

