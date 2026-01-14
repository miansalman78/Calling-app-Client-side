import React, {useState} from 'react';
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
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import BackAppHeader from '../components/BackAppHeader';
import { Switch } from 'react-native-switch';

export default function SecurityScreen(props) {
 
    const [actionSlide, setActionSlide] = useState(false);
    const [actionType, setActionType] = useState('');
    const [actionTitle, setActionTitle] = useState('');
    const [actionDesc, setActionDesc] = useState('');
    const [actionConfirm, setActionConfirm] = useState('');
    const [actionCancel, setActionCancel] = useState('');
    const navigation = useNavigation();
    const closeActionSheet = () => setActionSheet(false);
    const changeslider = (val) => {
        setActionSlide(val)
    }
  return (
    
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
    
    <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#0512250D'}]}>
            <BackAppHeader />
            <View style={[{flexDirection:'column',marginRight:20, marginLeft:20}]}>
            <Text className="mb-[16.00px] mt-[16.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'Security'}
            </Text>
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
                                <IconOutline name="edit" size={18} style={{marginTop:3, marginLeft:4}} />
                            </View>
                        </View>
                    </View>
                    <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-normal font-medium text-[#051225] text-[14px]" >
                        {'SeeMe Status'}
                    </Text>
                </View>
                <View style={{marginTop:15, marginRight:15}}>
                    <Switch
                        value={actionSlide}
                        onValueChange={(val) => changeslider(val)}
                        disabled={false}
                        activeText={'ON'}
                        inActiveText={'OFF'}
                        backgroundActive={'#F40ADB'}
                        backgroundInactive={'gray'}
                        circleActiveColor={'white'}
                        circleInActiveColor={'#000000'}
                        barHeight={20}
                        circleSize={20}
                        switchLeftPx={5}
                        switchRightPx={5}/>
                </View>
            </View>

            <View style={[style.gridItem, style.borersBot]}>
                <Text style={{ borderRadius:12,}} className="mt-[0.00px] bg-[#FFF8EE] mb-[8.00px] p-[15px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#F47A0A] rounded-[40px] text-[10px] tracking-[0] leading-[normal]" >
                {'Note that switching your SeeMe Status OFF or ON will  determine whether you can be tracked or not.'}
                </Text>
            </View>
            </View>
      </View>
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
      // borderRadius: 100 / 2,
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
    },
    borersBot:{
        borderBottomRightRadius:12,
        borderBottomLeftRadius:12,
        
    }
  });