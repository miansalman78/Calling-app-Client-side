import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, SafeAreaView, TextInput, TouchableOpacity, Text, Image, Linking, Alert } from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import AppHeader from '../components/AppHeader';
import TrackingBox from '../components/TrackingBox';
import SendRequestModal from '../components/SendRequestModal';
import {useSelector, useDispatch} from 'react-redux';
import {updateCurrentRequestItem} from '../slices/currentItemSlice';
import {useIsFocused} from '@react-navigation/native';
import {_getActiveRequest, _patchSendRequest, _patchSendSeeMeRequest, _patchTestSeeMeRequest, _lookseeme, _tomGeocode, host} from '../utils/api';
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
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';

import { checkMultiplePermissions } from '../helper/Permissions';
import Spinner from 'react-native-loading-spinner-overlay'

import {async} from '@firebase/util';
import {Marker} from 'react-native-maps';

import {request, PERMISSIONS, openSettings} from 'react-native-permissions';

export default function SeemeScreen(props) {
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
  const [sendurl,setSendurl] = useState('sendurl');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [useremail, setUseremail] = useState('');
  const [id, setId] = useState('');
  const [fcm, setFcm] = useState('');
    let usernameT = '';
    let useremailT = '';
    let idT = '';
    let fcmT = '';
    let emailedT = '';
    let emailed = ''
    let letaddress = '';
    let later ;
    let longer; 
    let timer ;

  useEffect(()=>{
  
    geolocationGetCurrentPosition();
    currentUserDetails();
    KeepAwake.activate();

    timer = setInterval(() => {
      jsutseemeupdateLocation(later || latitude, longer || longitude);
      console.log('setInterval called with lat long => ',later +longer);
    }, 60000);

    console.log("sendurl => "+sendurl);
    return () => {
      KeepAwake.deactivate();
      //setSpin(false);
      console.log('unmounting TrackerScreen')
      //clearInterval(timer);
      clearInterval(timer);
    };
  },[]);

  useEffect(() => {
    //initZeoCloud(); 
  }, [navigation, route]);

  useEffect(() => {
    
    setSeeme(true);
    //setSpin(true);
    //stopspinner();
        
    //getOneTimeLocationSeeMe(sendurl);
    
  }, [isFocused]);
    

    const getOneTimeLocationSeeMe = (uid) => {
        console.log("getOneTimeLocationSeeMe");
        geolocationGetCurrentPosition(uid);
        
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
              
              //console.log(currentLongitude);
              //console.log(currentLatitude);
              AsyncStorage.setItem("longitude",JSON.stringify(position.coords.longitude));
              AsyncStorage.setItem("latitude",JSON.stringify(position.coords.latitude));
                
              console.log(typeof currentLatitude);
              console.log('typeof currentLatitude getOneTimeLocationSeeMe');
                if(currentLongitude != ''){
                    setLatitude(currentLatitude)
                    setLongitude(currentLongitude)
                }

              updateseemeLocation(currentLatitude, currentLongitude, true, uid);
              later = currentLatitude ;
              longer = currentLongitude;
              //setTimeout(()=> {jsutseemeupdateLocation(currentLatitude, currentLongitude)},60000);
              //jsutseemeupdateLocation(currentLatitude, currentLongitude);
              
              //setSpin(false);
                
            },
            error => {
              Toast.show(
                'Please check the location Permissions. Error fetching current location',
              );
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
          ));
        } else {
          Toast.show('Please check the location Permissions');
          AsyncStorage.setItem('longitude', '');
          AsyncStorage.setItem('latitude', '');
            //setSpin(false);
        }
      }).catch = err => {
        Toast.show('Please check the location Permissions');
        AsyncStorage.setItem('longitude', '');
        AsyncStorage.setItem('latitude', '');
          //setSpin(false);
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
                  
                //setSpin(false);

                onetimeaddressrequest(currentLatitude, currentLongitude);
                
              },
              error => {
                //Toast.show('Please check the location Permissions. Error fetching current location');
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

  const updateseemeLocation = async (latitude, longitude, status, sendurll) => {
    if ((latitude || '') == '' || (longitude || '') == '') {
        console.log('no lat long')
      return;
    }

    //Google geocode address
    /*let addressDetails = await _getDetailsLatLong(`${latitude},${longitude}`)
    let addressed = "";
    if ((addressDetails?.results).length > 0){
      addressed = addressDetails?.results[0].formatted_address
      setAddress(addressed);
    }

    //Tom tom geocode address
    let addressDetailsTom = await _tomGeocode(`${latitude},${longitude}`)
    let addressedTom = "";
    if ((addressDetailsTom?.addresses).length > 0){
      addressedTom = addressDetailsTom?.addresses[0].address.freeformAddress
      //setAddress(addressedTom);
      console.log(addressedTom);
    }*/

    let body = {
        latitude: latitude,
        longitude: longitude,
        status: status,
        //address: addressed,
        address: letaddress,
        username: usernameT || username,
        useremail: useremailT || useremail,
        sendurll: sendurll,
        fcm: fcmT || fcm,
        id: idT || id,
    };
    
    //setSpin(false);
      console.log('useremail => ' +body.useremail);
      console.log(body);
    try {
        if(sendurll != 'sendurl'){
            let res = await _patchSendSeeMeRequest({pk:body.useremail, body:body});
            if(res.callstate == 'STOPED'){
                
                setSendurl('sendurl');
                Toast.show('Your location share was stopped');
                Geolocation.clearWatch(watchid);
                Geolocation.stopObserving();
                console.log(body);
                //setSeemetitle('See me - Off')
                setTimeout(()=> {getOneTimeLocationSeeMe('sendurl')},2000);
                timer = setInterval(() => {
                  jsutseemeupdateLocation(later || latitude, longer || longitude);
                  console.log('setInterval called with lat long => ',later +longer);
                }, 60000);

            }else{
              jsutseemeupdateLocation(latitude, longitude);
              console.log('calling from jsutseemeupdateLocation updatelocation');
            }
            console.log(res);
        }
    } catch (err) {
        console.log(getErrorMessage(err));
      //Toast.show(getErrorMessage(err));
    }
  };
    
  function distance(point1, point2) {
    var R = 6371000;// meters
    var degToRad = Math.PI / 180;
    return R * degToRad * Math.sqrt(Math.pow(Math.cos(point1.lat * degToRad ) * (point1.lng - point2.lng) , 2) + Math.pow(point1.lat - point2.lat, 2));
  }

  const onetimeaddressrequest = async (latitude, longitude) => {
    let addressDetailsTom = await _tomGeocode(`${latitude},${longitude}`)
      let addressedTom = "";
      if ((addressDetailsTom?.addresses).length > 0){
        addressedTom = addressDetailsTom?.addresses[0].address.freeformAddress
        setAddress(addressedTom);
        letaddress = addressedTom;
        console.log(addressedTom);
      }
  }

  const jsutseemeupdateLocation = async (latitude, longitude) => {
    console.log('_tomGeocode called from Seemescreen');
    if ((latitude || '') == '' || (longitude || '') == '') {
      return;
    }
    
    if (sendurl == 'sendurl' ) {
      //return;
    }

    //Google geocode address
    /*let addressDetails = await _getDetailsLatLong(`${latitude},${longitude}`)
    let addressed = "";
    if ((addressDetails?.results).length > 0){
      addressed = addressDetails?.results[0].formatted_address
      setAddress(addressed);
    }*/

    //Tom tom geocode address
    let addressDetailsTom = await _tomGeocode(`${latitude},${longitude}`)
    let addressedTom = "";
    if ((addressDetailsTom?.addresses).length > 0){
      addressedTom = addressDetailsTom?.addresses[0].address.freeformAddress
      setAddress(addressedTom);
      letaddress = addressedTom;
      console.log(addressedTom);
    }

    //setLatitude(latitude);
    //setLongitude(longitude);
    //setSpin(false);
  }

  const currentUserDetails = async () => {
    let res = await _me();
      
      setUsername(res.fullname);
      setUseremail(res.email);
      setFcm(res.device_token);
      setId(res.id);
      
    usernameT = res.fullname ;
    useremailT = res.email;
    fcmT = res.device_token;
    idT = res.id;
    askForSeeMeRequest(res.email);
    emailed = res.email;
    //console.log(res);
    //getOneTimeLocationSeeMe(sendurl);
    //setTimeout(()=> {getOneTimeLocationSeeMe(sendurl)},2000);
      console.log('getting users details')
  }

  const askForSeeMeRequest = async (email) => {
    console.log(' askForSeeMeRequest started');
    let body = {
      useremail: email,
    };
      
    let res = await _lookseeme({pk:email, body:body});
    if(res.url !== 'none' && res.status !== 'False'){
      setSendurl(res.url);
      //getOneTimeLocationSeeMe(res.url);
      //updateseemeLocation(latitude, longitude, true, res.url);
        setTimeout(()=> {
          getOneTimeLocationSeeMe(res.url);
          updateseemeLocation(latitude, longitude, true, res.url);
          console.log('setSendurl => ' + sendurl);
        },5000);
        console.log(' SeeMe loaded  => '+ res.url);
        clearInterval(timer);
      }else{
        setTimeout(()=> {getOneTimeLocationSeeMe(sendurl)},2000);
      }
      
      console.log(res);
  }

  
  const stopshare = async () => {
    if(sendurl == 'sendurl'){
        //console.log(useremail);
      Toast.show('You are not sending your location');
      return;
      //nothing = false;
    }else{
      setSendurl('sendurl');
      updateseemeLocation(latitude, longitude, false, sendurl);
      Toast.show('You stoped sending your location');
      Geolocation.clearWatch(watchid);
      Geolocation.stopObserving();
      //setSeemetitle('See me - Off')
      setTimeout(()=> {getOneTimeLocationSeeMe('sendurl')},2000);
      timer = setInterval(() => {
        jsutseemeupdateLocation(later || latitude, longer || longitude);
        console.log('setInterval called with lat long => ',later +longer);
      }, 60000);
    }
  }


  const share = async () => {

    clearInterval(timer);

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
    console.log(fcm);
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
    //let url = `https://tusharma123.pythonanywhere.com/seeme/${uid}`
    //let url = `https://me.seemeglobal.net/seeme/${uid}`
    let url = host+'seeme/'+uid
    const title = "My location"
    const message = `Click the link to see the location of ${username}`
    const customoptions = {
      title, url, message,
    }
    
    //setSeemetitle('See me - On');
    
    setSendurl(uid);
      Geolocation.clearWatch(watchid);
      Geolocation.stopObserving();

      setTimeout(()=> {
        getOneTimeLocationSeeMe(uid);
        updateseemeLocation(latitude, longitude, true, uid);
      },4000);
    
    try{
      
      setTimeout(async()=> {
        await Share.open(customoptions)
      },5000);
    }catch(err){
      console.log(err);
    }
  }

  const stopspinner = async () => {
    setTimeout(() => {
      if(spin){
        Toast.show("Oops! couldn't load your location");
        //setSpin(false);
      }
    }, 15000);
  }

  function updatespinner(value){
    if(value == true){
      //setSpin(true);
      stopspinner();
      console.log('spinner started from updatespinner => '+ value );
    }else{
      //setSpin(false);
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <>
        <Spinner
          visible={spin}
          textContent={'Loading location ...'}
          cancelable={true}
          />
        <MapView
          showUserLocation={true}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          loadingEnabled={false}
          region={{
            latitude: parseFloat(latitude || latitudeConstant),
            longitude: parseFloat(longitude || longitudeConstant),
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          {latitude || '' != '' ? (
            <Marker
              coordinate={{
                latitude: parseFloat(latitude || latitudeConstant),
                longitude: parseFloat(longitude || longitudeConstant),
              }}
              title={username}
              description={address}
            />
          ) : null}
        </MapView>
        </>
        <View style={[{flex:1 ,flexDirection:'row',bottom:10, position:'absolute', width: '85%', justifyContent:'space-between'}]}>
                
          <TouchableOpacity style={[styles.addContact,{backgroundColor: AppColors.buttonColor}]} 
                  onPress={async () =>{
                    await share();
                  }}>
                    <View style={[{flexDirection:'row',}]}>
                      <IconOutline
                        name="share-alt"
                        color={'white'}
                        size={23}
                        style={[{marginRight:5,marginTop:3}]}
                      />
                      <Text style={[{color:'white', fontWeight:'700', fontSize:14, lineHeight:28}]}>
                        {'Share SeeMe'}
                      </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.addContact,{backgroundColor:'#051225'}]} 
                  onPress={async () =>{
                    await stopshare();
                  }}>
                    <View style={[{flexDirection:'row',}]}>
                    <IconOutline
                        name="team"
                        color={'white'}
                        size={23}
                        style={[{marginRight:5,marginTop:3}]}
                      />
                      <Text style={[{color: 'white', fontSize:14,fontWeight:'700', lineHeight:28}]}>
                        {'SeeMe Off'}
                      </Text>
                    </View>
                </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 'auto',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addContact:{
    paddingLeft:15,
    paddingRight:15,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:32,
  },
});



