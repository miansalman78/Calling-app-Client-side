import React , {useState,useEffect,useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import UserAppHeader from '../components/UserAppHeader';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import ContactCard from '../components/ContactCard';
import GridItem from '../components/GridItem';
import Button from '../components/Buttons';
import {_fetchContacts,_getActiveRequest,_deleteContact, _updateDeviceToken, _me, _fetchContactsNextPage, _sendfcm, _postContact, _sendFCMMessage} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper'
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { useSelector, useDispatch } from 'react-redux'
import { updateRequestStatus } from '../slices/requestSlice'
import ConfirmBoxModal from '../components/ConfirmBox'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeepAwake from 'react-native-keep-awake';
import {IconOutline} from '@ant-design/icons-react-native';
import Modal from 'react-native-modal';
import ActionSheet from '../components/ActionsheetConfirm';
//import { getCountryCallingCode } from 'react-phone-number-input'
import examples from 'libphonenumber-js/mobile/examples'
import { getExampleNumber, isSupportedCountry } from 'libphonenumber-js'

import getCountryCallingCode from 'libphonenumber-js';
import DeviceCountry from 'react-native-device-country';

import * as ZIM from 'zego-zim-react-native'; 

import * as ZPNs from 'zego-zpns-react-native'; 

import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import {async} from '@firebase/util';
//import { checkMultiplePermissions } from '../helper/Permissions';
import {KeyCenter} from '../utils/Constants';
import codes from 'country-calling-code';
import {useNavigation} from '@react-navigation/native';
import { send_push_notification } from '../utils/videoCallFunction';
import {getDBConnection, createTable, getLocalData, updateHobies, addHobies, checkInsert} from "../utils/helper";
import { FloatingAction } from "react-native-floating-action";
import { selectContactPhone } from 'react-native-select-contact';
import parsePhoneNumber from 'libphonenumber-js';
import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
} from 'firebase/database';

const actions = [
  {
    icon: <IconOutline name="solution" color={'white'} size={20} style={[{marginRight:0,}]}/>,
    name: "bt_book",
    position: 2,
    color: AppColors.newPink,
  },
  {
    icon: <IconOutline name="edit" color={'white'} size={20} style={[{marginRight:0,}]}/>,
    name: "bt_manual",
    position: 1,
    color: AppColors.newPink,
  }
];

const send = async (userID, userName) => { 
  console.log('Incoming call with id : ', userID);
  let body = {
    id: userID
  };
  try {
    let res = await _sendfcm({
      body: body,
    });
    console.log(res.fcm);
    /*const notificationData = {
      type:'message',
      chat_id: params.chat_id.toString(),
      selectedUserEmail: selectedUser.email,
      selectedUserID: selectedUser.id.toString(),
      selectedUserFullname: selectedUser.fullname,
      selectedUserDevice: selectedUser.device_token,
      current_userID: currentUser.id.toString(),
      current_userFullname: currentUser.fullname,
    };*/
    
    let bodyler = {
      title: 'Missed Call',
      body: `Missed call from ${userName}!`,
      fcm: res.fcm
    }
    let response = await _sendFCMMessage({ bodyler });

  } catch (err) {
    console.log("updateLocation "+err);
  }
}

const onUserLogin = async (userID, userName, navigation) => { 

  return ZegoUIKitPrebuiltCallService.init( 
    KeyCenter.appID, 
    KeyCenter.appSign, 
    userID, 
    userName, 
    [ZIM, ZPNs], { 

      onOutgoingCallTimeout: (callID, inviter) => {
        console.log("call timed out => ",inviter.userID)
        console.log("call timed out => ",inviter)
        send(userID,inviter.userName);
      },
      ringtoneConfig: { 
        incomingCallFileName: 'zego_incoming.mp3', 
        outgoingCallFileName: 'zego_outgoing.mp3', 
      }, 

      notifyWhenAppRunningInBackgroundOrQuit: true, 
      isIOSSandboxEnvironment: true, 
      androidNotificationConfig: { 
        channelID: 'ZegoUIKit', 
        channelName: 'ZegoUIKit', 
      }, 

      requireConfig: data => { 
        return { 

          onHangUp: duration => { 
            console.log('########CallWithInvitation onHangUp going to home', duration); 
            navigation.navigate('Home'); 
          }, 

          topMenuBarConfig: { 
            buttons: [ZegoMenuBarButtonName.minimizingButton], 
          }, 

          onWindowMinimized: () => { 
            console.log('[Demo]CallInvitation onWindowMinimized'); 
            navigation.navigate('Home'); 
          }, 

          onWindowMaximized: () => { 
            console.log('[Demo]CallInvitation onWindowMaximized'); 
            navigation.navigate('ZegoUIKitPrebuiltCallInCallScreen'); 
          }, 
        }; 
      }, 
    }, 
  ); 
};

export default function ContactScreen(props) {

  const navigation = useNavigation();

  const [contacts,setContactList] = useState([])
  const [refreshing,setRefreshing] = useState(false)
  const [extradatadata,setExtradatadata] = useState(false)
  //const {navigation,route} = props
  const {route} = props
  const {params} = route
  const [cUSER, setCUser] = useState({});
  const current_request = useSelector(
    state => state.requestStatus?.requestStatus || {},
  );
  const current_user = useSelector(
    state => state.requestStatus?.currentUser || {},
  );
  const dispatchRedux = useDispatch()
  const [isModalVisible,setModalVisible] = useState(false)
  const [isFetching,setFetching] = useState(false)
  const [isnext,setNext] = useState(false)
  const [totalFectched,setTotalFectched] = useState(0)
  const [currentFetch,setCurrentFetch] = useState(0)
  const [contactToDelete,setDeletedRow] = useState({})

  const [actionType, setActionType] = useState('');
  const [actionTitle, setActionTitle] = useState('');
  const [actionDesc, setActionDesc] = useState('');
  const [actionConfirm, setActionConfirm] = useState('');
  const [actionCancel, setActionCancel] = useState('');
  const [dbdata, setdbData] = useState();
  const [togleflatlist, setTogleflatlist] = useState(false)
  const [deviceCountryCode, setDeviceCountryCode] = useState('');

  const [selectedItems, setSelectedItems] = useState([])
  const [isgroupcall,setGroupcall] = useState(false)
  const [isvideovoice,setVideovoice] = useState(false)

  let obbj = 'remoteMessage {"collapseKey": "com.kalugogo", "data": {"body": "Recieved from Ellincon Sunna !", "data": "{"selectedUser":{"room_id":"cheanyangwe20@gmail.com1686517116103","is_active":true,"is_email_present":82,"device_token":"fB5SLGb6R1WZtdbwk5dSw5:APA91bFfz_4GuGRhJO1CU9Uoo1DL59lRFZm07OIBKguYEz13SC6OFNHFOVjhPDMg7nzHa5MomHFJ8u1kLMJPZ1ZqS_qAvV8sS7Exe17zieVIDElgLrvknAxrNUtojLg01UihmnfXmABQ","phone_number":"+237676627827","id":82,"created_date":"2023-06-11T20:58:36.430696Z","fullname":"Anyangwe Che","modified_date":"2023-06-11T20:58:36.430753Z","user":83,"email":"cheanyangwe20@gmail.com"},"chat_id":"83_82","current_user":{"last_login":"2023-10-03T19:02:08.214174Z","device_token":"fONQ508YTO2i_XLou8VZTf:APA91bH1k0qjhqTNoET9A-tTgfNA5D0EHAnYBqFmnhS7-e7u4AiTCBHX5I5j087gRFbkVemgpdR1ls1NKFdX_0BMaVd40AXCpw8PbEzJDEAFtmAuR0sBUD_UOwl_6aXFPJI0Ox1JJ377","last_name":"","phone_number":"+237695907169","id":83,"fullname":"Ellincon Sunna","date_joined":"2023-06-11T20:56:00.893755Z","first_name":"","email":"ellinconsunna@gmail.com","username":"ellinconsunna"}}", "title": "New Message Recieved"}, "from": "108974893258", "messageId": "0:1696882147482086%65b4677c65b4677c", "notification": {"android": {}, "body": "Recieved from Ellincon Sunna !", "title": "New Message Recieved"}, "sentTime": 1696882147439, "ttl": 2419200}'

  useEffect(() => {
    //fetchlocalDB();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //const db = await getDBConnection();
      if(remoteMessage.data.type == 'message'){
        /*const fcmdata = { user: remoteMessage?.data.current_userID.toString(), count: 1 };
        checkInsert(db, fcmdata);
        
        setTimeout(() => { 
          //let objj = dbdata.findIndex(ob => ob.user == remoteMessage?.data.current_userID.toString());
          //let newdbdata = dbdata
          //console.log('objj', objj)
          //console.log('objj', newdbdata[objj])
          
          //newdbdata[objj].count = newdbdata[objj].count+1;
          getLocalData(db, setdbData);
          console.log('dbdata =>', dbdata)
          //console.log('newdbdata =>', newdbdata)
          //setdbData(newdbdata)
          setTogleflatlist(value => !value);
        }, 5000);*/
        setTimeout(() => { 
          setTogleflatlist(value => !value);
          refreshContacts() ;
        }, 2000); 
        /*setTimeout(() => { 
          //let objj = dbdata.findIndex(ob => ob.user == remoteMessage?.data.selectedUserID.toString());
          let newdbdata = dbdata
          newdbdata["count"] = newdbdata["count"]+1;
          console.log('dbdata =>', dbdata)
          console.log('newdbdata =>', newdbdata)
          setdbData(newdbdata)
          setTogleflatlist(value => !value);
          
        }, 5000); 
        setTimeout(() => { 
          refreshContacts() ;
        }, 8000); */
      }
      if(remoteMessage.data.type == 'tracker' && remoteMessage.notification.title == "Track Request Recieved"){
        /*const fcmdata = { user: remoteMessage?.data.user.toString(), count: 1 };
        checkInsert(db, fcmdata);
        
        setTimeout(() => { 
          getLocalData(db, setdbData);
          console.log('dbdata =>', dbdata)
          //console.log('newdbdata =>', newdbdata)
          //setdbData(newdbdata)
          setTogleflatlist(value => !value);
        }, 5000);*/
        setTimeout(() => { 
          setTogleflatlist(value => !value);
          refreshContacts() ;
        }, 2000); 
      }
      //console.log('remoteMessage', remoteMessage);
      //console.log('remoteMessage chat_id => ', remoteMessage.data.data.chat_id);
      if (remoteMessage != null) {
        if(remoteMessage?.data?.title == "New Message Recieved"){
          let id = remoteMessage?.data?.email;
          console.log(id);
          //updateNotifCount(id);

          //updateNotifCount(id);
          //const newdata = await createnewitems(contacts, id);
          //console.log(contacts);
          //let objec = contacts.findIndex((obj => obj.email == id));
          //contacts[objec].notifcount = 1;

          //const newobj = { ...contacts[objec], notifcount: 1}
          //const updatedobj = [...contacts.slice(0,objec), newobj, ...contacts.slice(0,objec+1),]
          //setContactList(newobj);


          /*const sostate = contacts.map(obj => obj.email === id ? {...obj, notifcount: 1} : obj);
          setContactList(sostate);
          console.log(sostate);*/
          //console.log(contacts);
          //getCountsFromStorage(id);
          //refreshContacts();
        }
      }
    });
    return unsubscribe;
  }, []);

  async function fetchlocalDBOld() { 
    const db = await getDBConnection();
    getLocalData(db, setdbData);
    refreshContacts();
    //setTogleflatlist(value => !value);
    console.log('togleflatlist =>', togleflatlist);
  }


  const getChatID = _item => {
    return current_user.id > _item.id
      ? current_user.id + '_' + _item.id
      : _item.id + '_' + current_user.id;
  };

  const countSeen = (items) => {
    let sendered = [];
    items.forEach(async(item, i) => {
      let _item = item;
      if(item['is_email_present']){
        _item['id'] = item['is_email_present'];
        let _chat_id = getChatID(item);
        const database = getDatabase();
        const snapshot = await get(ref(database, `chatroom/${_chat_id}`),);
        //console.log(_chat_id)
        //console.log(snapshot.val().messages)
        const mssgs = snapshot.val();
        let msgCount = 0;
        if(mssgs.messages != undefined){
          //console.log(mssgs.messages)
          mssgs.messages.map((msg, index) => {
            if(msg.status != undefined){
              msgCount ++;
            }
          })
        }
        let dat ={user: item['is_email_present'], count: msgCount, id: i}
        sendered.push(dat);
        console.log(dat);
      }
    })
  }

  useEffect(() => {
    console.log('params =>',params);
    if(params?.dbdaba == 'yes'){
      //fetchlocalDBOld();
      //console.log('refreshContacts =>')
      refreshContacts();
    }
    //fetchlocalDB();
    getDeviceToken();
    // (async function(){
    //   await onUserLogin(current_user.email, ccurrent_user.fullname);
    // })()
    setCUser(current_user);
    //initZeoCloud();
    //useredinfos();

    initZeoCloud(); 
    //AsyncStorage.setItem('changmonicasihang@gmail.com', JSON.stringify(3));
  }, [navigation, route]);


  
  const initZeoCloud = async () => { 
    try { 
      let res = await _me();
      await onUserLogin( res?.id.toString(), res?.fullname, navigation, ); 
    } catch (error) { 
      console.log('ERRoRR==', error); 
    } 
  }; 

  const useredinfos = async () => {
    try {
      let res = await _me();
      await onUserLogin(res.email, res.fullname);
    } catch (error) {
      console.log('ERRoRR==', error);
      console.log("zego not ininitiated "+res.email );
    }
  };


  useEffect(() => { 
    async function fetchData() { 
      try { 
        //await onUserLogin( current_user?.id.toString(), current_user?.fullname, navigation, ); 
      } catch (error) { 
        console.log('ERRoRR==', error); 
      } 
    } 

    setTimeout(() => { fetchData() }, 1000); 
    clearTimeout(); 

  }, [navigation, route]); 

  /*useEffect(() => {
    async function fetchData() {
      try {
        await onUserLogin(current_user?.email, current_user?.fullname);
      } catch (error) {
        console.log('ERRoRR==', error);
        console.log("zego not ininitiated "+current_user?.email);
      }
    }

    setTimeout(() => {
      fetchData();
    }, 1000);
    clearTimeout();
  }, [navigation, route]);*/

  const updateNotifCount = async (email) => {
    await AsyncStorage.getItem(email).then(value => {
      let newval = JSON.parse(value) + 1 ;
      AsyncStorage.setItem(email, JSON.stringify(newval));
    });
  }
  
  const getDeviceToken = async () => {

    /*await checkMultiplePermissions().then(result => { 
      console.log('checkMultiplePermissions', result); 
    });*/

    const authStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      alert: true,
      badge: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const token = await messaging().getToken();
      // const notificationKey = loginParams;
      // notificationKey.DeviceToken = token;
      updateDeviceToken(token);

      console.log('Notification Token: ', token);
    }
  };
  
  const updateDeviceToken = async (token) => {
    let body = {
      "device_token": token
    }
    await _updateDeviceToken({ body })
  }

  useEffect(()=>{
    
    const fetchContacts = async () => {
      try {
        let res = await _fetchContacts();
        //console.log('Contacts ==>',res);
        setTotalFectched(res.count);
        if(res.next !== null){
          setNext(true);
          setCurrentFetch(1);
        }

        /*const newdata = await createnewitems(listedcontact, 'nodata');
        console.log(newdata);
        setContactList(newdata);*/

        let listedcontact = res?.results;
        listedcontact.forEach(function(d){
          //console.log(d.id + " ==> " + d.email);
          let value = AsyncStorage.getItem(d.phone_number);
          if(value == null){
              AsyncStorage.setItem(d.phone_number, JSON.stringify(0));
              console.log(d.id + " ==> " + d.phone_number);
          }else{
              AsyncStorage.getItem(d.phone_number).then(value => {
                let newval = JSON.parse(value) ;
                AsyncStorage.setItem(d.phone_number, JSON.stringify(newval));
            });
          }
        });
        
        //updateNotifCount('cmomah@hotmail.com');
        setContactList(res?.results || [])
        if(contacts.length > 0){
          countSeen(res?.results)
        }
        
      } catch (err) {
        Toast.show(getErrorMessage(err));
      }
    }
    
    async function fetchlocalDB() { 
      const db = await getDBConnection();
      getLocalData(db, setdbData);
      fetchContacts();
      //setTogleflatlist(value => !value);
      console.log('togleflatlist =>', togleflatlist);
    }
    
    fetchContacts();

    const updateRequestDetails = async () => {
      let res = await _getActiveRequest()
      dispatchRedux(updateRequestStatus(res))
      if(res?.active_request == true){
        // navigation.navigate("Tracker")
        Toast.show("You have an in-process request. Please check the tracker screen");
      }
    };

    updateRequestDetails()

    let timer = setInterval(()=>{
      updateRequestDetails()
    },30000);

    //getPermission();

    KeepAwake.activate();
    return () => {
      clearInterval(timer);
      KeepAwake.deactivate();
     }
    }, [])

  const deleteItem = async (row) => {
    console.log('item ti delete =>', row);
    setModalVisible(true)
    setDeletedRow(row)

    setActionType('delete')
    setActionDesc('Do you wish to continue?')
    setActionTitle(`You are about to delete ${row.fullname}`)
    setActionConfirm('Yes, Delete')
    setActionCancel('No, Cancel')
  }


  const createnewitems = async (listers, email) => {
    let newcontact = [];
    listers.forEach(async(d) => {
      if(d.email == email){
        d.notifcount = 1;
        newcontact.push(d);
      }else{
        d.notifcount = 0;
        newcontact.push(d);
      }
    });
    return newcontact;
  }

  /*const createnewitems = async (listers) => {
    let newcontact = [];
    listers.forEach(async(d) => {
          //console.log(d.id + " ==> " + d.email);
    let value =  await AsyncStorage.getItem(d.email);
    if(value == null){
      //AsyncStorage.setItem(d.email, JSON.stringify(0));
      d.notifcount = 0;
      console.log(d);
      newcontact.push(d);
    }else{
      //AsyncStorage.getItem(d.email).then(value => {
          d.notifcount = value;
          console.log(d);
          newcontact.push(d);
        //});
      }
    });
    return newcontact;
  }*/


  const refreshContacts = async (text = '') => {

    try {
      setRefreshing(true)
      let res = await _fetchContacts(text);

      setTotalFectched(res.count);
        if(res.next !== null){
          setNext(true);
          setCurrentFetch(1);
        }

      

      setContactList(res?.results || [])
      setRefreshing(false)
    } catch (err) {
      setRefreshing(false)
      //Toast.show(getErrorMessage(err));
    }
    // getPermission()
  }

  const getPermission = async()=>{
    
    var phonebookArray = []
    DeviceCountry.getCountryCode()
    .then((result) => {
      const code = result.code.toUpperCase();
      const chesome = codes.find(({isoCode2}) => isoCode2 === code);
      const codeall = '+'+chesome.countryCodes[0];
      setDeviceCountryCode(codeall);
      
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept',
    })
        .then((res) => {
            console.log('Permission: ', res);
            if(res == 'granted'){
            Contacts.getAll()
                .then((contacts) => {
                    // work with contacts
                    //console.log(contacts);
                    contacts.map((contact) => {
                      //console.log(contact.displayName);
                      
                      contact.phoneNumbers.map((numbered) => {
                        //console.log(numbered.number);
                        //console.log( numbered.number.split(' ').join('') );
                        //var result = numbered.number.replace(/\s+/g, '');
                        var result = numbered.number.replace(/[^A-Z0-9+]+/ig, "");
                        if(result.slice(0,1) !== '+'){
                          result = codeall+result;
                          const chesomephone = obj => obj.number === result;
                          if(phonebookArray.some(chesomephone)){
                            //console.log(contact.displayName);
                            //console.log(result);
                          }else{
                            phonebookArray.push({name: contact.displayName, number: result})
                          }
                          
                        }
                        //console.log(result);
                        
                      });
                    });
                    //console.log(phonebookArray);
                })
                .catch((e) => {
                    console.log(e);
                });
            }
        })
        .catch((error) => {
            console.error('Permission error: ', error);
        });

    })
    .catch((e) => {
      console.log(e);
    });

  }

  const fetchContactsNextPage = async () => {
    console.log("isnext => " + isnext);
    console.log("currentFetch => " + currentFetch);
    console.log("totalFectched => " + totalFectched);
    if(isnext){
      //console.log("totalFectched =>" + totalFectched%10 + 1);
      //console.log("currentFetch =>" + currentFetch + 1);
      //currentFetch = currentFetch + 1
      
      setFetching(true);
      try {
          let res = await _fetchContactsNextPage({page:currentFetch+1});
          console.log('Contacts ==>',res);
          var jonin = contacts.concat(res?.results);

          let listedcontact = res?.results;
          listedcontact.forEach(function(d){
            //console.log(d.id + " ==> " + d.email);
            let value = AsyncStorage.getItem(d.phone_number);
            if(value == null){
                AsyncStorage.setItem(d.phone_number, JSON.stringify(0));
                console.log(d.id + " ==> " + d.phone_number);
            }else{
                AsyncStorage.getItem(d.phone_number).then(value => {
                  let newval = JSON.parse(value) ;
                  AsyncStorage.setItem(d.phone_number, JSON.stringify(newval));
              });
            }
          });

          setFetching(false);
          setContactList(jonin); 
          //setContactList((contacts) => [...contacts, res?.results]);
          //setContactList(res?.results || [])
          setTotalFectched(res.count);
          if(res.next !== null){
            setNext(true);
            setCurrentFetch(currentFetch+1);
          }else{
            setNext(false);
          }
          
      }catch (err) {
        console.log(getErrorMessage(err));
      }
    }
  }

const getPhoneNumber = async() => {
  await DeviceCountry.getCountryCode()
    .then((result) => {
      const code = result.code.toUpperCase();
      const chesome = codes.find(({isoCode2}) => isoCode2 === code);
      const codeall = '+'+chesome.countryCodes[0];

      console.log(codeall)
      
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept',
    }).then((res) => {
      console.log(res)
      if(res == 'granted'){
      selectContactPhone()
        .then(selection => {
            if (!selection) {
                Toast.show('Error getting contact');
                return null;
            }
            
            let { contact, selectedPhone } = selection;
            //console.log(selection)
            if( contact.name == '' || selectedPhone.number == '' || contact.name == null){
              Toast.show("Couldn't get contact name or number",1000);
            }else{
              var result = selectedPhone.number.replace(/[^A-Z0-9+]+/ig, "");
              if(result.slice(0,1) !== '+'){
                result = codeall+result;
              }else{
                const phn = parsePhoneNumber(selectedPhone.number);
                result = phn.number;
              }
              
              let emailo = contact.name.replace(/\s/g,'');
              let body = {
                "email": emailo+result.substring(1)+'@gmail.com',
                "fullname":contact.name,
                "phone_number":result,
                "room_id": result.substring(1)+ Date.now()
              }
              console.log(body)
              let res = _postContact({ body });
              console.log(res)
              setTimeout(() =>{refreshContacts()}, 2000)
              
              Toast.show(`${contact.name} was added to your contacts and an invitation was sent`);
            }
            console.log(`Selected ${selectedPhone.type} phone number ${result} from ${contact.name}`);
            
        });
      }
      if(res == "never_ask_again"){
        Toast.show("Contact permission denied. Enable contact permission in Seemeglobal app settings");
      } 
    });
  }); 
}

  const noContactView = () => {
    return (
      <>
        <View style={[{
          paddingLeft:20,
          backgroundColor: 'white',
          borderBottomWidth: 2,
          borderBottomColor: '#0512250D'}]}>
          <Text className="mt-[0.00px] mt-[24.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
            {'Your Contact List'}
          </Text>

          <Text className="mt-[8.00px] mb-[24.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[normal]" >
            {'Chat, Video, Edit, Delete & Track with Contacts'}
          </Text>
        </View>

        <View style={[{flex:1,backgroundColor:'#F6F6F6',paddingLeft:20,paddingRight:20}]}>
          <View style={[{flex:1,flexDirection:'column', alignItems:'center', justifyContent: 'center'}]}>
            <Image
              source={require('../assets/new/cuate.png')}
              resizeMode="contain"
              style={{width: '60%'}}
            />
            <Text className="mt-[8.00px] text-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px]" >
              {'No contacts yet'}
            </Text>
          </View>
        {/*<View style={[{bottom:10, position:'relative',  width: '100%', alignItems:'center', justifyContent: 'center'}]}>
          <TouchableOpacity style={styles.addContact} 
          onPress={() => navigation.navigate(
            'AddEditContact',
              {
                'flag': "add",
                'refreshContacts':refreshContacts
              }
            )}>
            <View style={[{flexDirection:'row',}]}>
              <IconOutline
                name="plus"
                color={'white'}
                size={20}
                style={[{marginRight:20,}]}
              />
              <Text style={[{color:'white', fontWeight:'bold', fontSize:16}]}>
                {'Add New Contact'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>*/}
      </View>
      </>
    )
  };

  const renderFooter = () => {
      return isFetching ? (
      <View style={{alignItems: 'center',marginTop:10}}>
        <ActivityIndicator size="large" color="#1f1f1f" />
      </View>
      ) : null;
  };

  const getFooter = () => {
      return <TouchableOpacity
      onPress={() => navigation.navigate(
        'AddEditContact',
          {
            'flag': "add",
            'refreshContacts':refreshContacts
          }
        )}>
      <View style={{backgroundColor:AppColors.addcontatBtn,flexDirection: 'row', alignItems: 'center',paddingBottom:10,paddingLeft:10, paddingTop:10}}>
        <Image
          source={require('../assets/addcontactUserIcon.png')}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={[GlobalStyles.text, {marginLeft: 15}]}>
          {'Add New Contact'}
        </Text>
      </View>
    </TouchableOpacity>
  };

  const onSearch = async (text) => {
    try {
      setRefreshing(true)
      let res = await _fetchContacts(text);
      setContactList(res?.results || [])
      setRefreshing(false)
    } catch (err) {
      setRefreshing(false)
      Toast.show(getErrorMessage(err));
    }
  }

  const closeActionSheet = () => setModalVisible(false);

  const removeContent = async() => {
    let res = await _deleteContact(contactToDelete.id)
    setModalVisible(false)
    Toast.show("Contact Successfully Deleted");
    refreshContacts()
  }

  const addgroupcalitem = (item) => {
    const isSelected = selectedItems.some((selected) => selected.id === item.id);
    console.log('isSelected =>', isSelected);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
    console.log('item =>', selectedItems.length);
    if(selectedItems.length == 1 && isSelected){
      setGroupcall(false);
      setSelectedItems([]);
    }
    /*setSelectedItems(selectedItems => {
      const existingIndex = selectedItems.findIndex(itema => itema.id === item.id); 
      if (existingIndex !== -1) {
        
      }else{
        return [...selectedItems, item]; 
      }
    });*/
  }

  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
          <UserAppHeader />
          { contacts.length > 0 ? 
          (<>
            <View style={[{
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 2,
            borderBottomColor: '#0512250D'}]}>
            <Image
                source={require('../assets/new/framehead.png')}
                resizeMode="contain"
                style={{width: '100%',marginTop:15, marginBottom:15}}
              />
          </View>
          {isgroupcall && (
            <View style={{marginRight:15, marginLeft:15, marginTop:10 }}>
            <ZegoSendCallInvitationButton
              
              invitees={selectedItems.map(inviteeID => { 
                return { 
                  userID: inviteeID.is_email_present.toString(), 
                  userName: inviteeID.fullname, 
                }; 
              })}
              isVideoCall={isvideovoice} 
              resourceID={'traakme_com_call'}
              icon={require('../assets/new/phone.png')}
              width={'100%'}
              height={42}
              text={`Start Group Call ${selectedItems.length}`}
              backgroundColor={AppColors.buttonColor} 
              onPressed={() =>{
                setGroupcall(false);
                setSelectedItems([]);
              }}
              fontSize={14}
              textColor={'#fff'}
              //textColor={'#051225CC'}
            />
            {/*<TouchableOpacity style={styles.addContactFloat} 
              onPress={() => navigation.navigate(
                'AddEditContact',
                  {
                    'flag': "add",
                    'refreshContacts':refreshContacts
                  }
                )}>
                <View style={[{flexDirection:'row',}]}>
                  <IconOutline
                    name="phone"
                    color={'white'}
                    size={20}
                    style={[{marginRight:10,}]}
                  />
                  <Text className="text-[16px]" style={{color:'white'}}>
                  { selectedItems.length > 0 ? (`Start Group Call ${selectedItems.length}`):(`Start Group Call`)}
                  </Text>
                </View>
                
            </TouchableOpacity>*/}
            </View>
          )}
          

            <View style={[{flex:1,backgroundColor:'#FBF6FF',paddingLeft:15,paddingRight:15, paddingTop:15, paddingBottom:15}]}>
            <FlatList
                    //extraData={togleflatlist}
                    data={contacts}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ index, item }) => (
                      <GridItem item={item} setVideovoice={setVideovoice} isgroupcall={isgroupcall} setGroupcall={setGroupcall} addgroupcalitem={addgroupcalitem} setSelectedItems={setSelectedItems} selectedItems={selectedItems} setItemToDelete={deleteItem} refreshContacts = {refreshContacts} dbdata={dbdata} />
                    )}
                    refreshing = {refreshing}
                    onRefresh={() => refreshContacts()}
                    onEndReached={fetchContactsNextPage}
                    extraData={togleflatlist}
                  />
          </View>
          </>) 
          : 
          noContactView()
          }
          <FloatingAction
            distanceToEdge={30}
            position='left'
            overlayColor={'rgba(68, 68, 68, 0.3)'}
            actions={actions}
            color={AppColors.buttonColor}
            onPressItem={name => {
              console.log(`selected button: ${name}`);
              if(name == 'bt_manual'){
                navigation.navigate('AddEditContact', {'flag': "add", 'refreshContacts':refreshContacts})
              }
              if(name == 'bt_book'){
                getPhoneNumber();
              }
            }}
          />
          <Modal
            isVisible={isModalVisible}
            style={{
            margin: 0,
            justifyContent: 'flex-end',
            }}>
            <ActionSheet 
                desc={actionDesc}
                title={actionTitle}
                confirm={actionConfirm}
                cancel={actionCancel} 
                action={removeContent} 
                onCancel={closeActionSheet} 
            />
          </Modal>  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addContact:{
    backgroundColor: AppColors.buttonColor,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius:32,
  },
  addContactFloat:{
    backgroundColor: 'green',
    height: 50,
    alignItems: 'center',
    width: 205,
    borderRadius:50,
    justifyContent: 'center',
    position:'absolute',
    right:20,
    top:220,
    zIndex:3,
    elevation:3
  },
  image: {
    height: 30,
    width: 30,
    borderRadius:3
  },
  heading:{
    fontSize:Font.headingSize,
    color: AppColors.newPink,
    marginBottom:5,
    fontFamily:Font.family_bold,
    paddingLeft:25,
  },
  subHeading:{
    fontSize:Font.subheadingSize,
    color: AppColors.textBlack,
    paddingLeft:25,
  },
  flatlisstyle:{
    width:'auto',
    height:'auto',
    marginBottom:178,
    
    // height:'auto',
    marginTop:20,
    marginLeft:25,
    marginRight:25,
    
    overflow:"scroll",
    borderTopColor:AppColors.newPink,
    borderTopWidth:0.50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
  },
  container_start:{
    flex: 1,
    //alignItems: 'center',
    
    justifyContent: 'flex-start',
    width:"100%"
  },
});
