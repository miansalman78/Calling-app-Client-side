import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors} from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';
import {useSelector, useDispatch} from 'react-redux';
import {updateRequestStatus} from '../slices/requestSlice';
import {_getActiveRequest, _patchSendRequest, _sendFCMMessage} from '../utils/api';
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper';
import useAuth from '../hooks/useAuth';
import {useNavigation} from '@react-navigation/native';
import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
} from 'firebase/database';
import {onJoinPress} from '../utils/videoCallFunction';
import {IconFill} from '@ant-design/icons-react-native';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { send_push_notification } from '../utils/videoCallFunction';
import Geolocation from 'react-native-geolocation-service';

export default function TrackingBox(props) {
  const {item} = props;

  const voiceRef = useRef();
  const videoRef = useRef();
  const navigation = useNavigation();
  const current_request = useSelector(
    state => state.requestStatus?.requestStatus || {},
  );
  const current_user = useSelector(
    state => state.requestStatus?.currentUser || {},
  );

  const selectedUser =
    current_user.id == current_request?.request?.to_user?.id
      ? current_request?.request?.from_user
      : current_request?.request?.to_user;

  const dispatchRedux = useDispatch();

  useEffect(() => {
    console.log('CURRENT USER ==>', current_user);
    console.log('SELECTED USER ==>', selectedUser);
    console.log('CURRENT REQUEST ==>', current_request);
    console.log('ITEM ==>', item);
    const updateRequestDetails = async () => {
      let res = await _getActiveRequest();
      if(res.request_status == "completed"){
        Geolocation.stopObserving();
        console.log("stopping the observer");
      }
      //console.log(res);
      dispatchRedux(updateRequestStatus(res));
    };

    updateRequestDetails();
    let timer = setInterval(() => {
      updateRequestDetails();
    }, 30000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const getChatID = () => {
    return current_user.id > selectedUser.id
      ? current_user.id + '_' + selectedUser.id
      : selectedUser.id + '_' + current_user.id;
  };

  const openChatroom = async item => {
    let _chat_id = getChatID();
    const database = getDatabase();
    
    const chatroomRef = ref(database, `chatroom/${_chat_id}`);
    onValue(chatroomRef, snapshot => {
      if (snapshot.exists()) {
        navigation.navigate('ChatScreen', {
          chat_id: _chat_id,
          selectedUser: selectedUser,
          currentUser: current_user,
        });
      } else {
        const newChatroomRef = push(ref(database, 'chatroom/' + _chat_id), {
          firstUser: current_user.id,
          secondUser: selectedUser.id,
          firstUserName: current_user.fullname,
          secondUserName: selectedUser.fullname,
          messages: [],
        });

        navigation.navigate('ChatScreen', {
          chat_id: _chat_id,
          selectedUser: selectedUser,
          current_user: current_user,
        });
      }
    });
  };

  const updateStatus = async flag => {
    try {
      let body = {
        request_status: flag,
      };
      let res = await _patchSendRequest({
        pk: current_request?.request?.id,
        body: body,
      });
      if(flag == "accepted"){
        flag = "resumed"
      }
      /*send_push_notification(
        current_request?.request?.from_user?.device_token,
        `Track Request ${flag} !`,
        `${current_request?.request?.to_user?.fullname} has ${flag} your track request.`
      )*/
      let bodybiler = {
        fcm: current_request?.request?.from_user?.device_token,
        title: `Track Request ${flag} !`,
        body: `${current_request?.request?.to_user?.fullname} has ${flag} your track request.`
      }
      let response = await _sendFCMMessage({ bodybiler });

      Toast.show(`Track request ${flag} !`);
      let currentRequest = await _getActiveRequest()
      dispatchRedux(updateRequestStatus(currentRequest))
    } catch (err) {
      console.log(err);
      //Toast.show(getErrorMessage(err));
    }
  };

    let _request = current_request?.request;
    return (
      <View
      style={{marginLeft:40, marginRight:40, marginBottom:20}}>
      <View
        style={{
          flexDirection: 'column',
          alignContent: 'space-between',
          justifyContent: 'center',
          padding: 20,
          zIndex: 999,
          backgroundColor: AppColors.background,
          height: 80,
          borderRadius: 20,
          elevation: 20,
          shadowColor: AppColors.textBlack,
        }}>
        {_request['user_flag'] == 'to_user' ? (
          <Text
            style={[
              GlobalStyles.descriptionText,
              {textAlign: 'center', marginTop: 10},
            ]}>
            You are being tracked by
            <Text style={{color: AppColors.buttonColor}}>
              {` ${_request?.from_user?.fullname}`}
            </Text>
          </Text>
        ) : (
          <Text
            style={[
              GlobalStyles.descriptionText,
              {textAlign: 'center', marginTop: 10},
            ]}>
            You are tracking
            <Text style={{color: AppColors.buttonColor}}>
              {`  ${_request?.to_user?.fullname}`}
            </Text>
          </Text>
        )}

        <View style={[styles.btnContainer]}>
        
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between'}}>
            
            <TouchableOpacity
              onPress={() => {
                updateStatus('accepted');
              }}>
              <IconOutline
                  name="pause"
                  color={'#051225B2'}
                  size={21}
                  style={[{marginLeft:0,marginRight:0}]}
                />
                <Text style={{lineHeight:14}} className="mt-[2.00px] [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225B2] text-[10px]" >
                {'Pause'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                updateStatus('completed');
              }}>
              <IconOutline
                  name="stop"
                  color={'#051225B2'}
                  size={21}
                  style={[{marginLeft:0,marginRight:0}]}
                />
                <Text style={{lineHeight:14}} className="mt-[2.00px] [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225B2] text-[10px]" >
                {'Stop'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                openChatroom();
              }}>
              <IconOutline
                  name="message"
                  color={'#051225B2'}
                  size={21}
                  style={[{marginLeft:0,marginRight:0}]}
                />
                <Text style={{lineHeight:14}} className="mt-[2.00px] [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225B2] text-[10px]" >
                {'Chat'}
              </Text>
            </TouchableOpacity>

            {_request['user_flag'] == 'to_user' ? (
              <>
                <View style={{marginTop: -4}}>
                  <ZegoSendCallInvitationButton
                    invitees={[1].map(inviteeID => {
                      return {userID: _request.from_user?.id.toString(), userName: _request.from_user?.fullname};
                      })}
                  isVideoCall={false}
                  resourceID={'traakme_com_call'} 
                  icon={require('../assets/new/phone.png')}
                  width={30}
                  height={32}
                  backgroundColor={'white'}  />
                  <Text style={{lineHeight:14}} className="mt-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225B2] text-[10px]" >
                    {'Audio'}
                  </Text>
                </View>

                <View style={{marginTop: -4}}>
                  <ZegoSendCallInvitationButton
                    invitees={[1].map(inviteeID => {
                      return {userID: _request.from_user?.id.toString(), userName: _request.from_user?.fullname};
                    })}
                    resourceID={'traakme_com_call'}
                    isVideoCall={true}
                    icon={require('../assets/new/video.png')}
                    width={30}
                    height={32}
                    backgroundColor={'white'}  />
                    <Text style={{lineHeight:14}} className="mt-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225B2] text-[10px]" >
                      {'Video'}
                    </Text>
              </View>
              </>
              ) : (
              <>
                <View style={{marginTop: -5}}>
                  <ZegoSendCallInvitationButton
                    invitees={[1].map(inviteeID => {
                      return {userID: _request.to_user?.id.toString(), userName: _request.to_user?.fullname};
                      })}
                  isVideoCall={false}
                  resourceID={'traakme_com_call'}
                  icon={require('../assets/new/phone.png')}
                  width={30}
                  height={32}
                  backgroundColor={'white'}  />
                  <Text style={{lineHeight:14}} className="mt-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225B2] text-[10px]" >
                    {'Audio'}
                  </Text>
                </View>

                <View style={{marginTop: -5}}>
                  <ZegoSendCallInvitationButton
                    invitees={[1].map(inviteeID => {
                      return {userID: _request.to_user?.id.toString(), userName: _request.to_user?.fullname};
                    })}
                    resourceID={'traakme_com_call'}
                    isVideoCall={true}
                    icon={require('../assets/new/video.png')}
                    width={30}
                    height={32}
                    backgroundColor={'white'}  />
                    <Text style={{lineHeight:14}} className="mt-[-2.00px] [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225B2] text-[10px]" >
                      {'Video'}
                    </Text>
              </View>
              </>
              )}

          </View>
            
        </View>

      </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  searchIcon: {
    position: 'absolute',
    zIndex: 999,
    right: 0,
    marginTop: 5.5,
    marginRight: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'space-between',
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
  },
  cardContainer: {
    height: 'auto',
    backgroundColor: AppColors.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  image: {
    height: 30,
    width: 40,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotateY: '180deg'}],
  },
});
