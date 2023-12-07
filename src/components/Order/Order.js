import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Button,
} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import OrderSteps from './OrderSteps';
import {useState} from 'react';
import {CardField, useStripe} from '@stripe/stripe-react-native';
import {URI} from '../../../Redux/URI';
import axios from 'axios';
import {createOrder} from '../../../Redux/Actions/OrderAction';
import {useEffect} from 'react';
import WebView from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {FormatRupiah} from '@arismun/format-rupiah';

const {width} = Dimensions.get('window');
const height = Dimensions.get('window').height;
// const {width, height} = Dimensions.get('window');

export default function Order({navigation}) {
  // const {cartData} = useSelector(state => state.cart);

  const {user} = useSelector(state => state.user);
  const [active, setActive] = useState(1);
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [countryName, setCountryName] = useState('');
  const [cityName, setCityName] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [success, setSuccess] = useState(false);

  const [cartData, setCartData] = useState([]);
  const [listKurir, setListKurir] = useState(['JNE', 'JET']);
  const [pengiriman, setPengiriman] = useState();
  function groupBy(list, keyGetter) {
    const map = {};
    list.forEach(item => {
      const key = keyGetter(item);
      const collection = map[key];
      if (!collection) {
        map[key] = [item];
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  const getCartData = async () => {
    try {
      const response = await axios.get(
        `${URI}api/keranjang/list-keranjang?id=` + user.id,
      );
      if (response.data.success) {
        var cartData = await Promise.all(
          response.data.cart.map(async item => {
            const productResponse = await axios.get(
              `${URI}api/keranjang/product-cart?id=` + item.produk_id,
            );
            const productData = productResponse.data.procart;
            console.log(productData.toko_nama);
            return {
              ...item,
              nama: productData.nama,
              namatoko: productData.toko_nama,
              image: productData.banner_produk,
              tokoId: productData.toko_id,
            };
          }),
        );

        cartData = groupBy(cartData, cartData => cartData.tokoId);
        var pengiriman = {};
        Object.keys(cartData).forEach(tokoId => {
          pengiriman[tokoId] = {
            pilihanKurir: null,
            isOpen: false,
          };
        });

        console.log(cartData);
        setCartData(cartData);
        setPengiriman(pengiriman);
      } else {
        console.log(response.data.cart);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  // console.log(cartData);

  useEffect(() => {
    getCartData();
  }, []);
  // useEffect(() => {
  //   createPayment();
  // }, []);

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cartData).forEach(tokoId => {
      cartData[tokoId].forEach(item => {
        total += item.harga * item.jumlah;
      });
    });
    return total;
  };

  // const totalPrice = calculateTotal;
  // // Be make sure that add it's on top
  // const totalPrice = cartData.reduce((acc, curr) => acc + curr.productPrice, 0);

  // const totalPrice = () => {
  //   let total = 0;
  //   Object.keys(cartData).forEach(item => {
  //     total += item.harga * item.jumlah;
  //   });
  //   return total;
  // };
  const totalPrice = calculateTotal();
  console.log(totalPrice);

  // const paymentData = {
  //   amount: Math.round(totalPrice * 100),
  // };

  const {createPaymentMethod} = useStripe();
  const dispatch = useDispatch();

  const order = {
    shippingInfo: {
      address,
      city: cityName,
      country: countryName,
      state,
    },
    phoneNumber,
    orderItems: cartData,
    itemsPrice: subtotal,
    shippingPrice: totalPrice > 100 ? 0 : 10,
    totalPrice: totalPrice,
  };

  const shippingDetailsHandler = () => {
    if (
      address.length > 0 &&
      phoneNumber.length > 0 &&
      countryName.length > 0 &&
      cityName.length > 0 &&
      state.length > 0
    ) {
      setActive(2);
    } else {
      ToastAndroid.showWithGravity(
        'Please fill all the fields',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };

  const confirmOrderHandler = () => {
    if (Object.keys(cartData.length > 0)) {
      setActive(3);
    }
  };

  const submitHandler = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const {data} = await axios.post(
      `${URI}/api/v2/payment/process`,
      paymentData,
      config,
    );
    const clientSecret = data.client_secret;

    const billingDetails = {
      name: user.name,
      email: user.email,
      phone: phoneNumber,
    };

    const paymentIntent = await createPaymentMethod({
      paymentIntentClientSecret: clientSecret,
      paymentMethodType: 'Card',
      paymentMethodData: {
        billingDetails,
      },
    });
    if (paymentIntent.error) {
      ToastAndroid.showWithGravity(
        'Something went wrong',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else if (paymentIntent) {
      order.paymentInfo = {
        id: paymentIntent.paymentMethod.id,
        status: 'success',
      };
      ToastAndroid.showWithGravity(
        'Payment Successful',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      dispatch(createOrder(order));
      setSuccess(true);
    }
  };
  return (
    <View>
      {success === true ? (
        <Success navigation={navigation} />
      ) : (
        <>
          <OrderSteps activeTab={active} />
          {active === 1 ? (
            <ShippingInfo
              activeTab={active}
              address={address}
              setAddress={setAddress}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              countryName={countryName}
              setCountryName={setCountryName}
              cityName={cityName}
              setCityName={setCityName}
              setState={setState}
              state={state}
              shippingDetailsHandler={shippingDetailsHandler}
            />
          ) : active === 2 ? (
            <Confirmation
              cartData={cartData}
              user={user}
              phoneNumber={phoneNumber}
              address={address}
              countryName={countryName}
              listKurir={listKurir}
              pengiriman={pengiriman}
              cityName={cityName}
              confirmOrderHandler={confirmOrderHandler}
              setSubtotal={setSubtotal}
            />
          ) : active === 3 ? (
            <PaymentInfo
              submitHandler={submitHandler}
              totalPrice={totalPrice}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const ShippingInfo = ({
  address,
  setAddress,
  phoneNumber,
  setPhoneNumber,
  countryName,
  setCountryName,
  cityName,
  setCityName,
  shippingDetailsHandler,
  setState,
  state,
}) => {
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    fetchAddressData();
  }, []);

  const {user} = useSelector(state => state.user);
  const fetchAddressData = () => {
    axios
      .get(`${URI}api/alamat/list-alamat/?id=` + user.id)
      .then(response => {
        setAddressList(response.data.alamat);
        console.log(response.data.alamat);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const selectAddress = item => {
    setAddress(item.judul);
    setPhoneNumber(user.nomor_handphone.toString());
    setCountryName(item.alamat);
    setCityName(item.judul);
    setState(item.judul);
    setSelectedAddressId(item.id);
    // Set state dan properti lainnya sesuai kebutuhan Anda
  };

  return (
    <ScrollView style={{marginTop: 10}}>
      <View style={styles.inputMain}>
        <FlatList
          data={addressList}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.addressItem,
                selectedAddressId === item.id && styles.selectedAddressItem,
              ]}
              onPress={() => selectAddress(item)}>
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{user.name}</Text>
                <Text style={styles.phoneText}>{user.nomor_handphone}</Text>
              </View>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontSize: 14,
                  marginRight: 5,
                  marginTop: 7,
                  fontWeight: 600,
                  color: '#666',
                }}>
                {item.judul}
              </Text>
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>
                  {item.alamat}, ({item.kodepos})
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={shippingDetailsHandler}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Confirmation = ({
  cartData,
  user,
  phoneNumber,
  address,
  countryName,
  cityName,
  confirmOrderHandler,
  setSubtotal,
  listKurir,
  pengiriman,
}) => {
  // const [listOpen, setListOpen] = useState({});
  // console.log(pengiriman);
  // const options = listKurir;

  // useEffect(() => {
  //   console.log(pengiriman);
  //   const newListOpen = {};

  //   Object.keys(pengiriman).forEach(tokoId => {
  //     newListOpen[tokoId] = false;
  //   });

  //   setListOpen(newListOpen);
  // }, [pengiriman]);

  // const toggleDropdown = tokoId => {
  //   listOpen[tokoId] = !listOpen[tokoId];
  //   console.log(listOpen[tokoId]);
  // };

  // const selectOption = (option, tokoId) => {
  //   pengiriman[tokoId].pilihanKurir = option;
  //   listOpen[tokoId] = false;
  // };

  const calculateTotal = () => {
    let total = 0;
    Object.keys(cartData).forEach(tokoId => {
      cartData[tokoId].forEach(item => {
        total += item.harga * item.jumlah;
      });
    });
    return total;
  };
  return (
    <ScrollView style={styles.confirmation}>
      <View style={{marginBottom: 20}}>
        <Text
          style={{
            color: '#333',
            fontSize: 20,
            textAlign: 'center',
            paddingVertical: 10,
          }}>
          Your Shipping Address
        </Text>
        <Text style={{color: '#333', fontSize: 16, padding: 10}}>
          Name: {user.name}
        </Text>
        <Text style={{color: '#333', fontSize: 16, padding: 10}}>
          Phone: {phoneNumber}
        </Text>
        <Text style={{color: '#333', fontSize: 16, padding: 10}}>
          Address: {address}, {cityName}, {countryName}
        </Text>
        <Text style={{color: '#333', fontSize: 20, textAlign: 'center'}}>
          Your Cart Items
        </Text>
        {Object.keys(cartData).map(tokoid => {
          return (
            <View>
              <View>
                <Text>{cartData[tokoid][0].namatoko}</Text>
              </View>
              {/* <View style={styles.container}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown(tokoid)}>
                  <Text style={styles.dropdownButtonText}>
                    {pengiriman[tokoid].pilihanKurir ?? 'Select an option'}
                  </Text>
                </TouchableOpacity>

                {listOpen[tokoid] == true ? (
                  <View style={styles.dropdownList}>
                    {options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.option}
                        onPress={() => selectOption(option, tokoid)}>
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}

                {pengiriman[tokoid].pilihanKurir && (
                  <Text style={styles.selectedValueText}>
                    Selected Value: {pengiriman[tokoid].pilihanKurir}
                  </Text>
                )}
              </View> */}
              <View>
                {cartData[tokoid].map((item, index) => {
                  setSubtotal(item.productPrice);
                  return (
                    <View>
                      <View key={index} style={styles.confirmationTop}>
                        <View style={{flexDirection: 'row'}}>
                          <Image
                            source={{uri: item.image}}
                            style={{
                              width: 50,
                              height: 50,
                              marginHorizontal: 10,
                            }}
                          />
                          <Text>{item.productName}</Text>
                        </View>
                        <Text style={{color: '#333', marginHorizontal: 10}}>
                          <FormatRupiah value={item.harga} /> x {item.jumlah} ={' '}
                          <FormatRupiah value={item.jumlah * item.harga} />
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderColor: '#00000036',
          }}>
          <Text style={{color: '#333', padding: 10, fontSize: 18}}>
            TotalPrice:
          </Text>
          <Text style={{color: '#333', padding: 10, fontSize: 16}}>
            {/* ${cartData.reduce((acc, curr) => acc + curr.productPrice, 0)} */}
            <FormatRupiah value={calculateTotal()} />
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={confirmOrderHandler}>
          <Text style={styles.buttonText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// const PaymentInfo = ({totalPrice, submitHandler}) => {
//   return (
//     <ScrollView style={styles.confirmation}>
//       <Text
//         style={{
//           color: '#333',
//           fontSize: 20,
//           textAlign: 'center',
//         }}>
//         Enter your Card Info
//       </Text>
//       <CardField
//         postalCodeEnabled={false}
//         cardNumberEnabled={true}
//         style={{
//           width: '90%',
//           height: 50,
//           marginVertical: 30,
//           marginLeft: 15,
//           color: '#333',
//         }}
//       />
//       <TouchableOpacity style={styles.button} onPress={submitHandler}>
//         <Text style={styles.buttonText}>Pay - ${totalPrice}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

const generateOrderId = () => {
  const orderId = Math.floor(Math.random() * 1000000);
  return orderId;
};

const PaymentInfo = ({totalPrice}) => {
  totalharga = totalPrice;
  // console.log(totalPrice);
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const {user} = useSelector(state => state.user);
  const submitHandler = async () => {
    const orderId = generateOrderId();

    const response = await fetch(`${URI}api/pembayaran/create-payment`, {
      method: 'POST',
      headers: {
        'Accept-type': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalharga,
        orderId: orderId,
        IdUser: user.id,
      }),
    });

    try {
      const {token} = await response.json();
      console.log(token);
      setWebViewUrl(`https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`); // Menggunakan URL sandbox Midtrans dengan Snaptoken
      setShowWebView(true); // Menampilkan webview
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Something went wrong',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  };
  const handleNavigationStateChange = navState => {
    if (!navState.loading) {
      if (navState.url.includes('payment/finish')) {
        // Jika pembayaran berhasil
        setShowWebView(false); // Menutup webview
        // Navigasi ke halaman sukses atau halaman lain yang sesuai
      }
    }
  };
  // if (showWebView) {
  //   return (
  //     <View style={styles.webviewContainer}>
  //       <WebView
  //         style={styles.webview}
  //         source={{uri: webViewUrl}}
  //         onNavigationStateChange={navState => {
  //           if (!navState.loading) {
  //             if (navState.url.includes('payment/finish')) {
  //               // Jika pembayaran berhasil
  //               setShowWebView(false); // Menutup webview
  //               navigation.navigate('My Orders'); // Mengarahkan ke halaman daftar pesanan
  //             }
  //           }
  //         }}
  //       />
  //     </View>
  //   );
  // }

  // return (
  //   <View style={styles.container}>
  //     {/* Konten lain dari PaymentInfo */}
  //     <TouchableOpacity style={styles.payButton} onPress={submitHandler}>
  //       <Text style={styles.payButtonText}>Pay - ${totalPrice}</Text>
  //     </TouchableOpacity>
  //   </View>
  // );
  const closeWebView = () => {
    setShowWebView(false);
    navigation.navigate('My Orders'); // Mengarahkan ke halaman daftar pesanan
  };

  return (
    <View style={styles.container}>
      {showWebView ? (
        // <View style={styles.webviewContainer}>
        //   <WebView
        //     style={styles.webview}
        //     source={{uri: webViewUrl}}
        //     onNavigationStateChange={handleNavigationStateChange}
        //   />
        //   <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
        //     <Text style={styles.closeButtonText}>Close</Text>
        //   </TouchableOpacity>
        // </View>
        <Modal visible={showWebView} animationType="slide">
          <View style={styles.modalContainer}>
            <WebView
              style={styles.WebView}
              source={{uri: webViewUrl}}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              mixedContentMode="always"
              allowsInlineMediaPlayback={true}
            />
            <Button title="Close" onPress={closeWebView} />
          </View>
        </Modal>
      ) : (
        <>
          {/* Konten lain dari PaymentInfo */}
          {/* <TouchableOpacity style={styles.payButton} onPress={submitHandler}>
            <Text style={styles.payButtonText}>Pay - ${totalPrice}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.buttonPay} onPress={submitHandler}>
            <Text style={styles.buttonText}>
              Pay Order
              {/* <FormatRupiah style={{marginLeft: 10}} value={totalharga} /> */}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const Success = ({navigation}) => {
  return (
    <View style={styles.success}>
      <Text
        style={{
          color: '#333',
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 20,
        }}>
        Your Order is Placed Successfully😍
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('My Orders')}>
        <Text style={styles.buttonText}>View Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: '200%',
  },
  WebView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    // padding: 15,
    // marginVertical: 10,
    // marginBottom: height / 4 - 20,
  },
  addressItem: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    // width: width * 0.8,
    // marginLeft: width * 0.1,
  },
  selectedAddressItem: {
    backgroundColor: '#e6e6e6',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneText: {
    fontSize: 14,
    color: '#888',
  },
  locationContainer: {
    flexDirection: 'row',
  },
  locationText: {
    fontSize: 14,
    marginRight: 5,
    color: '#666',
  },
  button: {
    backgroundColor: '#fca500',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    // width: width,
    // padding: 15,
    // marginVertical: 5,
    // marginBottom: height / 40 - 20,
  },
  confirmation: {
    width: width,
    marginBottom: height / 4 - 20,
  },
  input: {
    borderColor: '#00000036',
    borderWidth: 1,
    height: 50,
    color: '#333',
    borderRadius: 5,
    paddingLeft: 10,
  },
  inputMain: {
    paddingLeft: 20,
    paddingRight: 20,
    // width: width * 1.0,
    // marginLeft: width * 0.1,
    marginVertical: 10,
    color: '#333',
  },
  button: {
    width: width * 0.8,
    marginLeft: width * 0.1,
    marginVertical: 20,
    backgroundColor: '#3BB77E',
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPay: {
    width: width * 0.8,
    marginLeft: width * 0.1,
    // marginVertical: 10,
    marginTop: 50,
    backgroundColor: '#3BB77E',
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  confirmationTop: {
    width: width * 1,
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  success: {
    width: width * 1,
    height: height * 1 - 50,
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    width: width,
    height: height / 2 - -870,
    // marginBottom: height / 4 - 60,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
//
//
//
//
// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Dimensions,
// } from 'react-native';
// import WebView from 'react-native-webview';
// import {URI} from '../../../Redux/URI';
// const {width, height} = Dimensions.get('window');

// const PaymentInfo = ({totalPrice, navigation}) => {
//   const [showWebView, setShowWebView] = useState(false);
//   const [webViewUrl, setWebViewUrl] = useState('');

//   const submitHandler = async () => {
//     const orderId = Math.floor(Math.random() * 1000000);

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

//     try {
//       const {token} = await response.json();
//       console.log(token);
//       setWebViewUrl(`https://app.sandbox.midtrans.com/snap/v2/vtweb/${token}`); // Menggunakan URL sandbox Midtrans dengan Snaptoken
//       setShowWebView(true); // Menampilkan webview
//     } catch (error) {
//       ToastAndroid.showWithGravity(
//         'Something went wrong',
//         ToastAndroid.SHORT,
//         ToastAndroid.BOTTOM,
//       );
//     }
//   };
//   const handleNavigationStateChange = navState => {
//     if (!navState.loading) {
//       if (navState.url.includes('payment/finish')) {
//         // Jika pembayaran berhasil
//         setShowWebView(false); // Menutup webview
//         navigation.navigate('My Orders'); // Mengarahkan ke halaman daftar pesanan
//         // Navigasi ke halaman sukses atau halaman lain yang sesuai
//       }
//     }
//   };

//   const closeWebView = () => {
//     setShowWebView(false);
//     navigation.navigate('My Orders'); // Mengarahkan ke halaman daftar pesanan
//   };

//   return (
//     <View style={styles.container}>
//       {showWebView ? (
//         <View style={styles.webviewContainer}>
//           <WebView
//             style={styles.webview}
//             source={{uri: webViewUrl}}
//             onNavigationStateChange={handleNavigationStateChange}
//           />
//           <TouchableOpacity style={styles.closeButton} onPress={closeWebView}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           {/* Konten lain dari PaymentInfo */}
//           <TouchableOpacity style={styles.payButton} onPress={submitHandler}>
//             <Text style={styles.payButtonText}>Pay - ${totalPrice}</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   payButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 4,
//     marginTop: 20,
//   },
//   payButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   webview: {
//     flex: 1,
//     width: width,
//     height: height,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 4,
//   },
//   closeButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default PaymentInfo;
