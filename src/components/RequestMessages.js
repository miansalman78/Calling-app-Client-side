import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, SafeAreaView, TouchableOpacity } from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import GlobalStyles from '../utils/GlobalStyles';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';

const PRIMARY_COLOR = 'rgb(0,98,255)';
const WHITE = '#ffffff';
const BORDER_COLOR = '#DBDBDB';

const ActionSheet = (props) => {
  const { actionItems } = props;
  const actionSheetItems = [
    ...actionItems,
  ]
  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
          
        <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#0512250D'}]}>
              <View
                style={{
                    marginTop:20,
                    marginBottom:20,
                    marginLeft:20,
                    backgroundColor: 'white'
                }}>
                <TouchableOpacity onPress={
                    props.onCancel
                } >
                <View style={{ marginTop: 7}} className="w-7 h-7 bg-[#0512250d] rounded-[32px]">
                    <View className="pl-1 pt-1">
                        <IconOutline name="left" size={18} />
                    </View>
                </View>
                </TouchableOpacity>
                </View>
              <Text style={[{marginLeft:20,marginRight:20,}]} className="mb-[16.00px] mt-[8.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[18px] tracking-[0] leading-[normal]" >
              {'Select Request Message'}
            </Text>
            
        </View>
      {
        actionSheetItems.map((actionItem, index) => {
          return (
          <View key={index} style={[{backgroundColor:'white', marginBottom:0}]}>
            <View style={[style.gridItem,]}>
                <View style={{flexDirection:'row',}}>
                    
                    <Text style={{lineHeight:20}} className="pl-[12.00px] pr-[18px] mt-5 mb-5 [font-family:'Inter-Regular',Helvetica] font-medium text-[#051225] text-[14px]" >
                    {actionItem.label}
                    </Text>
                    </View>
                <TouchableOpacity
                    onPress={actionItem.onPress} 
                    style={{}} >
                    <IconOutline
                    name="right"
                    color={'#051225E5'}
                    size={16}
                    style={{textAlign:'right', lineHeight:60, left:0 }}
                    />
                </TouchableOpacity>
                </View>
            </View>
          )
        })
      }
    </SafeAreaView>
  )
}


const style = StyleSheet.create({
    searchIcon:{

    },
    addContact:{
      backgroundColor: AppColors.buttonColor,
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      borderRadius:32,
    },
    addContactFloat:{
      backgroundColor: AppColors.buttonColor,
      height: 55,
      alignItems: 'center',
      width: 55,
      borderRadius:50,
      justifyContent: 'center',
      position:'absolute',
      right:20,
      bottom:20,
      zIndex:3,
      elevation:3
    },
    image: {
      height: 30,
      width: 30,
      borderRadius:3
    },
    heading:{
      fontSize:Font.headingSize,
      color: AppColors.newPink,
      marginBottom:5,
      fontFamily:Font.family_bold,
      paddingLeft:25,
    },
    subHeading:{
      fontSize:Font.subheadingSize,
      color: AppColors.textBlack,
      paddingLeft:25,
    },
    flatlisstyle:{
      width:'auto',
      height:'auto',
      marginBottom:17,
      
      // height:'auto',
      marginTop:20,
      marginLeft:25,
      marginRight:25,
      
      overflow:"scroll",
      borderTopColor:AppColors.newPink,
      borderTopWidth:0.50,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign:'center',
    },
    container_start:{
      flex: 1,
      //alignItems: 'center',
      
      justifyContent: 'flex-start',
      width:"100%"
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
        width:'85%',
        marginRight:20,
        marginLeft:20,
        marginBottom:0,
        flexDirection:'row',
        height: 'auto',
        backgroundColor: 'white',
        justifyContent:'space-between',
        borderBottomWidth:1,
        borderColor: '#05122514',
        overflow: Platform.OS === 'android' ? 'hidden' : 'visible'
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