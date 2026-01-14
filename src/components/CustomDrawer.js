// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React , {useState,useEffect,useCallback} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { AppColors,Font } from '../utils/Constants';
import useAuth from '../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux'
import {_deleteAccount, _me } from '../utils/api';
import {async} from '@firebase/util';
import Toast from 'react-native-simple-toast';
import ConfirmBoxModal from '../components/ConfirmBox'
import * as ZIM from 'zego-zim-react-native';

import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, } from '@zegocloud/zego-uikit-prebuilt-call-rn';

const CustomSidebarMenu = (props) => {
  const {logout} = useAuth()
  const [isModalVisible,setModalVisible] = useState(false)
  const current_user = useSelector((state) => state.requestStatus?.currentUser || {});

  const removeContent = async() => {
        let res = await _me();
        let body = {
          "id": res.id
        };

        try {
          let res = await _deleteAccount({
            body: body,
          });
            if(res.STATUS == 'ok'){
                logout()
                return ZegoUIKitPrebuiltCallService.uninit()
                Toast.show("Account deleted successfully later");
            }
          //console.log(body);
          console.log("delete results => " + res.STATUS);
        } catch (err) {
          console.log("updateLocation "+err);
          Toast.show("An error occured please try again later");
        }
      setModalVisible(false)
      
    }

    const delccount = async () => {
        setModalVisible(true)
        
    };

  return (
    <SafeAreaView style={{flex: 1}}>
    <ConfirmBoxModal isModalVisible = {isModalVisible} acceptClick={removeContent} closeModal={setModalVisible} description="Are you sure you want to delete your account ?"/>
      <View style={styles.container}>
        <Image
          source={require('../assets/userDefault.png')}
          resizeMode={"contain"}
          style={styles.sideMenuProfileIcon}
        />
        <Text style={{fontSize:Font.buttonSize,fontFamily:Font.family_bold}}>
          {current_user?.fullname || ''}
        </Text>
      </View>

      {/* <View style={{height:1,backgroundColor:AppColors.borderColor}}>
      </View> */}
      <DrawerContentScrollView  {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Log Out"
          onPress={() => logout()}
        />
        <DrawerItem
            label="Delete Account"
            onPress={() => delccount()}
          />
      </DrawerContentScrollView>
      {/* <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>
        www.aboutreact.com
      </Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    width: 100,
    height: 100,
    // borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'flex-start',
    padding: 8,
    flexDirection:'row',
    alignItems:'center'
  }
});

export default CustomSidebarMenu;