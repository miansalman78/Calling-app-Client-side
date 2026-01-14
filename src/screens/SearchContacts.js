import React , {useState,useEffect,useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import BackAppHeader from '../components/BackAppHeader';
import {AppColors, Font, SpaceConstants} from '../utils/Constants';
import ContactCard from '../components/ContactCard';
import ListContacts from '../components/ListContacts';
import {_fetchContacts, _fetchContactsNextPage, _sendfcm} from '../utils/api'
import Toast from 'react-native-simple-toast';
import {getErrorMessage} from '../utils/helper'
import {IconOutline} from '@ant-design/icons-react-native';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = [
    {id: 1,fullname: "San Francisco",email: "johnDoe@gmail.com",phone_number: "+237676627827"},
    {id: 2,fullname: "San Francisco",email: "johnDoe@gmail.com",phone_number: "+237676627827"},
    {id: 3,fullname: "San Francisco",email: "johnDoe@gmail.com",phone_number: "+237676627827"},
    {id: 4,fullname: "San Francisco",email: "johnDoe@gmail.com",phone_number: "+237676627827"},
    {id: 5,fullname: "San Francisco",email: "johnDoe@gmail.com",phone_number: "+237676627827"},
];


export default function SearchContacts(props) {

  const [contacts,setContactList] = useState([])
  const [refreshing,setRefreshing] = useState(false)
  const navigation = useNavigation();
  const [searchText,setSearchText] = useState('')
  const [passfocus, setPassfocus] = useState(GlobalStyles.removeactiveTextInput);
  const [passfocusA, setPassfocusA] = useState(GlobalStyles.removeactiveTextInput);

    const onSearch = async (text) => {
        try {
        setRefreshing(true)
        let res = await _fetchContacts(text);
        setContactList(res?.results || [])
        setRefreshing(false)
        console.log(res)
        } catch (err) {
        setRefreshing(false)
        Toast.show(getErrorMessage(err));
        }
    }

    const passFocus = async() => {
      setPassfocus(GlobalStyles.activeTextInputSearch)
      setPassfocusA(GlobalStyles.activeTextInputSearchA)
    }

    return (
      <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
          
          <View style={[{
            flexDirection:'column',
            paddingLeft:0,
            backgroundColor: 'white',
            borderBottomWidth: 0,
            borderBottomColor: '#0512250D'}]}>
              <BackAppHeader />
              <Text style={[{marginLeft:20,marginRight:20,}]} className="mb-[16.00px] mt-[8.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'Search Contacts'}
            </Text>
            <View style={[{flexDirection:'row', 
            marginLeft:20,marginRight:20,}]}>
                <TextInput
                  style={[GlobalStyles.searchInput, passfocus]}
                  placeholder="Search contact"
                  onChangeText={setSearchText}
                  value={searchText}
                  onFocus={passFocus}
                  placeholderTextColor={AppColors.textGrey}
                />
              <TouchableOpacity style={[GlobalStyles.searchIcon, passfocusA]} onPress ={()=>onSearch(searchText)}>
                <IconOutline
                  name="search"
                  color={AppColors.textGrey}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            </View>
            <View style={[{flex:1,backgroundColor:'#F6F6F6',}]}>
              <FlatList
                    data={contacts}
                    numColumns={1}
                    keyExtractor={(item) => item.id}
                    renderItem={({ index, item }) => (
                      <ListContacts item={item}  />
                    )}
                    refreshing = {refreshing}
                    style={[{marginLeft:25,marginRight:25,}]}
                  />
            </View>
    </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
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
      marginBottom:178,
      
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
  });
