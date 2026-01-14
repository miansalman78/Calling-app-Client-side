import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const PRIMARY_COLOR = 'rgb(0,98,255)';
const WHITE = '#ffffff';
const BORDER_COLOR = '#DBDBDB';

const ActionSheet = (props) => {
  const { actionItems } = props;
  const actionSheetItems = [
    ...actionItems,
    {
      id: '#cancel',
      label: 'Cancel',
      onPress: props?.onCancel
    }
  ]
  return (
    <View style={styles.modalContent}>
      {
        actionSheetItems.map((actionItem, index) => {
          return (
            <TouchableHighlight
              style={[
                styles.actionSheetView,
                index === 0 && {
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                },
                index === actionSheetItems.length - 2 && {
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                },
                index === actionSheetItems.length - 1 && {
                  borderBottomWidth: 0,
                  backgroundColor: WHITE,
                  marginTop: 8,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  justifyContent: 'center',
                },
                {display:actionItem.isEmailPresent}
              ]}
              underlayColor={'#f7f7f7'}
              key={index} onPress={actionItem.onPress}>
              
              <View style={[{flexDirection:'row',}]}>
              
              {actionItem.present !== null && (
                <>
              {index === actionSheetItems.length - 9 && (
                <View style={[{marginLeft:0,marginBottom:-8}]}>
                <ZegoSendCallInvitationButton 
                  invitees={[1].map(inviteeID => { 
                    return { 
                      userID: actionItem.present.toString(), 
                      userName: actionItem.name, 
                    }; 
                  })} 
                  isVideoCall={false} 
                  resourceID={'traakme_com_call'}
                  icon={require('../assets/new/phone.png')}
                  width={340}
                  height={32}
                  text={'    Call    '}
                  backgroundColor={'white'} 
                  onPressed={actionItem.onPress}
                  fontSize={14}
                  textColor={'#051225CC'}
                />
                </View>
              )}

              {index === actionSheetItems.length - 8 && (
                <View style={[{marginLeft:0, marginBottom:-5}]}>
                <ZegoSendCallInvitationButton 
                  invitees={[1].map(inviteeID => { 
                    return { 
                      userID: actionItem.present.toString(), 
                      userName: actionItem.name, 
                    }; 
                  })} 
                  isVideoCall={true} 
                  resourceID={'traakme_com_call'}
                  icon={require('../assets/new/video.png')}
                  width={340}
                  height={32}
                  text={'   Video  '}
                  backgroundColor={'white'} 
                  onPressed={actionItem.onPress}
                  fontSize={14}
                  textColor={'#051225CC'}
                />
                </View>
              )}
              </>
            )}

              {index === actionSheetItems.length - 7 &&(
                <View style={[{flexDirection:'row',alignItems:'center', justifyContent:'center', width:'100%'}]} >
                <IconOutline
                  name={actionItem.icon}
                  color={'#051225CC'}
                  size={20}
                  style={[{marginLeft:-20,marginRight:10}]}
                />
                <Text allowFontScaling={false}
                  style={[
                    styles.actionSheetText,
                    props?.actionTextColor && {
                      color: props?.actionTextColor
                    }
                  ]}>
                  {actionItem.label}
                </Text>
                </View>
              )}

              {index === actionSheetItems.length - 6 &&(
                <View style={[{flexDirection:'row',alignItems:'center', justifyContent:'center', width:'100%'}]} >
                <IconOutline
                  name={actionItem.icon}
                  color={'#051225CC'}
                  size={20}
                  style={[{marginLeft:-15,marginRight:10}]}
                />
                <Text allowFontScaling={false}
                  style={[
                    styles.actionSheetText,
                    props?.actionTextColor && {
                      color: props?.actionTextColor
                    }
                  ]}>
                  {actionItem.label}
                </Text>
                </View>
              )}

              {index === actionSheetItems.length - 5 &&(
                <View style={[{flexDirection:'row',alignItems:'center', justifyContent:'center', width:'100%'}]} >
                <IconOutline
                  name={actionItem.icon}
                  color={'#051225CC'}
                  size={20}
                  style={[{marginLeft:-25,marginRight:10}]}
                />
                <Text allowFontScaling={false}
                  style={[
                    styles.actionSheetText,
                    props?.actionTextColor && {
                      color: props?.actionTextColor
                    }
                  ]}>
                  {actionItem.label}
                </Text>
                </View>
              )}

              {index === actionSheetItems.length - 4 &&(
                <View style={[{flexDirection:'row',alignItems:'center', justifyContent:'center', width:'100%'}]} >
                <IconOutline
                  name={actionItem.icon}
                  color={'#051225CC'}
                  size={20}
                  style={[{marginLeft:-25,marginRight:10}]}
                />
                <Text allowFontScaling={false}
                  style={[
                    styles.actionSheetText,
                    props?.actionTextColor && {
                      color: props?.actionTextColor
                    }
                  ]}>
                  {actionItem.label}
                </Text>
                </View>
              )}
              {index === actionSheetItems.length - 3 &&(
                <View style={[{flexDirection:'row',alignItems:'center', justifyContent:'center', width:'100%'}]} >
                <IconOutline
                  name={actionItem.icon}
                  color={'#051225CC'}
                  size={20}
                  style={[{marginLeft:-25,marginRight:10}]}
                />
                <Text allowFontScaling={false}
                  style={[
                    styles.actionSheetText,
                    props?.actionTextColor && {
                      color: props?.actionTextColor
                    }
                  ]}>
                  {actionItem.label}
                </Text>
                </View>
              )}
              {index === actionSheetItems.length - 2 &&(
                <View style={[{flexDirection:'row',alignItems:'center', justifyContent:'center', width:'100%'}]} >
                <IconOutline
                  name={actionItem.icon}
                  color={'#fa1616'}
                  size={20}
                  style={[{marginLeft:-10,marginRight:10}]}
                />
                <Text allowFontScaling={false}
                  style={[
                    styles.actionSheetText,
                    props?.actionTextColor && {
                      color: props?.actionTextColor
                    },{color: '#fa1616'}
                  ]}>
                  {actionItem.label}
                </Text>
                </View>
              )}

              {index === actionSheetItems.length - 1 &&(
                <>
                
                <Text allowFontScaling={false}
                  style={[{color: '#fa1616', fontSize:16}
                  ]}>
                  {actionItem.label}
                </Text>
                </>
              )}
                
              </View>
            </TouchableHighlight>
          )
        })
      }
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