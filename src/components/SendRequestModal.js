import React, {useState,useEffect, useCallback} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Button from './Buttons';
import ActionSheet from './Actionsheet';
import RequestMessages from './RequestMessages';
import Modal from 'react-native-modal';
import {_postSendRequest,_getActiveRequest, _patchSendRequest} from '../utils/api';
import useAuth from '../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux'
import Toast from 'react-native-simple-toast';
import { updateRequestStatus ,updateCurrentUser} from '../slices/requestSlice'
import {getErrorMessage} from '../utils/helper'
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import {_getDetailsLatLong, _sendFCMMessage} from '../utils/api'
import { send_push_notification } from '../utils/videoCallFunction';
import {getDatabase, get, ref, onValue, off, update} from 'firebase/database';

export default function SendRequestModal(props) {
  const navigation = useNavigation();
  const [actionSheet, setActionSheet] = useState(false);
  const [actionSheetMessages, setActionSheetMessages] = useState(false);
  const [selectedMsg, setSelectedMessage] = useState("");
  const [actionSheetItems, setActionSheetItems] = useState([])
  const {isLoggedIn, user} = useAuth();
  const closeActionSheet = () => setActionSheet(false);
  const closeActionSheetMessages = () => setActionSheetMessages(false);
  const {item, closeSendRequestModal, trackingBoxStatus, setTrackingBoxStatus,getOneTimeLocation, updateLocation, onetimeupdateLocation} =
    props;
  const current_user = useSelector((state) => state.requestStatus?.currentUser || {});
  const current_request = useSelector((state) => state.requestStatus?.requestStatus || {});

  const dispatchRedux = useDispatch()
  console.log(item)
  // useEffect(()=>{

  //   const updateRequest = async() => {
  //     let currentRequest = await _getActiveRequest()
  //     dispatchRedux(updateRequestStatus(currentRequest))
  //   }


  //   let timer = setInterval(()=>{
  //     updateRequest()
  //   },10000)
  //   return () => {
  //     // timer.clearInterval()
  // }
  // },[])

  useEffect(() => {
    const updateRequestDetails = async () => {
      let res = await _getActiveRequest();
        
      //console.log(res);
      console.log("SendRequestModal dispatcher");
      dispatchRedux(updateRequestStatus(res));
    };

    updateRequestDetails();
    let timer = setInterval(() => {
      updateRequestDetails();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const actionItemsSendRequest = [
    {
      id: 1,
      label:
        'Hey, it’s me. Want to make sure it’s all’s good out there. Okay to track you?',
      onPress: () => {
        updateRequestStatusMessage('Hey, it’s me. Want to make sure it’s all’s good out there. Okay to track you?')
      },
    },
    {
      id: 2,
      label:
        'Hey, it’s me. Want to make sure all’s good along the way. Okay to track you?      ',
      onPress: () => {
        updateRequestStatusMessage('Hey, it’s me. Want to make sure all’s good along the way. Okay to track you?')
      },
    },
    {
      id: 3,
      label: 'Hey, it’s me. Okay to track you?',
      onPress: () => {
        updateRequestStatusMessage('Hey, it’s me. Okay to track you?')
      },
    },
  ];

  const actionItemsAccept = [
    {
      id: 1,
      label:
        'Sounds good! Thanks',
      onPress: () => {
        acceptDeclineRequest('accept','Sounds good! Thanks')
      },
    },
    {
      id: 2,
      label:
        'Sounds good honey! Thanks ',
      onPress: () => {
        acceptDeclineRequest('accept','Sounds good honey! Thanks')
      },
    },
    {
      id: 3,
      label: 'Sounds good mom! Thanks',
      onPress: () => {
        acceptDeclineRequest('accept','Sounds good mom! Thanks')
      },
    },
    {
      id: 4,
      label: 'Sounds good dad! Thanks',
      onPress: () => {
        acceptDeclineRequest('accept','Sounds good dad! Thanks')
      },
    },
  ];

  const actionItemsDecline = [
    {
      id: 1,
      label:
        "No, I'm good. But thanks a lot",
      onPress: () => {
        acceptDeclineRequest('decline', "I'm good. But thanks a lot")
      },
    },
    {
      id: 2,
      label:
      "Not right now, honey But thanks",
      onPress: () => {
        acceptDeclineRequest('decline',"Not right now, honey But thanks")
      },
    },
    {
      id: 3,
      label: 'No need, dad. But thanks a lot',
      onPress: () => {
        acceptDeclineRequest('decline','No need, dad. But thanks a lot')
      },
    },
    {
      id: 4,
      label: 'No need, mom. But thanks a lot',
      onPress: () => {
        acceptDeclineRequest('decline','No need, mom. But thanks a lot')
      },
    },
    {
      id: 5,
      label: 'No need. But thanks a lot',
      onPress: () => {
        acceptDeclineRequest('decline','No need.But thanks a lot')
      },
    },
  ];

  const openActionSheet = (type) => {

    if(type == "send_request"){
      setActionSheetItems(actionItemsSendRequest)
    }else if(type == "accept"){
      setActionSheetItems(actionItemsAccept)
    }
    else if(type == "decline"){
      setActionSheetItems(actionItemsDecline)
    }
    setActionSheetMessages(true)
  }

  const updateRequestStatusMessage = (message) => {
    setSelectedMessage(message)
    setTrackingBoxStatus("send_request_confirm")
    closeActionSheet();
    closeActionSheetMessages();
  }

  const acceptDeclineRequest =  async (flag,message) => {
    flag = (flag == "accept" ? "accepted" : "declined")
    let body = {
      "request_status": flag ,
      "description_message":message
    }

    //geolocationGetCurrentPosition();

    try {
      let res = await _patchSendRequest({ pk:current_request?.request?.id ,body:body });

      Toast.show(`Request Successfully ${flag} !`);
      closeActionSheet();
      closeActionSheetMessages();
      closeSendRequestModal(false)
      let currentRequest = await _getActiveRequest()
      
      

      dispatchRedux(updateRequestStatus(currentRequest))
      /*send_push_notification(
        current_request?.request?.from_user?.device_token,
        `Track Request ${flag} !`,
        `${current_request?.request?.to_user?.fullname} has ${flag} your track request. ${message}`
      )*/
      let daty = {
        type:'tracker',
        device_token : item.device_token,
        email: item.email,
        fullname: item.fullname,
        id: item.id.toString(),
        is_email_present: item.is_email_present.toString(),
        is_number_present: item.is_number_present.toString(),
        phone_number: item.phone_number,
        room_id: item.room_id,
        user: item.user.toString()
      }
      fcmsender(current_request?.request?.from_user?.device_token, `Track Request ${flag} !`, `${current_request?.request?.to_user?.fullname} has ${flag} your track request. ${message}`, daty);
      getOneTimeLocationNow()
      sendChat(`Track Request ${flag} !`);
      //getOneTimeLocation();
    } catch (err) {
      console.log(err)
      Toast.show(getErrorMessage(err));
      closeActionSheet();
      closeActionSheetMessages();
    }
  }

  const getOneTimeLocationNow = () => {

    geolocationGetCurrentPosition();

    AsyncStorage.getItem("locationStatus").then((value)=>{
        if(value == "allowed"){
          Geolocation.watchPosition(
            //Will give you the current location
            position => {
              console.log(position)
              //getting the Longitude from the location json
              const currentLongitude =
                JSON.stringify(position.coords.longitude);

              //getting the Latitude from the location json
              const currentLatitude =
                JSON.stringify(position.coords.latitude);
                
              try {
                updateLocation(currentLatitude,currentLongitude);
              }catch(err){
                console.log('getOneTimeLocationNow failed from sendrequestmodal ',err);
              }
              //Toast.show('New location update onetimelocation called fro now',);
              // _getDetailsLatLong(`${currentLatitude},${currentLongitude}`).then((value)=>{

              //   setCurrentLocation(value?.results[0] || {})
              // })

            },
            (error) => {
              Toast.show("Please check the location Permissions. Error fetching current location")
              AsyncStorage.setItem("longitude",'');
              AsyncStorage.setItem("latitude",'');
            },
            {
              enableHighAccuracy: true,
              // timeout: 20000,
              maximumAge: 0,
              distanceFilter: 20
            },
          );
        }else{
          Toast.show("Please check the location Permissions")
          AsyncStorage.setItem("longitude",'');
              AsyncStorage.setItem("latitude",'');
        }
      }).catch = (err) => {
        Toast.show("Please check the location Permissions")
        AsyncStorage.setItem("longitude",'');
              AsyncStorage.setItem("latitude",'');
      }
  };

  const geolocationGetCurrentPosition = () => {
  console.log('geolocationGetCurrentPosition from sendrequest');
  Geolocation.getCurrentPosition(
          position => {
            
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            
            AsyncStorage.setItem("longitude",currentLongitude);
            AsyncStorage.setItem("latitude",currentLatitude);
            

            try {
                //updateLocation(currentLatitude,currentLongitude);
                onetimeupdateLocation(currentLatitude,currentLongitude);
                
              }catch(err){
                console.log('getOneTimeLocationNow failed from sendrequestmodal after them position',err);
                //navigation.navigate('TrackerScreen');
              }

            //setSpin(false);
            
          },
          error => {
            Toast.show('Please check the location Permissions. Error fetching current location');
            AsyncStorage.setItem('longitude', '');
            AsyncStorage.setItem('latitude', '');
            //setSpin(false);
          },
          {
            enableHighAccuracy: true,
            // timeout: 20000,
            maximumAge: 0,
            distanceFilter: 20,
          },
        );
};


  const proceedApproveRequest =  async () => {
    let body = {
      "request_status": "request_sent", //todo change to cancelled
      "from_user": current_user.id,
      "to_user": item.phone_number,
      "request_sent_msg":selectedMsg
    }

    try {
      let res = await _postSendRequest({ body });
      console.log('_postSendRequest => ',res);
      Toast.show("Request Succesfully Sent ! Please wait for the response");
      /*send_push_notification(
        item.device_token,
        "Track Request Recieved",
        `${current_user.fullname} has sent you a track request. ${selectedMsg}`
      )*/
      let daty = {
        type:'tracker',
        device_token : item.device_token,
        email: item.email,
        fullname: item.fullname,
        id: item.id.toString(),
        is_email_present: item.is_email_present.toString(),
        is_number_present: item.is_number_present.toString(),
        phone_number: item.phone_number,
        room_id: item.room_id,
        user: item.user.toString()
      }
      fcmsender(item.device_token, "Track Request Recieved", `${current_user.fullname} has sent you a track request. ${selectedMsg}`, daty);
      sendChat("Track Request sent");
      closeActionSheet();
      closeActionSheetMessages();
      let currentRequest = await _getActiveRequest()
      

      dispatchRedux(updateRequestStatus(currentRequest))
    } catch (err) {
      Toast.show(getErrorMessage(err));
      closeActionSheet();
      closeActionSheetMessages();
    }
  }

  const cancelRequest = async() => {

    if((current_request?.request?.id || '') == ''){
      closeSendRequestModal(false);
      return
    }

    try {
      let body = {
        "request_status": "cancelled",
      }
      let res = await _patchSendRequest({ pk:current_request?.request?.id ,body:body });
      Toast.show("Request Succesfully Cancelled !");
      closeActionSheet();
      closeActionSheetMessages();
      closeSendRequestModal(false)
      /*send_push_notification(
        item.device_token,
        "Track Request Cancelled",
        `${current_user.fullname} has cancelled track request.`
      )*/
      
      let daty = {
        type:'tracker',
        device_token : item.device_token,
        email: item.email,
        fullname: item.fullname,
        id: item.id.toString(),
        is_email_present: item.is_email_present.toString(),
        is_number_present: item.is_number_present.toString(),
        phone_number: item.phone_number,
        room_id: item.room_id,
        user: item.user.toString()
      }
      fcmsender(item.device_token, "Track Request Cancelled", `${current_user.fullname} has cancelled track request.`, daty);
      let currentRequest = await _getActiveRequest()
      sendChat("Track Request Cancelled");

      
      dispatchRedux(updateRequestStatus(currentRequest))
    } catch (err) {
      Toast.show(getErrorMessage(err));
      closeActionSheet();
      closeActionSheetMessages();
    }

  }

  const sendChat = async(text) => {
    const database = getDatabase();
    let _item = item;
    _item['id'] = item['is_email_present'];
    let _chat_id = getChatID(_item);
    //fetch fresh messages from server
    const currentChatroom = await fetchMessages();
    const lastMessages = currentChatroom.messages || [];
    update(ref(database, `chatroom/${_chat_id}`), {
      messages: [
        ...lastMessages,
        {
          text: text,
          sender: current_user.fullname,
          receiver:item.fullname,
          senderID: current_user.id,
          recieverID: item.id,
          createdAt: new Date(),
          status: 'sent',
        },
      ],
    });
  }

  const fetchMessages = async () => {
    const database = getDatabase();
    let _item = item;
    _item['id'] = item['is_email_present'];
    let _chat_id = getChatID(_item);
    const snapshot = await get(
      ref(database, `chatroom/${_chat_id}`),
    );

    return snapshot.val();
  };

  const getChatID = _item => {
    return current_user.id > _item.id
      ? current_user.id + '_' + _item.id
      : _item.id + '_' + current_user.id;
  };

  const fcmsender = async(fcmer, titler, bodyer, datler) => {
    let body = {
      title: titler,
      body: bodyer,
      fcm: fcmer,
      data: datler
    }
    let response = await _sendFCMMessage({ body });
  }

  const getModalContent = () => {
   let _currentRequest = current_request?.request || {};

     if (trackingBoxStatus == 'send_request' && (current_request?.request?.request_status || '') != "request_sent"){

       return (
        <View >
            <View style={{flexDirection: 'row'}}>
                <View style={{flex:9, marginTop:20, marginRight:-30}}>
                    <Text className="text-[14px] mt-[0px] mb-[4px] text-center font-semibold" >
                    {'Request Tracking'}
                    </Text>
                </View>
                <View style={{flex:1}}>
                    <IconOutline
                        onPress={() => closeSendRequestModal(false)}
                        name="close"
                        size={16}
                        color='#051225CC'
                        style={{marginRight:-50, marginTop:10}}
                    />
                </View>
            </View>
            <Text className='mt-[12px] mb-[16px] leading-5 pl-1 pr-1 font-normal text-[13px] text-[#051225CC]' >
                You have requested to track <Text className='text-[#F40ADB]'>{` ${item.fullname || _currentRequest.to_user.fullname} `}</Text> Click on <Text className='font-semibold'>“Select Request Message”</Text>
                and choose the tracking request message you would like to send.
            </Text>
            
            <Button
              onPress={() => openActionSheet("send_request")}
              title="Select Request Message"
              style={{width: '100%', marginTop: 10, borderRadius:32}}
            />
    </View>
       )
     }
     else if(trackingBoxStatus == 'send_request' && (_currentRequest?.request_status == "request_sent") && _currentRequest?.user_flag == "to_user"){

      return (
        <View>
              <View style={{flexDirection: 'row'}}>
                  <View style={{flex:9, marginTop:20, marginRight:0}}>
                      <Text className="text-[14px] mt-[0px] mb-[4px] text-center font-semibold" >
                      {'Track Request'}
                      </Text>
                  </View>
                  {/*<View style={{flex:1}}>
                      <IconOutline
                          onPress={() => closeSendRequestModal(false)}
                          name="close"
                          size={16}
                          color='#051225CC'
                          style={{marginRight:-50, marginTop:10}}
                      />
                  </View>*/}
              </View>
              <Text className='mt-[12px] mb-[16px] leading-5 pl-1 pr-1 font-normal text-[13px] text-[#051225CC]' >
              {` ${_currentRequest.to_user.fullname}`}<Text className='text-[#F40ADB]'>{`, ${_currentRequest.from_user.fullname} `}</Text> have requested to track you. 
              To enable requester to track you, click on “Accept”, and select one of the “Accept” message options. Otherwise, click on “Decline” and select one of the “Decline” message options
              </Text>
              
              <Button
                onPress={() => openActionSheet('accept')}
                title="Yes, Accept"
                style={{width: '100%', marginTop: 10, borderRadius:32}}
              />

              <Button
                onPress={() => openActionSheet('decline')}
                btnStyle={{color:'black',fontSize: 15,fontWeight:'400'}}
                title="No, Decline"
                style={{width: '100%', marginTop: 15, borderRadius:32, backgroundColor:'white',borderWidth:1,
                borderColor: '#05122514',}}
                />
            </View>
      )
  }
      else if((trackingBoxStatus == 'send_request_confirm' || (current_request?.request?.request_status == "request_sent"))){

          return (
            <View >
              <View style={{flexDirection: 'row'}}>
                  <View style={{flex:9, marginTop:20, marginRight:-30}}>
                      <Text className="text-[14px] mt-[0px] mb-[4px] text-center font-semibold" >
                      {'Track Request'}
                      </Text>
                  </View>
                  {/*<View style={{flex:1}}>
                      <IconOutline
                          onPress={() => closeSendRequestModal(false)}
                          name="close"
                          size={16}
                          color='#051225CC'
                          style={{marginRight:-50, marginTop:10}}
                      />
                  </View>*/}
              </View>
              <Text className='mt-[12px] mb-[16px] leading-5 pl-1 pr-1 font-normal text-[13px] text-[#051225CC]' >
                  You have requested to track <Text className='text-[#F40ADB]'>{current_request.active_request == false ? item?.fullname : _currentRequest.to_user.fullname}</Text> Your message <Text className='font-semibold'>`{selectedMsg != '' ? selectedMsg : current_request?.request?.request_sent_msg}`</Text>
                  If you click on Proceed, the response from {current_request.active_request == false ? item?.fullname : _currentRequest.to_user.fullname} will be displayed once it is received .
              </Text>
              {
                (current_request?.request?.request_status || '') == "request_sent" ?
                (<Text className='mt-[12px] mb-[16px] leading-5 pl-1 pr-1 font-normal text-[13px] text-center text-[#F40ADB]' >{'Response : Waiting for reply ...'}</Text>)
                :
                null
              }  
              
              <Button
                onPress={() => proceedApproveRequest()}
                title="Yes, Proceed"
                style={{width: '100%', marginTop: 10, borderRadius:32}}
                disabled = {current_request?.request?.request_status == "request_sent" ? true : false}
              />

              <Button
                onPress={() => cancelRequest()}
                btnStyle={{color:'black',fontSize: 15,fontWeight:'400'}}
                title="No, Cancel"
                style={{width: '100%', marginTop: 15, borderRadius:32, backgroundColor:'white',borderWidth:1,
                borderColor: '#05122514',}}
                />
            </View>
          )

    }


  };

  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'space-between',
        justifyContent: 'flex-start',
        width: '85%',
        padding: 20,
        margin: 20,
        zIndex: 999,
        backgroundColor: AppColors.background,
        height: 'auto',
        borderRadius: 20,
        elevation: 20,
        shadowColor: AppColors.textBlack,
        // flex:1
      }}>
      <Modal
        isVisible={actionSheet}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <ActionSheet actionItems={actionSheetItems} onCancel={closeActionSheet} />
      </Modal>

      <Modal
        isVisible={actionSheetMessages}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <RequestMessages actionItems={actionSheetItems} onCancel={closeActionSheetMessages} />
      </Modal>
      {getModalContent()}
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
    marginTop: 10,
    marginBottom: 10,
  },
  cardContainer: {
    height: 'auto',
    backgroundColor: AppColors.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
});
