import React,{useState, useEffect,} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import BackAppHeader from '../components/BackAppHeader';
import {_postContact, _patchContact} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import {CountryPicker} from "react-native-country-codes-picker";
import DeviceCountry from 'react-native-device-country';
import codes from 'country-calling-code';
import parsePhoneNumber from 'libphonenumber-js';


export default function AddEditContactScreen(props) {
  const {navigation,route} = props
  const {params} = route
  const [phone_number,setPhoneNumber] = useState(params?.item?.phone_number || "")
  const [email,setEmail] = useState(params?.item?.email || "")
  const [fullname,setFullname] = useState(params?.item?.fullname || "")
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [validemail, setValidemail] = useState('');
  const [validphone, setValidphone] = useState('');
  const [validall, setValidall] = useState('');

  const [emailfocus, setEmailfocus] = useState(GlobalStyles.removeactiveTextInput);

useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handlebackbtn);
  }, []);

function handlebackbtn(){
  if(show){
    setShow(false);
  }
  console.log("back presseed");
}

const showCountryCode = async()=>{
    
    var phonebookArray = []
    DeviceCountry.getCountryCode()
    .then((result) => {

      
      if(phone_number != '' && phone_number.slice(0,1) === '+'){

        const phn = parsePhoneNumber(phone_number);
        const chesome = codes.find(({isoCode2}) => isoCode2 === phn.country);
        const codeall = '+'+chesome.countryCodes[0];
        console.log(codeall);

        setCountryCode(codeall);

        let lth = codeall.length;
        let str = phone_number.slice(lth);
        setPhoneNumber(str);
        console.log(str);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }

  showCountryCode();

  const addContact = async() => {
    try {

      if(fullname == ''){
        setValidall('Please enter full names !');
        //Toast.show('Please enter all the fields !');
        return;
      }else{setValidall('')}

      /*if(email == '' || !(/\S+@\S+\.\S+/).test(email)){
        setValidemail('Please enter valid email address !');
        //Toast.show('Please enter valid email address !');
        return;
      }else {setValidemail('')}*/

      if(!validatePhoneNumber(countryCode+phone_number)){
        setValidphone('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212');
        //Toast.show('Please enter valid phone number with country code. Format should be + then country code, then area code, then phone number, e.g. +12065551212',Toast.LONG);
        return;
      }else{setValidphone('')}

      let emailo = fullname.replace(/\s/g,'');
      let body = {
        "email": emailo+phone_number+'@gmail.com',
        "fullname":fullname,
        "phone_number":countryCode+phone_number,
        "room_id": phone_number+ Date.now()
      }

      let res = params?.flag != 'edit' ? await _postContact({ body }) : await _patchContact({ pk:params?.item?.id,body });

      if(params?.flag != 'edit'){
        Toast.show("Contact Successfully Added !");
      }else{
        Toast.show("Contact Successfully Updated !");
      }

      navigation.goBack()
      params?.refreshContacts()
    } catch (err) {
      setValidall(getErrorMessage(err));
      Toast.show(getErrorMessage(err));
    }
  }

  const onSearch = async (text) => {
    navigation.goBack();
    params?.refreshContacts(text)
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
          <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#0512250D'}]}>
              <BackAppHeader />
              <Text className="ml-6 mb-[0.00px] mt-[8.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {params?.flag == "edit" ? 'Edit Contact' : 'Add New Contact'}
            </Text>
            <Text className="ml-6 mt-[8.00px] mb-[24.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[normal]" >
              {params?.flag == "edit" ? 'Make desired changes and submit' : 'Enter new contact details below'}
            </Text>
          </View>
          <View style={[GlobalStyles.KeyboardcontainerPadLeftRight,{flex:1,}]}>
          <Text className="mt-[28.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Contact’s Full Name'}
          </Text>
          <TextInput
                style={[GlobalStyles.textBox, emailfocus]}
                placeholder="e.g John Doe Mark"
                onChangeText={setFullname}
                keyboardType={'email-address'}
                autoCapitalize='none'
                value={fullname}
                //onBlur={onBlur}
                //onFocus={emailFocus}
                placeholderTextColor={AppColors.textGrey}
              />
            <Text style={styles.errorText}>
                {validall}
            </Text>

          {/*<Text className="mt-[0.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Contact’s Email'}
          </Text>
          <TextInput
                style={[GlobalStyles.textBox, emailfocus]}
                placeholder="e.g contactEmail@mail.com"
                onChangeText={setEmail}
                keyboardType={'email-address'}
                autoCapitalize='none'
                value={email}
                //onBlur={onBlur}
                //onFocus={emailFocus}
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                      {validemail}
                </Text>*/}

          <Text className="mt-[0.00px] mb-[14.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Contact’s Phone Number'}
          </Text>
          
            <View style={{flex: 1, flexDirection: 'row'}} >
                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      style={{
                          width: '27%',
                          height: 50,
                          padding: 10,
                          borderTopLeftRadius: 32,
                          borderBottomLeftRadius: 32,
                          backgroundColor: AppColors.uigreybackground,
                          marginTop:0,
                          alignItems: 'center',
                          lineHeight:50,
                          justifyContent:'center',
                          borderWidth: 1,
                          borderColor: AppColors.uitextborder,
                      }}
                    >
                      <Text style={{
                          fontSize: 20,
                          paddingLeft:10,
                          color: AppColors.textBlack,
                          fontSize: Font.textSize,
                      }}>
                          {countryCode}
                      </Text>
                      

                    </TouchableOpacity>
                    
                    
                    <TextInput
                      style={[styles.textBoxCode, emailfocus]}
                      placeholder="e.g 0123456789"
                      onChangeText={setPhoneNumber}
                      keyboardType={'phone-pad'}
                      autoCapitalize='none'
                      value={phone_number}
                      //onBlur={onBlur}
                      //onFocus={emailFocus}
                      placeholderTextColor={AppColors.textGrey}
                    />
                    <CountryPicker
                      show={show}
                      pickerButtonOnPress={(item) => {
                        setCountryCode(item.dial_code);
                        console.log(item.dial_code);
                        setShow(false);
                      }}
                      onBackdropPress={() =>{
                        setShow(false);
                      }}
                      enableModalAvoiding={false}
                      androidWindowSoftInputMode={'pan'}
                      style={{
                        modal:{
                          height:500
                        }
                      }}
                      popularCountries={['en', 'ua', 'pl']}
                    />
                  </View>
                  <Text style={styles.errorText}>
                      {validphone}
                  </Text>

            <View style={[GlobalStyles.nogreyContainer,{bottom:0, position:'relative', width: '100%'}]}>
              <Button
              style={{ marginTop:5, marginBottom:10, borderRadius:32, lineHeight: 24, height: 55 }}
                title="Submit"
                onPress={() => addContact()}
              />
              
            </View>
          </View>

        </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: '100%',
  },
  textBoxCode: {
    height: 50,
    width: '73%',
    borderTopRightRadius: 32,
    borderBottomRightRadius: 32,
    paddingLeft:20,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    // fontFamily: Font.family,
    backgroundColor: AppColors.uigreybackground,
    marginTop:0,
    borderWidth: 1,
    borderColor: AppColors.uitextborder,
    fontFamily: Font.family_regular
  },
  errorText:{
    textAlign:'center',
    fontSize: 6,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    marginBottom:0,
    marginTop:0,
    color: 'red'
  }
});
