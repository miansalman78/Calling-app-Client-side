import React, { useCallback, useRef } from 'react';
import {
  ImageURISource,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  ViewToken,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import ListItem from '../components/ListItem';
import PaginationElement from '../components/PaginationElement';
import Button from '../components/ButtonUI';
import GlobalStyles from '../utils/GlobalStyles'

const pages = [
  {
    text: 'Connect accross the world and around the corner',
    image: require('../assets/new/amico1.png'),
  },
  {
    text: 'Chat, voice call, video call, track, and use GPS navigation - for free',
    image: require('../assets/new/amico2.png'),
  },
  {
    text: 'Share location with SeeMe - anywhere in the world',
    image: require('../assets/new/amico3.png'),
  },
];

export default function App() {
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      flatListIndex.value = viewableItems[0].index ?? 0;
    },
    []
  );

  const viewabilityConfigCallbackPairs = useRef([
    { onViewableItemsChanged },
  ]);
  
  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(({item,index,}) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x]
  );
  return (
    <SafeAreaView style={[styles.container, GlobalStyles.safeAreaContainer]}>
      <KeyboardAvoidingView style={GlobalStyles.keyboardViewContainer}  enabled>
      <ScrollView
          style={GlobalStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled={true}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        //onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfigCallbackPairs={
          viewabilityConfigCallbackPairs.current
        }
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
      </View>
      </ScrollView>
      <View style={styles.bottomContainerBottom}>
      <Button
          currentIndex={flatListIndex}
          length={pages.length}
          flatListRef={flatListRef}
        />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop:20
  },
  bottomContainerBottom: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop:20,
    width:'100%'
  },
});