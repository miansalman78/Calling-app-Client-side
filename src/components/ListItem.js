import {
    View,
    useWindowDimensions,
    ImageURISource,
    StyleSheet,
    Image
  } from 'react-native';
  import React from 'react';
  import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
  } from 'react-native-reanimated';
  
  
  const ListItem = ({ item, index, x }) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const rnImageStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP
      );
      const opacity = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity,
        width: SCREEN_WIDTH * 0.7,
        height: SCREEN_WIDTH * 0.7,
        transform: [{ translateY}],
      };
    }, [index, x]);
  
    const rnTextStyle = useAnimatedStyle(() => {
      const translateY = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP
      );
      const opacity = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity,
        transform: [{ translateY}],
      };
    }, [index, x]);
    return (
      <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
        <Image
        source={require('../assets/new/logo.png')}
        resizeMode="contain"
        style={styles.imageLogo}
      />
        <Animated.Image
          source={item.image}
          style={[styles.vectorimg]}
          resizeMode="contain"
        />
        <Animated.Text className= "pr-8 pl-8 relative self-stretch mt-[-1.00px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#051225cc] text-xl text-center tracking-[0] leading-[27px]" style={[]}>
          {item.text}
        </Animated.Text>
        
      </View>
    );
  };
  
  export default React.memo(ListItem);
  
  const styles = StyleSheet.create({
    itemContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom:20
    },
    vectorimg:{
      width: '60%',
      marginBottom: 50,
    },
    imageLogo: {
      width: '70%',
      marginBottom: 50,
    },
    
  });