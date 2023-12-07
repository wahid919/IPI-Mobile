import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {FormatRupiah} from '@arismun/format-rupiah';
import {URI} from '../../../Redux/URI';

var {width} = Dimensions.get('window');

export default function ProductCard({product, navigation}) {
  const [click, setClick] = useState(false);
  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('ProductDetails', {item: product})}>
      <View style={styles.ProductCard}>
        <Image
          source={{
            uri: product.foto_banner,
          }}
          style={styles.image}
        />
        <View style={{paddingHorizontal: 10}}>
          <View>
            <Text
              style={{
                color: '#5d5d5d',
                paddingVertical: 5,
                textAlign: 'left',
              }}>
              {product.nama}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{textDecorationLine: 'line-through', color: '#cdcdcd'}}>
              <FormatRupiah value={product.avgprice.toString()} />
            </Text>
            <Text style={{color: '#b63467'}}> {product.diskon}%</Text>
          </View>
          <Text style={{fontSize: 18, fontWeight: '500', color: '#0e0e0e'}}>
            <FormatRupiah value={product.discountprice.toString()} />
          </Text>
          <View
            style={{
              flexDirection: 'row',
              // marginVertical: 13,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 12,
                backgroundColor: '#f07d7d',
                width: '100%',
                borderRadius: 10,
              }}>
              <View
                style={{
                  height: 12,
                  width: `${product.percentageSold}%`,
                  backgroundColor: '#c45454',
                  borderRadius: 10,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'white',
                    lineHeight: 12,
                    fontSize: 10,
                    paddingLeft: 4,
                  }}>
                  {product.percentageSold}
                  {'% '}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    lineHeight: 12,
                    fontSize: 10,
                    paddingLeft: 4,
                  }}>
                  {' '}
                  Terjual
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingBottom: 10,
            }}>
            <Text
              style={{
                color: '#333',
                paddingHorizontal: 10,
                fontSize: 16,
              }}>
              {/* <FormatRupiah value={product.harga} /> */}
            </Text>
            <Text
              style={{
                color: '#555',
                fontSize: 12,
                textDecorationLine: 'line-through',
                marginLeft: -10,
                marginTop: -5,
              }}>
              {/* {product.diskon.length > 0 ? '$' + product.offerPrice : null} */}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* <Icon name="star" color="#C68600" size={18} /> */}
              <Text
                style={{
                  color: '#333',
                  paddingHorizontal: 5,
                  fontSize: 16,
                }}>
                {/* ({product.diskon}) */}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          {click ? (
            <TouchableOpacity>
              {/* <Icon
                name="heart"
                size={25}
                style={{
                  marginRight: 10,
                  color: 'crimson',
                }}
                onPress={() => setClick(!click)}
              /> */}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              {/* <Icon
                name="heart-outline"
                size={25}
                style={{
                  marginRight: 10,
                  color: '#333',
                }}
                onPress={() => setClick(!click)}
              /> */}
            </TouchableOpacity>
          )}
          {product.sumstok !== 0 ? (
            <TouchableOpacity>
              <Icon
                name="cart-outline"
                size={25}
                style={{
                  marginRight: 10,
                  color: '#333',
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {product.sumstok === 0 ? (
          <View style={styles.outOfStock}>
            <Text
              style={{
                color: '#fff',
                fontSize: 11,
                textAlign: 'center',
              }}>
              Stock Limited
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  ProductCard: {
    width: width / 2 - 27,
    height: width / 1.6,
    borderRadius: 10,
    elevation: 8,
    backgroundColor: '#e5e5e5',
    flexWrap: 'wrap',
    margin: 10,
    paddingBottom: 1,
  },
  image: {
    width: '100%',
    height: width / 2 - 60,
    resizeMode: 'contain',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  outOfStock: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 50,
    position: 'absolute',
    top: -10,
    left: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
