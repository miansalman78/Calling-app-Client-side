import React , {useState} from 'react';
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
import {_changePassword} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper'



export default function ChangePasswordScreen(props) {
  const {navigation} = props
  const [oldPassword,setOldPassword] = useState('')
  const [newPassword,setNewPassword] = useState('')
  const [confirmNewPassword,setConfirmPass] = useState('')
  const [empty, setEmpty] = useState('');
  const [validold, setValidold] = useState('');
  const [validnew, setValidnew] = useState('');

  const forgotPassword = async () => {
    try {

      if(oldPassword == ''){
        validold("Please enter your old password");
        return
      }else{validold('')} 

      if(newPassword == ''){
        validnew("Please enter a new password ");
        return
      }else{validnew('')} 

      if(newPassword != confirmNewPassword){
        setEmpty("Passwords don't match");
        return
      }else{setEmpty('')}


      let body = {
        "re_password": confirmNewPassword,
        "password": newPassword,
        "old_password": oldPassword
      }

      let res = await _changePassword({ body });
      Toast.show(res?.detail || "Password Changed Successfully");
      setEmpty(res?.detail);
      navigation.goBack()
    } catch (err) {
      //Toast.show(getErrorMessage(err));
      setEmpty(getErrorMessage(err));
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
    <KeyboardAvoidingView style={GlobalStyles.keyboardViewContainer}  enabled>
      <ScrollView
        style={GlobalStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={[GlobalStyles.container_start,GlobalStyles.paddingAll]}>
            <View style={{width:"100%",flexDirection:"row",alignContent:"flex-start"}}>
            <Image
              source={require('../assets/logo.png')}
              resizeMode="contain"
              style={[styles.image,{marginTop:30}]}
            />
            </View>

            <Text style={[GlobalStyles.heading,{"marginTop":30,marginBottom:30}]}>{'Password Reset'}</Text>
            <Text style={[GlobalStyles.descriptionText]}>
              {'Please type in your old password and new password below and click on '}
                <Text style={[GlobalStyles.descriptionText,{fontFamily:Font.family_bold}]}>
                  {'"Change Password"'}
                </Text>
                {' to reset your password.'}
            </Text>
            <View style={[GlobalStyles.greyContainer,{marginTop:40}]}>
              <TextInput
                style={GlobalStyles.textBox}
                placeholder="Old Password"
                onChangeText={setOldPassword}
                secureTextEntry={true}
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                    {validold}
              </Text>

              <TextInput
                style={GlobalStyles.textBox}
                placeholder="New Password"
                onChangeText={setNewPassword}
                secureTextEntry={true}
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                    {validnew}
              </Text>

              <TextInput
                style={GlobalStyles.textBox}
                placeholder="Confirm Password"
                onChangeText={setConfirmPass}
                secureTextEntry={true}
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                    {empty}
              </Text>

              <Button
                title="CHANGE PASSWORD"
                onPress={forgotPassword}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 120,
    width: "50%",
    marginTop:70,
    marginLeft:-20
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
