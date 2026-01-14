import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Text, Image, PermissionsAndroid, Platform } from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AppHeader from '../components/AppHeader';
import TrackingBox from '../components/TrackingBox';
import SendRequestModal from '../components/SendRequestModal';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentRequestItem } from '../slices/currentItemSlice';
import { useIsFocused } from '@react-navigation/native';
import { _getActiveRequest, _patchSendRequest, _patchSendSeeMeRequest, _patchTestSeeMeRequest, _tomGeocode } from '../utils/api';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
//import Geolocation from '@react-native-community/geolocation';
import { _getDetailsLatLong, _me } from '../utils/api';
import Toast from 'react-native-simple-toast';
import { getErrorMessage } from '../utils/helper';
import { updateRequestStatus, updateCurrentUser } from '../slices/requestSlice'
import { latitudeConstant, longitudeConstant } from '../utils/Constants'
import Button from '../components/Buttons';
import KeepAwake from 'react-native-keep-awake';
import Share from 'react-native-share';
import uuid from 'react-native-uuid';
import { IconFill } from '@ant-design/icons-react-native';
import { Marker } from 'react-native-maps';


import { checkMultiplePermissions } from '../helper/Permissions';
import Spinner from 'react-native-loading-spinner-overlay'

import * as ZIM from 'zego-zim-react-native';

import * as ZPNs from 'zego-zpns-react-native';

import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, } from '@zegocloud/zego-uikit-prebuilt-call-rn';

import { async } from '@firebase/util';
//import { checkMultiplePermissions } from '../helper/Permissions';
import { KeyCenter } from '../utils/Constants';


const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location for tracking.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        await AsyncStorage.setItem('locationStatus', 'allowed');
        return true;
      } else {
        console.log('Location permission denied');
        await AsyncStorage.setItem('locationStatus', 'denied');
        Toast.show('Location permission is required for tracking');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS handles permissions differently
};

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
          //props.navigation.navigate('Home'); 
        },

        topMenuBarConfig: {
          buttons: [ZegoMenuBarButtonName.minimizingButton],
        },

        onWindowMinimized: () => {
          console.log('[Demo]CallInvitation onWindowMinimized');
          //props.navigation.navigate('Home'); 
        },

        onWindowMaximized: () => {
          console.log('[Demo]CallInvitation onWindowMaximized');
          //props.navigation.navigate('ZegoUIKitPrebuiltCallInCallScreen'); 
        },
      };
    },
  },
  ).then(() => {
    ZegoUIKitPrebuiltCallService.requestSystemAlertWindow({
      message: 'We need your consent for the following permissions in order to use the offline call function properly',
      allow: 'Allow',
      deny: 'Deny',
    });
  });
};

export default function TrackerScreen(props) {
  const { navigation, route } = props
  const { params } = route;
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
  const [sendurl, setSendurl] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [id, setId] = useState('');
  const [fcm, setFcm] = useState('');
  const [seemetitle, setSeemetitle] = useState('See me - Off');
  let letaddress = '';

  let newItems;
  if (params.type) {
    console.log('type psm');
    let selecteditem = {
      device_token: params.device_token,
      email: params.email,
      fullname: params.fullname,
      id: parseInt(params.id),
      //is_email_present: parseInt(params.is_email_present),
      //is_number_present: parseInt(params.is_number_present),
      phone_number: params.phone_number,
      room_id: params.room_id,
      user: parseInt(params.user)
    }
    newItems = selecteditem;
  }
  console.log('current_request =>', current_request);
  console.log('current_user => ', current_user);
  console.log('requestStatus =>', requestStatus);

  useEffect(() => {
    const updateRequestDetails = async () => {
      let res = await _getActiveRequest();

      console.log('_getActiveRequest =>', res);
      console.log("SendRequestModal dispatcher");
      dispatchRedux(updateRequestStatus(res));
    };

    // Request location permission on mount
    requestLocationPermission();

    //geolocationGetCurrentPosition();
    updateRequestDetails();
    currentUserDetails();
    KeepAwake.activate();
    return () => {
      KeepAwake.deactivate();
      console.log('unmounting TrackerScreen')
    };
  }, []);

  useEffect(() => {
    //initZeoCloud(); 
  }, [navigation, route]);

  useEffect(() => {
    if (currentItem != null) {
      setSendRequestModalVisible(true);
      setTrackingBoxStatus('send_request');
    }
    getOneTimeLocation();
  }, [isFocused]);

  let requestStatus = current_request?.request?.request_status || '';
  let _current_request = current_request?.request;

  function closeSendRequestModal(valy) {
    setSendRequestModalVisible(valy);
    navigation.setParams({ item: null });
    console.log('modal closed');
  }


  const updateLocation = async (latitude, longitude) => {
    if ((latitude || '') == '' || (longitude || '') == '') {
      return;
    }

    /*let addressDetails = await _getDetailsLatLong(`${latitude},${longitude}`)
    let address = "";
    if ((addressDetails?.results).length > 0){
      address = addressDetails?.results[0].formatted_address
    }*/

    //setTimeout(()=> {jsutseemeupdateLocation(latitude, longitude)},60000);

    let body = {
      latitude: latitude,
      longitude: longitude,
      last_location: letaddress == "" ? address : letaddress
      //last_location: "My loacation is loading for you"
    };

    console.log("letaddress => ", letaddress);
    console.log("address => ", address);

    try {
      let res = await _patchSendRequest({
        pk: current_request?.request?.id,
        body: body,
      });

      let currentRequest = await _getActiveRequest();
      console.log("calling currentRequest");
      console.log(currentRequest);
      if (currentRequest.active_request == false) {
        console.log("calling currentRequest fail");
      } else {
        jsutseemeupdateLocation(latitude, longitude)
      }
      dispatchRedux(updateRequestStatus(currentRequest));

      // getOneTimeLocation()
    } catch (err) {
      console.log(err);
      console.log(getErrorMessage(err));
      //Toast.show(getErrorMessage(err));
    }
  };

  const onetimeupdateLocation = async (latitude, longitude) => {
    if ((latitude || '') == '' || (longitude || '') == '') {
      return;
    }

    /*let addressDetails = await _getDetailsLatLong(`${latitude},${longitude}`)
    let address = "";
    if ((addressDetails?.results).length > 0){
      address = addressDetails?.results[0].formatted_address
    }*/

    let addressDetailsTom = await _tomGeocode(`${latitude},${longitude}`)
    let addressedTom = "";
    if ((addressDetailsTom?.addresses).length > 0) {
      addressedTom = addressDetailsTom?.addresses[0].address.freeformAddress
      setAddress(addressedTom);
      letaddress = addressedTom;
      console.log(addressedTom);
    }

    let body = {
      latitude: latitude,
      longitude: longitude,
      last_location: letaddress == "" ? address : letaddress
      //last_location: "My loacation is loading for you"
    };

    console.log("letaddress => ", letaddress);
    console.log("address => ", address);

    try {
      let res = await _patchSendRequest({
        pk: current_request?.request?.id,
        body: body,
      });

      let currentRequest = await _getActiveRequest();
      dispatchRedux(updateRequestStatus(currentRequest));

      // getOneTimeLocation()
    } catch (err) {
      console.log(err);
      console.log(getErrorMessage(err));
      //Toast.show(getErrorMessage(err));
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
    geolocationGetCurrentPosition();
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

  function stopinapplocation(value) {
    if (value == true) {
      console.log('current seeme from stopinapplocation => ' + value);
    } else {
      console.log('current seeme from stopinapplocation => ' + value);
    }
  }

  const currentUserDetails = async () => {
    let res = await _me();
    setUsername(res.fullname);
    setUseremail(res.email);
    setFcm(res.device_token);
    setId(res.id);
    //console.log(res);
  }

  const geolocationGetCurrentPosition = () => {
    console.log('geolocationGetCurrentPosition');
    Geolocation.getCurrentPosition(
      position => {

        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        /*AsyncStorage.setItem("longitude",currentLongitude);
        AsyncStorage.setItem("latitude",currentLatitude);
        
        setLatitude(currentLatitude)
        setLongitude(currentLongitude)*/

        onetimeaddressrequest(currentLatitude, currentLongitude);

        //updateLocation(currentLatitude, currentLongitude);
        console.log('jsutseemeupdateLocation called from getOneTimeLocation one time');
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

  const onetimeaddressrequest = async (latitude, longitude) => {
    let addressDetailsTom = await _tomGeocode(`${latitude},${longitude}`)
    let addressedTom = "";
    if ((addressDetailsTom?.addresses).length > 0) {
      addressedTom = addressDetailsTom?.addresses[0].address.freeformAddress
      setAddress(addressedTom);
      letaddress = addressedTom;
      console.log(addressedTom);
      updateLocation(latitude, longitude);
    }
  }

  const jsutseemeupdateLocation = async (latitude, longitude) => {
    console.log('_tomGeocode called in Trackerscreen');
    console.log(_current_request.user_flag);
    console.log(current_request.active_request);
    console.log(requestStatus);
    console.log(current_request?.request?.request_status)

    if ((latitude || '') == '' || (longitude || '') == '') {
      return;
    }

    if (current_request?.active_request == false) {
      return;
    }

    /*let addressDetails = await _getDetailsLatLong(`${latitude},${longitude}`)
    let addressed = "";
    if ((addressDetails?.results).length > 0){
      addressed = addressDetails?.results[0].formatted_address
      setAddress(addressed);
    }*/

    console.log('_tomGeocode called in Trackerscreen geodoced success');
    //Tom tom geocode address
    let addressDetailsTom = await _tomGeocode(`${latitude},${longitude}`)
    let addressedTom = "";
    if ((addressDetailsTom?.addresses).length > 0) {
      addressedTom = addressDetailsTom?.addresses[0].address.freeformAddress
      setAddress(addressedTom);
      letaddress = addressedTom;
      console.log(addressedTom);
    }

    //setLatitude(latitude);
    //setLongitude(longitude);
    //setSpin(false);
  }


  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <>

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
              <Marker
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
        <View style={[{ bottom: 0, position: 'absolute', width: '100%', }]}>
          {/* <TrackingBox /> */}

          {(current_request?.active_request == false ||
            requestStatus == 'request_sent') &&
            displaySendReqModal &&
            (currentItem || null) != null ? (
            <SendRequestModal
              closeSendRequestModal={setSendRequestModalVisible}
              item={params.type ? newItems : currentItem}
              trackingBoxStatus={trackingBoxStatus}
              setTrackingBoxStatus={setTrackingBoxStatus}
              updateLocation={updateLocation}
              onetimeupdateLocation={onetimeupdateLocation}
            />
          ) : ['accepted', 'paused'].includes(requestStatus) ? (
            <TrackingBox item={params.type ? newItems : currentItem} />
          ) : current_request?.active_request == true &&
            requestStatus == 'request_sent' ? (
            <SendRequestModal
              closeSendRequestModal={setSendRequestModalVisible}
              item={params.type ? newItems : currentItem}
              trackingBoxStatus={trackingBoxStatus}
              updateLocation={updateLocation}
              getOneTimeLocation={getOneTimeLocation}
              setTrackingBoxStatus={setTrackingBoxStatus}
              onetimeupdateLocation={onetimeupdateLocation}
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



