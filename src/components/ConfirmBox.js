import React, {useState,useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Modal
} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors} from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';
import {useNavigation} from '@react-navigation/native';
import Button from './Buttons';
import {_postSendRequest,_getActiveRequest} from '../utils/api';
import useAuth from '../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux'
import {_getDetailsLatLong} from '../utils/api'


export default function ConfirmBoxModal(props) {
  const navigation = useNavigation();
  const {isLoggedIn, user} = useAuth();
  const current_user = useSelector((state) => state.requestStatus?.currentUser || {});
  const {acceptClick,closeModal,description,isModalVisible,modalValues} = props;

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={isModalVisible}
    // style={{padding:10}}
    onRequestClose={() => {
      // this.closeButtonFunction()
      closeModal(false)
    }}>
    <View
      style={{
        height:'auto',
        marginTop: '100%',
        backgroundColor:'#Fff',
        marginLeft:"7.5%",
        marginRight:"7.5%",
        // marginBottom:"100%",
        border:1,
        borderColor:"#dfdfdf",
        borderWidth:1,
        borderRadius:10
      }}>
        <View style={{width:'100%',padding:20}}>

        <Text style={[GlobalStyles.descriptionText,{...{textAlign:"center",fontSize:18,marginBottom:10}}]}>
          {
            description
          }
        </Text>

        <View style={{flexDirection:'row'}}>
          <Button
            onPress={() => acceptClick()}
            title="Confirm"
            style={{width: '45%', marginTop: 10}}
            // disabled = {current_request?.request?.request_status == "request_sent" ? true : false}
          />
          <Button
            onPress={() => closeModal(false)}
            title="Cancel"
            style={{width: '45%', marginTop: 10,marginLeft:10,backgroundColor:"#FECC00"}}
            // disabled = {current_request?.request?.request_status == "request_sent" ? true : false}
          />
        </View>
      </View>


    </View>
  </Modal>
    )
}

const styles = StyleSheet.create({
  searchIcon: {
    position: 'absolute',
    zIndex: 999,
    right: 0,
    marginTop: 5.5,
    marginRight: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'space-between',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  cardContainer: {
    height: 'auto',
    backgroundColor: AppColors.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  centeredView: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // marginTop: 22,
    // bottom:0,
    // position:'absolute'
  },
});
