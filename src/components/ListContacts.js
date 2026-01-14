import React, {useState,useEffect} from 'react';
import { Pressable, StyleSheet, Text, View, Platform, Image, TouchableOpacity } from "react-native";
import {IconOutline} from '@ant-design/icons-react-native';
import ActionSheet from './Actionsheet';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {_deleteContact} from '../utils/api';

const ListContacts = (props) => {
    const navigation = useNavigation();
    const {item, refreshContacts, setItemToDelete} = props;
    const [actionSheetItems, setActionSheetItems] = useState([])
    const [callID, setCallID] = useState('');
    const [actionSheet, setActionSheet] = useState(false);
    const closeActionSheet = () => setActionSheet(false);

    return (
    <View style={[style.gridItem,]}>
    <View style={{flexDirection:'row',}}>
        <Image
          source={item.is_email_present ? {uri:item.is_image} : require('../assets/new/ellipse723.png')}
          resizeMode={"cover"}
          style={style.userIcon}
        />
        <Text style={{lineHeight:50}} className="pl-[12.00px] a [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225] text-[14px]" >
              {item.fullname}
        </Text>
        </View>
    <TouchableOpacity
        onPress={() => {
            //openChatroom(item);
            navigation.navigate('ContactDetails', {
                item: item,
            })
        }} style={{}} >
        <IconOutline
          name="right"
          color={'#051225E5'}
          size={16}
          style={{textAlign:'right', lineHeight:50, left:0 }}
        />
    </TouchableOpacity>
    </View>
    )
}

export default ListContacts;

const style = StyleSheet.create({
    userIcon:{
        width: 40,
        height: 40,
        marginBottom:0,
        backgroundColor:'#F6F6F6',
        borderRadius: 100 / 2,
        marginTop:10
    },
    textStyling: {
            fontSize: 20,
            fontStyle: 'italic',
            color: 'black'
    },
    innerContainer: {
            flex: 1,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center'

    },
    button: {
            flex: 1
    },
    gridItem: {
        width:'100%',
        paddingLeft:20,
        paddingRight:20,
        flexDirection:'row',
        height: 'auto',
        backgroundColor: '#F6F6F6',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor: '#05122514',
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    }
})