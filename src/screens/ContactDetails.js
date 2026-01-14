import React , {useState,useEffect,useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import GlobalStyles from '../utils/GlobalStyles';
import BackAppHeader from '../components/BackAppHeader';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import {_fetchContacts, _fetchContactsNextPage, _sendfcm, _deleteContact} from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import ActionsheetConfirm from '../components/ActionsheetConfirm';
import ActionSheet from '../components/Actionsheet';
import Modal from 'react-native-modal';
import {IconOutline} from '@ant-design/icons-react-native';
import Toast from 'react-native-simple-toast';
import {getDatabase, get, ref, onValue, off, update} from 'firebase/database';

export default function SearchContacts(props) {
    const {route} = props
    const {params} = route
    const item = params.item
    //const [phone_number,setPhoneNumber] = useState(params?.item?.phone_number || "")
    const [actionSheet, setActionSheet] = useState(false);
    const [actionSheetConfirm, setActionSheetConfirm] = useState(false);
    const navigation = useNavigation();
    const closeActionSheet = () => setActionSheet(false);
    const closeActionSheetconfirm = () => setActionSheetConfirm(false);
    const [contactToDelete, setDeletedRow] = useState({})
    
    const [actionSheetItems, setActionSheetItems] = useState([])
    const current_user = useSelector(
      state => state.requestStatus?.currentUser || {},
    );

    const calluser = async() => {
        let res = await _deleteContact(contactToDelete.id)
        setActionSheetConfirm(false)
        navigation.navigate('Contacts', {
            dbdaba: 'yes',
        });
        Toast.show("Contact Successfully Deleted");
    }

    const setItemToDelete = async (row) => {
        console.log('item ti delete =>', row);
        setActionSheetConfirm(true)
        setDeletedRow(row)
    }

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
                })
                setActionSheet(false)
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
     //console.log(params?.item)
    return (
      <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
          
        <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#0512250D'}]}>
            <BackAppHeader />
              
            <View style={[{flexDirection:'column', justifyContent: 'center', alignItems: 'center'}]}>
                <Image
                    source={item.is_email_present ? {uri:item.is_image} : require('../assets/new/ellipse723.png')}
                    resizeMode={"cover"}
                    style={styles.sideMenuProfileIcon}
                />
                <View style={styles.containertext}>
                    <Text className="text-[16px]" style={{fontFamily:Font.family_bold, width:'100%'}}>
                    {params?.item.fullname}
                    </Text>
                    <Text className='mt-[4px] mb-[26px] pl-[4px] pr-[4px] pb-1 pt-1 text-center text-[10px]' style={{color: AppColors.buttonColor, }}>
                    {params?.item.phone_number}
                    </Text>
                </View>
            </View>
        </View>
        <View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Full Name'}
            </Text>
            <Text className="text-[16px]" style={styles.textAccountValue}>
                {params?.item.fullname}
            </Text>
        </View>
        
        <View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Email Address'}
            </Text>
            <Text className="text-[16px]" style={styles.textAccountValue}>
                {params?.item.email}
            </Text>
        </View>
        <View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Phone Number'}
            </Text>
            <Text className="text-[16px]" style={styles.textAccountValue}>
                {params?.item.phone_number}
            </Text>
        </View>
        <View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Track  Call  Text'}
            </Text>
            <TouchableOpacity onPress ={()=>{
                    setActionSheet(true)
                    setActionSheetItems(actionItemsAccept)
                    }
                }>
                <IconOutline
                    name="more"
                    color={'#051225E5'}
                    size={27}
                    style={{textAlign:'right', marginTop:15,paddingRight:10 }}
                />
            </TouchableOpacity>
        </View>
        <Modal
            isVisible={actionSheetConfirm}
            style={{
            margin: 0,
            justifyContent: 'flex-end',
            }}>
            <ActionsheetConfirm 
                desc={'Do you wish to continue?'}
                title={`You are about to delete ${item.fullname}`}
                confirm={'Yes, Delete'}
                cancel={'No, Cancel'} 
                action={calluser}
                item={params?.item} 
                onCancel={closeActionSheetconfirm} 
            />
        </Modal>
        <Modal
            isVisible={actionSheet}
            style={{
            margin: 0,
            justifyContent: 'flex-end',
            }}>
            <ActionSheet actionItems={actionSheetItems} onCancel={closeActionSheet} />
        </Modal>
    </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    
    image: {
      height: 30,
      width: 30,
      borderRadius:3
    },
    sideMenuProfileIcon:{
        
      borderRadius: 100 / 2,
      alignSelf: 'center',
      
        width: '28%',
        height:100,
        marginBottom:10
    },
    textAccountImage:{
        width: '15%',
        height:40,
        marginBottom:10,
        marginTop:10,
        borderRadius: 100 / 2,
    },
    textAccount:{
        fontSize: 14,
        color: '#05122599',
        paddingTop:20,
        paddingBottom:20
    },
    textAccountValue:{
        fontSize: 14,
        color: '#051225CC',
        paddingTop:20,
        paddingBottom:20,
        fontWeight: '600'
    },
    viewlist:{
        flexDirection:'row',
        marginLeft:25,
        marginRight:25,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#0512250D'
    }
  });
