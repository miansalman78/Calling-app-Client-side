import React , {useState,useEffect,useCallback} from 'react';
import { View, StyleSheet,Text, TextInput,TouchableOpacity, Image} from 'react-native';
import Modal from "react-native-modal";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {GOOGLE_API_KEY} from '../utils/Constants'
import {_getPlaceDetails} from '../utils/api'
import GlobalStyles from '../utils/GlobalStyles';
import { IconOutline } from '@ant-design/icons-react-native';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import 'react-native-get-random-values';

 const SelectLocationScreen = (props) => {
  const {navigation} = props
  const getPlaceData = async (details) =>{

    let res = await _getPlaceDetails(details?.place_id);

    props.updateLocation(props.locationType,res.result)
  }

  const [searchText,setSearchText] = useState('')
  const [passfocus, setPassfocus] = useState(GlobalStyles.removeactiveTextInput);
  const [passfocusA, setPassfocusA] = useState(GlobalStyles.removeactiveTextInput);

    const onSearch = async (text) => {
        
    }

    const passFocus = async() => {
      setPassfocus(GlobalStyles.activeTextInputSearch)
      setPassfocusA(GlobalStyles.activeTextInputSearchA)
    }

  return (
    <Modal   animationType = {"fade"}
    transparent = {true}
    visible = {props.isVisible}
    onSwipeComplete={() => props.setIsVisible(false)}
    onBackButtonPress= {()=>props.setIsVisible(false)}
    swipeDirection="down"
    style={{justifyContent:'flex-end',margin:0}}

    onRequestClose = {() =>props.setIsVisible(false)}>

    <View style={styles.container}>

      
      <View
        style={{
          
          marginTop:20,
          marginBottom:10,
          marginLeft:10,
          backgroundColor: 'white'
        }}>
      <TouchableOpacity onPress={()=>props.setIsVisible(false)}>
        <View style={{ marginTop: 7}} className="w-7 h-7 bg-[#0512250d] rounded-[32px]">
          <View className="pl-1 pt-1">
              <IconOutline name="left" size={18} />
          </View>
        </View>
        </TouchableOpacity>
      </View>
      <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 0,
            borderBottomColor: '#0512250D'}]}>
              <Text style={[{marginLeft:10,marginRight:10,}]} className="mb-[16.00px] mt-[8.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {props.locationType == 'current' ? 'My Starting Point' : 'My Destination'}
            </Text>
            <View style={[{flexDirection:'row', 
            marginLeft:10,marginRight:10,}]}>
              

          {/*<GooglePlacesAutocomplete
            placeholder="Where to?"
            fetchDetails={true}
            debounce={200}
            enablePoweredByContainer={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            minLength={2}
            timeout={10000}
            keyboardShouldPersistTaps="handled"
            listViewDisplayed="auto"
            keepResultsAfterBlur={false}
            currentLocation={false}
            currentLocationLabel="Current location"
            enableHighAccuracyLocation={true}
            onFail={() => console.warn('Google Places Autocomplete failed')}
            onNotFound={() => console.log('No results found')}
            onTimeout={() => console.warn('Google Places request timeout')}
            predefinedPlaces={[]}
            predefinedPlacesAlwaysVisible={false}

            styles={{
                textInputContainer: {
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    marginHorizontal: 20,
                    position: 'relative',
                    shadowColor: '#d4d4d4',
                },
                textInput: {
                    backgroundColor: 'white',
                    fontWeight: '600',
                    fontSize: 16,
                    marginTop: 5,
                    width: '100%',
                    fontFamily: 'JakartaSans-Medium',
                    color: '#000',
                },
                listView: {
                    backgroundColor: 'white',
                    position: 'relative',
                    top: 0,
                    width: '100%',
                    zIndex: 99,
                    borderRadius: 10,
                    shadowColor: '#d4d4d4',
                },
            }}

            query={{
                key: GOOGLE_API_KEY,
                language: 'en',
                types: 'geocode',
            }}

            onPress={(data, details = null) => {
                console.log('Selected data:', data);
                console.log('Details:', details);
                getPlaceData(details)
            }}
            GooglePlacesSearchQuery={{
                rankby: 'distance',
                radius: 1000, // <-- REQUIRED if using 'distance'
            }}

            renderLeftButton={() => (
                <View className="justify-center items-center w-6 h-6">
                    <Image source={require('../assets/new/phone.png')} className="w-6 h-6" resizeMode="contain" />
                </View>
            )}

            textInputProps={{
                placeholderTextColor: 'gray',
                placeholder: 'Where do you want to go?',
            }}
        />*/}

            <GooglePlacesAutocomplete
            fetchDetails={true}
            debounce={200}
            enablePoweredByContainer={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            minLength={2}
            timeout={10000}
            keyboardShouldPersistTaps="handled"
            listViewDisplayed="auto"
            keepResultsAfterBlur={false}
            enableHighAccuracyLocation={true}
            onFail={() => console.warn('Google Places Autocomplete failed')}
            onNotFound={() => console.log('No results found')}
            onTimeout={() => console.warn('Google Places request timeout')}
            predefinedPlaces={[]}
            predefinedPlacesAlwaysVisible={false}
                  placeholder='Search Location'
                  currentLocation={true}
                  currentLocationLabel={'My Location'}
                  onPress={ (data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    getPlaceData(details)
                  }}
                  query={{
                    key: GOOGLE_API_KEY,
                    language: 'en',
                  }}
                  styles={{
                    textInputContainer:{},
                    textInput: {
                      height: 40,
                      borderRadius: 20,
                      paddingLeft:20,
                      color: AppColors.textBlack,
                      fontSize: Font.textSize,
                      // fontFamily: Font.family,
                      backgroundColor: AppColors.textInputBg,
                      marginBottom:SpaceConstants.spacing,
                      borderWidth: 1,
                      borderColor: AppColors.uitextborder,
                      width: '88%',
                      fontFamily: Font.family_regular
                    },
                    separator: {
                      height:1,
                      backgroundColor:'#05122514'
                    },
                    listView:{
                      borderBottomWidth:1,
                      borderTopWidth:1,
                      borderColor: '#05122514',
                    },
                    description:{
                      color:'#051225CC'
                    }
                  }}
                  textInputProps={{
                    placeholderTextColor: 'gray',
                    placeholder: 'Search Location',
                }}
                />
              
            </View>
            </View>
            
      
    

     <View style={styles.containerImage}>
      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    height:'90%',
    // bottom:0,
    // paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: 'white',

  },
  searchIcon: {
    // position:"absolute",
    zIndex:999,
    right:0,
    // marginTop:5.5,
    marginRight:10,
    color:'#dadada'
  },
  logo: {
    width: 300,
    height: 400,
  },
});

export default SelectLocationScreen;
