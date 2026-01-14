import PushNotification from "react-native-push-notification";
const channelSetup = (channelId) => {
    if (PushNotification.channelExists(channelId)) {
        //PushNotification.deleteChannel(channelId)
    }else{
        PushNotification.createChannel(
        {
            channelId: channelId, // required
            channelName: 'some channel name', 
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: 4, // (optional) default: 4. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        }
        ,
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    }
};

export const sendLocalPushNotification = (
    notificationData,
    channelId="kalugogoa-local-push") => {
    try {
        channelSetup(channelId);
        PushNotification.localNotification({
            channelId: channelId,
            autoCancel: true,
            bigText: notificationData.message,
            // subText: 'Local Notification',
            title: notificationData.title,
            data: notificationData.data,
            message: notificationData.message,
            vibrate: true,
            vibration: 300,
            playSound: true,
            soundName: 'default',
            // actions: '["Yes", "No"]'
        });
    } catch (error){
        console.log("push error", error)
    }
}