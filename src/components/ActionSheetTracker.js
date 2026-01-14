import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';

const PRIMARY_COLOR = 'rgb(0,98,255)';
const WHITE = '#ffffff';
const BORDER_COLOR = '#DBDBDB';
 
const ActionSheet = (props) => {
  const { title, desc, confirm, cancel, action, onCancel} = props;
  const actionSheetItems = [
    {
      id: '#cancel',
      label: 'Cancel',
      onPress: props?.onCancel
    }
  ]
  return (
    <View style={styles.modalContent}>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex:9, marginTop:20, marginRight:-30}}>
                    <Text className="text-[14px] mt-[0px] mb-[4px] text-center font-semibold" >
                    {'Request Tracking'}
                    </Text>
                </View>
                <View style={{flex:1}}>
                    <IconOutline
                        onPress={() => closeSendRequestModal(false)}
                        name="close"
                        size={16}
                        color='#051225CC'
                        style={{marginRight:-50, marginTop:10}}
                    />
                </View>
            </View>
            <Text className='mt-[12px] leading-5 pl-5 pr-5 font-normal text-[13px] text-[#051225CC]' >
                You have requested to track <Text className='text-[#F40ADB]'>John Doe </Text> Click on <Text className='font-semibold'>“Select Request Message”</Text>
                and choose the tracking request message you would like to send.
            </Text>
            <TouchableHighlight
              style={[
                styles.actionSheetView,{
                    borderBottomWidth: 0,
                    backgroundColor: AppColors.buttonColor,
                    marginTop: 24,
                    marginBottom: 16,
                    borderRadius: 22,
                    justifyContent: 'center',
                    marginLeft:20,
                    marginRight:20,
                },
              ]}
              underlayColor={'#f7f7f7'}
               onPress={onCancel}>
              
              <View style={[{flexDirection:'row',}]}>
                <Text allowFontScaling={false}
                  style={[{color:'white', fontWeight:'600', fontSize:14}]}>
                  {'Select Request Message'}
                </Text>
              </View>
            </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 20,
    backgroundColor:'white'
  },
  actionSheetText: {
    fontSize: 16,
    color: '#051225CC',
    paddingLeft:10,
    paddingRight:5
  },
  actionSheetView: {
    backgroundColor: WHITE,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  }
});

ActionSheet.propTypes = {
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      onPress: PropTypes.func
    })
  ).isRequired,
  onCancel: PropTypes.func,
  actionTextColor: PropTypes.string
}


ActionSheet.defaultProps = {
  actionItems: [],
  onCancel: () => { },
  actionTextColor: null
}


export default ActionSheet;