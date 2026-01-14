import * as React from 'react';
import {StyleSheet, View,ScrollView,KeyboardAvoidingView} from 'react-native';
import { AppColors } from '../utils/Constants';


export default function RootView() {
  return (
    <View style={styles.container}>
      <ScrollView style={{flex:1}}>
            <KeyboardAvoidingView
                behavior={"padding"}
                contentContainerStyle={{ flex: 1}}>
            </KeyboardAvoidingView>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:AppColors.background,
    height:'auto',
    padding:20,
    margin:20,
    borderRadius:20
  }
});
