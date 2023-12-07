import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
// import React, {useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {URI} from '../../../Redux/URI';

var {width} = Dimensions.get('window');

const Header = ({navigation}) => {
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
              <View style={styles.headerMain}>
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      marginLeft: 30,
                      marginTop: 8,
                      marginBottom: 25,
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    IPI Mart
                  </Text>
                </View>
                <View style={styles.headerFlex}>
                  {/* <Image
                    source={{
                      uri:
                        'http://192.168.1.25:8080/ikm/web/uploads/setting/' +
                        item.logo,
                    }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 70,
                      borderColor: '#FFFFFF',
                      borderWidth: 2,
                      marginLeft: 10,
                    }}
                  />
                  <View
                    style={{flex: 1, marginLeft: 10, justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: '#212121',
                      }}>
                      {item.nama_web}
                    </Text>
                    <Text style={{color: '#212121'}}>{item.judul_web}</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon name="menu-outline" size={40} hei color="#333" />
                  </TouchableOpacity> */}
                  <TextInput
                    // placeholder="Search..."
                    placeholderTextColor="#333"
                    style={styles.searchBox}
                  />
                  <TouchableOpacity>
                    <Icon
                      name="search-outline"
                      size={23}
                      color="#333"
                      style={styles.searchIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          );
        })}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerMain: {
    width: width,
    height: width / 3 - 5,
    backgroundColor: '#009b03',
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBox: {
    width: width - 57,
    height: width / 7 - 17,
    backgroundColor: '#e5e5e5',
    marginHorizontal: 18,
    borderRadius: 8,
    fontSize: 15,
    color: '#333',
    paddingHorizontal: 10,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    bottom: -15,
    right: 30,
  },
});
