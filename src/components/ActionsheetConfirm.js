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
            <Text className='mt-[32px] font-normal text-center text-[14px] text-[#051225]' >
                {title}
            </Text>
            <Text className="text-[14px] mt-[6px] mb-[4px] text-center font-semibold" >
                {desc}
            </Text>
            <TouchableHighlight
              style={[
                styles.actionSheetView,{
                    borderBottomWidth: 0,
                    backgroundColor: AppColors.buttonColor,
                    marginTop: 24,
                    marginBottom: 8,
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
                  {cancel}
                </Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight
              style={[
                styles.actionSheetView,{
                    backgroundColor: 'white',
                    marginTop: 8,
                    marginBottom: 26,
                    borderRadius: 22,
                    justifyContent: 'center',
                    marginLeft:20,
                    marginRight:20,
                    borderWidth: 1,
                    borderColor: '#05122514',
                },
              ]}
              underlayColor={'#f7f7f7'}
               onPress={action}>
              
              <View style={[{flexDirection:'row',}]}>
                <Text allowFontScaling={false}
                  style={[{color:'black', fontWeight:'600', fontSize:14}]}>
                  {confirm}
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