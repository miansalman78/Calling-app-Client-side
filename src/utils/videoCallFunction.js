const sendNotification = (
  isVoiceCall = false,
  item = {},
  current_user = {},
) => {
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAGV9o6Mo:APA91bHDXrgGqGBM0S_y9elMSAOy5LIj58JB7mlvzzaDbsXnJN8ozE9bpTa8RWcvhniQaArQbdfueIrLFClbknhre_KKNUkP3WgAY2-_JsyH-o7tcjPNvKDO241ifAEJery3SEug5xp_',
    },
    body: JSON.stringify({
      to: item.device_token,
      notification: {
        body: `Tap to join the ${isVoiceCall ? 'voice' : 'video'} call`,
        title:
          current_user?.fullname +
          ` is inviting you to a ${isVoiceCall ? 'voice' : 'video'} call`,
        room_id: item.room_id,
        user_name: item?.fullname,
        voice: isVoiceCall ? 'true' : 'false',
      },
      data: {
        body: `Tap to join the ${isVoiceCall ? 'voice' : 'video'} call`,
        title:
          current_user?.fullname +
          ` is inviting you to a ${isVoiceCall ? 'voice' : 'video'} call`,
        room_id: item.room_id,
        user_name: item?.fullname,
        voice: isVoiceCall ? 'true' : 'false',
        callers_fcm: current_user?.device_token,
        callers_name: current_user?.fullname,
      },
      android: {
        priority: 'high',
      },
    }),
  });
};

export const onJoinPress = (
  isVoiceCall = false,
  item = {},
  current_user = {},
  ref,
) => {
  sendNotification(isVoiceCall, item, current_user);
  /*if (isVoiceCall) {
    ref?.current?.toggleVoiceCall({
      userID: String(Math.floor(Math.random() * 100000)),
      userName: current_user?.fullname?.split(' ')[0],
      callID: item.room_id,
    });
  } else {
    ref?.current?.toggleVideoCall({
      userID: String(Math.floor(Math.random() * 100000)),
      userName: current_user?.fullname?.split(' ')[0],
      callID: item.room_id,
    });
  }*/
};

export const onJoinPressSeeme = (
  isVoiceCall = false,
  room_id,
  ref,
) => {
  if (isVoiceCall) {
    ref?.current?.toggleVoiceCall({
      userID: String(Math.floor(Math.random() * 100000)),
      userName: 'Shared Link User',
      callID: room_id,
    });
  } else {
    ref?.current?.toggleVideoCall({
      userID: String(Math.floor(Math.random() * 100000)),
      userName: 'Shared Link User',
      callID: room_id,
    });
  }
};

export const send_push_notification = (
  device_id,
  title,
  body = '',
  data='',
  email='',
) => {
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAGV9o6Mo:APA91bHDXrgGqGBM0S_y9elMSAOy5LIj58JB7mlvzzaDbsXnJN8ozE9bpTa8RWcvhniQaArQbdfueIrLFClbknhre_KKNUkP3WgAY2-_JsyH-o7tcjPNvKDO241ifAEJery3SEug5xp_',
    },
    body: JSON.stringify({
      to: device_id,
      notification: {
        body: body,
        title: title,
        data: data,
        email: email,
      },
      data: {
        body: body,
        title: title,
        data: data,
        email: email,
      },
      android: {
        priority: 'high',
      },
    }),
  });
};

export const call_update_notification = (
  device_id,
  rooms_id,
  title,
  body = '',
) => {
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAGV9o6Mo:APA91bHDXrgGqGBM0S_y9elMSAOy5LIj58JB7mlvzzaDbsXnJN8ozE9bpTa8RWcvhniQaArQbdfueIrLFClbknhre_KKNUkP3WgAY2-_JsyH-o7tcjPNvKDO241ifAEJery3SEug5xp_',
    },
    body: JSON.stringify({
      to: device_id,
      data: {
        body: body,
        title: title,
        rooms_id: rooms_id
      },
      android: {
        priority: 'high',
      },
    }),
  });
};
