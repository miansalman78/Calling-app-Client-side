import React, {useState} from 'react';
import {View, StyleSheet, TextInput,TouchableOpacity,Text, Image} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import { AppColors,Font } from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'


export default function AppHeader(props) {
  const navigation = useNavigation();
  const current_user = useSelector((state) => state.requestStatus?.currentUser || {});
  
  return (
    <View
      style={{
        width: '100%',
        paddingBottom:10,
        marginTop:20,
        paddingLeft:10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#0512250D'
      }}>
      <View style={styles.container}>
        <Image
          source={{uri: current_user?.image_url }}
          resizeMode={"cover"}
          style={styles.sideMenuProfileIcon}
        />
        <View style={styles.containertext}>
            <Text className="text-[16px]" style={{fontFamily:Font.family_bold, width:'100%'}}>
            {current_user?.fullname || ''}
            </Text>
            <Text className='mt-[4px] pl-[8px] pr-[8px] pt-1 pb-1 text-[10px]' style={{color: AppColors.buttonColor, backgroundColor:'#FFEEFD', width:'95%'}}>
            {current_user?.phone_number || ''}
            </Text>
        </View>
        <TouchableOpacity style={styles.searchIcon} onPress ={()=> 
            navigation.navigate('SearchContacts')}>
        <IconOutline
          name="search"
          color={'black'}
          size={27}
        />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
      width: 52,
      height: 52,
      borderRadius: 100 / 2,
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
    },
    containertext:{
        flexDirection:'column',
        marginLeft:10,
        width:'auto'
    },
    searchIcon: {
        position:"absolute",
        zIndex:999,
        right:0,
        marginTop:5.5,
        marginRight:20
    },
  });
