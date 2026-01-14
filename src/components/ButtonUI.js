import {
    ImageURISource,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from 'react-native';
  import React, { useCallback } from 'react';
  import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
  } from 'react-native-reanimated';
  import GlobalStyles from '../utils/GlobalStyles';
  import ButtonCom from './Buttons';
  import {AppColors, Font} from '../utils/Constants';
  import {useNavigation} from '@react-navigation/native';

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  
  const Button = ({ currentIndex, length, flatListRef }) => {
    const navigation = useNavigation();

    const rnBtnStyle = useAnimatedStyle(() => {
      return {
        width:
          currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
        height: 60,
      };
    }, [currentIndex, length]);
  
    const rnTextStyle = useAnimatedStyle(() => {
      return {
        opacity:
          currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
        transform: [
          {
            translateX:
              currentIndex.value === length - 1 ? withTiming(0) : withTiming(100),
          },
        ],
      };
    }, [currentIndex, length]);
  
    const imageAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity:
          currentIndex.value !== length - 1 ? withTiming(1) : withTiming(0),
        transform: [
          {
            translateX:
              currentIndex.value !== length - 1 ? withTiming(0) : withTiming(100),
          },
        ],
      };
    }, [currentIndex, length]);
  
    const onPress = useCallback(() => {
      if (currentIndex.value === length - 1) {
        console.log('Get Started');
        return;
      } else {
        flatListRef?.current?.scrollToIndex({
          index: currentIndex.value + 1,
        });
      }
    }, []);

    const loginUser = async() => { 
      //navigation.navigate('SignIn')
      navigation.navigate('OTPLogin')
      //completeGetScreen()
    }
  
    const getstarted = async() => { 
      navigation.navigate('SignUp')
      //completeGetScreen()
    }

    const completeGetScreen = async() => { 
      try{
        AsyncStorage.setItem("ONBOARDED",false);
      }catch (err) {
        console.log(err)
      }
    }

    return (
        <>
      
      <View style={GlobalStyles.nogreyContainer}>
              <ButtonCom
              style={{ marginTop:5, marginBottom:10, borderRadius:32, lineHeight: 24, height: 50 }}
                title="Get Started Today"
                onPress={() => getstarted()}
                disabled={false}
              />

            <ButtonCom
              style={{ marginTop:5, backgroundColor: AppColors.uiblack, marginBottom:40, borderRadius:32, lineHeight: 24, height: 50 }}
                title="Sign In"
                onPress={() => loginUser()}
              />
            </View>
      </>
    );
  };
  
  export default Button;
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 100,
      backgroundColor: '#304FFE',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    textStyle: {
      color: 'white',
      position: 'absolute',
      fontWeight: '600',
      fontSize: 16,
    },
    imageStyle: {
      width: 24,
      height: 24,
      position: 'absolute',
    },
  });