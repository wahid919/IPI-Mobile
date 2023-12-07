import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import Header from '../components/Layout/Header';
import Banner from '../components/Home/Banner';
import Cart from '../components/Cart/Cart';

export default function CartScreen({navigation}) {
  return (
    <View style={{paddingBottom: 20}}>
      <Header navigation={navigation} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Cart navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
