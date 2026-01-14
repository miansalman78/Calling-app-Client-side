import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import Button from '../components/Buttons';
import AppHeader from '../components/AppHeader';
// import {scrollViewProperties} from './src/utils/Constants'

export default function SettingScreen({navigation}) {
  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={GlobalStyles.scrollContainerCenter}
        >
        <View style={GlobalStyles.container_start}>
          <AppHeader displaySearch = {false} heading={"Settings"}/>
          <View style={GlobalStyles.paddingAll}>
            <Text style={GlobalStyles.descriptionText}>
              {
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. '
              }
            </Text>
          </View>
          <View style={GlobalStyles.paddingAll}>
            <Text style={GlobalStyles.descriptionText}>
              {
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. '
              }
            </Text>
          </View>



        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 230,
    width: '80%',
  },
});
