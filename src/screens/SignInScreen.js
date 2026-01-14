import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font} from '../utils/Constants';
import useAuth from '../hooks/useAuth';
import Toast from 'react-native-simple-toast';
import {_checkEmailStatus} from '../utils/api'
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import BackAppHeader from '../components/BackAppHeader';


export default function SignInScreen(props) {
  const {navigation} = props
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empty, setEmpty] = useState('');

  const [emailfocus, setEmailfocus] = useState(GlobalStyles.removeactiveTextInput);
  const [passfocus, setPassfocus] = useState(GlobalStyles.removeactiveTextInput);

  const onBlur = async() => {
    setFocusblur(GlobalStyles.removeactiveTextInput)
  }

  const emailFocus = async() => {
    setEmailfocus(GlobalStyles.activeTextInput)
  }

  const passFocus = async() => {
    setPassfocus(GlobalStyles.activeTextInput)
  }

  const loginUser = async() => {

    if(email == '' || password == ''){
      setEmpty('Please enter email and password !');
      return;
    }else{setEmpty('')} 

    if(!(/\S+@\S+\.\S+/).test(email)){
      setEmpty('Please enter valid email address !');
      return;
    }else{setEmpty('')}

    let body = {
      "email":email
    }
    try{
      let res = await _checkEmailStatus({ body })
      login(email,password)
    }catch (err) {
      //Toast.show(getErrorMessage(err));
      setEmpty(getErrorMessage(err));
      console.log(getErrorMessage(err));
    }
  }

  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
      <BackAppHeader />
          <View style={[GlobalStyles.KeyboardcontainerPadLeftRight,{flex:1,}]}>
          
          <Text className="w-[236px] mt-[16.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-2xl tracking-[0] leading-[normal]" >
            {'Log In'}
          </Text>

          <Text className="w-[335px] mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[normal]" >
            {'Enter your details below'}
          </Text>

          <Text className="w-[335px] mt-[28.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Email'}
          </Text>
          <TextInput
                style={[GlobalStyles.textBox, emailfocus]}
                placeholder="Email"
                onChangeText={setEmail}
                keyboardType={'email-address'}
                autoCapitalize='none'
                //onBlur={onBlur}
                onFocus={emailFocus}
                placeholderTextColor={AppColors.textGrey}
              />

          <Text className="w-[335px] mt-[16.00px] mb-[4.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[12px] tracking-[0] leading-[normal]" >
            {'Password'}
          </Text>
          <TextInput
                style={[GlobalStyles.textBox, passfocus]}
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry
                onFocus={passFocus}
                placeholderTextColor={AppColors.textGrey}
              />
          <View style={[GlobalStyles.nogreyContainer,{bottom:20, position:'absolute', width: '100%'}]}>
              <Button
              style={{ marginTop:5, marginBottom:10, borderRadius:32, lineHeight: 24, height: 55 }}
                title="Login"
                onPress={() => loginUser()}
              />

              {/*<Button
              style={{ marginTop:5, backgroundColor: AppColors.uibackgroundinactive, marginBottom:10, borderRadius:32, lineHeight: 24, height: 55 }}
                title="Disabled Login"
                disabled={true}
              />*/}

            </View>
          </View>
          
            
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    maxHeight: 270,
    width: '110%',
  },
  errorText:{
    textAlign:'center',
    fontSize: 6,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    marginBottom:0,
    marginTop:0,
    color: 'red'
  },
  errorTextBottom:{
    textAlign:'center',
    fontSize: 6,
    color: AppColors.textBlack,
    fontSize: Font.textSize,
    marginBottom:5,
    marginTop:5,
    color: 'red'
  }
});
