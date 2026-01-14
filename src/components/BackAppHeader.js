import React, {useState} from 'react';
import {View, StyleSheet, TextInput,TouchableOpacity,Text} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors} from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';
import { useNavigation } from '@react-navigation/native';



export default function AppHeader(props) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        
        marginTop:20,
        marginBottom:20,
        marginLeft:20,
        backgroundColor: 'white'
      }}>
    <TouchableOpacity onPress={navigation.goBack}>
      <View style={{ marginTop: 7}} className="w-7 h-7 bg-[#0512250d] rounded-[32px]">
        <View className="pl-1 pt-1">
            <IconOutline name="left" size={18} />
        </View>
      </View>
      </TouchableOpacity>
    </View>
  );
}
