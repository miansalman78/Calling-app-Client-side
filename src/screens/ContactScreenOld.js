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
import AppHeader from '../components/AppHeader';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import ContactCard from '../components/ContactCard';
import Button from '../components/Buttons';
import {_fetchContacts,_getActiveRequest,_deleteContact, _updateDeviceToken, _me, _fetchContactsNextPage} from '../utils/api'
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

//import { getCountryCallingCode } from 'react-phone-number-input'
import examples from 'libphonenumber-js/mobile/examples'
import { getExampleNumber, isSupportedCountry } from 'libphonenumber-js'

import getCountryCallingCode from 'libphonenumber-js';
import DeviceCountry from 'react-native-device-country';

import * as ZIM from 'zego-zim-react-native'; 

import * as ZPNs from 'zego-zpns-react-native'; 

import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, } from '@zegocloud/zego-uikit-prebuilt-call-rn';

import {async} from '@firebase/util';
//import { checkMultiplePermissions } from '../helper/Permissions';
import {KeyCenter} from '../utils/Constants';
import codes from 'country-calling-code';

const onUserLogin = async (userID, userName, props) => { 

  return ZegoUIKitPrebuiltCallService.init( 
    KeyCenter.appID, 
    KeyCenter.appSign, 
    userID, 
    userName, 
    [ZIM, ZPNs], { 

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
            console.log('########CallWithInvitation onHangUp', duration); 
            props.navigation.navigate('Home'); 
          }, 

          topMenuBarConfig: { 
            buttons: [ZegoMenuBarButtonName.minimizingButton], 
          }, 

          onWindowMinimized: () => { 
            console.log('[Demo]CallInvitation onWindowMinimized'); 
            props.navigation.navigate('Home'); 
          }, 

          onWindowMaximized: () => { 
            console.log('[Demo]CallInvitation onWindowMaximized'); 
            props.navigation.navigate('ZegoUIKitPrebuiltCallInCallScreen'); 
          }, 
        }; 
      }, 
    }, 
  ); 
};

export default function ContactScreen(props) {

  const [contacts,setContactList] = useState([])
  const [refreshing,setRefreshing] = useState(false)
  const [extradatadata,setExtradatadata] = useState(false)
  const {navigation,route} = props
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

  let obbj = 'remoteMessage {"collapseKey": "com.kalugogo", "data": {"body": "Recieved from Ellincon Sunna !", "data": "{"selectedUser":{"room_id":"cheanyangwe20@gmail.com1686517116103","is_active":true,"is_email_present":82,"device_token":"fB5SLGb6R1WZtdbwk5dSw5:APA91bFfz_4GuGRhJO1CU9Uoo1DL59lRFZm07OIBKguYEz13SC6OFNHFOVjhPDMg7nzHa5MomHFJ8u1kLMJPZ1ZqS_qAvV8sS7Exe17zieVIDElgLrvknAxrNUtojLg01UihmnfXmABQ","phone_number":"+237676627827","id":82,"created_date":"2023-06-11T20:58:36.430696Z","fullname":"Anyangwe Che","modified_date":"2023-06-11T20:58:36.430753Z","user":83,"email":"cheanyangwe20@gmail.com"},"chat_id":"83_82","current_user":{"last_login":"2023-10-03T19:02:08.214174Z","device_token":"fONQ508YTO2i_XLou8VZTf:APA91bH1k0qjhqTNoET9A-tTgfNA5D0EHAnYBqFmnhS7-e7u4AiTCBHX5I5j087gRFbkVemgpdR1ls1NKFdX_0BMaVd40AXCpw8PbEzJDEAFtmAuR0sBUD_UOwl_6aXFPJI0Ox1JJ377","last_name":"","phone_number":"+237695907169","id":83,"fullname":"Ellincon Sunna","date_joined":"2023-06-11T20:56:00.893755Z","first_name":"","email":"ellinconsunna@gmail.com","username":"ellinconsunna"}}", "title": "New Message Recieved"}, "from": "108974893258", "messageId": "0:1696882147482086%65b4677c65b4677c", "notification": {"android": {}, "body": "Recieved from Ellincon Sunna !", "title": "New Message Recieved"}, "sentTime": 1696882147439, "ttl": 2419200}'

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //console.log('remoteMessage', remoteMessage);
      //console.log('remoteMessage chat_id => ', remoteMessage.data.data.chat_id);
      if (remoteMessage != null) {
        if(remoteMessage?.data?.title == "New Message Recieved"){
          let id = remoteMessage?.data?.email;
          console.log(id);

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

  useEffect(() => {
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
      await onUserLogin( res?.id.toString(), res?.fullname, props, ); 
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
        await onUserLogin( current_user?.id.toString(), current_user?.fullname, props, ); 
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
          let value = AsyncStorage.getItem(d.email);
          if(value == null){
              AsyncStorage.setItem(d.email, JSON.stringify(0));
              console.log(d.id + " ==> " + d.email);
          }else{
              AsyncStorage.getItem(d.email).then(value => {
                let newval = JSON.parse(value) ;
                AsyncStorage.setItem(d.email, JSON.stringify(newval));
            });
          }
        });
        
        //updateNotifCount('cmomah@hotmail.com');
        setContactList(res?.results || [])
      } catch (err) {
        Toast.show(getErrorMessage(err));
      }
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

    getPermission();

    KeepAwake.activate();
    return () => {
      clearInterval(timer);
      KeepAwake.deactivate();
     }
    }, [])

  const deleteItem = async (row) => {
    setModalVisible(true)
    setDeletedRow(row)
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

      let listedcontact = res?.results;
        listedcontact.forEach(function(d){
          //console.log(d.id + " ==> " + d.email);
          let value = AsyncStorage.getItem(d.email);
          if(value == null){
              AsyncStorage.setItem(d.email, JSON.stringify(0));
              console.log(d.id + " ==> " + d.email);
          }else{
              AsyncStorage.getItem(d.email).then(value => {
                let newval = JSON.parse(value) ;
                AsyncStorage.setItem(d.email, JSON.stringify(newval));
            });
          }
        });

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
      
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept',
    })
        .then((res) => {
            console.log('Permission: ', res);
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
            let value = AsyncStorage.getItem(d.email);
            if(value == null){
                AsyncStorage.setItem(d.email, JSON.stringify(0));
                console.log(d.id + " ==> " + d.email);
            }else{
                AsyncStorage.getItem(d.email).then(value => {
                  let newval = JSON.parse(value) ;
                  AsyncStorage.setItem(d.email, JSON.stringify(newval));
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
      <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:10,marginLeft:10}}>
        <Image
          source={require('../assets/add_contact.png')}
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

  const removeContent = async() => {
    let res = await _deleteContact(contactToDelete.id)
    setModalVisible(false)
    Toast.show("Contact Successfully Deleted");
    refreshContacts()
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <KeyboardAvoidingView style={GlobalStyles.keyboardViewContainer} enabled>
      <ConfirmBoxModal isModalVisible = {isModalVisible} acceptClick={removeContent} closeModal={setModalVisible} description="Are you sure you want to delete this contact ?"/>
        <View
          // automaticallyAdjustContentInsets = {false}
          // contentContainerStyle={[
          //   GlobalStyles.scrollContainerCenter,
          //   {width:'100%'},
          // ]}
          style = {[GlobalStyles.scrollContainerCenter,{width:'100%'}]}
          showsVerticalScrollIndicator={false}
          bounces={false}>

          <View style={GlobalStyles.container_start}>

            <AppHeader onSearch={onSearch}/>

            <Text style={GlobalStyles.heading}>{'Your Contact list'}</Text>
            <Text style={[GlobalStyles.subHeading]}>
              {'Chat, Video, Edit, Delete & Track with Contacts'}
            </Text>
            
            <View style={[GlobalStyles.greyContainer,{width:'90%',height:'auto',marginBottom:150}]}>
              <FlatList
                  data={contacts}
                  renderItem={({ item, index }) => (
                    <ContactCard key={item.id} item={item} setItemToDelete={deleteItem} refreshContacts = {refreshContacts} />
                  )}
                  ListHeaderComponent={getFooter}
                  ListFooterComponent={renderFooter}
                  refreshing = {refreshing}
                  onRefresh={() => refreshContacts()}
                  onEndReached={fetchContactsNextPage}
                />

            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
    borderRadius:3
  },
});
