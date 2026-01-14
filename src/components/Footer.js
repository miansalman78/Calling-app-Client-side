import React from 'react';
import {View, StyleSheet, Image,TouchableOpacity,Text} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors} from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';
import { useNavigation } from '@react-navigation/native';



export default function Footer(props) {
  const navigation = useNavigation();
  const {displaySearch,heading} = props
  const openDrawer = () => {
    navigation.openDrawer();
  }
  return (
    <View
      style={{
        bottom:0,
        height:40,
        width: '100%',
      }}>
          <Image
              source={require('../assets/bottomBar.png')}
              resizeMode="contain"
              style={styles.image}
            />



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
});
