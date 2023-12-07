import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button,
  Linking,
  ToastAndroid,
  Modal,
} from 'react-native';
import WebView from 'react-native-webview';

// import React, {useEffect, useState} from 'react';
// import {useSelector, useDispatch} from 'react-redux';
// var {width} = Dimensions.get('window');
// var height = Dimensions.get('window').height;
// import Icon from 'react-native-vector-icons/Ionicons';
// import Swiper from 'react-native-swiper';
// import {
//   addCart,
//   addWishList,
//   createReview,
//   getCart,
//   getProduct,
//   removeWishList,
// } from '../../../Redux/Actions/ProductAction';

import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
var {width} = Dimensions.get('window');
var height = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import RenderHTML from 'react-native-render-html';
import {FormatRupiah} from '@arismun/format-rupiah';
import {URI} from '../../../Redux/URI';
import {
  addCart,
  addWishList,
  createReview,
  getCart,
  getProduct,
  removeWishList,
} from '../../../Redux/Actions/ProductAction';

export default function ProductDetails({route, navigation}) {
  const [click, setClick] = useState(false);
  const [cart, setCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // const [data, setData] = useState('');
  const [cartdata, setCartData] = useState();
  const {user} = useSelector(state => state.user);
  const {cartData} = useSelector(state => state.cart);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  // const isi_wa="Saya tertarik dengan produk ini,apakah stok produk "+ route.params?.item.nama +" masih tersedia?";
  // const wa = Linking.openURL('https://wa.me/' + route.params?.item.toko.no_whatsapp+'?text='+isi_wa);

  const [avgprice, setAvgPrice] = useState([]);
  const [avgrating, setAvgRating] = useState([]);
  const [countreview, setCountReview] = useState([]);
  const [totalstok, setTotalStok] = useState([]);
  const [galeris, setGaleris] = useState([]);
  const [getwarnas, setColors] = useState([]);
  const [getsizes, setSizes] = useState([]);
  const [data, setDetail] = useState([]);
  const [toko, setToko] = useState([]);
  const getData = async () => {
    try {
      // let linkproduk = `${URI}api/produk/list-produk`;
      let res = await fetch(
        `${URI}api/produk/detail-produk?id=` +
          route.params?.item.id +
          '&toko_id=' +
          route.params?.item.toko_id,
        {
          method: 'GET',
          headers: {
            // accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      );
      res = await res.json();
      console.log(res.getwarnas.value);
      // console.log(res.data.deksripsi_lengkap);
      setGaleris(res.photogaleri);
      setColors(res.getwarnas);
      setSizes(res.getsizes);
      setDetail(res.data);
      setAvgPrice(res.averageprice);
      setAvgRating(res.avgrating);
      setCountReview(res.countreview);
      setTotalStok(res.totalstok);
      setToko(res.toko);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    // getKategori();
    getData();
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const [modalMaps, setModalMaps] = useState(false);
  const latitude = toko.latitude; // Koordinat lintang
  const longitude = toko.longitude; // Koordinat bujur

  const openMaps = () => {
    setModalMaps(true);
  };

  const detailProduk = {
    nama: route.params?.item.nama,
    gambar: route.params?.item.foto_banner,
    harga: 100000,
    // stok: 10,
    // warna: ['red', 'blue', 'green'],
    // ukuran: ['S', 'M', 'L'],
    // colors: {getwarnas &&
    //   getwarnas.map(item => {
    //     return (
    //       <>
    //         <View>
    //           <Text>{item.value}</Text>
    //         </View>
    //       </>
    //     );
    //   })}
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Green', 'Blue'],
    stock: {
      L: {
        black: 10,
        orange: 5,
        blue: 8,
      },
      XL: {
        black: 4,
        orange: 3,
        blue: 1,
      },
      S: {
        black: 12,
        orange: 1,
        blue: 9,
      },
    },
  };

  const getStock = () => {
    if (selectedSize && selectedColor) {
      return detailProduk.stock[selectedSize][selectedColor];
    }
    return 0;
  };

  console.log('hao');
  const produk_id = route.params?.item.id.toString();
  const user_id = user.id.toString();
  const variant1 = selectedColor.toString();
  const variant2 = selectedSize.toString();
  const harga = detailProduk.harga.toString();
  const jumlah = quantity.toString();

  // addToCartHandler
  const addToCartHandler = async () => {
    if (!variant1 || !variant2) {
      ToastAndroid.showWithGravity(
        `Silahkan pilih warna dan ukuran terlebih dahulu`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else {
      await dispatch(
        addCart(produk_id, user_id, variant1, variant2, harga, jumlah),
      );
      ToastAndroid.showWithGravity(
        `${route.params?.item.nama} berhasil ditambahkan kekeranjang`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  // cartAlreadyAdded handler
  const cartAlreadyAdded = () => {
    ToastAndroid.showWithGravity(
      route.params?.item.Stock === 0
        ? `${route.params?.item.name} out of stock`
        : `${route.params?.item.name} already have in cart`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  // decreaseQuantity handler
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // increaseQuantity handler
  const increaseQuantity = () => {
    if (getStock() - 1 < quantity) {
      ToastAndroid.showWithGravity(
        `${route.params?.item.nama} stok Habis`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else {
      setQuantity(quantity + 1);
    }
  };

  return (
    <>
      <View
        style={{
          elevation: 8,
          backgroundColor: 'white',
          width: width * 1,
        }}>
        <View style={styles.productDetailsTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{flexDirection: 'row'}}>
            <Icon name="arrow-back" color="white" size={30} />
            <Text
              style={{
                marginLeft: 10,
                top: 3,
                color: 'white',
                fontSize: 18,
                fontWeight: 700,
              }}>
              Detail Product
            </Text>
          </TouchableOpacity>
          {/* {click ? (
            <Icon
              name="heart"
              size={30}
              style={{
                marginRight: 10,
                color: 'crimson',
                position: 'absolute',
                bottom: 10,
                right: 0,
              }}
              onPress={() => setClick(!click)}
            />
          ) : (
            <Icon
              name="heart-outline"
              size={30}
              style={{
                marginRight: 10,
                color: '#333',
                position: 'absolute',
                bottom: 10,
                right: 0,
              }}
              onPress={() => setClick(!click)}
            />
          )} */}
        </View>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <View style={styles.swiper}>
            <Swiper showButtons={true} autoplay={true} autoplayTimeout={4}>
              {galeris.map(i => (
                <Image
                  source={{uri: i.foto}}
                  style={styles.banner}
                  key={i.id}
                />
              ))}
            </Swiper>
            <View
              style={{
                paddingTop: 20,
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  paddingLeft: 20,
                  paddingBottom: 14,
                  color: '#242424',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                {route.params?.item.nama}
              </Text>
              <Text
                style={{
                  paddingLeft: 20,
                  paddingTop: 0,
                  color: '#bfbfbf',
                  fontSize: 16,
                  fontWeight: '600',
                  textDecorationLine: 'line-through',
                }}>
                <FormatRupiah value={avgprice} />
              </Text>
              <Text
                style={{
                  paddingTop: -7,
                  paddingLeft: 20,
                  color: '#242424',
                  fontSize: 25,
                  fontWeight: '800',
                }}>
                <FormatRupiah value={avgprice} />
              </Text>
              <View
                style={{
                  paddingTop: 7,
                  paddingBottom: 1,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  name="star"
                  color="#C68600"
                  size={18}
                  style={{marginHorizontal: 2}}
                />
                <Text
                  style={{
                    // paddingLeft: 20,
                    paddingTop: 0,
                    color: '#bfbfbf',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {avgrating !== null
                    ? parseFloat(avgrating).toFixed(1)
                    : '0.0'}
                </Text>
                <Text
                  style={{
                    paddingLeft: 15,
                    paddingTop: 0,
                    color: '#bfbfbf',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {countreview} Ulasan
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Beli</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.details_box}>
            <View style={styles.details}>
              <View style={styles.imageBanner}>
                <Image
                  source={{uri: route.params?.item.foto_banner}}
                  style={styles.imageBannerChild}
                />
              </View>
              <View style={{marginLeft: -40, width: '50%'}}>
                <Text
                  style={{
                    color: '#242424',
                    fontSize: 18,
                    fontWeight: '700',
                  }}>
                  {toko.nama}
                </Text>
                <Text
                  style={{
                    color: '#242424',
                    fontSize: 14,
                    fontWeight: '400',
                  }}>
                  {toko.alamat}
                </Text>
                <Text
                  style={{
                    color: '#242424',
                    fontSize: 14,
                    fontWeight: '400',
                  }}>
                  Online
                </Text>
              </View>
              <View style={styles.imageBanner}>
                <TouchableOpacity onPress={openMaps}>
                  <Image
                    source={require('../../Assets/map.png')}
                    // source={{uri: route.params?.item.foto_banner}}
                    style={styles.imageMaps}
                  />
                </TouchableOpacity>
              </View>
              <Modal visible={modalMaps} animationType="slide">
                <View style={{flex: 1}}>
                  <WebView
                    source={{
                      uri: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
                    }}
                  />
                  <Button title="Close" onPress={() => setModalMaps(false)} />
                </View>
              </Modal>
            </View>
          </View>
          <View style={styles.details_desccrption}>
            <View style={styles.details}>
              <View>
                <Text
                  style={{
                    // paddingBottom: 14,
                    color: '#242424',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  Product Description
                </Text>
              </View>
            </View>
            <View style={styles.description}>
              {/* <Text
              style={{
                color: '#333',
                fontSize: 18,
                fontWeight: '600',
              }}>
              Description
            </Text> */}
              <RenderHTML
                style={{
                  color: '#555',
                  fontSize: 14,
                  fontWeight: '500',
                  lineHeight: 20,
                  paddingTop: 10,
                }}
                source={{html: route.params?.item.deksripsi_lengkap}}
              />
            </View>
          </View>
          <View style={styles.details_box}>
            <View style={styles.details}>
              <View>
                <Text
                  style={{
                    color: '#333',
                    fontSize: 20,
                    fontWeight: '600',
                  }}>
                  {route.params?.item.nama}
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
                  {/* {route.params?.item.diskon.length === 0
                  ? null
                  : '$' + route.params?.item.offerPrice} */}
                </Text>
                <Text
                  style={{
                    color: '#333',
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  <FormatRupiah value={avgprice} />
                </Text>
              </View>
            </View>
            <View style={styles.description}>
              {/* <Text
              style={{
                color: '#333',
                fontSize: 18,
                fontWeight: '600',
              }}>
              Description
            </Text> */}
              <RenderHTML
                style={{
                  color: '#555',
                  fontSize: 15,
                  fontWeight: '500',
                  lineHeight: 20,
                  paddingTop: 10,
                }}
                source={{html: route.params?.item.deksripsi_lengkap}}
              />
            </View>
            {/* <View style={styles.quantity}>
              <TouchableOpacity onPress={decreaseQuantity}>
                <View style={styles.quantityBox}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#fff',
                      fontWeight: '800',
                    }}>
                    -
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#333',
                    fontSize: 16,
                  }}>
                  {quantity.toString()}
                </Text>
              </View>
              <TouchableOpacity onPress={increaseQuantity}>
                <View style={styles.quantityBox}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#fff',
                      fontWeight: '800',
                    }}>
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}
            <View
              style={{
                width: width * 1 - 30,
                alignItems: 'center',
              }}>
              <View style={styles.button}>
                {/* <Button
                title="preess mee"
                color="#f194ff"
                onPress={() => alert}
              /> */}
                {/* {route.params?.item.toko.map(i => ( */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://wa.me/' +
                        route.params?.item.toko.no_whatsapp +
                        '?text=Saya tertarik dengan produk ini,apakah stok produk ' +
                        route.params?.item.nama +
                        ' masih tersedia?',
                    )
                  }>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#fff',
                        fontWeight: '600',
                      }}>
                      Masukkan Ke keranjang
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                {/* ))} */}
              </View>
              <View style={styles.reviews}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#333',
                    fontWeight: '600',
                  }}>
                  Reviews
                </Text>
                {/* {route.params?.item.reviews.length === 0 ? (
                <Text
                  style={{
                    textAlign: 'center',
                    paddingTop: 5,
                    color: '#333',
                  }}>
                  No reviews have yet...
                </Text>
               ) : (
                <View>
                  {route.params?.item.reviews.map(i => (
                    <View
                      key={i._id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        paddingVertical: 5,
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#333',
                          fontWeight: '700',
                          paddingLeft: 5,
                        }}>
                        {i.name}
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#555',
                            fontWeight: '600',
                            paddingLeft: 5,
                          }}>
                          {'  '}
                          {i.comment}
                        </Text>
                      </Text>
                      <Icon name="star" color="#C68600" size={18} />
                      <Text style={{color: '#333'}}>({i.rating})</Text>
                    </View>
                  ))}
                </View>
              )} */}
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#555',
                      fontWeight: '600',
                      paddingRight: 10,
                    }}>
                    Your Ratings*
                  </Text>
                  <Icon
                    name="star-outline"
                    color="#C68600"
                    size={18}
                    style={{marginHorizontal: 2}}
                  />
                  <Icon
                    name="star-outline"
                    color="#C68600"
                    size={18}
                    style={{marginHorizontal: 2}}
                  />
                  <Icon
                    name="star-outline"
                    color="#C68600"
                    size={18}
                    style={{marginHorizontal: 2}}
                  />
                  <Icon
                    name="star-outline"
                    color="#C68600"
                    size={18}
                    style={{marginHorizontal: 2}}
                  />
                  <Icon
                    name="star-outline"
                    color="#C68600"
                    size={18}
                    style={{marginHorizontal: 2}}
                  />
                </View>
                <View
                  style={{
                    marginTop: 10,
                    height: 100,
                  }}>
                  <TextInput
                    keyboardType="default"
                    placeholder="Add your comment..."
                    placeholderTextColor="#333"
                    textAlignVertical="top"
                    style={{
                      borderWidth: 1,
                      paddingLeft: 10,
                      color: '#333',
                      borderRadius: 5,
                      borderColor: '#0000002b',
                      height: '100%',
                    }}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={styles.submitButton}>Submit</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Icon
                name="close"
                size={40}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 0,
                  backgroundColor: '#555555',
                  padding: 2,
                  borderRadius: 50,
                  marginRight: 10,
                  color: '#999999',
                  zIndex: 111,
                  // flexDirection: 'row',
                  // alignItems: 'flex-end',
                  // justifyContent: 'center',
                }}
                onPress={() => setModalVisible(false)}
              />

              <Image
                source={{uri: detailProduk.gambar}}
                style={styles.modalGambarProduk}
              />
              <View style={styles.modalContentDetail}>
                <Text style={styles.modalLabel}>
                  Nama Produk: {detailProduk.nama}
                </Text>
                <Text style={styles.modalLabel}>
                  Harga: {detailProduk.harga}
                </Text>
                <Text style={styles.stock}>Stok: {getStock()}</Text>

                <Text style={styles.modalLabel}>Pilih Warna:</Text>
                <View style={styles.colorContainer}>
                  {getwarnas.map((getwarnas, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedColor(getwarnas.value)}
                      style={[
                        styles.colorButton,
                        {backgroundColor: getwarnas.value.toLowerCase()},
                      ]}
                    />
                  ))}
                </View>
                {/* <View style={styles.colorContainer}>
                {detailProduk.colors.map((colors, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedColor(colors)}
                    style={[
                      styles.colorButton,
                      {backgroundColor: colors.toLowerCase()},
                    ]}
                  />
                ))}
              </View> */}
                <Text style={styles.modalLabel}>Pilih Ukuran:</Text>
                <View style={styles.sizeContainer}>
                  {getsizes.map((getsizes, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedSize(getsizes.value)}
                      warnapick={() => setSelectedSize(getsizes.value)}
                      style={styles.sizeButton}>
                      <Text style={styles.sizeText}>{getsizes.value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* <View style={styles.sizeContainer}>
                {detailProduk.sizes.map((sizes, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSize(sizes)}
                    style={styles.sizeButton}>
                    <Text style={styles.sizeText}>{sizes}</Text>
                  </TouchableOpacity>
                ))}
              </View> */}
                <View style={styles.quantity}>
                  <TouchableOpacity onPress={decreaseQuantity}>
                    <View style={styles.quantityBox}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#fff',
                          fontWeight: '800',
                        }}>
                        -
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#333',
                        fontSize: 16,
                      }}>
                      {quantity.toString()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={increaseQuantity}>
                    <View style={styles.quantityBox}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#fff',
                          fontWeight: '800',
                        }}>
                        +
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {cart === true || route.params?.item.stok === 0 ? (
                  <TouchableOpacity
                    onPress={cartAlreadyAdded}
                    style={[
                      styles.button,
                      {
                        backgroundColor: '#000',
                      },
                    ]}>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                          fontWeight: '600',
                        }}>
                        Add to Cart
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={addToCartHandler}
                    style={[
                      styles.button,
                      {
                        backgroundColor: '#3BB77E',
                      },
                    ]}>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: '#fff',
                          fontWeight: '600',
                        }}>
                        Add to Car
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
              {/* <TouchableOpacity
                style={styles.button}
                onPress={addToCartHandler}>
                <Text style={styles.buttonText}>Tambahkan ke Keranjang</Text>
              </TouchableOpacity> */}

              {/* <Button title="Tutup" onPress={() => setModalVisible(false)} /> */}
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 1,
    height: height * 1,
    backgroundColor: '#f5f5f6',
  },
  productDetailsTop: {
    width: width * 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: width / 6 - 10,
    paddingHorizontal: 20,
    elevation: 10,
    backgroundColor: '#009b03',
    //   borderBottomLeftRadius: 10,
    //   borderBottomRightRadius: 10,
  },
  banner: {
    width: '100%',
    height: width / 2 - -90,
    resizeMode: 'cover',
    marginVertical: 30,
    borderRadius: 25,
  },
  swiper: {
    width: '100%',
    height: width / 2 - -280,
    backgroundColor: '#fff',
    position: 'relative',
  },
  buyButton: {
    position: 'absolute',
    right: 20,
    top: -20,
    backgroundColor: '#009b03',
    paddingHorizontal: 50,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // banner: {
  //   width: width * 1,
  //   height: width / 2 - -200,
  //   resizeMode: 'cover',
  //   marginVertical: 10,
  // },
  // swiper: {
  //   width: width * 1,
  //   height: width / 2 - -100,
  //   backgroundColor: '#fff',
  //   position: 'relative',
  //   borderBottomLeftRadius: 10,
  //   borderBottomRightRadius: 10,
  // },
  details_box: {
    backgroundColor: 'white',
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    padding: 20,
    marginTop: 7,
    // marginBottom: height / 8 - 60,
  },
  details_desccrption: {
    backgroundColor: 'white',
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    paddingTop: 10,
    paddingLeft: 20,
    marginTop: 7,
    // marginBottom: height / 8 - 60,
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
    width: '85%',
    backgroundColor: '#3BB77E',
    height: 50,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 8,
    width: '80%',
  },
  modalContentDetail: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalGambarProduk: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    resizeMode: 'cover',
    attachment: 'fixed',
    // repeat: norepeat,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  sizeText: {
    fontSize: 14,
  },
  // button: {
  //   backgroundColor: '#1e90ff',
  //   padding: 10,
  //   borderRadius: 5,
  //   marginTop: 10,
  // },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageBanner: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageBannerChild: {
    width: 80,
    height: 80,
  },
  imageMaps: {
    width: 50,
    height: 50,
  },
});
