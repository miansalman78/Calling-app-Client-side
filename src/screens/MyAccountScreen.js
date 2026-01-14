import React , {useEffect, useState} from 'react';
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
import {_patchUser,_me, _postUpdateAcctRequest} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper'
import useAuth from '../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux'
import { updateRequestStatus ,updateCurrentUser} from '../slices/requestSlice'
import AppHeader from '../components/AppHeader'


export default function MyAccountScreen(props) {
  const {navigation} = props
  const [name,setName] = useState('')
  const [empty, setEmpty] = useState('');

  const current_user = useSelector((state) => state.requestStatus?.currentUser || {});
  const dispatchRedux = useDispatch()
  useEffect(()=>{
    setName(current_user?.fullname || '')
  },[])
  const updateProfile = async () => {


    try {
      if( name == ''){
        setEmpty('Please enter all the fields !');
        return;
      }else{setEmpty('')}


      let body = {
        "fullname": name,
        "id": current_user?.id
      }
      //let res = await _patchUser({ pk:current_user?.id ,body:body });
      let res = await _postUpdateAcctRequest({ body:body });
      if(res.STATUS == "ok"){
        Toast.show("Profile Successfully Updated");
      }
      
      console.log("Profile Successfully Updated");
      console.log(res);
      let currentUserDetails = await _me()
      dispatchRedux(updateCurrentUser(currentUserDetails))
    } catch (err) {
      console.log(err)
      setEmpty(getErrorMessage(err));
    }
  }

  return (
     <ScrollView>
      <View
        // style={GlobalStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ flexGrow: 1 }}
        bounces={true}>
        <AppHeader displaySearch = {false} flag = {"chatroom"} heading={"My Profile"}/>
        <View style={[GlobalStyles.container_start,GlobalStyles.paddingAll]}>
            {/* <View style={{width:"100%",flexDirection:"row",alignContent:"flex-start"}}>
            <Image
              source={require('../assets/logo.png')}
              resizeMode="contain"
              style={styles.image}
            />
            </View> */}

            {/* <Text style={[GlobalStyles.heading,{"marginTop":30,marginBottom:30}]}>{'My Profile'}</Text> */}
            <Text style={[GlobalStyles.descriptionText]}>
              {'Please type in your name below, and click on '}
                <Text style={[GlobalStyles.descriptionText,{fontFamily:Font.family_bold}]}>
                  {'"update. "'}
                </Text>
               {'to update your name in the application.'}
            </Text>
            <View style={[GlobalStyles.greyContainer,{marginTop:40}]}>
              <TextInput
                style={GlobalStyles.textBox}
                placeholder="Name"
                onChangeText={setName}
                autoCapitalize='none'
                value={name}
                placeholderTextColor={AppColors.textGrey}
              />
              <Text style={styles.errorText}>
                    {empty}
              </Text>

              <Button
                title="Update"
                onPress={updateProfile}
              />
            </View>
          </View>
        </View>
    </ScrollView>
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
