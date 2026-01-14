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
              {'Privacy Policy'}
            </Text>
        </View>
        </View>
        <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={true}
        // contentContainerStyle={GlobalStyles.scrollContainerCenter}
        >
      <View style={[{flex:1,backgroundColor:'white',paddingLeft:25,paddingRight:25, paddingTop:15, paddingBottom:15}]}>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of your information when you use the service, and tells you about your privacy rights and how the law protects you. We dont use Your Personal data to provide and improve the Service. We also dont collect content that you create, upload, or receive from other users when using the Service.'}
          </Text>
          
          <Text className="mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Interpretation and Definitions'}
          </Text>

          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Definitions: For the purposes of this Privacy Policy:'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Affiliate: means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Application: means the software program provided by the Company downloaded by You on any electronic device, named Seemeglobal GPS tracker'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Company: GPS Tracker. Further and under the terms of the herein policieused by our Companys, it shall also be referred to as either “the Company”, “We”, “Us” or “Our”.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Country: Country refers to all the countries, provinces, nations as well as any and all localities where our services are authorized to be used by our Company'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Device: a digital tablet and or any other device that can act as a platform for the use of our Service for personal and or group use.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Personal data: Personal Data refers to any information that relates to an identified or identifiable individual.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Service refers to our corporate patented Application'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Usage Data refers to data collected automatically, either generated using the Service or from the Service infrastructure itself (for example, the duration of a page visit).'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Seemeglobal data refers to impersonal data collected automatically or obtained because of using the Service, namely geographic maps and other information posted on the Service'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Interpretation Words of which the initial letter is capitalized shall be read as having the same meaning notwithstanding whether they appear in singular or in plural'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'You mean the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Third-Party WebsitesOur Service may sometimes contain links to third party websites that are not related, connected, or operated by our Company'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Collecting and Using Your Personal Data'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Types of Data Collected'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Personal Data'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'While using Our Service, we may ask You only Usage Data that is collected automatically when using the Service'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Usage Data may include information such as Your Device’s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'When You access the Service by or through a mobile device, we may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Information Collected While Using the Application'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'While using the feature of Our Application, We may collect, with Your prior permission:'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Information regarding your location. We use this information to provide features of Ou Service, to improve and customize Our Service. The information may not be uploaded to the Company’s servers, but it may be simply stored on Your device. You can enable or disable access to this information at any time, through Your Device settings.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Use of Your Personal Data'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'The Company don`t use and don`t collect Personal Data.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Links to Other Websites'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Our Service may contain links to other websites that are not operated by Us. If You click on a third-party link, you will be directed to that third party’s site. We strongly advise You to review the Privacy Policy of every site You visit.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Collection and Use of Your Seemeglobal Data'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'When you use Our Service, namely geographic maps and other information created by Google map to fulfill the terms of cooperation with Google map, we automatically collect and transmit your geolocation Data. The geolocation data may be used by us or the ultimate recipient (Google map) only for the purpose of technical improvements to the Service and geographic maps and other information created by Google map. The geolocation data does not contain your Personal Information. And any geolocation data collected from Our Seemeglobal application must be for the intention of good cause if used otherwise you are totally responsible of whatever the consequences might become.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'You may opt out of the collection of geolocation Data at any time by clicking on the Google map logo on the map, going to “Telemetry Settings” and selecting the appropriate item.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Changes to this Privacy Policy'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'We may continually update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'Contact Us'}
          </Text>
          <Text className="justify-center mt-[0.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'If you have any questions about this Privacy Policy.'}
          </Text>
          <Text className="justify-center mt-[16.00px] [font-family:'Inter-Regular',Helvetica] font-bold text-[#051225b2] text-[13px] tracking-[0] leading-[20px]" >
            {'You can contact us: Email: info@seemeglobal.com'}
          </Text>
      </View>
      </ScrollView>
</SafeAreaView>
  )
};

const style = StyleSheet.create({
    main_container:{
        borderRadius:32,
        marginTop:16,
        padding:4
    },
    sideMenuProfileIcon: {
      width: 52,
      height: 52,
      // borderRadius: 100 / 2,
      alignSelf: 'center',
    },
    container: {
      justifyContent: 'flex-start',
      padding: 8,
      flexDirection:'row',
      alignItems:'center'
    },
    containertext:{
        flexDirection:'column',
        marginLeft:10,
        width:'auto'
    },
    searchIcon: {
        position:"absolute",
        zIndex:999,
        right:0,
        marginTop:5.5,
        marginRight:20
    },
    userIcon:{
        width:'18%',
        height: 50,
        marginBottom:0,
        backgroundColor:'#F6F6F6'
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
        width:'100%',
        paddingLeft:20,
        paddingRight:20,
        paddingBottom:7,
        paddingTop:7,
        flexDirection:'row',
        height: 'auto',
        backgroundColor: 'white',
        justifyContent:'space-between',
        
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
    },
    borersTop:{
        borderTopRightRadius:12,
        borderTopLeftRadius:12,
    },
    borersBot:{
        borderBottomRightRadius:12,
        borderBottomLeftRadius:12,
        
    }
  });