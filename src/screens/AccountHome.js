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
  KeyboardAvoidingView
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font} from '../utils/Constants';
import useAuth from '../hooks/useAuth';
import Toast from 'react-native-simple-toast';
import {_checkEmailStatus} from '../utils/api'
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import {IconOutline} from '@ant-design/icons-react-native';
import ActionSheet from '../components/ActionsheetConfirm';
//import ActionSheet from '../components/ActionSheetTracker';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { useSelector, useDispatch } from 'react-redux'
import {_deleteAccount, _me } from '../utils/api';
import { getAuth, signOut } from '@react-native-firebase/auth';


export default function AccountHome(props) {
 
    const {logout} = useAuth()
    const current_user = useSelector((state) => state.requestStatus?.currentUser || {});

    const [actionSheet, setActionSheet] = useState(false);
    const [actionType, setActionType] = useState('');
    const [actionTitle, setActionTitle] = useState('');
    const [actionDesc, setActionDesc] = useState('');
    const [actionConfirm, setActionConfirm] = useState('');
    const [actionCancel, setActionCancel] = useState('');
    const [name,setName] = useState('')
    const navigation = useNavigation();
    const closeActionSheet = () => setActionSheet(false);

    const dispatchRedux = useDispatch()
    useEffect(()=>{
        setName(current_user?.fullname || '')
    },[])
    
    const calluser = async() => {
        if(actionType == 'logout'){
            console.log('log user')
            logout()
            //firbaseeSignOuter();
        }else{
            console.log('delete account')
            let res = await _me();
            let body = {
                "id": res.id
            };

            try {
                let res = await _deleteAccount({
                    body: body,
                });
                    if(res.STATUS == 'ok'){
                        logout();
                        Toast.show("Account deleted successfully");
                        return ZegoUIKitPrebuiltCallService.uninit();
                    }
                //console.log(body);
                console.log("delete results => " + res.STATUS);
            } catch (err) {
                console.log("updateLocation "+err);
                Toast.show("An error occured please try again later");
            }
        }
        setActionSheet(false)
    }

    const firbaseeSignOuter = async() => {
        await signOut(getAuth()).then(() => console.log('User signed out!'));
    }

  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
      
        <View
            style={{
                width: '100%',
                paddingBottom:10,
                marginTop:20,
                paddingLeft:10,
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#0512250D'
            }}>
            <View style={style.container}>
                <Image
                source={{uri: current_user?.image_url }}
                resizeMode={"cover"}
                style={style.sideMenuProfileIcon}
                />
                <View style={style.containertext}>
                    <Text className="text-[16px]" style={{fontFamily:Font.family_bold, width:'100%'}}>
                    {'My Account'}
                    </Text>
                    <Text className='mt-[4px] pl-[8px] pr-[8px] pt-1 pb-1 text-[10px]' style={{color: AppColors.buttonColor, backgroundColor:'#FFEEFD', width:'100%'}}>
                    {name}
                    </Text>
                </View>
            </View>
        </View>
        
        <View style={[{flex:1,backgroundColor:'#F6F6F6',paddingLeft:15,paddingRight:15, paddingTop:15, paddingBottom:15}]}>
            <View style={[style.main_container,{flex:1,flexDirection:'column'}]}>
            
            <View style={[style.gridItem,style.borersTop]}>
                <View style={{flexDirection:'row',}}>
                    <View
                        style={{
                            marginTop:5,
                            backgroundColor: 'white'
                        }}>
                        <View style={{ marginTop: 7}} className="w-8 h-8 bg-[#F5F7FF] rounded-[38px]">
                            <View className="pl-1 pt-1">
                                <IconOutline name="tool" size={18} style={{marginTop:3, marginLeft:4}} />
                            </View>
                        </View>
                    </View>
                    <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225] text-[14px]" >
                        {'Profile Settings'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        //openChatroom(item);
                        navigation.navigate('ProfileDetails')
                    }} style={{}} >
                    <IconOutline
                    name="right"
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', lineHeight:50, left:0 }}
                    />
                </TouchableOpacity>
            </View>

            <View style={[style.gridItem]}>
                <View style={{flexDirection:'row',}}>
                    <View
                        style={{
                            marginTop:5,
                            backgroundColor: 'white'
                        }}>
                        <View style={{ marginTop: 7}} className="w-8 h-8 bg-[#F5F7FF] rounded-[38px]">
                            <View className="pl-1 pt-1">
                                <IconOutline name="lock" size={18} style={{marginTop:3, marginLeft:4}} />
                            </View>
                        </View>
                    </View>
                    <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225] text-[14px]" >
                        {'Security'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        //openChatroom(item);
                        navigation.navigate('SecurityScreen')
                    }} style={{}} >
                    <IconOutline
                    name="right"
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', lineHeight:50, left:0 }}
                    />
                </TouchableOpacity>
            </View>

            <View style={[style.gridItem,style.borersBot]}>
                <View style={{flexDirection:'row',}}>
                    <View
                        style={{
                            marginTop:5,
                            backgroundColor: 'white'
                        }}>
                        <View style={{ marginTop: 7}} className="w-8 h-8 bg-[#F5F7FF] rounded-[38px]">
                            <View className="pl-1 pt-1">
                                <IconOutline name="question-circle" size={18} style={{marginTop:3, marginLeft:4}} />
                            </View>
                        </View>
                    </View>
                    <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-normal font-medium text-[#051225] text-[14px]" >
                        {'Help Service'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        //openChatroom(item); 
                        navigation.navigate('HelpScreen')
                    }} style={{}} >
                    <IconOutline
                    name="right"
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', lineHeight:50, left:0 }}
                    />
                </TouchableOpacity>
            </View>

            </View>

            <View style={[style.main_container,{flex:1,flexDirection:'column'}]}>
            
            <View style={[style.gridItem,style.borersTop]}>
                <View style={{flexDirection:'row',}}>
                    <View
                        style={{
                            marginTop:5,
                            backgroundColor: 'white'
                        }}>
                        <View style={{ marginTop: 7}} className="w-8 h-8 bg-[#F5F7FF] rounded-[38px]">
                            <View className="pl-1 pt-1">
                                <IconOutline name="key" size={18} style={{marginTop:3, marginLeft:4}} />
                            </View>
                        </View>
                    </View>
                    <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225] text-[14px]" >
                        {'Privacy Policy'}
                    </Text>
                </View>
                <TouchableOpacity
                onPress={() => {
                    //openChatroom(item);
                    navigation.navigate('PrivacyPolicy')
                }}
                     style={{}} >
                    <IconOutline
                    name="right"
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', lineHeight:50, left:0 }}
                    />
                </TouchableOpacity>
            </View>

            <View style={[style.gridItem]}>
                <View style={{flexDirection:'row',}}>
                    <View
                        style={{
                            marginTop:5,
                            backgroundColor: 'white'
                        }}>
                        <View style={{ marginTop: 7}} className="w-8 h-8 bg-[#F5F7FF] rounded-[38px]">
                            <View className="pl-1 pt-1">
                                <IconOutline name="logout" color={'#D81212'} size={18} style={{marginTop:3, marginLeft:4}} />
                            </View>
                        </View>
                    </View>
                    <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-medium text-[#D81212] text-[14px]" >
                        {'Log Out'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setActionSheet(true)
                        setActionType('logout')
                        setActionDesc('Do you wish to continue?')
                        setActionTitle('You are about logging out of your account.')
                        setActionConfirm('Yes, Logout')
                        setActionCancel('No, Cancel')
                    }} style={{}} >
                    <IconOutline
                    name="right"
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', lineHeight:50, left:0 }}
                    />
                </TouchableOpacity>
            </View>

            <View style={[style.gridItem,style.borersBot]}>
                <View style={{flexDirection:'row',}}>
                    <View
                        style={{
                            marginTop:5,
                            backgroundColor: 'white'
                        }}>
                        <View style={{ marginTop: 7}} className="w-8 h-8 bg-[#F5F7FF] rounded-[38px]">
                            <View className="pl-1 pt-1">
                                <IconOutline name="delete" size={18} style={{marginTop:3, marginLeft:4}} />
                            </View>
                        </View>
                    </View>
                    <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-normal font-medium text-[#051225] text-[14px]" >
                        {'Delete Account'}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        setActionSheet(true)
                        setActionType('delete')
                        setActionDesc('Do you wish to continue?')
                        setActionTitle('You are about to delete this account. \nDetails of this account will be lost.')
                        setActionConfirm('Yes, Delete')
                        setActionCancel('No, Cancel')
                    }} style={{}} >
                    <IconOutline
                    name="right"
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', lineHeight:50, left:0 }}
                    />
                </TouchableOpacity>
            </View>

            </View>
        </View>

        <Modal
            isVisible={actionSheet}
            style={{
            margin: 0,
            justifyContent: 'flex-end',
            }}>
            <ActionSheet 
                desc={actionDesc}
                title={actionTitle}
                confirm={actionConfirm}
                cancel={actionCancel} 
                action={calluser} 
                onCancel={closeActionSheet} 
            />
        </Modal>
    </SafeAreaView>
  )
};

const style = StyleSheet.create({
    main_container:{
        borderRadius:32,
        marginTop:16,
        padding:4
    },
    sideMenuProfileIcon: {
      width: 52,
      height: 52,
      borderRadius: 100 / 2,
      alignSelf: 'center',
    },
    container: {
      justifyContent: 'flex-start',
      padding: 8,
      flexDirection:'row',
      alignItems:'center'
    },
    containertext:{
        flexDirection:'column',
        marginLeft:10,
        width:'auto'
    },
    searchIcon: {
        position:"absolute",
        zIndex:999,
        right:0,
        marginTop:5.5,
        marginRight:20
    },
    userIcon:{
        width:'18%',
        height: 50,
        marginBottom:0,
        backgroundColor:'#F6F6F6'
    },
    textStyling: {
            fontSize: 20,
            fontStyle: 'italic',
            color: 'black'
    },
    innerContainer: {
            flex: 1,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center'

    },
    button: {
            flex: 1
    },
    gridItem: {
        width:'100%',
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:7,
        paddingTop:7,
        flexDirection:'row',
        height: 'auto',
        backgroundColor: 'white',
        justifyContent:'space-between',
        
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    borersTop:{
        borderTopRightRadius:12,
        borderTopLeftRadius:12,
        borderBottomWidth:0.5,
        borderColor: '#05122514',
    },
    borersBot:{
        borderBottomRightRadius:12,
        borderBottomLeftRadius:12,
        borderTopWidth:0.5,
        borderColor: '#05122514',
    }
  });