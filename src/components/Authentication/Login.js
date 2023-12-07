import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {userLogin} from '../../../Redux/Actions/UserAction';
var {width} = Dimensions.get('window');

export default function Login({navigation}) {
  const dispatch = useDispatch();

  const {error, isAuthenticated} = useSelector(state => state.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginSubmit = e => {
    e.preventDefault();
    dispatch(userLogin(username, password));
  };
  useEffect(() => {
    if (error) {
      ToastAndroid.showWithGravity(
        error,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
    if (isAuthenticated) {
      ToastAndroid.showWithGravity(
        'yeah login!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
  }, [dispatch, error, isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.LoginHeader}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: '900',
            fontFamily: 'Roboto',
            color: '#333',
          }}>
          Masuk,
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '100',
            fontFamily: 'sans-serif',
            color: '#555',
            paddingRight: '25%',
          }}>
          Silakan Mengisi Email and Password Anda yang telah terdaftar
        </Text>
      </View>
      <View style={styles.LoginBox}>
        <View style={styles.relative}>
          <Icon name="mail-open-outline" size={25} style={styles.icon} />
          <TextInput
            placeholder="Input email anda..."
            placeholderTextColor="#333"
            style={styles.inputBox}
            textContentType="emailAddress"
            keyboardType="email-address"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>
        <View style={styles.relative}>
          <Icon
            name={showPassword ? 'lock-open-outline' : 'lock-closed-outline'}
            size={25}
            style={styles.icon}
          />
          <TextInput
            placeholder="Input password anda..."
            placeholderTextColor="#333"
            style={styles.inputBox}
            textContentType="password"
            secureTextEntry={!showPassword}
            // secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={25}
            style={{
              color: 'grey',
              position: 'absolute',
              marginHorizontal: '85%',
              marginRight: 2,
              marginTop: '6%',
            }}
            onPress={() => setShowPassword(!showPassword)}
          />
          <Text
            style={{
              textAlign: 'right',
              color: '#20c8af',
              fontSize: 15,
            }}
            onPress={() => navigation.navigate('Forgot')}>
            Lupa Password ?
          </Text>
          <TouchableOpacity onPress={loginSubmit}>
            <View style={styles.Button}>
              <Text style={{color: '#fff', fontSize: 18}}>Masuk</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: width / 6 - 20,
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{
            color: '#333',
            fontSize: 15,
          }}>
          Belum punya akun ?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text
            style={{
              fontSize: 15,
              color: '#20c8af',
              paddingRight: 15,
            }}>
            {' '}
            Daftar
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // left: 0,
          // right: 0,
          // paddingTop: '12%',
          // marginBottom: '-5%'
          // marginBottom: '-20%',
        }}>
        <Image
          source={require('../../Assets/images/footerloginf.png')}
          style={{
            width: '120%',
            // height: '60%',
            height: 170,
            position: 'absolute',
            bottom: 0,
            alignItems: 'center',
          }}></Image>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#e5e5e5',
    // height: width * 2,
    height: width * 2.1,
  },
  LoginHeader: {
    width: width * 1,
    paddingTop: width / 5,
    paddingLeft: 10,
  },
  inputBox: {
    width: width * 1 - 50,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#20c8af',
    paddingLeft: 45,
    fontSize: 15,
    color: '#333',
    marginVertical: 10,
  },
  relative: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    color: '#20c8af',
  },
  LoginBox: {
    marginTop: width / 4,
  },
  Button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#20c8af',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});
