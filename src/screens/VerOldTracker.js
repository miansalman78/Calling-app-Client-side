import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import AppHeader from '../components/AppHeader';
import TrackingBox from '../components/TrackingBox';
import SendRequestModal from '../components/SendRequestModal';
import {useSelector, useDispatch} from 'react-redux';
import {updateCurrentRequestItem} from '../slices/currentItemSlice';
import {useIsFocused} from '@react-navigation/native';
import {_getActiveRequest, _patchSendRequest, _patchSendSeeMeRequest, _patchTestSeeMeRequest} from '../utils/api';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
//import Geolocation from '@react-native-community/geolocation';
import {_getDetailsLatLong, _me} from '../utils/api';
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper';
import { updateRequestStatus ,updateCurrentUser} from '../slices/requestSlice'
import {latitudeConstant,longitudeConstant} from '../utils/Constants'
import Button from '../components/Buttons';
import KeepAwake from 'react-native-keep-awake';
import Share from 'react-native-share';
import uuid from 'react-native-uuid';
import {IconFill} from '@ant-design/icons-react-native';


import { checkMultiplePermissions } from '../helper/Permissions';
import Spinner from 'react-native-loading-spinner-overlay'

import * as ZIM from 'zego-zim-react-native'; 

import * as ZPNs from 'zego-zpns-react-native'; 

import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, } from '@zegocloud/zego-uikit-prebuilt-call-rn';

import {async} from '@firebase/util';
//import { checkMultiplePermissions } from '../helper/Permissions';
import {KeyCenter} from '../utils/Constants';

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

export default function TrackerScreen(props) {
  const {navigation,route} = props
  const {params} = route;
  const current_request = useSelector(
    state => state.requestStatus?.requestStatus || {},
  );
  const current_user = useSelector(
    state => state.requestStatus?.currentUser || {},
  );
  // const current_request = useState(current_request_store)
  const currentItem = params?.item || null;
  const [displaySendReqModal, setSendRequestModalVisible] = useState(true);
  const isFocused = useIsFocused();
  const [trackingBoxStatus, setTrackingBoxStatus] = useState('send_request');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const dispatchRedux = useDispatch()
  const [watchid, setWatchid] = useState(0);
  const [seeme, setSeeme] = useState(false);
  const [spin, setSpin] = useState(false);
  const [sendurl,setSendurl] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [id, setId] = useState('');
  const [fcm, setFcm] = useState('');
  const [seemetitle, setSeemetitle] = useState('See me - Off');

  useEffect(()=>{
    
    currentUserDetails();
    checksharing();
    KeepAwake.activate();
    console.log("sendurl => "+sendurl);
    return () => {
      KeepAwake.deactivate();
      setSpin(false);
      console.log('unmounting TrackerScreen')
    };
  },[]);

  useEffect(() => {
    //initZeoCloud(); 
  }, [navigation, route]);

  useEffect(() => {
    console.log('this is current item => ' + currentItem);
    console.log('this is request status => ' + _current_request.request_status);
    if (currentItem != null) {
      setSendRequestModalVisible(true);
      setTrackingBoxStatus('send_request');
      setSeeme(false);

    }else{
      if (_current_request.request_status != undefined) {
        setSeeme(false);
        
        console.log('seeme is false');
      }else{
        setSeeme(true);
        setSpin(true);
        stopspinner();
        console.log('seeme is true');

        
        try{
          if(sendurl != '' ) {
            getOneTimeLocationSeeMe(sendurl);
          }else{
            getOneTimeLocationSeeMe('sendurl');
            setSendurl('');
          }
        }catch(e){}
      }
    }
    getOneTimeLocation();
    console.log(sendurl);
    
  }, [isFocused]);

  let requestStatus = current_request?.request?.request_status || '';
  let _current_request = current_request?.request;

  function closeSendRequestModal(valy){
    setSendRequestModalVisible(valy);
    navigation.setParams({item: null});
    console.log('modal closed');
  }

  function stopinapplocation(value){
    //setSeeme(false);
    if(value == true){
      setSeeme(false);
      setSpin(false);

      
      console.log('current seeme from stopinapplocation => '+ value + ' so seeme => false');
    }else{
      console.log('current seeme from stopinapplocation => '+ value + ' so seeme => true');
      setSeeme(true);
      setSpin(true);
      stopspinner();
      geolocationGetCurrentPosition(sendurl);
      
      try{
          if(sgaredFromStorage.length > 0 ) {
            getOneTimeLocationSeeMe(sendurl);
          }else{
            //getOneTimeLocationSeeMe('sendurl');
            setSendurl('');
          }
        }catch(e){}
    }
    //console.log('current seeme from stopinapplocation => '+ value);
  }

  const initZeoCloud = async () => { 
    try { 
      let res = await _me();
      await onUserLogin( res?.id.toString(), res?.fullname, props, );
      console.log('initZeoCloud completed from ==> TrackerScreen'); 
    } catch (error) { 
      console.log('ERRoRR==', error); 
    } 
  }; 

  const updateLocation = async (latitude, longitude) => {
    if ((latitude || '') == '' || (longitude || '') == '') {
      return;
    }

    let addressDetails = await _getDetailsLatLong(`${latitude},${longitude}`)
    let address = "";
    if ((addressDetails?.results).length > 0){
      address = addressDetails?.results[0].formatted_address
    }

    let body = {
      latitude: latitude,
      longitude: longitude,
      last_location:address
    };

    try {
      let res = await _patchSendRequest({
        pk: current_request?.request?.id,
        body: body,
      });

      let currentRequest = await _getActiveRequest();
      dispatchRedux(updateRequestStatus(currentRequest));
      setSpin(false);
      if(currentRequest.active_request == 'true'){
        setSeeme(false);
      }
      // getOneTimeLocation()
    } catch (err) {
      console.log(err);
      Toast.show(getErrorMessage(err));
    }
  };

  const getOneTimeLocation = () => {
    console.log('called getOneTimeLocation');
    if (
      _current_request.request_status != 'accepted' ||
      _current_request.user_flag != 'to_user'
    ) {
      return;
    }
    AsyncStorage.getItem('locationStatus').then(value => {
      if (value == 'allowed') {
        Geolocation.watchPosition(
          //Will give you the current location getCurrentPosition
          position => {
            // console.log(position);
            //getting the Longitude from the location json
            const currentLongitude = JSON.stringify(position.coords.longitude);

            //getting the Latitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);

            updateLocation(currentLatitude, currentLongitude);
            console.log('jsutseemeupdateLocation called from getOneTimeLocation');
            //console.log(currentLongitude);
            //console.log(currentLatitude);
            //jsutseemeupdateLocation(currentLatitude, currentLongitude);

            // _getDetailsLatLong(`${currentLatitude},${currentLongitude}`).then((value)=>{

            //   setCurrentLocation(value?.results[0] || {})
            // })
          },
          error => {
            //Toast.show('Please check the location Permissions. Error fetching current location');
            AsyncStorage.setItem('longitude', '');
            AsyncStorage.setItem('latitude', '');
          },
          {
            enableHighAccuracy: true,
            // timeout: 20000,
            maximumAge: 0,
            distanceFilter: 20,
          },
        );
      } else {
        Toast.show('Please check the location Permissions');
        AsyncStorage.setItem('longitude', '');
        AsyncStorage.setItem('latitude', '');
      }
    }).catch = err => {
      Toast.show('Please check the location Permissions');
      AsyncStorage.setItem('longitude', '');
      AsyncStorage.setItem('latitude', '');
    };
  };

  const jsutseemeupdateLocation = async (latitude, longitude) => {
    console.log('jsutseemeupdateLocation called');
    if ((latitude || '') == '' || (longitude || '') == '') {
      return;
    }

    let addressDetails = await _getDetailsLatLong(`${latitude},${longitude}`)
    let addressed = "";
    if ((addressDetails?.results).length > 0){
      addressed = addressDetails?.results[0].formatted_address
      setAddress(addressed);
    }

    setLatitude(latitude);
    setLongitude(longitude);
    setSpin(false);
  }

  const currentUserDetails = async () => {
    let res = await _me();
    setUsername(res.fullname);
    setUseremail(res.email);
    setFcm(res.device_token);
    setId(res.id);
    //console.log(res);
  }

  const checksharing = async () => {
    try {
      const value = await AsyncStorage.getItem('SHARE_URL');
      if(value !== null){
        setSendurl(value);
        console.log(value + ' value from checksharing');
      }
    } catch (error) {
      console.log(error + ' no value from checksharing');
    }
  }

  const updatesharing = async () => {
    try {
      const value = await AsyncStorage.removeItem('SHARE_URL');
      console.log(value + ' value from updatesharing');
    } catch (error) {
      console.log('error from updatesharing'+error);
    }
  }

  const newsharing = async (val) => {
    try {
      const value = await AsyncStorage.setItem('SHARE_URL',val);
      console.log(value + 'value from newsharing');
    } catch (error) {
      console.log('error from newsharing '+error);
    }
  }

  const stopshare = async () => {
    if(sendurl == ''){
      Toast.show('You are not sending your location');
      return;
      //nothing = false;
    }else{
      setSendurl();
      updatesharing();
      updateseemeLocation(latitude, longitude, false, sendurl);
      Toast.show('You stoped sending your location');
      Geolocation.clearWatch(watchid);
      Geolocation.stopObserving();
      //setSeemetitle('See me - Off')
      //setTimeout(()=> {getOneTimeLocationSeeMe('sendurl')},2000);
    }
  }


  const share = async () => {
    /*let uid = id + Math.floor(Date.now()/1000).toString(36);
    setSendurl([...sendurl, uid]);
    setSendurl(sendurl.filter(a=> a !== '83s2cyh1'));
    setSendurl([]);
    if(sendurl.length > 0){
      console.log(sendurl.length);
      console.log(sendurl);
    }
    let stri = sendurl.toString();
    console.log(stri.split(','));*/

    setSeeme(true);
    console.log('share clicked ');
    //console.log(sendurl);
    
    /*if(sendurl == ''){
      Toast.show('You are sending your location');
      //nothing = false;
    }else{
      Toast.show('You are already sharing your location. Click on stop');
      return;
    }*/

    Toast.show('You are sending your location');
    
    //let uid = id + uuid.v4();
    let uid = id + Math.floor(Date.now()/1000).toString(36);
    let url = `https://seeme.traakme.com/seeme/${uid}`
    const title = "My location"
    const message = "Click link to see my location"
    const customoptions = {
      title, url, message,
    }
    
    //setSeemetitle('See me - On');
    

    newsharing(uid);
    setSendurl(uid);
    getOneTimeLocationSeeMe(uid);
    updateseemeLocation(latitude, longitude, true, uid);
    
    try{
      await Share.open(customoptions)
    }catch(err){
      console.log(err);
    }
  }

  const getOneTimeLocationSeeMe = (uid) => {
    console.log("getOneTimeLocationSeeMe");
    geolocationGetCurrentPosition(uid);
    if (!seeme) {
      return;
    }
    setSpin(true);
    stopspinner();
    AsyncStorage.getItem('locationStatus').then(value => {
      if (value == 'allowed') {
        setWatchid(Geolocation.watchPosition(
          //Will give you the current location
          position => {
            //setWatchid();
            // console.log(position);
            //getting the Longitude from the location json
            const currentLongitude = JSON.stringify(position.coords.longitude);

            //getting the Latitude from the location json
            const currentLatitude = JSON.stringify(position.coords.latitude);

            //updateLocation(currentLatitude, currentLongitude);
            
            AsyncStorage.setItem("longitude",currentLongitude);
            AsyncStorage.setItem("latitude",currentLatitude);
            
            setLatitude(currentLatitude)
            setLongitude(currentLongitude)

            updateseemeLocation(currentLatitude, currentLongitude, true, uid);
            jsutseemeupdateLocation(currentLatitude, currentLongitude);
            
          },
          error => {
            //Toast.show('Please check the location Permissions. Error fetching current location');
            AsyncStorage.setItem('longitude', '');
            AsyncStorage.setItem('latitude', '');
          },
          {
            enableHighAccuracy: true,
            // timeout: 20000,
            maximumAge: 0,
            distanceFilter: 20,
          },
        ));
      } else {
        Toast.show('Please check the location Permissions');
        AsyncStorage.setItem('longitude', '');
        AsyncStorage.setItem('latitude', '');
      }
    }).catch = err => {
      Toast.show('Please check the location Permissions');
      AsyncStorage.setItem('longitude', '');
      AsyncStorage.setItem('latitude', '');
    };
  };

const geolocationGetCurrentPosition = (uid) => {
  Geolocation.getCurrentPosition(
          position => {
            
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            
            AsyncStorage.setItem("longitude",currentLongitude);
            AsyncStorage.setItem("latitude",currentLatitude);
            
            setLatitude(currentLatitude)
            setLongitude(currentLongitude)

            jsutseemeupdateLocation(currentLatitude, currentLongitude);
            
          },
          error => {
            //Toast.show('Please check the location Permissions. Error fetching current location');
            AsyncStorage.setItem('longitude', '');
            AsyncStorage.setItem('latitude', '');
          },
          {
            enableHighAccuracy: true,
            // timeout: 20000,
            maximumAge: 0,
            distanceFilter: 20,
          },
        );
};


  

  const stopspinner = async () => {
    setTimeout(() => {
      if(spin){
        Toast.show("Oops! couldn't show location");
        setSpin(false);
      }
    }, 30000);
  }

  function updatespinner(value){
    if(value == true){
      setSpin(true);
      stopspinner();
      console.log('spinner started from updatespinner => '+ value );
    }else{
      setSpin(false);
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <AppHeader />
        <>
        <Spinner
          visible={spin}
          textContent={'Loading location ...'}
          cancelable={true}
          />
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: parseFloat(
              _current_request?.latitude || latitudeConstant,
            ),
            longitude: parseFloat(
              _current_request?.longitude || longitudeConstant,
            ),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          {_current_request?.latitude || '' != '' ? (
            <MapView.Marker
              coordinate={{
                latitude: parseFloat(
                  _current_request?.latitude,
                ),
                longitude: parseFloat(
                  _current_request?.longitude,
                ),
              }}
              title={_current_request?.to_user?.fullname || 'Current Location'}
              description={_current_request?.last_location}
            />
          ) : null}
        </MapView>
        </>
        <View>
          {/* <TrackingBox /> */}
          
          {(current_request?.active_request == false ||
            requestStatus == 'request_sent') &&
          displaySendReqModal &&
          (currentItem || null) != null ? (
            <SendRequestModal
              closeSendRequestModal={setSendRequestModalVisible}
              item={currentItem}
              trackingBoxStatus={trackingBoxStatus}
              setTrackingBoxStatus={setTrackingBoxStatus}
              stopinapplocation={stopinapplocation}
              updatespinner={updatespinner}
            />
          ) : ['accepted', 'paused'].includes(requestStatus) ? (
            <TrackingBox item={currentItem} stopinapplocation={stopinapplocation} updatespinner={updatespinner}/>
          ) : current_request?.active_request == true &&
            requestStatus == 'request_sent' ? (
            <SendRequestModal
              closeSendRequestModal={setSendRequestModalVisible}
              item={currentItem}
              trackingBoxStatus={trackingBoxStatus}
              updateLocation={updateLocation}
              getOneTimeLocation={getOneTimeLocation}
              setTrackingBoxStatus={setTrackingBoxStatus}
              stopinapplocation={stopinapplocation}
              updatespinner={updatespinner}
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});



