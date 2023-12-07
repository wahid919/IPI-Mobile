// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React from 'react';
// import Header from '../Layout/Header';
// import {useDispatch, useSelector} from 'react-redux';
// import {getUserOrders} from '../../../Redux/Actions/OrderAction';
// import {useEffect} from 'react';

// var {width} = Dimensions.get('window');

// export default function UserOrder({navigation}) {
//   const {error, orders} = useSelector(state => state.orderData);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (error) {
//       console.log(error);
//     }

//     dispatch(getUserOrders());
//   }, [dispatch, error]);

//   return (
//     <View>
//       <Header navigation={navigation} />
//       <MyOrder orders={orders} />
//     </View>
//   );
// }

// const MyOrder = ({orders}) => {
//   return (
//     <View>
//       {orders && orders.length > 0 ? (
//         orders &&
//         orders.map((item, index) => (
//           <>
//             <View
//               key={index}
//               style={{
//                 width: width * 1,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 padding: 10,
//                 marginVertical: 10,
//               }}>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={{color: '#333'}}>Order Status</Text>
//                 <Text
//                   style={{
//                     color:
//                       item.orderStatus === 'Processing' ? 'crimson' : '#3BB77E',
//                   }}>
//                   {item.orderStatus}
//                 </Text>
//               </View>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={{color: '#333'}}>Items Qty</Text>
//                 <Text style={{color: '#333'}}>
//                   {item.orderItems.length === 0 ? 1 : item.orderItems.length}
//                 </Text>
//               </View>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={{color: '#333'}}>Amount</Text>
//                 <Text style={{color: '#333'}}>${item.totalPrice}</Text>
//               </View>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={{color: '#333'}}>Order Items</Text>
//                   <Text style={{color: '#333'}}>
//                     {item.orderItems[0].name}...
//                   </Text>
//               </View>
//             </View>
//             <View
//               style={{
//                 width: width * 1,
//                 height: 1,
//                 backgroundColor: '#00000036',
//               }}
//             />
//           </>
//         ))
//       ) : (
//         <View>
//           <Text>Your OrderList is empty!</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({});
import React, {useState, useEffect, itemDetails} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {URI} from '../../Redux/URI';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import {FormatRupiah} from '@arismun/format-rupiah';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
const OrderScreen = () => {
  const [activeTab, setActiveTab] = useState('belumBayar');
  const [orders, setOrders] = useState([]);
  const [carts, setCartOrders] = useState([]);
  const [products, setProductOrders] = useState([]);
  const {user} = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
    fetchCartOrders();
    fetchProductOrders();
  }, []);

  const handleCansel = id => {
    // Logika untuk membatalkan pesanan
  };

  const handlePayOrder = id => {
    // Logika untuk membayar pesanan
  };

  const handleConfirmation = id => {
    // Logika untuk mengkonfirmasi pesanan
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${URI}api/pesanan/pesanan?id=` + user.id);
      const data = await response.json();
      // if (data.success) {
      //   const orderData = await Promise.all(
      //     data.pesanan.map(async item => {
      //       const productResponse = await axios.get(
      //         `${URI}api/pesanan/order-cart?id=` + item.id,
      //       );
      //       const productData = productResponse.data.productorder;
      //       console.log(productData);
      //       return {
      //         ...item,
      //         product: productData,
      //         // image: productData.foto_banner,
      //       };
      //     }),
      //   );
      //   setOrders(orderData);
      //   // const res = await axios.get(
      //   //   `${URI}api/keranjang/list-keranjang?id=` + user.id,
      //   // );
      //   // setCartData(res.data.cart);
      // } else {
      //   console.log(response.data.message);
      // }
      setOrders(data.pesanan);
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
    setRefreshing(false);
  };

  const fetchCartOrders = async () => {
    try {
      const response = await fetch(
        `${URI}api/pesanan/order-cart?id=` + user.id,
      );
      const data = await response.json();
      setCartOrders(data.ordercart);
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
    setRefreshing(false);
  };

  const fetchProductOrders = async () => {
    try {
      const response = await fetch(`${URI}api/pesanan/product-order`);
      const data = await response.json();
      setProductOrders(data.productorder);
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
    setRefreshing(false);
  };
  // {orders && orders.length > 0 ? (
  //   orders.map((item, index) => (
  //     <>
  //     </>
  //   ))
  // ) : (
  //   <View>
  //     <Text>Your OrderList is empty!</Text>
  //   </View>
  // )}
  // console.log(orders);
  // console.log(products);

  const ItemDetails = ({item, carts, products, styles}) => {
    const displayedProducts = products.filter(product =>
      carts.some(
        cart => cart.id_transaksi === item.id && cart.produk_id === product.id,
      ),
    );

    const [showAllProducts, setShowAllProducts] = useState(false);

    const toggleProductVisibility = () => {
      setShowAllProducts(prevState => !prevState);
    };

    const visibleProducts = showAllProducts
      ? displayedProducts
      : displayedProducts.slice(0, 1);

    // Menghitung total payment
    const totalPayment = displayedProducts.reduce((total, product) => {
      const cart = carts.find(
        cart => cart.id_transaksi === item.id && cart.produk_id === product.id,
      );
      return total + (cart ? cart.harga * cart.jumlah : 0);
    }, 0);

    //handle payment
    const handlePayOrder = () => {
      const url = item.url; // Replace with your checkout URL
    };

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 6,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemName}>Payment ID</Text>
              <Text style={{color: '#3ca745'}}>#{item.invoice}</Text>
            </View>
            <TouchableOpacity
              style={{marginHorizontal: '-43%', flexDirection: 'row'}}>
              <Icon name={'close-circle'} size={20} color="#dc3545" />
              <Text
                style={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#dc3545',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          {carts.map(cart => {
            if (cart.id_transaksi === item.id && displayedProducts.length > 0) {
              return (
                <View key={cart.id} style={{flexDirection: 'row'}}>
                  <View style={styles.produkItem}>
                    {visibleProducts.map(product => {
                      if (product.id === cart.produk_id) {
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <View key={product.id} style={{paddingTop: 5}}>
                              <View style={styles.productImageContainer}>
                                <Image
                                  style={styles.productImage}
                                  source={{uri: product.foto_banner}}
                                  resizeMode="cover"
                                />
                              </View>
                            </View>
                            <View style={{paddingLeft: 15}}>
                              <Text
                                style={{
                                  fontWeight: 500,
                                  paddingBottom: 10,
                                  color: '#212529',
                                }}>
                                {product.nama}
                              </Text>
                              <Text style={{color: '#007bff', fontSize: 12}}>
                                Color: {cart.variant1} | Size: {cart.variant2}
                              </Text>
                              <View style={{flexDirection: 'row'}}>
                                <Text>
                                  <FormatRupiah value={cart.harga} />
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    lineHeight: 22,
                                    marginLeft: 3,
                                  }}>
                                  x{cart.jumlah}
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      }
                    })}
                  </View>
                </View>
              );
            }
          })}
          {displayedProducts.length > 1 && (
            <TouchableOpacity
              onPress={toggleProductVisibility}
              style={{flexDirection: 'row'}}>
              <Icon
                name={
                  showAllProducts ? 'chevron-up-circle' : 'chevron-down-circle'
                }
                size={20}
                color="#17a2b8"
              />
              <Text style={{color: '#17a2b8'}}>
                {showAllProducts ? ' Hidden' : ' Show More'}
              </Text>
            </TouchableOpacity>
          )}
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'row'}}>
              <Text>!Pay before </Text>
              <Text style={{color: '#dc3545'}}>1 x 24 hours</Text>
            </View>
            <TouchableOpacity style={styles.pay} onPress={handlePayOrder}>
              <Text style={{color: 'white'}}>Pay Order</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={{fontSize: 14, color: '#212529'}}>Total Payment</Text>
          <Text
            style={{
              fontSize: 12,
              color: '#dc3545',
            }}>
            <FormatRupiah value={totalPayment} />
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <ItemDetails
        item={item}
        carts={carts}
        products={products}
        styles={styles}
      />
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'BelumBayar':
        return (
          <>
            {/* {orders.map(order => {
              if (order.status_id === 3) {
                return ( */}
            {orders && orders.length > 0 ? (
              <ScrollView
                style={styles.container}
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                onScroll={({nativeEvent}) => {
                  const {contentOffset} = nativeEvent;
                  if (contentOffset.y <= 0) {
                    handleRefresh();
                  }
                }}
                scrollEventThrottle={400}>
                <>
                  <FlatList
                    data={orders.filter(item => item.status_id === 3)}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    // ListFooterComponent={renderFooter}
                  />
                </>
                {/* <Text key={order.id}>
                  <Text>{order.invoice}</Text>
                </Text> */}
              </ScrollView>
            ) : (
              <View
                style={{
                  height: height * 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: '#333', fontSize: 20, textAlign: 'center'}}>
                  Pesanan belum bayar kosong 😢
                </Text>
              </View>
            )}
            {/* );
              }
            })} */}
          </>
        );
      case 'Kemas':
        return (
          <>
            {orders.map(order => {
              if (order.status_id === 2) {
                return (
                  <ScrollView>
                    <Text key={order.id}>
                      <Text>{order.invoice}</Text>
                    </Text>
                  </ScrollView>
                );
              }
            })}
          </>
        );
      case 'Kirim':
        return (
          <>
            {orders.map(order => {
              if (order.status_id === 10) {
                return (
                  <ScrollView>
                    <Text key={order.id}>
                      <Text>{order.invoice}</Text>
                    </Text>
                  </ScrollView>
                );
              }
            })}
          </>
        );
      case 'Selesai':
        return (
          <>
            {orders.map(order => {
              if (order.status_id === 11) {
                return (
                  <ScrollView>
                    <Text key={order.id}>
                      <Text>{order.invoice}</Text>
                    </Text>
                  </ScrollView>
                );
              }
            })}
          </>
        );
      case 'Dibatalkan':
        return (
          <>
            {orders.map(order => {
              if (
                order.status_id === 4 ||
                order.status_id === 5 ||
                order.status_id === 6
              ) {
                return (
                  <ScrollView>
                    <Text key={order.id}>
                      <Text>{order.invoice}</Text>
                    </Text>
                  </ScrollView>
                );
              }
            })}
          </>
        );
      default:
        return null;
    }
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
    fetchOrders();
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
        }}>
        <TouchableOpacity
          onPress={() => handleTabChange('BelumBayar')}
          style={[
            styles.tabItem,
            activeTab === 'BelumBayar' && styles.activeTabItem,
          ]}>
          <Text
            style={{
              fontWeight: activeTab === 'BelumBayar' ? 'bold' : 'normal',
            }}>
            Belum Bayar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange('Kemas')}
          style={[
            styles.tabItem,
            activeTab === 'Kemas' && styles.activeTabItem,
          ]}>
          <Text style={{fontWeight: activeTab === 'Kemas' ? 'bold' : 'normal'}}>
            Kemas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Kirim')}
          style={[
            styles.tabItem,
            activeTab === 'Kirim' && styles.activeTabItem,
          ]}>
          <Text style={{fontWeight: activeTab === 'Kirim' ? 'bold' : 'normal'}}>
            Dikirim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Selesai')}
          style={[
            styles.tabItem,
            activeTab === 'Selesai' && styles.activeTabItem,
          ]}>
          <Text
            style={{fontWeight: activeTab === 'Selesai' ? 'bold' : 'normal'}}>
            Selesai
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Dibatalkan')}
          style={[
            styles.tabItem,
            activeTab === 'Dibatalkan' && styles.activeTabItem,
          ]}>
          <Text
            style={{
              fontWeight: activeTab === 'Dibatalkan' ? 'bold' : 'normal',
            }}>
            Dibatalkan
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {renderContent()}
      </View>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width: width,
    padding: 15,
    // marginVertical: 10,
    marginBottom: height / 6 - 60,
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
  tabItem: {
    borderWidth: 0,
    borderRadius: 0.25,
    color: 'grey',
    // backgroundColor: 'linear-gradient(91.9deg, #aa770a 0%, #e6af3a 90%)',
    // Gaya lainnya untuk tab yang tidak aktif
  },
  activeTabItem: {
    borderWidth: 0,
    borderRadius: 0.25,
    color: 'black',
    // backgroundColor: 'linear-gradient(90.9deg, #039019 2.5%, #7fad39 100.7%)',
    // color: '#fff',
    // borderColor: '#1e7e34',
    // boxShadow: 'none',
    // Gaya lainnya untuk tab yang aktif
  },
  produkItem: {
    flexDirection: 'row',
    paddingBottom: 7,
    marginLeft: 0,
  },
  productImageContainer: {
    width: 60,
    height: 60,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 150 / 2,
  },
  canselorder: {},
  pay: {
    position: 'absolute',
    left: `105%`,
    top: '-40%',
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
