import React, {useState,useEffect} from 'react';
import { Pressable, StyleSheet, Text, View, Platform, Image, TouchableOpacity } from "react-native";
import {IconOutline} from '@ant-design/icons-react-native';
import ActionSheet from './Actionsheet';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {_deleteContact} from '../utils/api';
import useAuth from '../hooks/useAuth';
import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  push,
  update,
} from 'firebase/database';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, ZegoCountdownLabel} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import Toast from 'react-native-simple-toast';

const GridItem = (props) => {
    const navigation = useNavigation();
    const {item, refreshContacts, setItemToDelete, dbdata, isgroupcall, selectedItems, setGroupcall, setSelectedItems, addgroupcalitem, setVideovoice} = props;
    const [actionSheetItems, setActionSheetItems] = useState([])
    const [callID, setCallID] = useState('');
    const [actionSheet, setActionSheet] = useState(false);
    const closeActionSheet = () => setActionSheet(false);
    const [badgecoun, setBadgecoun] = useState(0);
    const current_user = useSelector(
      state => state.requestStatus?.currentUser || {},
    );

    useEffect(() => {
        setCallID(String(Math.floor(Math.random() * 100000)));
        //console.log(item)
        /*if(dbdata != undefined){
          dbdata.map((itemdb, index) => {
          if(itemdb.user == item.is_email_present){
            setBadgecoun(itemdb.count)
          }
        });
        //console.log('dbdata dbdata =>', dbdata)
        }*/
      const countSeen = async() => {
        let _item = item;
        if(item['is_email_present']){
          _item['id'] = item['is_email_present'];
          let _chat_id = getChatID(item);
          const database = getDatabase();
          const snapshot = await get(ref(database, `chatroom/${_chat_id}`),);
          let msgCount = 0;
          //console.log(snapshot.val().messages)
          const mssgs = snapshot.val();
          if(mssgs.messages != undefined){
            //console.log(mssgs.messages)
            mssgs.messages.map((msg, index) => {
              if(msg.senderID != current_user.id && msg.status == 'sent'){
                msgCount ++;
              }
              if(msg.status == 'sent'){
                //msgCount ++;
              }
            })
          }
          setBadgecoun(msgCount)
        }
      }
      countSeen();

    }, [item]);

    

    const actionItemsAccept = [
        {
          id: 1,
          icon:'phone',
          present: item.is_email_present,
          name: item.fullname,
          isEmailPresent: item.is_email_present == null ? 'none' : 'flex',
          label:
            'Call',
          onPress: () => {
            //acceptDeclineRequest('accept','Sounds good! Thanks')
            setActionSheet(false)
            sendChat('Voice call')
            //const newinvitees= { userID: item.email.toString(), userName: item.fullname};
             
              /*ZegoUIKitPrebuiltCallService
              .sendCallInvitation(
                newInvitees = [1].map((inviteeID) => {
                    return { userID: item.is_email_present.toString(), userName: item.fullname};
                  }), 
                false, 
                props.navigation, 
                { 
                  resourceID: 'traakme_com_call', 
                  timeout: 60,
                  callID: callID,
                  notificationTitle: 'Incoming call',
                  notificationMessage: 'You have a call',
                  customData: '',
                }
              );*/
          },
        },
        {
          id: 2,
          icon:'video-camera',
          present: item.is_email_present,
          name: item.fullname,
          isEmailPresent: item.is_email_present == null ? 'none' : 'flex',
          label:
            'Video',
          onPress: () => {
            //acceptDeclineRequest('accept','Sounds good honey! Thanks')
            setActionSheet(false)
            sendChat('Video call')
            //const newinvitees= { userID: item.email.toString(), userName: item.fullname};
              /*ZegoUIKitPrebuiltCallService
              .sendCallInvitation(
                newInvitees = [1].map((inviteeID) => {
                    return { userID: item.is_email_present.toString(), userName: item.fullname};
                  }), 
                true, 
                props.navigation, 
                { 
                  resourceID: 'traakme_com_call', 
                  timeout: 60,
                  callID: callID,
                  notificationTitle: 'Incoming call',
                  notificationMessage: 'You have a call',
                  customData: '',
                }
              );*/
          },
        },
        {
          id: 3,
          icon:'message',
          present: item.is_email_present,
          name: item.fullname,
          isEmailPresent: item.is_email_present == null ? 'none' : 'flex',
          label: 'Chat',
          onPress: () => {
            openChatroom()
            setActionSheet(false)
          },
        },
        {
          id: 4,
          icon:'environment',
          present: item.is_email_present,
          name: item.fullname,
          isEmailPresent: item.is_email_present == null ? 'none' : 'flex',
          label: 'Track',
          onPress: () => {
            navigation.navigate('Tracker', {
                item: item,
            });
            setActionSheet(false)
          },
        },
        {
            id: 5,
            icon:'form',
            present: item.is_email_present,
            name: item.fullname,
            isEmailPresent: 'flex',
            label: 'Edit',
            onPress: () => {
                navigation.navigate('AddEditContact', {
                    flag: 'edit',
                    item: item,
                    refreshContacts: refreshContacts,
                })
                setActionSheet(false)
            },
          },
          {
            id: 7,
            icon:'phone',
            present: item.is_email_present,
            name: item.fullname,
            isEmailPresent: item.is_email_present == null ? 'none' : 'flex',
            label: 'Group call voice',
            onPress: () => {
              setGroupcall(true);
              setSelectedItems([]);
              setActionSheet(false)
              addgroupcalitem(item);
              setVideovoice(false)
            },
          },
          {
            id: 8,
            icon:'video-camera',
            present: item.is_email_present,
            name: item.fullname,
            isEmailPresent: item.is_email_present == null ? 'none' : 'flex',
            label: 'Group call video',
            onPress: () => {
              setGroupcall(true);
              setSelectedItems([]);
              setActionSheet(false)
              addgroupcalitem(item);
              setVideovoice(true)
            },
          },
          {
            id: 6,
            icon:'delete',
            present: item.is_email_present,
            name: item.fullname,
            isEmailPresent: 'flex',
            label: 'Delete',
            onPress: () => {
                //removeContent(item.id)
                setItemToDelete(item);
                setActionSheet(false)
            },
          },
      ];

      const sendChat = async(text) => {
        const database = getDatabase();
        let _item = item;
        _item['id'] = item['is_email_present'];
        let _chat_id = getChatID(_item);
        //fetch fresh messages from server
        const currentChatroom = await fetchMessages();
        const lastMessages = currentChatroom.messages || [];
        update(ref(database, `chatroom/${_chat_id}`), {
          messages: [
            ...lastMessages,
            {
              text: text,
              sender: current_user.fullname,
              receiver:item.fullname,
              senderID: current_user.id,
              recieverID: item.id,
              createdAt: new Date(),
              status: 'sent',
            },
          ],
        });
      }
    
      const fetchMessages = async () => {
        const database = getDatabase();
        let _item = item;
        _item['id'] = item['is_email_present'];
        let _chat_id = getChatID(_item);
        const snapshot = await get(
          ref(database, `chatroom/${_chat_id}`),
        );
    
        return snapshot.val();
      };

      const getChatID = _item => {
        return current_user.id > _item.id
          ? current_user.id + '_' + _item.id
          : _item.id + '_' + current_user.id;
      };
      const openChatroom = async() => {
        
        let _item = item;
        _item['id'] = item['is_email_present'];
        let _chat_id = getChatID(_item);
        const database = getDatabase();
        console.log('openChatroom ', item['is_email_present'])
        current_user.id;
        const chatroomRef = ref(database, `chatroom/${_chat_id}`);
        
        onValue(chatroomRef, snapshot => {
          if (snapshot.exists()) {
            navigation.navigate('ChatScreen', {
              chat_id: _chat_id,
              selectedUser: _item,
              currentUser: current_user,
            });
          } else {
            const newChatroomRef = push(ref(database, 'chatroom/' + _chat_id), {
              firstUser: current_user.id,
              secondUser: _item.id,
              firstUserName: current_user.fullname,
              secondUserName: _item.fullname,
              messages: [],
            });
    
            navigation.navigate('ChatScreen', {
              chat_id: _chat_id,
              selectedUser: _item,
              current_user: current_user,
            });
          }
        });
      };

    const isSelected = selectedItems.some((selected) => selected.id === item.id);

    return (
      
    <View style={isSelected ? [style.gridItem, style.selectedItem, { backgroundColor: '#FFEEFD' }]: [style.item, style.gridItem, { backgroundColor: 'white' }]}>
    <TouchableOpacity
        onPress={() => {
          if(isgroupcall){
            if(item.is_email_present !== null){
            addgroupcalitem(item);
            }else{
              Toast.show(`${item.fullname} Does not have an account yet.`);
            }
          }
        }}>
    <View style={{alignItems:'center'}}>
        {badgecoun != 0 && (
          <View style={style.viewinimage}>
            <Text style={style.badge}>{badgecoun}</Text>
          </View>
        )}
        <Image
          source={item.is_email_present ? {uri:item.is_image} : require('../assets/new/ellipse723.png')}
          resizeMode={"cover"}
          style={style.sideMenuProfileIcon}
        />
        <Text className="mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225B2] text-[14px] tracking-[0] leading-[normal]" >
              {item.fullname}
        </Text>
        <Text className="mt-[4.00px] mb-[10.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#F40ADB] text-[10px] tracking-[0] leading-[normal]" >
              {item.phone_number}
        </Text>
    </View>
    <View style={{justifyContent:'flex-end',alignItems:'flex-end', alignContent:'flex-end'}}>
    <TouchableOpacity
      style={{ width:'25%'}}
        onPress={() => {
            //openChatroom(item);
            setActionSheet(true)
            setActionSheetItems(actionItemsAccept)
        }}>
        <IconOutline
          name="more"
          color={'#051225E5'}
          size={27}
          style={{textAlign:'right', paddingBottom:10,paddingRight:10 }}
        />
    </TouchableOpacity>
    </View>
    <Modal
        isVisible={actionSheet}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <ActionSheet actionItems={actionSheetItems} onCancel={closeActionSheet} />
      </Modal>
      </TouchableOpacity>
    </View>
    
    )
}

export default GridItem;

const style = StyleSheet.create({
    userIcon:{
        width:'45%',
        marginBottom:-12,
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
        flexDirection:'column',
        flex: 1,
        margin: 5,
        height: 'auto',
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#05122514',
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    sideMenuProfileIcon: {
      width: 60,
      height: 60,
      borderRadius: 100 / 2,
      alignSelf: 'center',
      marginTop: 20
    },
    viewinimage: {
      position: 'absolute',
      paddingLeft:50,
      marginTop:10,
      zIndex:999
    },
    badge: {
      backgroundColor: AppColors.newPink,
      textShadowColor: 'white',
      borderRadius: 30,
      borderColor: AppColors.newPink,
      borderWidth:1,
      textAlign: 'center',
      height: 20,
      width: 18,
      fontSize: 11,
      color: 'white',
      marginTop: 10
    },
    item: {
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    selectedItem: {
      padding: 10,
      backgroundColor: '#e0e0e0', // Example: different background for selected items
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
})