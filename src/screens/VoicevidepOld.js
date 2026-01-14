import React, {useEffect, useState, useRef, Component} from 'react';
import {StatusBar, View, Text, ActivityIndicator, StyleSheet, TextInput, Button, TouchableOpacity, Platform, NativeModules} from 'react-native';
import {TwilioVideoLocalView, TwilioVideoParticipantView, TwilioVideo } from "react-native-twilio-video-webrtc";
import { CallEnd, MicOff, MicOn, CameraSwitch, Leave} from "../icons";
import Toast from 'react-native-simple-toast';
import Sound from 'react-native-sound';


//const VoiceVideo = ({route, navigation}) => {
class VoiceVideo extends Component {
    params = this.props.route.params || {};
    //navigation = this.props.navigation
    //const {callIDed, userIDed, usernamed} = params;
    //CalendarModule = NativeModules.CalendarModule;

    Sound.setCategory('Playback');

    state = {
      isAudioEnabled: true,
      isVideoEnabled: this.props.route.params.isvideo,
      //isVideoEnabled: true,
      status: this.props.route.params.status,
      participants: new Map(),
      videoTracks: new Map(),
      roomName: this.props.route.params.callIDed,
      token: this.props.route.params.token,
    };

    //if(prevRoute.name === "Voicevideo"){
    //    navigation.navigate('Contacts');
    //}

    //console.log(prevRoute);

    //console.log(params);
    //console.log(userIDed);
    //console.log(usernamed);

    _onConnectButtonPress = () => {
      try {
        this.twilioRef.connect({
          roomName: this.state.roomName,
          accessToken: this.state.token,
          enableVideo: this.state.isVideoEnabled
        });
      } catch (error) {
        console.log(error);
      }
  
      this.setState({ status: "connecting" });
    };
  
    _onEndButtonPress = () => {
      this.twilioRef.disconnect();
      this.props.navigation.goBack();
      //navigation.goBack();
      CalendarModule.createCalendarEvent('close');
    };
  
    _onMuteButtonPress = () => {
      this.twilioRef
        .setLocalAudioEnabled(!this.state.isAudioEnabled)
        .then(isEnabled => this.setState({ isAudioEnabled: isEnabled }));
    };
  
    _onFlipButtonPress = () => {
      this.twilioRef.flipCamera();
    };
  
    _onRoomDidConnect = () => {
      this.setState({ status: "connected" });
    };
  
    _onRoomDidDisconnect = ({ roomName, error }) => {
      console.log("ERROR: ", error);
  
      this.setState({ status: "disconnected" });
    };
  
    _onRoomDidFailToConnect = error => {
      console.log("ERROR: ", error);
  
      this.setState({ status: "disconnected" });
    };
  
    _onParticipantAddedVideoTrack = ({ participant, track }) => {
      console.log("onParticipantAddedVideoTrack: ", participant, track);
  
      this.setState({
        videoTracks: new Map([
          ...this.state.videoTracks,
          [
            track.trackSid,
            { participantSid: participant.sid, videoTrackSid: track.trackSid }
          ]
        ])
      });
      this.setState({ status: "connected" });
    };
  
    _onParticipantRemovedVideoTrack = ({ participant, track }) => {
      console.log("onParticipantRemovedVideoTrack: ", participant, track);
  
      const videoTracks = this.state.videoTracks;
      videoTracks.delete(track.trackSid);
  
      this.setState({ videoTracks: new Map([...videoTracks]) });
      this._onEndButtonPres;
      Toast.show('The call was stoped');
      CalendarModule.createCalendarEvent('close');
    };
  
    setTwilioRef = ref => {
      this.twilioRef = ref;
    };

    render() {
        console.log(this.props.route.params.isvideo);
        console.log(this.props.route.params.usernamed);
        console.log(this.props.route.params.token);
        return(
            <View style={styles.container}>
              {this.state.status === "disconnected" && (
                <View style={{ flex: 1, justifyContent: "space-around" }}>
              <View
                style={{
                  padding: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 14,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#D0D4DD",
                  }}
                >
                  Calling ...
                </Text>

                <Text
                  style={{
                    fontSize: 26,
                    marginTop: 12,
                    color: "#ffff",
                    letterSpacing: 2,
                  }}
                >
                  {this.props.route.params.usernamed}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={this._onConnectButtonPress}
                  style={{
                    backgroundColor: "#FF5D5D",
                    borderRadius: 30,
                    height: 60,
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CallEnd width={50} height={12} />
                </TouchableOpacity>
              </View>
            </View>
          )}
  
          {this.state.status === "connected" ? (
            <View style={styles.callContainer}>
              {this.state.isVideoEnabled ? (
                <View style={styles.remoteGrid}>
                  {Array.from(
                    this.state.videoTracks,
                    ([trackSid, trackIdentifier]) => {
                      return (
                        <TwilioVideoParticipantView
                          applyZOrder={false}
                          style={styles.remoteVideo}
                          key={trackSid}
                          trackIdentifier={trackIdentifier}
                        />
                      );
                    }
                  )}
                </View>
              ): null}
              {this.state.isVideoEnabled ? (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    marginLeft: 20,
                    marginRight: 20,
                    borderRadius: 100 / 2,
                    backgroundColor: "#EB5A5A",
                    justifyContent: "center",
                    borderColor: "white",
                    borderWidth: 1,
                    alignItems: "center"
                  }}
                  onPress={this._onEndButtonPress}
                >
                  <CallEnd width={50} height={12} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={this._onMuteButtonPress}>
                  {this.state.isAudioEnabled ? (<MicOff height={24} width={24} fill="#FFF" />) : (<MicOn height={24} width={24} fill="#FFF" />)}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={this._onFlipButtonPress}
                >
                  <CameraSwitch height={24} width={24} fill="#FFF" />
                </TouchableOpacity>

                <TwilioVideoLocalView enabled={true} applyZOrder={true} style={styles.localVideo} />
                <View />
              </View>
              ): <View style={{ flex: 1, justifyContent: "space-around" }}>
                <View
                    style={{
                    padding: 35,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 14,
                    }}>
                    <Text
                    style={{
                        fontSize: 26,
                        color: "#ffff",
                        letterSpacing: 2,
                    }}>
                    {this.props.route.params.usernamed}
                    </Text>
                    <Text
                    style={{
                        fontSize: 16,
                        color: "#D0D4DD",
                        marginTop: 12,
                    }}>
                    Connected 
                    </Text>
                </View>
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={{
                            width: 60,
                            height: 60,
                            marginLeft: 40,
                            marginRight: 40,
                            borderRadius: 100 / 2,
                            backgroundColor: "#EB5A5A",
                            justifyContent: "center",
                            borderWidth: 1,
                            alignItems: "center"
                        }}
                        onPress={this._onEndButtonPress}>
                        <CallEnd width={50} height={12} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.optionButton2}
                        onPress={this._onMuteButtonPress}>
                        {this.state.isAudioEnabled ? (<MicOff height={24} width={24} fill="#FFF" />) : (<MicOn height={24} width={24} fill="#FFF" />)}
                    </TouchableOpacity>
                </View>
                </View> }
            </View>
          ) : null}
  
          <TwilioVideo
            ref={this.setTwilioRef}
            onRoomDidConnect={this._onRoomDidConnect}
            onRoomDidDisconnect={this._onRoomDidDisconnect}
            onRoomDidFailToConnect={this._onRoomDidFailToConnect}
            onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
            onParticipantRemovedVideoTrack={this._onParticipantRemovedVideoTrack}
          />
        </View>
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