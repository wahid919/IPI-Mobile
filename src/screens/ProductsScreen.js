import {StyleSheet, Text, ScrollView, View} from 'react-native';
import React from 'react';
import Header from '../components/Layout/Header';
import FilterProducts from '../components/Products/FilterProducts';
import Banner from '../components/Home/Banner';

export default function ProductsScreen({navigation}) {
  return (
    <View>
      <Header navigation={navigation} />
      <ScrollView>
        <Banner />
        <FilterProducts navigation={navigation} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
