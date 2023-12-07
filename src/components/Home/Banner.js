import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';
import {useState} from 'react';
import {useEffect} from 'react';

var {width} = Dimensions.get('window');

export default function Banner() {
  const [BannerData, setBannerData] = useState([]);

  useEffect(() => {
    setBannerData([
      'https://simadrasah.com/wp-content/uploads/2021/01/Download-Logo-Harlah-NU-ke-95-CDR-PNG-Tahun-2021.jpg',
      'https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2021/01/30/2245395923.png',
    ]);
    return () => {
      setBannerData([]);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            showButtons={false}
            autoplay={true}
            autoplayTimeout={4}
            style={{
              height: width / 2,
            }}>
            {BannerData.map(item => {
              return (
                <Image
                  key={item}
                  resizeMode="contain"
                  source={{uri: item}}
                  style={styles.banner}
                />
              );
            })}
          </Swiper>
          <View style={{height: 20}}></View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '',
    // #e5e5e5
  },
  swiper: {
    width: width,
    marginTop: '5%',
    alignItems: 'center',
  },
  banner: {
    height: width / 2.1,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});
