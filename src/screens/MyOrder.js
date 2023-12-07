import React, {useState, useEffect, itemDetails} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native';

import {URI} from '../../Redux/URI';
import {FormatRupiah} from '@arismun/format-rupiah';
import Icon from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {getOrder} from '../../Redux/Actions/OrderAction';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
const windowWidth = Dimensions.get('window').width;
const columnWidth = windowWidth / 12;

export default function MyOrder({navigation}) {
  const [activeTab, setActiveTab] = useState('BelumBayar');
  const [orders, setOrders] = useState([]);
  const [carts, setCartOrders] = useState([]);
  const [products, setProductOrders] = useState([]);
  const {user} = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    fetchCartOrders();
    fetchProductOrders();
    setRefreshing(false);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${URI}api/pesanan/pesanan?id=` + user.id);
      const data = await response.json();
      setTimeout(() => {
        // Lakukan pengambilan data
        // ...
        setOrders(data.pesanan);
        setLoading(false);
      }, 500);
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

  useEffect(() => {
    fetchOrders();
    fetchCartOrders();
    fetchProductOrders();
  }, []);

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

    //fomrat date
    const toReadableDate = dateString => {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      const date = new Date(dateString);

      return date.toLocaleString('id-ID', options);
    };
    // handle payment
    const [showWebView, setShowWebView] = useState(false);

    const handlePayOrder = () => {
      setShowWebView(true);
    };

    const handleCloseWebView = () => {
      setShowWebView(false);
    };

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 17,
            }}>
            <View style={{width: columnWidth * 8, flexDirection: 'row'}}>
              <Text style={styles.itemName}>Payment ID</Text>
              <Text style={{color: '#3ca745'}}>#{item.invoice}</Text>
            </View>
            {item.status_id === 3 ? (
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
            ) : item.status_id === 2 ? (
              <TouchableOpacity
                style={{marginHorizontal: '-67%', flexDirection: 'row'}}>
                <Icon name={'ios-alert'} size={20} color="#007bff" />
                <Text
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#007bff',
                  }}>
                  Details
                </Text>
              </TouchableOpacity>
            ) : item.status_id === 10 ? (
              <TouchableOpacity
                style={{marginHorizontal: '-81%', flexDirection: 'row'}}>
                <Icon name={'ios-alert'} size={20} color="#007bff" />
                <Text
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#007bff',
                  }}>
                  Details
                </Text>
              </TouchableOpacity>
            ) : item.status_id === 11 ? (
              <TouchableOpacity
                style={{marginHorizontal: '-83%', flexDirection: 'row'}}>
                <Icon name={'ios-alert'} size={20} color="#007bff" />
                <Text
                  style={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: '#007bff',
                  }}>
                  Details
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: columnWidth * 4, flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{marginHorizontal: '0%', flexDirection: 'row'}}>
                  <Icon name={'ios-alert'} size={20} color="#007bff" />
                  <Text
                    style={{
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: '#007bff',
                    }}>
                    Details
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
                                  paddingBottom: 6,
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
          {item.status_id === 3 ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Text>!Pay before </Text>
                <Text style={{color: '#dc3545'}}>1 x 24 hours</Text>
              </View>
              <TouchableOpacity style={styles.pay} onPress={handlePayOrder}>
                <Text style={{color: 'white'}}>Pay Order</Text>
              </TouchableOpacity>
              <Modal visible={showWebView} animationType="slide">
                <View style={styles.modalContainer}>
                  <WebView
                    style={styles.WebView}
                    source={{
                      uri: item.url,
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    mixedContentMode="always"
                    allowsInlineMediaPlayback={true}
                  />
                  <Button title="Close" onPress={handleCloseWebView} />
                </View>
              </Modal>
            </View>
          ) : item.status_id === 2 ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#212529'}}>Total Payment</Text>
                <Text style={{color: '#28a745'}}>
                  {' '}
                  <FormatRupiah value={totalPayment} />{' '}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  left: `123%`,
                  top: '-10%',
                  // backgroundColor: '#28a745',
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 6,
                  flex: 1,
                  alignItems: 'flex-end', // Mengatur konten ke sisi kanan
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#ffc107'}}>Processed</Text>
              </View>
            </View>
          ) : item.status_id === 10 ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Text>Total Payment </Text>
                <Text style={{color: '#28a745'}}>
                  <FormatRupiah value={totalPayment} />{' '}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.received}
                onPress={handlePayOrder}>
                <Text style={{color: 'white'}}>Order Received</Text>
              </TouchableOpacity>
              <Modal visible={showWebView} animationType="slide">
                <View style={styles.modalContainer}>
                  <WebView
                    style={styles.WebView}
                    source={{uri: item.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    mixedContentMode="always"
                    allowsInlineMediaPlayback={true}
                  />
                  <Button title="Close" onPress={handleCloseWebView} />
                </View>
              </Modal>
            </View>
          ) : item.status_id === 11 ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Text>Total Payment </Text>
                <Text style={{color: '#28a745'}}>
                  <FormatRupiah value={totalPayment} />{' '}
                </Text>
              </View>
              <TouchableOpacity style={styles.review} onPress={handlePayOrder}>
                <Text style={{color: 'white'}}>Leave a Review</Text>
              </TouchableOpacity>
              <Modal visible={showWebView} animationType="slide">
                <View style={styles.modalContainer}>
                  <WebView
                    style={styles.WebView}
                    source={{uri: item.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    mixedContentMode="always"
                    allowsInlineMediaPlayback={true}
                  />
                  <Button title="Close" onPress={handleCloseWebView} />
                </View>
              </Modal>
            </View>
          ) : item.status_id === 4 ||
            item.status_id === 5 ||
            item.status_id === 6 ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{width: columnWidth * 6}}>
                <Text style={{color: 'black'}}>Cancel Reason</Text>
                <Text>{item.keterangan}</Text>
              </View>
              <View
                style={{
                  // flexDirection: 'row',
                  width: columnWidth * 6,
                  alignItems: 'flex-end',
                  paddingRight: '30%',
                }}>
                <Text>Total Payment </Text>
                <Text style={{color: '#28a745'}}>
                  <FormatRupiah value={totalPayment} />{' '}
                </Text>
              </View>
              <Modal visible={showWebView} animationType="slide">
                <View style={styles.modalContainer}>
                  <WebView
                    style={styles.WebView}
                    source={{uri: item.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    mixedContentMode="always"
                    allowsInlineMediaPlayback={true}
                  />
                  <Button title="Close" onPress={handleCloseWebView} />
                </View>
              </Modal>
            </View>
          ) : (
            <View>
              <Text>Ksosng</Text>
            </View>
          )}
        </View>
        {item.status_id === 3 ? (
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginTop: '-7%',
            }}>
            <Text style={{fontSize: 14, color: '#212529'}}>Total Payment</Text>
            <Text
              style={{
                fontSize: 12,
                color: '#dc3545',
              }}>
              <FormatRupiah value={totalPayment} />
            </Text>
          </View>
        ) : item.status_id === 2 ? (
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginTop: '-7%',
            }}>
            <Text style={{fontSize: 14, color: '#212529'}}>Order Time :</Text>
            <Text
              style={{
                fontSize: 12,
                color: '#17b6dd',
                width: '70%',
                textAlign: 'right',
              }}>
              {toReadableDate(item.selesai) + ' WIB'}
            </Text>
          </View>
        ) : item.status_id === 10 ? (
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginTop: '-7%',
            }}>
            <Text style={{fontSize: 14, color: '#212529'}}>
              Delivery Time :
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#17b6dd',
                width: '70%',
                textAlign: 'right',
              }}>
              {toReadableDate(item.selesai) + ' WIB'}
            </Text>
          </View>
        ) : item.status_id === 11 ? (
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginTop: '-7%',
            }}>
            <Text style={{fontSize: 14, color: '#212529'}}>
              Order Received :
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: '#17b6dd',
                width: '70%',
                textAlign: 'right',
              }}>
              {toReadableDate(item.selesai) + ' WIB'}
            </Text>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginTop: '-7%',
            }}>
            <Text style={{fontSize: 14, color: '#212529'}}>Cancelled :</Text>
            <Text
              style={{
                fontSize: 12,
                color: '#17b6dd',
                width: '70%',
                textAlign: 'right',
              }}>
              {toReadableDate(item.selesai) + ' WIB'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({item}) => (
    <ItemDetails
      item={item}
      carts={carts}
      products={products}
      styles={styles}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <Text style={styles.headerText}>My Orders</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'BelumBayar' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('BelumBayar')}>
            <LinearGradient
              colors={
                activeTab === 'BelumBayar'
                  ? ['#aa770a', '#e6af3a']
                  : ['#039019', '#7fad39']
              }
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 1}}
              locations={[0, 0.9]}
              style={{
                borderWidth: 0,
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                // borderWidth: 1,
                borderColor: '#000',
                borderRadius: 5,
                marginRight: 10,
              }}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'BelumBayar' && styles.activeTabButtonText,
                ]}>
                Pending Pay
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Dikemas' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('Dikemas')}>
            <LinearGradient
              colors={
                activeTab === 'Dikemas'
                  ? ['#aa770a', '#e6af3a']
                  : ['#039019', '#7fad39']
              }
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 1}}
              locations={[0, 0.9]}
              style={{
                borderWidth: 0,
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                // borderWidth: 1,
                borderColor: '#000',
                borderRadius: 5,
                marginRight: 10,
              }}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'Dikemas' && styles.activeTabButtonText,
                ]}>
                Packed
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Dikirim' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('Dikirim')}>
            <LinearGradient
              colors={
                activeTab === 'Dikirim'
                  ? ['#aa770a', '#e6af3a']
                  : ['#039019', '#7fad39']
              }
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 1}}
              locations={[0, 0.9]}
              style={{
                borderWidth: 0,
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                // borderWidth: 1,
                borderColor: '#000',
                borderRadius: 5,
                marginRight: 10,
              }}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'Dikirim' && styles.activeTabButtonText,
                ]}>
                On Delivery
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Selesai' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('Selesai')}>
            <LinearGradient
              colors={
                activeTab === 'Selesai'
                  ? ['#aa770a', '#e6af3a']
                  : ['#039019', '#7fad39']
              }
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 1}}
              locations={[0, 0.9]}
              style={{
                borderWidth: 0,
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                // borderWidth: 1,
                borderColor: '#000',
                borderRadius: 5,
                marginRight: 10,
              }}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'Selesai' && styles.activeTabButtonText,
                ]}>
                Finished
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Dibatalkan' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('Dibatalkan')}>
            <LinearGradient
              colors={
                activeTab === 'Dibatalkan'
                  ? ['#aa770a', '#e6af3a']
                  : ['#039019', '#7fad39']
              }
              start={{x: 0, y: 0}}
              end={{x: 0.9, y: 1}}
              locations={[0, 0.9]}
              style={{
                borderWidth: 0,
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                // borderWidth: 1,
                borderColor: '#000',
                borderRadius: 5,
                marginRight: 10,
              }}>
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'Dibatalkan' && styles.activeTabButtonText,
                ]}>
                Cancelled
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
        {loading ? (
          // Tampilan memuat (loading)
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : activeTab === 'BelumBayar' ? (
          <FlatList
            data={orders.filter(order => order.status_id === 3)}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        ) : activeTab === 'Dikemas' ? (
          <FlatList
            data={orders.filter(order => order.status_id === 2)}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        ) : activeTab === 'Dikirim' ? (
          <FlatList
            data={orders.filter(order => order.status_id === 10)}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        ) : activeTab === 'Selesai' ? (
          <FlatList
            data={orders.filter(order => order.status_id === 11)}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        ) : (
          <FlatList
            data={orders.filter(
              order =>
                order.status_id === 4 ||
                order.status_id === 5 ||
                order.status_id === 6,
            )}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: '200%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  scrollView: {
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  activeTabButtonText: {
    color: '#fff',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 12,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemPayment: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemLink: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  itemProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  itemProductDetail: {
    flexDirection: 'row',
  },
  itemProductImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemProductInfo: {
    flex: 1,
  },
  itemProductPrice: {
    fontSize: 14,
  },
  itemProductQuantity: {
    fontSize: 12,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#F5F5F5',
  //   width: width,
  //   padding: 15,
  //   // marginVertical: 10,
  //   marginBottom: height / 6 - 60,
  // },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: width,
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
    color: '#212529',
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
    top: '-30%',
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  received: {
    position: 'absolute',
    left: `120%`,
    top: '-30%',
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  review: {
    position: 'absolute',
    left: `120%`,
    top: '-30%',
    backgroundColor: '#e6af3a',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  WebView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
//
//
//
// import {Dimensions, StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import Header from '../components/Layout/Header';
// import {useEffect} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
// import {getOrder} from '../../Redux/Actions/OrderAction';

// var {width} = Dimensions.get('window');

// export default function OrderScreen({navigation}) {
//   const {error, orders} = useSelector(state => state.orderData);

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (error) {
//       ToastAndroid.showWithGravity(
//         error,
//         ToastAndroid.SHORT,
//         ToastAndroid.BOTTOM,
//       );
//     }
//     dispatch(getOrder());
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
//                   {item.orderItems.reduce(
//                     (total, item) => total + item.quantity,
//                     0,
//                   )}
//                 </Text>
//               </View>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={{color: '#333'}}>Amount</Text>
//                 <Text style={{color: '#333'}}>${item.totalPrice}</Text>
//               </View>
//               <View style={{alignItems: 'center'}}>
//                 <Text style={{color: '#333'}}>Order Items</Text>
//                 <Text style={{color: '#333'}}>
//                   {item.orderItems[0].productName}...
//                 </Text>
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
