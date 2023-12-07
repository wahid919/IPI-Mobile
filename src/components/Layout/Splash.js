import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  ImageBackground,
  Text,
} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

var {width} = Dimensions.get('window');
var height = Dimensions.get('window').height;

export default function Splash() {
  return (
    <ImageBackground
      source={require('../../Assets/splash/background_splash.jpg')}
      style={styles.container}>
      <View>
        <Image
          source={require('../../Assets/splash/ipilogowhite.png')}
          style={styles.img}
        />
      </View>
      <Text
        style={{
          marginTop: '-24%',
          fontSize: 25,
          fontWeight: '700',
          textAlign: 'center',
          color: 'white',
          textAlignVertical: 'center',
        }}>
        IKATAN PESANTREN INDONESIA
      </Text>
      <LottieView
        source={require('../../Assets/splash/loader.json')}
        autoPlay
        loop
        style={styles.loader}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height * 1,
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    // backgroundColor: '#fff',
    width: width * 1 - 150,
    height: 200,
    marginTop: '-15%',
    resizeMode: 'contain',
    marginBottom: 100,
  },
  loader: {
    position: 'absolute',
    bottom: -180,
    // left: 10,
  },
});
