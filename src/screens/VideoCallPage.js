import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import {Alert} from 'react-native';

import {StyleSheet, View, Text, Button} from 'react-native';
import ZegoUIKitPrebuiltCall from '@zegocloud/zego-uikit-prebuilt-call-rn';
import ModalBox from '../components/ModalBox';
import KeepAwake from 'react-native-keep-awake';

export default index = forwardRef((props, ref) => {
  // const { route } = props;
  // const { params } = route;
  const {userID, userName, callID} = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  useEffect(()=>{
    KeepAwake.activate();
    return ()=>{
      KeepAwake.deactivate();
    }
  },[open,data])

  useImperativeHandle(ref, () => ({

    toggleVideoCall(data) {
        setData(data)
        setOpen(!open);
        // console.log('data==>',data)
    },
  }));

  return (
    <ModalBox coverScreen={true} isOpen={open}>
      <View style={styles.container}>
        <ZegoUIKitPrebuiltCall
          appID={590832720}
          appSign={
            '233db54f9ec37e98e9e9fe839232036b3e40ae62bf4aad1ea0dcfe62bdba0b80'
          }
          userID={data?.userID}
          userName={data?.userName}
          callID={data?.callID}
          config={{
            turnOnCameraWhenJoining: true,
            bottomMenuBarConfig: {
              buttons: [1, 2, 0, 4, 3],
            },
            onOnlySelfInRoom: () => {
              setOpen(false);
              KeepAwake.deactivate();

            },
            onHangUp: () => {
              setOpen(false);
              KeepAwake.deactivate();
            },
            onHangUpConfirmation: () => {
              return new Promise((resolve, reject) => {
                Alert.alert(
                  'Leave the call',
                  'Are your sure to leave the call',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        reject();
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'Confirm',
                      onPress: () => {
                        resolve();
                      },
                    },
                  ],
                );
              });
            },
          }}
        />
      </View>
    </ModalBox>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  avView: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
  },
  ctrlBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 50,
    width: '100%',
    height: 50,
    zIndex: 2,
  },
  ctrlBtn: {
    flex: 1,
    width: 48,
    height: 48,
    marginLeft: 37 / 2,
    position: 'absolute',
  },
});
