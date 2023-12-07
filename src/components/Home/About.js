import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
var {width} = Dimensions.get('window');
var height = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import HTML, {RenderHTML} from 'react-native-render-html';
import WebView from 'react-native-webview';
import {URI} from '../../../Redux/URI';

export default function About({route, navigation}) {
  const [click, setClick] = useState(false);
  const [data, setData] = useState();
  const getSet = async () => {
    try {
      const response = await axios.get(`${URI}api/setting/`, {
        // params:{
        // },
      });
      // console.log(response);
      setData(response.data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getSet();
  }, []);

  return (
    <>
      {data &&
        data.map(item => {
          return (
            <>
              <View
                style={{
                  elevation: 8,
                  backgroundColor: '#fff',
                  width: width * 1,
                }}>
                <View style={styles.productDetailsTop}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" color="#333" size={30} />
                  </TouchableOpacity>
                  {click ? (
                    <Icon
                      name="heart"
                      size={30}
                      style={{
                        marginRight: 10,
                        color: 'crimson',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                      }}
                      onPress={() => setClick(!click)}
                    />
                  ) : (
                    // <Image
                    //   size={30}
                    //   source={{
                    //     uri:
                    //       'http://1252.168.1.8:8080/ikm/web/uploads/setting/' +
                    //       item.logo,
                    //   }}
                    //   style={{
                    //     marginRight: 10,
                    //     color: '#333',
                    //     position: 'absolute',
                    //     bottom: 0,
                    //     right: 0,
                    //   }}
                    // />
                    <Icon
                      name=""
                      size={30}
                      style={{
                        marginRight: 10,
                        color: '#333',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                      }}
                      onPress={() => setClick(!click)}
                    />
                  )}
                </View>
                <ScrollView
                  style={styles.container}
                  showsVerticalScrollIndicator={false}>
                  <View style={styles.swiper}>
                    <Swiper
                      showButtons={true}
                      autoplay={true}
                      autoplayTimeout={4}>
                      <Image
                        source={{
                          uri: `${URI}uploads/setting/` + item.banner,
                        }}
                        style={styles.banner}
                      />
                    </Swiper>
                  </View>
                  {/* <Banner/> */}
                  <View style={styles.details_box}>
                    <View style={styles.details}>
                      <View>
                        <Text
                          style={{
                            color: '#333',
                            fontSize: 20,
                            fontWeight: '600',
                          }}>
                          {item.judul_web}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#555',
                            fontSize: 15,
                            fontWeight: '600',
                            textDecorationLine: 'line-through',
                            marginRight: 10,
                            marginBottom: 10,
                          }}>
                          {/* {route.params?.item.offerPrice.length === 0 ? null : "$" + route.params?.item.offerPrice} */}
                        </Text>
                        <Text
                          style={{
                            color: '#333',
                            fontSize: 18,
                            fontWeight: '600',
                          }}>
                          {/* ${route.params?.produk.harga} */}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.description}>
                      {/* <Text
                        style={{
                          color: '#555',
                          fontSize: 15,
                          fontWeight: '500',
                          lineHeight: 20,
                          paddingTop: 10,
                        }}>
                        {item.tentang_kami}
                      </Text> */}
                      <RenderHTML
                        style={{
                          color: '#555',
                          fontSize: 15,
                          fontWeight: '500',
                          lineHeight: 20,
                          paddingTop: 10,
                        }}
                        source={{html: item.tentang_kami}}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          color: '#333',
                          fontSize: 20,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}>
                        Visi
                      </Text>
                    </View>
                    <View>
                      <RenderHTML
                        style={{
                          color: '#555',
                          fontSize: 15,
                          fontWeight: '500',
                          lineHeight: 20,
                          paddingTop: 10,
                        }}
                        source={{html: item.visi}}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          color: '#333',
                          fontSize: 20,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}>
                        Misi
                      </Text>
                    </View>
                    <View>
                      <RenderHTML
                        style={{
                          color: '#555',
                          fontSize: 15,
                          fontWeight: '500',
                          lineHeight: 20,
                          paddingTop: 10,
                        }}
                        source={{html: item.misi}}
                      />
                    </View>
                    <View style={{marginTop: 100}}></View>
                  </View>
                </ScrollView>
              </View>
            </>
          );
        })}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 1,
    height: height * 1,
    backgroundColor: '#fff',
  },
  productDetailsTop: {
    width: width * 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: width / 6 - 20,
    paddingHorizontal: 10,
    elevation: 8,
    backgroundColor: '#fff',
  },
  banner: {
    width: width * 1,
    height: width / 2 - 20,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  swiper: {
    width: width * 1,
    height: width / 2,
    backgroundColor: '#fff',
    position: 'relative',
  },
  details_box: {
    backgroundColor: '#e5e5e5',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: height / 8 - 60,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
  quantity: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  quantityBox: {
    width: 40,
    height: 40,
    backgroundColor: '#3BB77E',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  button: {
    width: '70%',
    backgroundColor: '#3BB77E',
    height: 50,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  submitButton: {
    width: '70%',
    backgroundColor: '#3BB77E',
    marginTop: 20,
    borderRadius: 5,
    paddingVertical: 15,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  reviews: {
    marginTop: 10,
    width: width * 1,
    padding: 20,
  },
});
