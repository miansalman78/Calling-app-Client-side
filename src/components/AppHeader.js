import React, {useState} from 'react';
import {View, StyleSheet, TextInput,TouchableOpacity,Text} from 'react-native';
import {IconOutline} from '@ant-design/icons-react-native';
import {AppColors} from '../utils/Constants';
import GlobalStyles from '../utils/GlobalStyles';
import { useNavigation } from '@react-navigation/native';



export default function AppHeader(props) {
  const navigation = useNavigation();
  const [searchText,setSearchText] = useState('')

  const {displaySearch,heading,onSearch} = props


  const openDrawer = () => {
    navigation.openDrawer();
  }



  return (
    <View
      style={{
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'center',
        width: '100%',
        marginTop:20,
        zIndex:999
      }}>
        <TouchableOpacity onPress={props?.flag == "chatroom" ? navigation.goBack : openDrawer}>
      <View style={{width: 50, marginTop: 7}}>
        {
          props?.flag == "chatroom" ?
          <IconOutline name="caret-left" size={27} />:
          <IconOutline name="menu" size={27} />
        }

      </View>
      </TouchableOpacity>

      {
        displaySearch === false
        ?
        <Text
          style={[GlobalStyles.heading,{width:"75%",marginTop:5}]}
        >
          {heading}
        </Text>
      :

      <View style={{width: '75%'}}>
        <TouchableOpacity style={styles.searchIcon} onPress ={()=>onSearch(searchText)}>
        <IconOutline
          name="search"
          color={AppColors.textGrey}
          size={27}
        />
        </TouchableOpacity>

        <TextInput
          style={[GlobalStyles.searchInput]}
          placeholder="Search"
          onChangeText={setSearchText}
          value={searchText}
          placeholderTextColor={AppColors.textGrey}
        />
      </View>
      }
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
