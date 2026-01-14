import React, {useEffect, useState, useRef, Component} from 'react';
import {StatusBar, View, Text, ActivityIndicator, StyleSheet, TextInput, Button, TouchableOpacity, Platform, NativeModules} from 'react-native';
import { CallEnd, MicOff, MicOn, CameraSwitch, Leave, CallStart, Cancel} from "../icons";
import Toast from 'react-native-simple-toast';
import Sound from 'react-native-sound';
import ModalBox from '../components/ModalBox';


//const VoiceVideo = ({route, navigation}) => {
class VoiceVideo extends Component {
    //params = this.props.route.params || {};
    //navigation = this.props.navigation
    //const {callIDed, userIDed, usernamed} = params;
    //CalendarModule = NativeModules.CalendarModule;
    message='';
    componentWillUnmount(){
        this.dialtone.release();
        console.log('component unmounted successfuly');
    }
    componentDidMount(){
        this.dialtone = new Sound('whoosh.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
        });
        this.dialtone.setVolume(0.50);
    }

    state = {
        isAudioEnabled: true,
        isVideoEnabled: this.props.isvideo,
        //isVideoEnabled: true,
        status: this.props.status,
        statuscall: this.props.status,
        participants: new Map(),
        videoTracks: new Map(),
        roomName: this.props.callIDed,
        token: this.props.token,
        open: this.props.open,
      };

    componentDidUpdate(prevProps, prevState){
        if(this.props.fcmMessage == 'RING_STOPED'){
            this.dialtone.stop();
            this.message='Call not answered';
        }
        if(this.props.fcmMessage == 'CALL_CONNECTED'){
            //this.setState({ status: "connected" });
            this.dialtone.stop();
            this.message='Connected';
            console.log('call connected from other user')
        }
        if(this.props.fcmMessage == 'CALL_ENDED'){
            this.message='Call stoped';
        }
        if(this.props.fcmMessage == 'CALL_FAILED'){
            this.dialtone.stop();
            this.message='Could not connect';
        }
        if(this.props.fcmMessage == 'CALL_DECLINED'){
            this.dialtone.stop();
            this.message='Declined call';
        }
        if(this.props.fcmMessage == 'ANOTHER_CALL'){
            this.dialtone.stop();
            this.message='Is on another call';
        }
    }
    

    render() {
        //console.log("kiddo state "+ this.state.open);
        return(
            <ModalBox coverScreen={true} isOpen={this.props.open}>
            <View style={styles.container}>
              
        </View>
        </ModalBox>
        );
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white"
  },
  button: {
    marginTop: 100
  },
  localVideo: {
    flex: 1,
    width: 125,
    height: 200,
    position: "absolute",
    right: 10,
    bottom: 400,
    borderRadius: 2,
    borderColor: '#4e4e4e'
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  remoteVideo: {
    width: '100%',
    height: '100%'
  },
  optionsContainer: {
    position: "absolute",
    left: 0,
    bottom: 50,
    right: 0,
    height: 100,
    // backgroundColor: "blue",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center'
  },
  optionButton: {
    width: 60,
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 100 / 2,
    backgroundColor: "transparent",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 1,
    alignItems: "center"
  },
  optionButton2: {
    width: 60,
    height: 60,
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 100 / 2,
    backgroundColor: "transparent",
    justifyContent: "center",
    borderColor: "white",
    borderWidth: 1,
    alignItems: "center"
  }
});

export default VoiceVideo;