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
import {_fetchContacts, _fetchContactsNextPage, _sendfcm} from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Buttons';
import { useSelector, useDispatch } from 'react-redux'

export default function SearchContacts(props) {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [phone,setPhone] = useState('')
    const [photo,setPhoto] = useState('')
    const current_user = useSelector((state) => state.requestStatus?.currentUser || {});
    const navigation = useNavigation();
    const dispatchRedux = useDispatch()
    useEffect(()=>{
        setName(current_user?.fullname || '')
        setEmail(current_user?.email || '')
        setPhone(current_user?.phone_number || '')
        setPhoto(current_user?.image_url)
        //console.log(current_user)
    },[])
    const calluser = () => {
        console.log('callling user')
        navigation.navigate('ProfileEdit')
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
        </View>
        <View style={[{flexDirection:'column',marginRight:20, marginLeft:20}]}>
            <Text className="mb-[16.00px] mt-[24.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#051225] text-[20px] tracking-[0] leading-[normal]" >
              {'My Profile'}
            </Text>
        </View>
        <View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Full Name'}
            </Text>
            <Text className="text-[16px]" style={styles.textAccountValue}>
                {name}
            </Text>
        </View>
        <View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Display Picture'}
            </Text>
            <Image
                source={{uri: photo}}
                resizeMode={"cover"}
                style={styles.textAccountImage}
            />
        </View>
        {/*<View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Email Address'}
            </Text>
            <Text className="text-[16px]" style={styles.textAccountValue}>
                {email}
            </Text>
        </View>*/}
        <View style={styles.viewlist}>
            <Text className="text-[16px]" style={styles.textAccount}>
                {'Phone Number'}
            </Text>
            <Text className="text-[16px]" style={styles.textAccountValue}>
                    {phone}
            </Text>
        </View>
        <View style={[{marginTop:40, width: '100%', alignItems:'center', justifyContent:'center'}]}>
        <Button
            style={{ width: '90%', marginBottom:0, borderRadius:32, lineHeight: 24, height: 50 }} 
            title="Edit Profile"
            onPress={calluser}
            />
        </View>
    </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    
    image: {
      height: 30,
      width: 30,
      borderRadius:3
    },
    sideMenuProfileIcon:{
        width: '35%',
        height:70,
        marginBottom:10
    },
    textAccountImage:{
        width: '15%',
        height:40,
        marginBottom:10,
        marginTop:10,
        borderRadius:50
    },
    textAccount:{
        fontSize: 14,
        color: '#05122599',
        paddingTop:20,
        paddingBottom:20
    },
    textAccountValue:{
        fontSize: 14,
        color: '#051225CC',
        paddingTop:20,
        paddingBottom:20,
        fontWeight: '600'
    },
    viewlist:{
        flexDirection:'row',
        marginLeft:25,
        marginRight:25,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#0512250D'
    }
  });
