import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Linking
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import AppHeader from '../components/AppHeader';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors, Font, SpaceConstants,GOOGLE_API_KEY} from '../utils/Constants';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker} from 'react-native-maps';
import SelectLocationScreen from './SelectLocationScreen';
import Toast from 'react-native-simple-toast';
import MapViewDirections from 'react-native-maps-directions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from 'react-native-geolocation-service';
//import Geolocation from '@react-native-community/geolocation';
import {_getDetailsLatLong} from '../utils/api'
import {latitudeConstant,longitudeConstant} from '../utils/Constants'
import KeepAwake from 'react-native-keep-awake';
import Share from 'react-native-share';
import uuid from 'react-native-uuid';
import {_getActiveRequest, _patchSendSeeMeRequest, _tomGeocode} from '../utils/api';


export default function NavigationScreen({navigation}) {
  const [destination, setDestination] = useState([{value: ''}]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [isVisible, setIsVisible] = useState('');
  const [locationType, setLocationType] = useState('');
  const [latitude,setLatitude] = useState('');
  const [longitude,setLongitude] = useState('');
  const [sendurl,setSendurl] = useState('');
  let letaddress = '';

  useEffect(()=>{
    getOneTimeLocation()
    KeepAwake.activate();
    return () => {
      KeepAwake.deactivate();
    };
  },[])

  const reset  = () => {
    setDestination(
      [{value: ''}]
    )
  }

  const getOneTimeLocation = () => {

    AsyncStorage.getItem("locationStatus").then((value)=>{

        if(value == "allowed"){
          Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {

              //getting the Longitude from the location json
              const currentLongitude =
              JSON.stringify(position.coords.longitude);

              //getting the Latitude from the location json
              const currentLatitude =
              JSON.stringify(position.coords.latitude);

              //updateseemeLocation(currentLatitude, currentLongitude, true, sendurl);
              //Toast.show('New location update onetimelocation called from navigation',);

              //Setting Longitude state
              AsyncStorage.setItem("longitude",currentLongitude);
              AsyncStorage.setItem("latitude",currentLatitude);
              setLatitude(currentLatitude)
              setLongitude(currentLongitude)

              /*_getDetailsLatLong(`${currentLatitude},${currentLongitude}`).then((value)=>{

                setCurrentLocation(value?.results[0] || {})
              })*/

              _tomGeocode(`${currentLatitude},${currentLongitude}`).then((value)=>{
                
                let latslongs = value?.addresses[0].position ;
                let latlong = latslongs.split(',')
                let results =  {"results": [{"formatted_address": value?.addresses[0].address.freeformAddress, "geometry": { "location": { "lat": parseFloat(latlong[0]), "lng": parseFloat(latlong[1])}}}]}
                  setCurrentLocation(results?.results[0] || {})
  
                  console.log("value from nvigation location ");
                  console.log(value?.addresses[0].address.freeformAddress);
                  console.log(value);
                  console.log(results);
                })

            },
            (error) => {
              //Toast.show("Please check the location Permissions. Error fetching current location")
              AsyncStorage.setItem("longitude",'');
              AsyncStorage.setItem("latitude",'');
              console.log(error);
            },
            {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 1000
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

  const updateLocation = (locationFlag, locationDetails) => {
    setIsVisible(!isVisible);

    if(locationFlag == "current"){
      setCurrentLocation(locationDetails)
      setLatitude(locationDetails?.geometry?.location?.lat)
      setLongitude(locationDetails?.geometry?.location?.lng)
      return
    }
    let destinationArr = [...destination]
    destinationArr[locationFlag].value = locationDetails
    setDestination(destinationArr)
  };

  const openModal = locationFlag => {
    setLocationType(locationFlag);
    setIsVisible(true);
  };

  const addDestination = () => {
    let currentDestinationIndex = destination[destination.length - 1]['key'];
    let currentDestinationvalue = destination[destination.length - 1]['value'];
    if (currentDestinationvalue == '') {
      Toast.show('Please enter previous destination to add new destination');
      return;
    }

    let destinationArr = [...destination]
    destinationArr.push({key: currentDestinationIndex + 1, value: ''});
    setDestination(destinationArr);
  };

  const updateseemeLocation = async (latitude, longitude, status, sendurll) => {
    if ((latitude || '') == '' || (longitude || '') == '') {
      return;
    }
    if(sendurll == ''){
      return;
    }

    let body = {
      latitude: latitude,
      longitude: longitude,
      status: status,
    };
    console.log(body);
    try {
      let res = await _patchSendSeeMeRequest({
        pk: sendurll,
        lat: latitude,
        long: longitude,
        stat: status,
        body: body,
      });
    } catch (err) {
      console.log(err);
      Toast.show(getErrorMessage(err));
    }
  };

  const share = async () => {
    if(sendurl == ''){
      Toast.show('You are sending your location');
    }else{
      setSendurl('');
      updateseemeLocation(latitude, longitude, false, sendurl);
      Toast.show('You stoped sending your location');
      return;
    }
    
    let uid = uuid.v4();
    let url = `https://tusharma123.pythonanywhere.com/seeme/${uid}`
    const title = "My location"
    const message = "Click link to see my location"
    const customoptions = {
      title, url, message,
    }
    
    updateseemeLocation(latitude, longitude, true, uid);
    setSendurl(uid);
    try{
      await Share.open(customoptions)
    }catch(err){
      console.log(err);
    }
  }

  const openGoogleMaps = () => {

    let url = `https://www.google.com/maps/dir/${latitude}, ${longitude}/`
    destination.forEach((v,i)=>{
      if((v?.value?.geometry || '') != '')
        url = url + `${v?.value?.geometry?.location?.lat}, ${v?.value?.geometry?.location?.lng}/`
    })
    Linking.openURL(url)
    // navigation.navigate(
    //   'home',
    //     {
    //         "currentLatitude":latitude,
    //         "currentLongitude":longitude,
    //         "destination" :destination,
    //         "currentLocation":currentLocation
    //     }
    //   )
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <SelectLocationScreen
        updateLocation={updateLocation}
        setIsVisible={setIsVisible}
        isVisible={isVisible}
        locationType={locationType}
      />
        <View
          style={[//GlobalStyles.scrollContainerCenter,
            {padding: 0, marginTop: 30, paddingBottom: 0, marginBottom: 0,flex:1,
              flexGrow: 1, flexDirection:'column',
              justifyContent: 'center'
            },
          ]}>
          <View style={{flex:1, flexDirection: 'row',}}>
            <Image
              source={require('../assets/new/nav.png')}
              resizeMode={"contain"}
              style={styles.sideMenuProfileIcon}
            />
            <View style={{flexDirection: 'column', flex:1, marginRight:20}}>
              <View style={[{flex:1}]}>
                <Text className="mt-[0.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
                  {'My Starting Point'}
                </Text>
                <TextInput
                      style={[GlobalStyles.textBox]}
                      placeholder={currentLocation?.formatted_address || "e.g Abuja Federal Capital Territory"}
                      onPressIn={() => openModal('current', true,'My Starting Point')}
                      value={currentLocation?.formatted_address ||''}
                      defaultValue={''}
                      keyboardType={'default'}
                      autoCapitalize='words'
                      placeholderTextColor={AppColors.textGrey}
                    />

                {(destination).map((v, i) => {

                  return (
                    <>
                      <Text className="mt-[0.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
                        {'My Destination'}
                      </Text>

                      <TextInput
                        style={[GlobalStyles.textBox]}
                        placeholder="e.g Destination"
                        keyboardType={'default'}
                        autoCapitalize='words'
                        placeholderTextColor={AppColors.textGrey}
                        onPressIn={() => openModal(`${i}`, true, 'My Destination')}
                        value={v.value?.formatted_address}
                        defaultValue={''}
                      />
                    </>
                  )
                })}
                <View style={[{flex:1,flexDirection:'row', justifyContent:'space-between', marginTop:10, marginLeft:15, marginRight:15}]}>
                <TouchableOpacity style={[styles.addContact,{borderColor:destination[destination.length - 1]['value'] == '' ? '#CBD5E1' : AppColors.buttonColor}]} 
                  onPress={() => addDestination()}>
                    <View style={[{flexDirection:'row',}]}>
                      <IconOutline
                        name="plus"
                        color={destination[destination.length - 1]['value'] == '' ? '#CBD5E1' : AppColors.buttonColor}
                        size={19}
                        style={[{marginRight:10,marginTop:5}]}
                      />
                      <Text style={[{color:destination[destination.length - 1]['value'] == '' ? '#CBD5E1' : AppColors.buttonColor, fontWeight:'700', fontSize:14, lineHeight:28}]}>
                        {'Add Destination'}
                      </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addContactReset} 
                  onPress={() => reset()}>
                    <View style={[{flexDirection:'row',}]}>
                      <IconOutline
                        name="retweet"
                        color={destination[destination.length - 1]['value'] == '' ? '#DAD4FF' : 'black'}
                        size={20}
                        style={[{marginRight:10,marginTop:0}]}
                      />
                      <Text style={[{color:destination[destination.length - 1]['value'] == '' ? '#DAD4FF' : 'black', fontWeight:'700', fontSize:15}]}>
                        {'Reset'}
                      </Text>
                    </View>
                </TouchableOpacity>
                </View>
              </View>
            </View>
        </View>

          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              minZoomLevel={2}  // default => 0
              maxZoomLevel={14}
              region={{
                latitude: parseFloat(latitude || latitudeConstant),
                longitude: parseFloat(longitude || longitudeConstant),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
                  {

              currentLocation?.geometry?.location?.lat != undefined ?
                  <Marker
                        coordinate={{latitude: currentLocation?.geometry?.location?.lat,
                         longitude: currentLocation?.geometry?.location?.lng}}
                         title={currentLocation?.formatted_address || "My Location"}
                        description={""}
                    />
                    : <></>
                  }

                  {
                    (destination || []).map((v,i)=>{
                      let lat = v?.value?.geometry?.location?.lat || ''
                      let lng = v?.value?.geometry?.location?.lng || ''
                      if(lat != ''){
                        return  <Marker
                        coordinate={{latitude: lat,
                         longitude: lng}}
                        title={v.value?.formatted_address}
                        description={""}
                    />
                      }

                    })
                  }


                  {
                    (destination || []).map((v,i)=>{
                      let lat = v?.value?.geometry?.location?.lat || ''
                      if(i == 0 && (destination[0]?.value || '')!= '' && lat != ''){
                          return <MapViewDirections strokeWidth={5} apikey={GOOGLE_API_KEY}
                          destination={`${v?.value?.geometry?.location?.lat}, ${v?.value?.geometry?.location?.lng}`} origin={`${latitude}, ${longitude}`}
                          />
                      }


                        return <MapViewDirections strokeWidth={5} apikey={GOOGLE_API_KEY}
                          destination={`${v?.value?.geometry?.location?.lat}, ${v?.value?.geometry?.location?.lng}`} origin={`${destination[i-1]?.value?.geometry?.location?.lat}, ${destination[i-1]?.value?.geometry?.location?.lng}`}
                          />

                    })
                  }
                  {/* <MapViewDirections strokeWidth={5} apikey={GOOGLE_API_KEY}
                    origin="28.69735410749251, 77.17596077182557" destination="28.686331765062576, 77.20683299319101"
                  /> */}

              </MapView>
          </View>
          <View style={[{bottom:10, position:'absolute', width: '100%', alignItems:'center', justifyContent:'center'}]}>
              {destination[destination.length - 1]['value'] != '' && (
                <Button
                style={{ marginTop:5, width: '80%', marginBottom:0, borderRadius:32, lineHeight: 24, height: 50 }}
                  title="Go Now"
                  onPress={openGoogleMaps}
                />
              )}
            </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sideMenuProfileIcon:{
    marginLeft:20,
    marginRight:20,
    marginTop:45,
  },
  addContact:{
    paddingLeft:10,
    paddingRight:10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:8,
    borderWidth:1
  },
  addContactReset:{
    paddingLeft:10,
    paddingRight:10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 20,
    width: 20,
    marginLeft: 8,
  },
  searchIcon: {
    // position:"absolute",
    zIndex: 999,
    right: 0,
    // marginTop:5.5,
    marginRight: 10,
    height: 50,
    width: 50,
  },
  destinationIcon: {
    position: 'absolute',
    zIndex: 999,
    marginLeft: 8,
    top: 16,
    height: 20,
    width: 20,
  },
  searchInput: {
    height: 40,
    paddingLeft: 35,
    paddingRight: 30,
    marginTop: 5,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    // fontFamily: Font.family,
    backgroundColor: AppColors.textInputBg,
    marginBottom: SpaceConstants.spacing,
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    width: '100%',
    fontFamily: Font.family_regular,
  },
  inputIcon: {
    position: 'absolute',
    zIndex: 999,
    top: 16,
    paddingLeft: 10,
  },
  container: {
    // ...StyleSheet.absoluteFillObject,
    // flex:1,
    // height:'50%',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor:"#000",
    marginTop: 20,
    height: '57%',
    width: '110%',
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
