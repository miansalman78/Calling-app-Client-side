import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Platform
} from "react-native";


import { CallEnd, MicOff, MicOn, CameraSwitch, Leave} from "../icons";
import Toast from 'react-native-simple-toast';
import Sound from 'react-native-sound';
import ModalBox from '../components/ModalBox';
import {call_update_notification} from '../utils/videoCallFunction';

  class Voicevideonoclass extends Component {


    state = {
      isAudioEnabled: true,
      isVideoEnabled: this.props.isvideo,
      status: this.props.status,
      participants: new Map(),
      videoTracks: new Map(),
      roomName: this.props.callIDed,
      token:this.props.token,
      open: this.props.open,
    };

    
  
    render() {
      return (
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
    bottom: 0,
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

export default Voicevideonoclass;