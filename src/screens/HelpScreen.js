import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import {AppColors, Font} from '../utils/Constants';
import useAuth from '../hooks/useAuth';
import Toast from 'react-native-simple-toast';
import {_checkEmailStatus} from '../utils/api'
import {getErrorMessage,validatePhoneNumber} from '../utils/helper'
import {IconOutline} from '@ant-design/icons-react-native';
import ActionSheet from '../components/ActionsheetConfirm';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import BackAppHeader from '../components/BackAppHeader';
import { Switch } from 'react-native-switch';
import Accordion from 'react-native-collapsible/Accordion';

export default function PrivacyPolicy(props) {
 
    const [actionSlide, setActionSlide] = useState(false);
    const [actionType, setActionType] = useState('');
    const [actionTitle, setActionTitle] = useState('');
    const [actionDesc, setActionDesc] = useState('');
    const [actionConfirm, setActionConfirm] = useState('');
    const [actionCancel, setActionCancel] = useState('');
    const navigation = useNavigation();
    const closeActionSheet = () => setActionSheet(false);
    const changeslider = (val) => {
        setActionSlide(val)
    }

    const [ activeSections, setActiveSections ] = useState([]);
  const sections = [
    {
      title: 'How does the traakme location tracking feature work',
      content: <Text style={styles.textSmall}>
        Using GPS technology, the Traakme Location Tracking app converts any device that the app is installed into a GPS tracking device. As the app is running, the device’s location is continually recorded and uploaded to the server and can be monitored on the Traakme app’s map page. Our Business version of the Traakme app can be used to track employee location and navigation while they are on company paid time. Their real time locations will be followed as they navigate. The work-related time spent at each visited location is accurately recorded. Our Friends & Family version of the app can be used to track the location and movement of your loved ones, to make sure they are safe. Their real time locations will be shown as they navigate
      </Text>
    },
    {
      title: 'Does the Traakme location tracking feature work in a tablet?',
      content: <Text style={styles.textSmall}>
        If a device has cellular data service and has GPS chip, the app will run just like in a regular smart phone, but if the device has WiFi but no cellular data service, or no GPS chip in it, the app will run in WiFi-Only mode. In the WiFi-Only mode, the Traakme app records locations and saves to the device storage. You will not see real time location updates of the monitored device on your app’s map screen.
      </Text>
    },
    {
      title: 'Does Traakme app protect my privacy?',
      content: <Text style={styles.textSmall}>
        We take your privacy seriously, and follow all precautions to protect your data. We collect only the minimal data required to provide our location tracking service, and these include your traakme account data, device information such as ID/name and model, and your geolocation data. We don’t store sensitive information, such as your credit card information, and only you can access your account information.
      </Text>
    },
    {
      title: 'Can I track multiple devices with one account?',
      content: <Text style={styles.textSmall}>
        Yes. The number of devices you can track depends on the pricing plan you have selected. To view our plans and choose one that meets your needs, see Our Plans & Pricing.
      </Text>
    },
    {
      title: 'I am a Traakme Friends & Family subscriber. I changed to a new smart phone. How can I transfer my service to my new device?',
      content: <><Text style={styles.textSmall}>
        a. Install the Traakme app in your new device, and configure the app with your account information
      </Text><Text style={styles.textSmall}>
      b. Uninstall the app from your old device if you still have access to it
      </Text>
      <Text style={styles.textSmall}>c. You can easily transfer the paid service to your new device</Text></>
    },
    {
      title: 'I am a Traakme for Business subscriber. An employee changed to a new smart phone. How can we transfer the tracking feature to his or her new device?',
      content:<><Text style={styles.textSmall}>
        a. Install the Traakme app in your new device, and configure the app with your account information
      </Text>
      <Text style={styles.textSmall}>
      b. Uninstall the app from your old device if you still have access to it
      </Text>
      <Text style={styles.textSmall}>
      You can easily transfer the paid service to your new device
      </Text></>
    },
    {
      title: 'I am a Traakme for Business subscriber, with administrator role. I changed to a new device. How can I transfer my Traakme service and administrator privileges to my new device?',
      content: <><Text style={styles.textSmall}>
        To transfer your Traakme service and administrator privileges to your new device
      </Text>
      <Text style={styles.textSmall}>
      a. Install the Traakme app in your new device, and configure the app with your administrator level account information
      </Text>
      <Text style={styles.textSmall}>
      b. Uninstall the app from your old device if you still have access to it
      </Text>
      <Text style={styles.textSmall}>
      c. In your My Account page, follow the prompts to remove your old device and transfer the Traakme service and administrator privileges to your new device
      </Text></>
    },
    {
      title: 'I am a Traakme for Business subscriber, with manager or administrator role. How do I access and print navigation records of an employee on my list?',
      content: <><Text style={styles.textSmall}>
        To transfer your Traakme service and administrator privileges to your new device
      </Text>
      <Text style={styles.textSmall}>
      a. Log into your My Account page
      </Text>
      <Text style={styles.textSmall}>
      b. Click on the Navigation Reports link
      </Text>
      <Text style={styles.textSmall}>
      c. Select the employee whose navigation report you want to see
      </Text>
      <Text style={styles.textSmall}>
      d. Click on Download Report
      </Text></>
    },
    {
      title: 'I am a Traakme for Friends & Family subscriber. How do I access and print navigation records of a member of my circle?',
      content: <><Text style={styles.textSmall}>
        a. Log into your My Account page
      </Text>
      <Text style={styles.textSmall}>
      b. Click on the Navigation Reports link
      </Text>
      <Text style={styles.textSmall}>
      c. Select the employee whose navigation report you want to see
      </Text>
      <Text style={styles.textSmall}>
      d. Click on Download Report
      </Text>
      </>
    },
    {
      title: 'For iOS devices, what settings do I set to enable Traakme to track in the background?',
      content: <><Text style={styles.textSmall}>
        Open the iOS device, go to Settings  Traakme and insure the following settings
      </Text>
      <Text style={styles.textSmall}>
      a. Location: Always. Precise Location should be enabled
      </Text>
      <Text style={styles.textSmall}>
      b. Motion & Fitness: On
      </Text>
      <Text style={styles.textSmall}>
      c. Background App Refresh: On
      </Text>
      <Text style={styles.textSmall}>
      d. Use Cellular Data: On
      </Text>
      </>
    },
    {
      title: 'For Android devices, what settings do I set to enable Traakme to track in the background?',
      content: <>
      <Text style={styles.textSmall}>
      Background data must be enabled for Seemeglobal app to work in the background. This setting is enabled by default when you install the app. If it is disabled, do as follows to enable it
        </Text>
        <Text style={styles.textSmall}>
        a. Go to Settings &; Apps & Notifications & Seemeglobal
      </Text>
      <Text style={styles.textSmall}>
      b. Select Mobile Data & Wi-Fi
      </Text>
      <Text style={styles.textSmall}>
      c. Enable both “Background Data” and “Unrestricted Data Usage”. It is necessary to unrestrict the data usage so that the app continues to track when Data Server has been turned on. But not to worry, the app uses very little data
      </Text></>
    },
    {
      title: 'How much does the Traakme service cost?',
      content: <Text style={styles.textSmall}>
        Our plans are affordable, simple and flexible. To view our plans and choose one that meets your needs, see Our Plans & Pricing. A free trial plan is also available
      </Text>
    },
    {
      title: 'What payment options do you have?',
      content: <Text style={styles.textSmall}>
        The regular credit card payment option - which take the commonly used credit cards such as Visa, MasterCard, American Express, and Discover.
      </Text>
    },
    {
      title: 'To select and subscribe to our service, see Our Plans & Pricing. A free trial plan is also available',
      content: <Text style={styles.textSmall}>
        In your My Account page, click on Cancel My Service and follow the prompts
      </Text>
    },
    {
      title: 'How do I cancel my service?',
      content: <Text style={styles.textSmall}>
        In your My Account page, click on Cancel My Service and follow the pro
      </Text>
    },
    {
      title: 'I cancelled after subscribing to your service. How does your refund policy work?',
      content: <><Text style={styles.textSmall}>
        If you cancelled after your free trial period ended or you subscribed to a paid plan directly, your account features will remain available to you till the end of the paid subscription period, as this period has already been paid for by you. The service would terminate after the paid subscription period ends.
      </Text>
      <Text style={styles.textSmall}>
      If you cancelled during your free trial period, your account features will remain available to you till the end of the free trial period, and the service will terminate. You will not be charged.
      </Text></>
    },
    {
      title: 'How can I contact you for help or further assistance?',
      content: <Text style={styles.textSmall}>
        We have a responsive and quality customer service, available to assist you or answer any additional questions you might have. Call us anytime at 800-555-1212, or chat with us.
      </Text>
    },
  ];

  function renderHeader(section, _, isActive) {
    return (
      <View style={styles.accordHeader}>
        <Text style={styles.accordTitle}>{ section.title }</Text>
        <IconOutline
                    name={ isActive ? 'down' : 'right' }
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', paddingTop:15, paddingBottom:10, left:0 }}
                    />
      </View>
    );
  };

  function renderContent(section, _, isActive) {
    return (
      <View style={styles.accordBody}>
        {section.content}
      </View>
    );
  }

  return (
    
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
    
    <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#0512250D'}]}>
            <BackAppHeader />
          <View style={[{flexDirection:'column',marginRight:25, marginLeft:25}]}>
            <Text className="mb-[16.00px] mt-[16.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'Help Service'}
            </Text>
          </View>
          
        </View>
        <View style={[{flexDirection:'column',paddingLeft:25, paddingRight:25, backgroundColor:'#FFF6FE'}]}>
            <Text className="mb-[3.00px] mt-[16.00px] [font-family:'Inter-Bold',Helvetica] font-medium text-[#F40ADB] text-[10px] tracking-[0] leading-[normal]" >
              {'Phone: 1-800-555-1212'}
            </Text>
            <Text className="mb-[16.00px] mt-[3.00px] [font-family:'Inter-Bold',Helvetica] font-medium text-[#F40ADB] text-[10px] tracking-[0] leading-[normal]" >
              {'Email: info@seemeglobal.com'}
            </Text>
          </View>
        <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        // contentContainerStyle={GlobalStyles.scrollContainerCenter}
        >
      <View style={[{flex:1,backgroundColor:'white',paddingLeft:25,paddingRight:25, paddingTop:15, paddingBottom:15}]}>
        <Accordion
            align="bottom"
            sections={sections}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={(sections) => setActiveSections(sections)}
            sectionContainerStyle={styles.accordContainer}
          />
      </View>
      </ScrollView>
</SafeAreaView>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  accordContainer: {
    paddingBottom: 4
  },
  accordHeader: {
    
    color: '#eee',
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
    borderBottomWidth:0.5,
        borderColor: '#05122514',
  },
  accordTitle: {
    fontSize: 14,
    fontWeight:'600',
    lineHeight:20,
    overflow:'hidden',
    width:'85%',
    paddingTop:10, paddingBottom:15,
  },
  accordBody: {
    paddingLeft: 0,
    paddingTop:10,
    paddingBottom:10,
  },
  textSmall: {
    fontSize: 13,
    color:'#051225A6',
    lineHeight:18,
    paddingRight:30,
  },
  seperator: {
    height: 12
  }
});
