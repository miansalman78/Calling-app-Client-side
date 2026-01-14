import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {updateCurrentRequestItem} from '../slices/currentItemSlice';
import {_deleteContact} from '../utils/api';
import useAuth from '../hooks/useAuth';
import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
} from 'firebase/database';
import VideoCallPage from '../screens/VideoCallPage';
import {IconFill} from '@ant-design/icons-react-native';
import VoiceCallPage from '../screens/VoiceCallPage';
import {onJoinPress} from '../utils/videoCallFunction';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactCard(props) {
  const navigation = useNavigation();
  const videoRef = useRef();
  const voiceRef = useRef();

  const [userID, setUserID] = useState('');
  const [callID, setCallID] = useState('');
  const [notifCount, setNotifCount] = useState(0);

  const {item, refreshContacts, setItemToDelete} = props;
  const {isLoggedIn, user} = useAuth();
  const dispatchRedux = useDispatch();
  const [sendRequestModalVisible, setSendRequestModalVisible] = useState(false);
  const current_user = useSelector(
    state => state.requestStatus?.currentUser || {},
  );
  useEffect(() => {
    // console.log('USER DATA==>', current_user);
    setUserID(String(Math.floor(Math.random() * 100000)));
    setCallID(String(Math.floor(Math.random() * 10000)));
    getCountsFromStorage(item);
  }, []);

  const removeContent = async itemId => {
    await _deleteContact(itemId);
    refreshContacts();
  };

  const getCountsFromStorage = async itemId => {

    let value =  await AsyncStorage.getItem(itemId.email);
    console.log(itemId.email + " ==> " + value);
    //setNotifCount(JSON.parse(value));
    if(value == null){
      await AsyncStorage.setItem(itemId.email, JSON.stringify(notifCount));
      setNotifCount(JSON.parse(notifCount));
    }else{
      await AsyncStorage.getItem(itemId.email).then(value => {
          let newval = JSON.parse(value) + notifCount ;
          setNotifCount(newval);
          AsyncStorage.setItem(itemId.email, JSON.stringify(newval));
      });
    }
  };

  const getChatID = _item => {
    return current_user.id > _item.id
      ? current_user.id + '_' + _item.id
      : _item.id + '_' + current_user.id;
  };
  const openChatroom = async item => {
    console.log(item);
    let _item = item;
    _item['id'] = item['is_email_present'];
    let _chat_id = getChatID(_item);
    const database = getDatabase();

    current_user.id;
    const chatroomRef = ref(database, `chatroom/${_chat_id}`);
    console.log(chatroomRef);
    onValue(chatroomRef, snapshot => {
      if (snapshot.exists()) {
        navigation.navigate('ChatScreen', {
          chat_id: _chat_id,
          selectedUser: _item,
          currentUser: current_user,
        });
      } else {
        const newChatroomRef = push(ref(database, 'chatroom/' + _chat_id), {
          firstUser: current_user.id,
          secondUser: _item.id,
          firstUserName: current_user.fullname,
          secondUserName: _item.fullname,
          messages: [],
        });

        navigation.navigate('ChatScreen', {
          chat_id: _chat_id,
          item: _item,
          current_user: current_user,
        });
      }
    });
  };
  

  //const [show, setShow] = useState(false);
  //useEffect(() => {
  //  const timeo = setTimeout(()=>{
  //    setShow(true);
  //    console.log("res ta ");
  //  }, 2000);
  //  return() => clearTimeout(timeo);
  //},[show]);
  

  return (
    <View style={[styles.cardContainer]}>

    <View style={{flex: 1, flexDirection: 'row'}}>
    <View style={{alignItems: 'center',marginBottom:10, marginTop:30}}>
        <Image
          source={require('../assets/contctUser.png')}
          resizeMode="contain"
          style={styles.imageLogo}
        />
      </View>
        <View style={{width:'55%',marginBottom:0,marginLeft:10,marginRight:5,}}>
            <Text style={[styles.text,{fontFamily: Font.family_bold}]}>{`${item.fullname}`}</Text>
            {(item.email || '') != '' && (
                <Text style={[styles.text]}>{`${item.email}`}</Text>
            )}
            <Text style={[styles.text]}>{`${item.phone_number}`}</Text>
            <View style={{flexDirection: 'row',marginTop:10}}>

            {(item.is_email_present || '') != '' ? (
            <>
            <TouchableOpacity
                onPress={() => {
                  openChatroom(item);
                }}>
                
                <ImageBackground
                  source={require('../assets/chat.png')}
                  resizeMode="contain"
                  style={styles.imagebackground}>
                  {(notifCount > 0) ? (
                  <View style={styles.viewinimage}>
                    <Text style={styles.badge}>{notifCount}</Text>
                  </View>
                  ): null }
                </ImageBackground>
              </TouchableOpacity>

              <View style={styles.imagezego}> 
                <ZegoSendCallInvitationButton 
                  invitees={[1].map(inviteeID => { 
                    return { 
                      userID: item.is_email_present.toString(), 
                      userName: item.fullname, 
                    }; 
                  })} 
                  isVideoCall={false} 
                  resourceID={'traakme_com_call'}
                  icon={require('../assets/zegophone.png')}
                  width={34}
                  height={32} 
                />
              </View>  
              
              <View style={styles.imagezego}> 
                <ZegoSendCallInvitationButton 
                  invitees={[1].map(inviteeID => { 
                    return { 
                      userID: item.is_email_present.toString(), 
                      userName: item.fullname, 
                    }; 
                  })} 
                  resourceID={'traakme_com_call'} 
                  isVideoCall={true}
                  icon={require('../assets/zegovideo.png')}
                  width={34}
                  height={32}
                /> 
              </View> 

                  </>
              ) : (
                <></>
              )}

              <TouchableOpacity
                onPress={() => {
                  // alert('Send Track Request');
                  navigation.navigate('Tracker', {
                    item: item,
                  });
                }}>
                <Image
                  source={require('../assets/track.png')}
                  resizeMode="contain"
                  style={[styles.image, {marginRight: 0}]}
                />
              </TouchableOpacity>
            </View>
        </View>

        <View style={{flexDirection: 'row', marginTop:30}}>
            <TouchableOpacity onPress={() =>
              navigation.navigate('AddEditContact', {
                flag: 'edit',
                item: item,
                refreshContacts: refreshContacts,
              })
            }>
                <Text style={[styles.text]}>{'Edit'}</Text>       
            </TouchableOpacity>
            <Text >{' | '}</Text>
            <TouchableOpacity onPress={() => {
              // removeContent(item.id)
              setItemToDelete(item);
            }}>
                <Text style={[styles.text]}>{'Delete'}</Text>      
            </TouchableOpacity>
        </View>
    </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  imagebackground: {
    height: 30,
    width: 50,
    marginTop: 0,
    marginLeft: -10,
    marginRight: -10,
    padding: 10,
  },
  viewinimage: {
    position: 'absolute',
  },
  image: {
    height: 30,
    width: 30,
    marginLeft: 10,
    padding: 10,
  },
  imagezego: {
    flexDirection: 'row',
    marginRight: 6,
    marginLeft: 6,
    paddingTop: 0,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'space-between',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  cardContainer: {
    height: 'auto',
    width: '100%',
    backgroundColor: AppColors.background,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomColor:AppColors.newPink,
    borderTopColor: AppColors.newPink,
    borderBottomWidth:0.50,
    borderTopWidth:0.50,
  },
  circle: {
    marginRight: 8,
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotateY: '180deg'}],
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 30,
    textAlign: 'center',
    height: 18,
    width: 18,
    fontSize: 11,
    color: 'white',
  },
  text:{
    fontSize:(Font.textSize),
    color: AppColors.textBlack,
    lineHeight:18,
    fontFamily: Font.family_regular
  },
  imageLogo:{
    height: 40,
    width: 40,
    marginLeft: 5,
    padding: 10,
  }
});
