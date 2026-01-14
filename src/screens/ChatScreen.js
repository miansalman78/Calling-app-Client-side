//import libraries
import { useNavigation } from '@react-navigation/native';
import React, { Component, useState,useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView,Pressable, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
//reusable components
import AddressPickup from '../components/AddressPickup';
import CustomBtn from '../components/CustomBtn';
import { showError } from '../helper/helperFunction';
import {GiftedChat, Bubble, Send, Time, InputToolbar, MessageImage} from 'react-native-gifted-chat';
import {getDatabase, get, ref, onValue, off, update} from 'firebase/database';
import AppHeader from '../components/AppHeader';
import { send_push_notification } from '../utils/videoCallFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import BackAppHeader from '../components/BackAppHeader';
import { _me, _sendFCMMessage } from '../utils/api'
import {getDBConnection, createTable, getLocalData, updateHobies, addHobies, checkInsert} from "../utils/helper";
import {launchImageLibrary} from 'react-native-image-picker';
import InChatFileTransfer from '../components/InChatFileTransfer';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
//import * as DocumentPicker from 'react-native-document-picker';

const ChatScreen = (props) => {
    const {route} = props
    const {params} = route;
    const navigation = useNavigation();

    const [imagepathstate, setimagepathstate] = useState(false);
    const [filepathstate, setfilepathstate] = useState(false);
    const [imagepath, setimagepath] = useState('');
    const [filepath, setfilepath] = useState('');
    const [totaltransfered, setTotaltransfered] = useState(0);
    const [uploadtast, setuploadtast] = useState(null);

    //console.log('params =>', params);
    let selectedUserM ; 
    let currentUserM ; 
    if(params.type){
      console.log('type psm');
      let selectedUser = {
        id: parseInt(params.selectedUserID),
        email: params.selectedUserEmail,
        fullname: params.selectedUserFullname,
        device_token: params.selectedUserDevice
      }
      let currentUser = {
        id: parseInt(params.current_userID),
        fullname: params.current_userFullname
      }
      selectedUserM = selectedUser;
      currentUserM = currentUser;
    }
    const [isFoundMessages, setFoundMessages] = useState(false)
    //const [selectedUser, setSelectedUser] = useState(params.selectedUser)
    const [currentUser, setCurrentUser] = useState(params.type ? currentUserM : params.currentUser)
    //const [selectedUser, setSelectedUser] = useState(params.type ? selectedUserM : params.selectedUser)
    const selectedUser = params.type ? selectedUserM : params.selectedUser;
    //const myData = params.currentUser ?? {};
    const [messages, setMessages] = useState([]);
    

    const notificationData = {
      type:'message',
      chat_id: params.chat_id.toString(),
      selectedUserEmail: selectedUser.email,
      selectedUserID: selectedUser.id.toString(),
      selectedUserFullname: selectedUser.fullname,
      selectedUserDevice: selectedUser.device_token,
      current_userID: currentUser.id.toString(),
      current_userFullname: currentUser.fullname,
    };
    //console.log('notificationData =>',notificationData);

    const resetSeen = async() => {
      const database = getDatabase();
      const currentChatroom = await fetchMessages();

      const lastMessages = currentChatroom.messages || [];
      lastMessages.map((msg, index) => {
        if(msg.senderID != currentUser.id){
          msg.status = 'seen';
        }
      })
      update(ref(database, `chatroom/${params.chat_id}`), {
        messages: [ 
          ...lastMessages
        ],
      });
    }
    
    useEffect(() => {
      //load old messages
      //console.log(notificationData)
      const loadData = async () => {
        const myChatroom = await fetchMessages();
        //AsyncStorage.setItem(selectedUser.email,JSON.stringify(0));
        //console.log('myChatroom => ',myChatroom.messages);
        setMessages(renderMessages(myChatroom.messages));
        myChatroom.messages.length > 0 ? setFoundMessages(true) : setFoundMessages(false)
      };

      async function updateDB() { 
        const db = await getDBConnection();
        const updateTodos = { user: selectedUser.id.toString(), count: 0 };
        updateHobies(db, updateTodos);
      }
      //updateDB();

      const getme = async() => {
        let res = await _me();
        console.log('res => ',res)
        //setCurrentUser(res)
      }

      //getme()
      loadData();

      // set chatroom change listener
      const database = getDatabase();
      const chatroomRef = ref(database, `chatroom/${params.chat_id}`);
      onValue(chatroomRef, snapshot => {
        const data = snapshot.val();
        setMessages(renderMessages(data.messages));
        resetSeen();
      });

      resetSeen();

      return () => {
        //remove chatroom listener
        off(chatroomRef);
      };
    }, [fetchMessages, renderMessages, params.chat_id]);

    const renderMessages = useCallback(
      msgs => {
        //structure for chat library:
        // msg = {
        //   _id: '',
        //   user: {
        //     avatar:'',
        //     name: '',
        //     _id: ''
        //   }
        // }

        return msgs
          ? msgs.reverse().map((msg, index) => ({
              ...msg,
              _id: index,
              user: {
                _id:
                  msg.senderID === currentUser.id
                    ? currentUser.id
                    : selectedUser.id,
                avatar:
                  null,
                name:
                  msg.senderID === currentUser.id
                    ? currentUser.id
                    : selectedUser.id,
              },
            }))
          : [];
      },
      [
        currentUser.id,
        selectedUser.id,
      ],
    );

    //const newImageMessage = (mediaURL, fileURL) => {
    const onSendmedia = useCallback(async(mediaURL, fileURL = []) => {
      const newMessage = {
        _id: Math.random().toString(),
        createdAt: new Date(),
        user: { 
          _id: currentUser.id, 
          name:currentUser.id 
        }, // Current user ID
        image: mediaURL,
        //image: mediaURL != '' ? mediaURL : '', // For images
        //file: fileURL != '' ? fileURL : '', // For files
        // Or file: { url: mediaURL, type: selectedFile.type } for other files
      };
      const database = getDatabase();
      const currentChatroom = await fetchMessages();
      const lastMessages = currentChatroom.messages || [];
      update(ref(database, `chatroom/${params.chat_id}`), {
        messages: [
          ...lastMessages,
          {
            image: mediaURL,
            sender: currentUser.fullname,
            receiver:selectedUser.fullname,
            senderID: currentUser.id,
            recieverID: selectedUser.id,
            createdAt: new Date(),
            status: 'sent',
          },
        ],
      });

      //setMessages(prevMessages => GiftedChat.append(prevMessages, newMessage));
      setimagepath('');
      setimagepathstate(false);
      setTotaltransfered(0);

    },[fetchMessages, currentUser.fullname, params.chat_id],);


    const fetchMessages = useCallback(async () => {
      const database = getDatabase();

      const snapshot = await get(
        ref(database, `chatroom/${params.chat_id}`),
      );

      return snapshot.val();
    }, [params.chat_id]);

    const onSend = useCallback(
      async (msg = []) => {
        //send the msg[0] to the other user
        const database = getDatabase();
``
        //fetch fresh messages from server
        const currentChatroom = await fetchMessages();

        const lastMessages = currentChatroom.messages || [];

        /*update(ref(database, `chatroom/${params.chat_id}`), {
          messages: [
            ...lastMessages,
            {
              text: msg[0].text,
              sender: currentUser.fullname,
              receiver:selectedUser.fullname,
              senderID: currentUser.id,
              recieverID: selectedUser.id,
              createdAt: new Date(),
              status: 'sent',
            },
          ],
        });*/
        //console.log(params)
        setMessages(prevMessages => GiftedChat.append(prevMessages, msg));
        
        let body = {
          title: 'New Message Recieved',
          body: `Recieved from ${currentUser.fullname} !`,
          fcm: params?.selectedUser?.device_token,
          data: notificationData
        }
        //let response = await _sendFCMMessage({ body });
        //console.log(response)
      },
      [fetchMessages, currentUser.fullname, params.chat_id],
    );

    // Modify onSend()
    /*const onSend1 = useCallback((messages = []) => {
      const [messageToSend] = messages;
      if (imagepathstate) {
        const newMessage = {
          _id: messages[0]._id + 1,
          text: messageToSend.text,
          createdAt: new Date(),
          user: {
            _id: 2,
            avatar: '',
          },
          image: imagepath,
          file: {
            url: ''
          }
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessage),
        );
        setimagepath('');
        setimagepathstate(false);
      } else if (filepathstate) {
        const newMessage = {
          _id: messages[0]._id + 1,
          text: messageToSend.text,
          createdAt: new Date(),
          user: {
            _id: 2,
            avatar: '',
          },
          image: '',
          file: {
            url: filepath
          }
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessage),
        );
        setfilepath('');
        setfilepathstate(false);
      } else {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        );
      }
    },
    [filepath, imagepath, imagepathstate, filepathstate],);*/
  

    const _pickDocument = async() => {
      console.log("back presseed");
      const res = await launchImageLibrary();
      console.log(res.assets[0].uri);
      let fileUri = res.assets[0].uri
      if(fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
        setimagepath(fileUri);
        setimagepathstate(true)
        //onSendmedia(fileUri,'');
        _uploadfile(fileUri,'image');
        
        //saveFile(stringer,fileUri)
      }else{
        //setfilepath(fileUri);
        //setfilepathstate(true);
        //onSendmedia('',fileUri);
        //_uploadfile(fileUri,'file');
      }
    }

    /*const _pickDocument = async () => {
      try {
        const result = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
          copyTo: 'documentDirectory',
          mode: 'import',
          allowMultiSelection: true,
        });
        const fileUri = result[0].fileCopyUri;
        if (!fileUri) {
          console.log('File URI is undefined or null');
          return;
        }
        if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
          onSend(fileUri,'');
        } else {
          onSend('',fileUri);
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User cancelled file picker');
        } else {
          console.log('DocumentPicker err => ', err);
          throw err;
        }
      }
    };*/

    const _uploadfile = async(pathToFile, type) => {
      //let stringer = Date.now().toString() + params.chat_id + pathToFile.fileName ;
      let splitted = pathToFile.split(".");
      let stringer = Date.now().toString() + params.chat_id + uuid.v4() +'.'+splitted[splitted.length-1] ;

      /*let stringer = 'tomatch.png'
      const reference = storage().refFromURL(`gs://kalugogoa.appspot.com/${stringer}`);
      const secondsttorage = await reference.getDownloadURL();
      console.log('getDownloadURL =>', secondsttorage);*/

      //const reference = storage().ref(`${stringer}`);
      //const storagebucket = storage(`gs://kalugogoa.appspot.com`);
      //const reference = storagebucket.ref(`${stringer}`);
      const reference = storage().refFromURL(`gs://kalugogoa.appspot.com/${stringer}`);
      const task = reference.putFile(pathToFile);
      setuploadtast(task);
      console.log('uploadtask =>', task);

      task.on('state_changed', taskSnapshot => {
        //console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        let transfered = taskSnapshot.bytesTransferred/taskSnapshot.totalBytes * 100
        console.log(` uploading ${transfered}`);
        setTotaltransfered(transfered);
        if(transfered == 100){
          //setimagepath('');
          //setfilepath('');
          //setimagepathstate(false);
          //setfilepathstate(false);
          ////type == 'image' ? onSendmedia(reference.getDownloadURL(), '') : onSendmedia('', reference.getDownloadURL());
          //setuploadtast(null);
        }
      },
      error => {
        console.log('upload error =>', error);
      },
      async () => {
        try{
          //const downloadURL = await reference.getDownloadURL();
          //console.log('uploadtask =>', downloadURL);
          
        }catch(error){
          console.log('error getting download url =>', error);
        }
      }
    );

      task.then(async() => {
        const downloadURL = await reference.getDownloadURL()
        console.log('Image uploaded to the bucket!',  downloadURL);
        type == 'image' ? onSendmedia(downloadURL, '') : onSendmedia('', downloadURL);
        setimagepath('');
        setfilepath('');
        setimagepathstate(false);
        setfilepathstate(false);
        setuploadtast(null);
      });
    }

    const saveFile = async (fileName, content) => {
      //const path = `${RNFS.DocumentDirectoryPath}/${fileName}`; // Or RNFS.CachesDirectoryPath
      const dirs = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.ExternalDirectoryPath;
      const path = Platform.select({
        ios: `${dirs}/${fileName}`,
        android: `${dirs}/${fileName}`,
      });

      try {
        await RNFS.moveFile(content, path);
        console.log('File moved successfully!');
        console.log('File moved successfully!', path);
        setimagepath(path);
        setimagepathstate(true)
      } catch (error) {
        console.error('Error moving file:', error);
      }
    };

    const deletefile = async() => {
      let splitted = imagepath.split(".");
      let stringer = Date.now().toString() + params.chat_id + uuid.v4() +'.'+splitted[splitted.length-1] ;
      const desertRef = storage().ref(stringer);

      setimagepath('');
      setfilepath('');
        
      if(uploadtast != null){
        uploadtast.cancel();
        desertRef.delete().then(function() { 
          // File deleted successfully 
          console.log('File deleted successfully')
        }).catch(function(error) { 
          // Uh-oh, an error occurred!
          console.log('Uh-oh, an error occurred!',error)
        });
      }
    }

    const backbuttonclick = async () => {
      if(params.type){
        Linking.openURL('kalugogoaapp://contacts').catch((err)=>{
          console.log('Linking error', err);
        });
      }else{
        Linking.openURL('kalugogoaapp://contacts').catch((err)=>{
          console.log('Linking error', err);
        });
        
        //navigation.goBack
        /*Linking.openURL('kalugogoaapp://contacts').catch((err)=>{
          console.log('Linking error', err);
        });*/
      }
    }

    // add a function to view your file picked before click send it
    const renderChatFooter = useCallback(() => {
      if (imagepath) {
        return (
          <View style={{width:'100%',justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end', zIndex:20, backgroundColor:'transparent'}}>
          <View style={styles.chatFooterContainer}>
            <ImageBackground
              source={{uri: imagepath}}
              resizeMode="cover"
              style={styles.chatFooter}>
            <TouchableOpacity
              onPress={() => deletefile()}
              style={styles.buttonFooterChatImg}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <View style={styles.uploadbox}>
                <Text style={styles.uploadboxtext} >{`${totaltransfered}%`}</Text>
                <IconOutline
                      name="arrow-up"
                      color={'black'}
                      size={12}
                      style={[{marginLeft:2,marginTop:2}]}
                />
              </View>
              <IconOutline
                    name="close"
                    color={'white'}
                    size={20}
                    style={[{marginLeft:5,marginTop:5}]}
              />
              </View>
            </TouchableOpacity>
            </ImageBackground>
            {/*<Text style={styles.textFooterChat}>16:34 AM</Text>*/}
          </View>
          </View>
        );
      }
      if (filepath) {
        return (
          <View style={styles.chatFooter}>
            <InChatFileTransfer
              filePath={filepath}
            />
            <TouchableOpacity
              onPress={() => deletefile()}
              style={styles.buttonFooterChat}
            >
              <Text style={styles.textFooterChat}>X</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return null;
    }, [filepath, imagepath]);

    const renderMessageImage = (props) => {
      const {currentMessage} = props;
      //console.log('InChatViewFile =>', currentMessage)
      return (
        <MessageImage
          {...props}
          lightboxProps={{
            // Custom props for react-native-lightbox
            renderContent: () => (
              <Image
                source={{ uri: props.currentMessage.image }}
                style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            ),
            swipeToDismiss: true, // Example: Enable swipe to dismiss
            springConfig: { tension: 50, friction: 10 }, // Example: Custom spring animation
          }}
        />
      );
    };

    const renderBubble = (props) => {
      const {currentMessage} = props;
      //console.log('InChatViewFile =>', currentMessage)
      if (currentMessage.file && currentMessage.file.url) {
      //if (currentMessage.image) {
        return (
          <TouchableOpacity
          style={{
            ...styles.fileContainer,
            backgroundColor: props.currentMessage.user._id === 2 ? '#2e64e5' : '#efefef',
            borderBottomLeftRadius: props.currentMessage.user._id === 2 ? 15 : 5,
            borderBottomRightRadius: props.currentMessage.user._id === 2 ? 5 : 15,
          }}
            onPress={() =>
              navigation.navigate('InChatViewFile', {filePath: currentMessage.file.url})
              //console.log('InChatViewFile =>', currentMessage)
            }
          >
            <InChatFileTransfer
              style={{marginTop: -10}}
              filePath={currentMessage.file.url}
            />
            <View style={{flexDirection: 'column'}}>
              <Text style={{
                    ...styles.fileText,
                    color: currentMessage.user._id === 2 ? 'white' : 'black',
                  }} >
                {currentMessage.text}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: 'white',
              fontSize:13,
              fontWeight:'500'
            },
            left: {
              color: 'white',
              fontSize:13,
              fontWeight:'500'
            },
          }}
          wrapperStyle={{
            left: {
              backgroundColor: AppColors.buttonColor,
              marginBottom:10,
              marginLeft:10
            },
            right: {
              backgroundColor: '#051225',
              marginBottom:10,
              marginRight:10
            },
          }}
        />
      );
    }

    const renderTime = (props) => {
      return (
        <Time
        {...props}
          timeTextStyle={{
            left: {
              color: 'white',
            },
            right: {
              color: 'white',
            },
          }}
        />
      );
    };

    const customtInputToolbar = props => {
      return (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: "white",
            borderTopColor: "#E8E8E8",
            borderTopWidth: 1,
            marginTop:10,
            marginBottom:5
          }}
        />
      );
    };

    const renderSend = (props) => {
      return (
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={_pickDocument}>
            <IconOutline
              name="paper-clip"
              style={{
                marginLeft: 5,
                transform: [{rotateY: '180deg'}],
              }}
              size={30}
              color={AppColors.buttonColor}
              tvParallaxProperties={undefined}
            />
          </TouchableOpacity>
        <Send
          {...props}
          containerStyle={styles.sendContainer}
        >
          <IconOutline name="send" color={'white'} size={25} style={[{marginRight:7,marginHorizontal:9}]}/>
        </Send>
        </View>
      );
    }

    const noChatMessagestView = () => {
      return (
        <>
          <View style={[{
            paddingTop:20,
            backgroundColor: 'white',
            borderBottomWidth: 2,
            borderBottomColor: '#0512250D'}]}>
              <View
                  style={{
                    marginTop:20,
                    marginBottom:20,
                    marginLeft:20,
                    backgroundColor: 'white'
                  }}>
                <TouchableOpacity
                onPress={() => backbuttonclick()}>
                  <View style={{ marginTop: 7}} className="w-7 h-7 bg-[#0512250d] rounded-[32px]">
                    <View className="pl-1 pt-1">
                        <IconOutline name="left" size={18} />
                    </View>
                  </View>
                  </TouchableOpacity>
                </View>
            <Text className="mt-[0.00px] pl-[20px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'Chats'}
            </Text>

            <Text className="mt-[8.00px] mb-[24.00px] pl-[20px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[normal]" >
              {'Make changes to this contact and submit'}
            </Text>
          </View>

          <View style={[{flex:1,backgroundColor:'#F6F6F6',paddingLeft:20,paddingRight:20}]}>
            <View style={[{flex:1,flexDirection:'column', alignItems:'center', justifyContent: 'center'}]}>
              <Image
                source={require('../assets/new/cuate.png')}
                resizeMode="contain"
                style={{width: '60%',height:110}}
              />
              <Text className="mt-[8.00px] text-center [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px]" >
                {'No chats yet'}
              </Text>
            </View>
          <View style={[{bottom:10, position:'relative',  width: '100%', alignItems:'center', justifyContent: 'center'}]}>
            <TouchableOpacity style={styles.addContact} 
            onPress={() => setFoundMessages(true)}>
              <View style={[{flexDirection:'row',}]}>
                <Text style={[{color:'white', fontWeight:'bold', fontSize:16}]}>
                  {'Start Chat'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        </>
      )
    };

    return (
      <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
        {isFoundMessages ? (
          <>
            <View style={[{
              paddingTop:0,
              backgroundColor: 'white',
              borderBottomWidth: 2,
              borderBottomColor: '#0512250D'}]}>
                <View
                  style={{
                    marginTop:20,
                    marginBottom:20,
                    marginLeft:20,
                    backgroundColor: 'white'
                  }}>
                <TouchableOpacity
                onPress={() => backbuttonclick()}>
                  <View style={{ marginTop: 7}} className="w-7 h-7 bg-[#0512250d] rounded-[32px]">
                    <View className="pl-1 pt-1">
                        <IconOutline name="left" size={18} />
                    </View>
                  </View>
                  </TouchableOpacity>
                </View>
              <Text className="mt-[0.00px] mt-[0.00px] pl-[20px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
                {'Chats'}
              </Text>

              <Text className="mt-[8.00px] mb-[24.00px] pl-[20px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[normal]" >
                {'Chat, Video, Edit, Delete & Track with Contacts'}
              </Text>
            </View>
            <GiftedChat
              messages={messages}
              onSend={newMessage => onSend(newMessage)}
              user={{
                _id: currentUser.id,
              }}
              textInputStyle={styles.inputext}
              renderBubble={renderBubble}
              renderTime={renderTime}
              renderInputToolbar={props => customtInputToolbar(props)}
              renderSend={renderSend}
              alwaysShowSend={true}
              renderChatFooter={renderChatFooter}
              renderMessageImage={renderMessageImage}
              /*renderMessageImage={(props) => (
                <Image source={{ uri: props.currentMessage.image }} style={{ width: 200, height: 150 }} />
              )}*/
            />
          </>
         ):
         noChatMessagestView()
        }
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,

  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 15,
    backgroundColor: AppColors.buttonColor,
    borderRadius:45,
    height:40,
    marginLeft:10
  },
  inputext:{
    backgroundColor: '#0512250D',
    borderColor: "#0512251A",
    borderWidth: 1,
    borderRadius: 32,
    paddingLeft:20,
    paddingRight:20,
    paddingTop:10,
    marginTop:5,
    paddingBottom:10,
  },
  addContact:{
    backgroundColor: AppColors.buttonColor,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius:32,
  },
  addContactFloat:{
    backgroundColor: AppColors.buttonColor,
    height: 55,
    alignItems: 'center',
    width: 55,
    borderRadius:50,
    justifyContent: 'center',
    position:'absolute',
    right:20,
    bottom:20,
    zIndex:3,
    elevation:3
  },
  image: {
    height: 30,
    width: 30,
    borderRadius:3
  },
  heading:{
    fontSize:Font.headingSize,
    color: AppColors.newPink,
    marginBottom:5,
    fontFamily:Font.family_bold,
    paddingLeft:25,
  },
  subHeading:{
    fontSize:Font.subheadingSize,
    color: AppColors.textBlack,
    paddingLeft:25,
  },
  flatlisstyle:{
    width:'auto',
    height:'auto',
    marginBottom:178,
    
    // height:'auto',
    marginTop:20,
    marginLeft:25,
    marginRight:25,
    
    overflow:"scroll",
    borderTopColor:AppColors.newPink,
    borderTopWidth:0.50,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
  },
  container_start:{
    flex: 1,
    //alignItems: 'center',
    
    justifyContent: 'flex-start',
    width:"100%"
  },
  chatFooterContainer:{
    width:'40%',
    marginBottom:10,
    marginTop:10,
    justifyContent:'flex-end',
    alignContent:'flex-end',
    alignItems:'flex-end',
    marginRight:20,
    borderColor:'black',
    borderWidth:5,
    borderRadius:15,
    backgroundColor:'black',
    zIndex:60
  },
  chatFooter:{
    borderRadius:10,
    height: 120, 
    width: '100%',
    overflow:'hidden'
  },
  textFooterChat:{
    fontSize:12,
    color:'white',
    marginTop:10,
    marginRight:10,
    marginBottom:3
  },
  uploadbox:{
    flexDirection:'row',
    backgroundColor:'white',
    borderRadius:20,
    width:'40%',
    paddingTop:2,
    paddingLeft:4,
    marginLeft:5,
    marginTop:5
  },
  uploadboxtext:{
    fontSize:11,
    color:'black',
  }
});
export default ChatScreen;
