import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
var {width} = Dimensions.get('window');
import ProductCard from '../Products/ProductCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import RenderHTML from 'react-native-render-html';

import {URI} from '../../../Redux/URI';

var {width} = Dimensions.get('window');

const FilterProducts = props => {
  const {navigation} = props;

  const [kategori, setKategori] = useState([]);
  const getKategori = async () => {
    try {
      let linkkategoriproduk = `${URI}api/kategori-produk`;
      let res = await fetch(linkkategoriproduk, {
        method: 'GET',
        headers: {
          // accept: 'application/json',
          'content-type': 'application/json',
        },
      });
      res = await res.json();
      // console.log(res);
      // console.log(res.data.deksripsi_lengkap);
      setKategori(res);
    } catch (error) {
      alert(error.message);
    }
  };

  const funsiRefreshProduk = async id => {
    getData(id);
  };

  const [products, setData] = useState([]);
  const getData = async (id_kat = null) => {
    try {
      let linkproduk = `${URI}api/produk/list-produk`;
      if (id_kat !== null) {
        linkproduk += '?id_kat=' + id_kat;
      }
      let res = await fetch(linkproduk, {
        method: 'GET',
        headers: {
          // accept: 'application/json',
          'content-type': 'application/json',
        },
      });
      res = await res.json();
      console.log(res);
      // console.log(res.data.deksripsi_lengkap);
      setData(res.products);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getKategori();
    getData();
  }, []);

  console.log(products);
  return (
    <View style={styles.container}>
      <View>
        <View style={{flexDirection: 'row'}}>
          {/* <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              paddingRight: 100,
              paddingTop: 2,
              fontSize: 20,
              marginLeft: 18,
            }}>
            Kategori
          </Text> */}
          {/* <View>
            <FlatList
              data={kategori}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => funsiRefreshProduk(item.id)}
                  style={{
                    paddingVertical: 5,
                    marginRight: 10,
                    paddingHorizontal: 5,
                    backgroundColor: 'white',
                    borderRadius: 25,
                    elevation: 3,
                    marginBottom: 10,
                    marginTop: 20,
                  }}>
                  <Icon
                    name={item.icon.replace('fa-', '')}
                    size={20}
                    color="pink"
                  />
                  <Text style={{color: '#34354E', fontSize: 10}}>
                    {item.nama}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View> */}
          {/* <TextInput
            value={props.pencarian}
            onChangeText={text => props.setPencarian(text)}
            placeholder="cari Produk"
            style={{
              backgroundColor: '#fff',
              elevation: 3,
              paddingLeft: 10,
              borderRadius: 5,
              flex: 1,
              height: 40,
            }}
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              borderRadius: 5,
              marginLeft: 10,
              elevation: 3,
              height: 40,
            }}>
            <Icon name="search" size={20} color="black" />
          </TouchableOpacity> */}
        </View>
        <></>
        <>
          <View style={styles.kategori}>
            {kategori &&
              kategori.map(item => {
                return (
                  <>
                    <View>
                      <TouchableOpacity
                        onPress={() => funsiRefreshProduk(item.id)}>
                        <Image
                          source={{uri: item.icon2}}
                          style={{
                            width: 44,
                            height: 45,
                            borderRadius: 10,
                            // elevation: 1,
                            // shadowRadius: 10,
                            // shadowOffset: 1,
                            // shadowOpacity: 1,
                            padding: 10,
                            // margin: 5,
                            marginBottom: 10,
                            // marginTop: 10,
                            marginLeft: 20,
                            marginRight: 20,
                          }}
                        />
                        {/* <Icon
                          style={{
                            // paddingVertical: 10,
                            width: 44,
                            height: 45,
                            // paddingHorizontal: 25,
                            backgroundColor: 'white',
                            borderRadius: 10,
                            // elevation: 1,
                            // shadowRadius: 10,
                            // shadowOffset: 1,
                            // shadowOpacity: 1,
                            padding: 10,
                            // margin: 5,
                            marginBottom: 10,
                            // marginTop: 10,
                            marginLeft: 20,
                            marginRight: 20,
                          }}
                          name={item.icon.replace('fa-', '')}
                          size={25}
                          color="#d65f25"
                          alignItems="center"
                        /> */}
                        <Text
                          style={{
                            color: '#2b9d2d',
                            fontSize: 11,
                            textAlign: 'center',
                            marginBottom: 20,
                            // fontWeight: 'bold',
                          }}>
                          {item.nama}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              })}
          </View>
        </>
        <View
          style={{
            backgroundColor: '#159b18',
            borderRadius: 10,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: -20,
            paddingBottom: 17,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              marginRight: 7,
              marginLeft: 7,
              marginBottom: 5,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
              Flash Sale
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                flex: 1,
              }}>
              <Text style={{color: 'white'}}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products &&
              products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  navigation={navigation}
                />
              ))}
          </ScrollView>
        </View>
        {/* <View
          style={{
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: -20,
            paddingBottom: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              marginRight: 8,
              marginLeft: 8,
              marginBottom: 5,
            }}>
            <Text style={{color: '#2b9d2d', fontWeight: 'bold', fontSize: 18}}>
              Promo Spesial
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                flex: 1,
              }}>
              <Text style={{color: '#FDB436'}}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products &&
              products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  navigation={navigation}
                />
              ))}
          </ScrollView>
        </View>
        <View
          style={
            {
              // paddingLeft: 15,
              // paddingRight: 15,
              // paddingTop: -20,
              // paddingBottom: 17,
            }
          }>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              marginRight: 13,
              marginLeft: 13,
              marginBottom: 5,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#2b9d2d',
                fontWeight: 'bold',
                fontSize: 18,
              }}>
              DAFTAR PRODUK
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                flex: 1,
              }}>
              <Text style={{color: '#FDB436'}}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productCard}>
            {products &&
              products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  navigation={navigation}
                />
              ))}
          </View>
        </View> */}
        <View style={{marginTop: 70}}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    padding: 10,
    marginVertical: 10,
    marginBottom: width / 6 - 5,
  },
  productCard: {
    width: width * 1 - 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kategori: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 27,
  },
});

export default FilterProducts;
