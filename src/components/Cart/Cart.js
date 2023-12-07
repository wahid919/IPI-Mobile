// import React, {Component} from 'react';
// import {View, Text, Button, TouchableOpacity} from 'react-native';
// import {URI} from './Redux/URI';
// import {WebView} from 'react-native-webview';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from 'react-native-screens/native-stack';
// import HomeScreen from '../../screens/HomeScreen';

// const Stack = createNativeStackNavigator();

// class Cart extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       webViewVisible: false,
//       paymentUrl: '',
//       paymentStatus: null,
//     };
//   }

//   generateOrderId = () => {
//     const orderID = Math.floor(Math.random() * 1000000);
//     return orderID;
//   };

//   handlePayment = async () => {
//     try {
//       const orderId = this.generateOrderId();

//       const response = await fetch(`${URI}api/pembayaran/create-payment`, {
//         method: 'POST',
//         headers: {
//           'Accept-type': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: 100000,
//           orderId: orderId,
//         }),
//       });

//       const {token} = await response.json();

//       const paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`;
//       this.setState({paymentUrl: paymentUrl, webViewVisible: true});
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   handlePaymentStatus = status => {
//     this.setState({paymentStatus: status});

//     if (status === 'success') {
//       this.props.navigation.navigate('HomeScreen');
//     } else {
//       this.props.navigation.navigate('HomeScreen');
//     }

//     this.setState({webViewVisible: false});
//   };

//   render() {
//     const {webViewVisible, paymentUrl, paymentStatus} = this.state;
//     return (
//       <View style={{flex: 1}}>
//         {!webViewVisible && (
//           <TouchableOpacity onPress={this.handlePayment}>
//             <View style={{backgroundColor: 'blue', padding: 10}}>
//               <Text style={{color: 'white'}}>Make Payment</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//         {webViewVisible && (
//           <WebView
//             source={{uri: paymentUrl}}
//             onMessage={event =>
//               this.handlePaymentStatus(event.nativeEvent.data)
//             }
//           />
//         )}
//         {!webViewVisible && paymentStatus && (
//           <View>
//             {paymentStatus === 'success' && <Text>Pembayaran berhasil!</Text>}
//             {paymentStatus === 'failure' && <Text>Pembayaran gagal!</Text>}
//             <TouchableOpacity
//               onPress={() => {
//                 navigation.navigate('HomeScreen');
//               }}>
//               <View style={{backgroundColor: 'blue', padding: 10}}>
//                 <Text style={{color: 'white'}}>Kembali ke Halaman Lain</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     );
//   }
// }
// export default Cart;
// import React, {useRef, useState} from 'react';
// import {View, TouchableOpacity, Text} from 'react-native';
// import WebView from 'react-native-webview';
// import {URI} from '../../../Redux/URI';
// const PaymentScreen = () => {
//   const webViewRef = useRef(null);
//   const [paymentUrl, setPaymentUrl] = useState('');
//   const generateOrderId = () => {
//     const orderId = Math.floor(Math.random() * 1000000);
//     return orderId;
//   };
//   const handlePayment = async () => {
//     const orderId = generateOrderId();
//     const response = await fetch(`${URI}api/pembayaran/create-payment`, {
//       method: 'POST',
//       headers: {
//         'Accept-type': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         amount: 100000,
//         orderId: orderId,
//       }),
//     });

//     const {token} = await response.json();
//     setPaymentUrl(paymentUrl);
//     if (token) {
//       // Buka halaman pembayaran menggunakan WebView dan Midtrans Snap
//       const paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`;
//       webViewRef.current.injectJavaScript(
//         `window.location.href = "${paymentUrl}";`,
//       );
//     }
//   };

//   const handleWebViewMessage = event => {
//     const data = JSON.parse(event.nativeEvent.data);

//     if (data.status_code === '200') {
//       // Pembayaran sukses, tutup WebView dan arahkan ke halaman lain
//       webViewRef.current.stopLoading();
//       // Navigasi ke halaman lain di React Native (ganti 'NextScreen' dengan nama komponen halaman selanjutnya)
//       navigation.navigate('HomeScreen');
//     }
//   };

//   return (
//     <View>
//       <TouchableOpacity onPress={handlePayment}>
//         <Text>Bayar</Text>
//       </TouchableOpacity>
//       <WebView
//         ref={webViewRef}
//         source={{
//           uri: paymentUrl,
//         }} // Ganti dengan URL yang sesuai dengan kebutuhan Anda
//         onMessage={handleWebViewMessage}
//       />
//     </View>
//   );
// };

// export default PaymentScreen;

//
//
//
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   TouchableOpacity,
//   TouchableHighlight,
// } from 'react-native';
// import {URI} from '../Redux/URI';
// import {WebView} from 'react-native-webview';
// import {useNavigation} from '@react-navigation/native';

// export default function PaymentScreen() {
//   const navigation = useNavigation();
//   const [webViewVisible, setWebViewVisible] = useState(false);
//   const [paymentUrl, setPaymentUrl] = useState('');
//   const [paymentStatus, setPaymentStatus] = useState(null);

//   const generateOrderId = () => {
//     const orderId = Math.floor(Math.random() * 1000000);
//     return orderId;
//   };

//   const handlePayment = async () => {
//     try {
//       const orderId = generateOrderId();

//       const response = await fetch(`${URI}api/pembayaran/create-payment`, {
//         method: 'POST',
//         headers: {
//           'Accept-type': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           amount: 100000,
//           orderId: orderId,
//         }),
//       });

//       const {token} = await response.json();

//       const paymentUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`;
//       setPaymentUrl(paymentUrl);
//       setWebViewVisible(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handlePaymentStatus = status => {
//     setPaymentStatus(status);

//     if (status === 'success') {
//       navigation.navigate('HomeScreen');
//     } else {
//       navigation.navigate('HomeScreen');
//     }

//     setWebViewVisible(false);
//   };

//   return (
//     <View style={{flex: 1}}>
//       {!webViewVisible && (
//         <View>
//           <TouchableHighlight
//             onPress={handlePayment}
//             style={{backgroundColor: 'blue', padding: 10}}>
//             {/* <Text style={{fontSize: 18, color: '#fff', fontWeight: '600'}}>
//               Bayar
//             </Text> */}
//           </TouchableHighlight>
//         </View>
//       )}
//       {webViewVisible && (
//         <WebView
//           source={{uri: paymentUrl}}
//           onMessage={event => handlePaymentStatus(event.nativeEvent.data)}
//         />
//       )}
//       {!webViewVisible && paymentStatus && (
//         <View>
//           {paymentStatus === 'success' && <Text>Pembayaran berhasil!</Text>}
//           {paymentStatus === 'failure' && <Text>Pembayaran gagal!</Text>}
//           <TouchableHighlight
//             onPress={() => {
//               navigation.navigate('HomeScreen');
//             }}
//             style={{backgroundColor: 'blue', padding: 10}}>
//             {/* <Text style={{fontSize: 18, color: '#fff', fontWeight: '600'}}>
//               Kembali ke Halaman Lain
//             </Text> */}
//           </TouchableHighlight>
//         </View>
//       )}
//     </View>
//   );
// }
//
//
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {removeCart, updateCart} from '../../../Redux/Actions/ProductAction';
import {useEffect} from 'react';
import {URI} from '../../../Redux/URI';
import axios from 'axios';
import {FormatRupiah} from '@arismun/format-rupiah';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default function Cart({navigation}) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [jumlah, setQuantity] = useState(1);
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    getCartData();
    setRefreshing(false);
  };

  const [cartData, setCartData] = useState([]);
  const getCartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URI}api/keranjang/list-keranjang?id=` + user.id,
      );
      if (response.data.success) {
        const cartData = await Promise.all(
          response.data.cart.map(async item => {
            const productResponse = await axios.get(
              `${URI}api/keranjang/product-cart?id=` + item.produk_id,
            );
            const productData = productResponse.data.procart;
            console.log(productData.foto_banner);
            return {
              ...item,
              nama: productData.nama,
              image: productData.banner_produk,
            };
          }),
        );
        setTimeout(() => {
          setCartData(cartData);
          setLoading(false);
        }, 500);
        // const res = await axios.get(
        //   `${URI}api/keranjang/list-keranjang?id=` + user.id,
        // );
        // setCartData(res.data.cart);
      } else {
        setLoading(false);
        console.log(response.data.message);
      }
    } catch (error) {
      alert(error.message);
    }
    setRefreshing(false);
  };
  // console.log(cartData);

  useEffect(() => {
    getCartData();
  }, []);

  // useEffect(() => {
  //   setTotalPrice(
  //     cartData.reduce((total, item) => total + item.harga * item.jumlah, 0),
  //   );
  //   if (cartData.length > 0) {
  //     cartData.map(item => {
  //       setQuantity(item.jumlah);
  //     });
  //   }
  // }, [cartData, jumlah]);

  const incrementQuantity = item => {
    const updatedCart = [...cartData];
    const selectedItem = updatedCart.find(cartData => cartData.id === item.id);
    selectedItem.jumlah += 1;
    setCartData(updatedCart);
  };

  const decrementQuantity = item => {
    const updatedCart = [...cartData];
    const selectedItem = updatedCart.find(cartData => cartData.id === item.id);
    if (selectedItem.jumlah > 1) {
      selectedItem.jumlah -= 1;
      setCartData(updatedCart);
    }
  };

  const removeItem = async item => {
    const id = item.id;
    console.log(id);
    await dispatch(removeCart(id));
    ToastAndroid.showWithGravity(
      `${item.nama} removed from cart`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
    const updatedCart = cartData.filter(cartItem => cartItem.id !== item.id);
    setCartData(updatedCart);
  };

  const calculateTotal = () => {
    let total = 0;
    cartData.forEach(item => {
      total += item.harga * item.jumlah;
    });
    return total;
  };

  console.log(cartData);

  const renderItem = ({item}) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{
            uri: item.image,
          }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.nama}</Text>
          <Text style={styles.itemColor}>Color: {item.variant1}</Text>
          <Text style={styles.itemSize}>Size: {item.variant2}</Text>
          <Text style={styles.itemPrice}>
            <FormatRupiah value={item.harga} />
          </Text>
        </View>
        <View style={styles.itemQuantity}>
          <TouchableOpacity onPress={() => decrementQuantity(item)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.jumlah}</Text>
          <TouchableOpacity onPress={() => incrementQuantity(item)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeItem(item)}>
          <Icon
            name="ios-trash"
            size={30}
            color="crimson"
            style={{marginHorizontal: 10}}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderFooter = () => (
    <View>
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalText}>Total:</Text>
          <Text style={styles.footerTotalPrice}>
            <FormatRupiah value={calculateTotal()} />
          </Text>
        </View>
      </View>
      <View style={styles.footerBottom}>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate('Products')}>
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('OrderScreen')}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{flexGrow: 1}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      scrollEventThrottle={1000}>
      {loading ? (
        // Tampilan memuat (loading)
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : cartData === null ? (
        <View
          style={{
            height: height * 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#333', fontSize: 20, textAlign: 'center'}}>
            Your Cart is empty 😢
          </Text>
        </View>
      ) : (
        <FlatList
          data={cartData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={renderFooter}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width: width,
    padding: 15,
    marginVertical: 10,
    marginBottom: height / 4 - 60,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemColor: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 2,
  },
  itemSize: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#888888',
  },
  itemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  removeItem: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  // totalContainer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: '#fff',
  //   padding: 10,
  //   borderTopWidth: 1,
  //   borderTopColor: '#ccc',
  //   flexDirection: 'row',
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  // },
  // totalText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    top: -15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 0,
    // backgroundColor: '#fff',
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'none',
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  footerTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  footerTotalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  footerButtons: {
    flexDirection: 'row',
  },
  continueShoppingButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 30,
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: 'green',
    marginHorizontal: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
});
