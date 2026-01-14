import React,{useState} from 'react';
import {View, StyleSheet, TextInput,TouchableOpacity,Text,Image} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors} from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import Button from './Buttons';
import ActionSheet from './Actionsheet';
import Modal from 'react-native-modal';


export default function AcceptDeclineModal(props) {
  const navigation = useNavigation();
  const [actionSheet, setActionSheet] = useState(true);
  const closeActionSheet = () => setActionSheet(false);
  const actionItems = [
    {
      id: 1,
      label: 'Hey, it’s me. Want to make sure it’s all’s good out there. Okay to track you?',
      onPress: () => {
        closeActionSheet()
      }
    },
    {
      id: 2,
      label: 'Hey, it’s me. Want to make sure all’s good along the way. Okay to track you?      ',
      onPress: () => {
        closeActionSheet()
      }
    },
    {
      id: 3,
      label: 'Hey, it’s me. Okay to track you?',
      onPress: () => {
        closeActionSheet()
      }
    },
  ];
  return (
    <View
      style={{
        flexDirection: 'column',
        alignContent: 'space-between',
        justifyContent: 'flex-start',
        width: '85%',
        padding:20,
        margin:20,
        zIndex:999,
        backgroundColor: AppColors.background,
        height:'auto',
        borderRadius:20,
        elevation: 20,
        shadowColor: AppColors.textBlack,
        // flex:1
      }}>
       <Modal
          isVisible={actionSheet}
          style={{
            margin: 0,
            justifyContent: 'flex-end'
          }}
        >
          <ActionSheet
            actionItems={actionItems}
            onCancel={closeActionSheet}
          />
        </Modal>
           <View style={{flexDirection: 'row',alignContent:"space-between",justifyContent:"center",padding:10}}>
                <Text style={[GlobalStyles.descriptionText,{textAlign:"center",marginTop:10}]}>
                        Susan Sanders,
                        <Text style={{color:AppColors.buttonColor}}>
                            &nbsp;Susan Sanders&nbsp;
                        </Text>
                        Julie Andrews has requested to track you.
                </Text>
                <IconOutline name="close" size={22}  />
                <IconOutline name="vertical-align-bottom" size={22}  />
          </View>
          <Text style={GlobalStyles.descriptionText}>
              Your Response : No, I'm good. But thanks a lot
          </Text>
          <View>
            <Button onPress = {()=>setActionSheet(true)} title = "Select Request Message" style={{width:'100%',marginTop:10}}/>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
    searchIcon: {
        position:"absolute",
        zIndex:999,
        right:0,
        marginTop:5.5,
        marginRight:10
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'space-between',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
        marginBottom:10
      },
      cardContainer: {
        height: 'auto',
        backgroundColor: AppColors.background,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
      },
});
