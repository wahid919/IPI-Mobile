import axios from 'axios';
import {URI} from '../URI';
import {ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = `${URI}`;

// Create axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: {
    'Accept-type': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async config => {
    const IP1m4rt = await AsyncStorage.getItem('IP1m4rt');
    if (IP1m4rt) {
      config.headers.Authorization = `Bearer ${IP1m4rt}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const userLogin = (username, password) => async dispatch => {
  dispatch({
    type: 'userLoginRequest',
  });
  return fetch(`${URI}api/user/login`, {
    method: 'POST',
    headers: {
      'Accept-type': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password}),
  })
    .then(response => response.json())
    .then(user => {
      if (user.success) {
        const IP1m4rt = user.user.secret_token;
        console.log(IP1m4rt);
        // Menyimpan secret token di storage lokal (misalnya AsyncStorage di React Native)
        AsyncStorage.setItem('IP1m4rt', IP1m4rt)
          .then(() => {
            // Jika penyimpanan berhasil, memperbarui state aplikasi dengan status login
            console.log(username);
            console.log(user);
            setTimeout(() => {
              dispatch({
                type: 'userLoginSuccess',
                payload: user.user,
              });
            }, 2000); // 3 detik jeda sebelum pindah ke halaman home
          })
          .catch(error => {
            // Menangani kesalahan saat menyimpan secret token
            setTimeout(() => {
              dispatch({type: 'userLoginFalse', payload: user.message});
            }, 2000);
          });
      } else {
        console.log(password);
        console.log(user);
        setTimeout(() => {
          dispatch({type: 'userLoginFalse', payload: user.message});
        }, 2000);
      }
      console.log(user);
    })
    .catch(error => {
      console.error(error);
    });
};

// Registration User
export const register =
  (name, username, password, avatar) => async dispatch => {
    try {
      dispatch({type: 'userCreateRequest'});

      const {data} = await axios.post(
        `https://mern-ecommerce-stores.herokuapp.com/api/v2/registration`,
        {name, username, password, avatar},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      dispatch({type: 'userCreateSuccess', payload: data.user});
    } catch (error) {
      dispatch({
        type: 'userCreateFail',
        payload: error.response.data.message,
      });
    }
  };

// Load User
export const loadUser = () => async dispatch => {
  try {
    const IP1m4rt = await AsyncStorage.getItem('IP1m4rt');
    if (IP1m4rt) {
      const response = await axiosInstance.get('api/user/load-user', {
        headers: {Authorization: `Bearer ${IP1m4rt}`},
      });
      const data = response.data;
      // console.log(data);
      dispatch({type: 'userLoadSuccess', payload: data.user});
    } else {
      dispatch({type: 'userLoadFailed', payload: 'Login Again'});
    }
  } catch (error) {
    dispatch({type: 'userLoadFailed', payload: error.message});
  }
};

// Log out User
export const logOutUser = () => {
  return async dispatch => {
    try {
      const IP1m4rt = await AsyncStorage.getItem('IP1m4rt');

      if (!IP1m4rt) {
        throw new Error('Access token not found');
      }

      const response = await axiosInstance.post('api/user/logout', {
        headers: {Authorization: `Bearer ${IP1m4rt}`},
      });

      const data = response.data;
      console.log(data);
      if (data.success) {
        await AsyncStorage.removeItem('IP1m4rt');
        dispatch({
          type: 'userLogOutSucess',
          payload: data.message,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

// Forgot Password
export const forgotPassword = username => async dispatch => {
  try {
    dispatch({type: 'forgotPasswordRequest'});

    const config = {headers: {'Content-Type': 'application/json'}};

    const {data} = await axios.post(
      `https://mern-ecommerce-stores.herokuapp.com/api/v2/password/forgot`,
      {username},
      config,
    );
    dispatch({type: 'forgotPasswordSuccess', payload: data.message});
  } catch (error) {
    dispatch({
      type: 'forgotPasswordFailed',
      payload: error.response.data.message,
    });
  }
};

// update profile
export const updateProfile = (name, username, avatar) => async dispatch => {
  try {
    dispatch({type: 'updateProfileReducer'});

    const config = {headers: {'Content-Type': 'application/json'}};

    const {data} = await axios.put(
      `${URI}/api/v2/me/update/info`,
      {name, username, avatar},
      config,
    );
    dispatch({type: 'updateProfileSuccess', payload: data.success});
  } catch (error) {
    dispatch({
      type: 'updateProfileFailed',
      payload: error.response.data.message,
    });
    console.log(error.response.data.message);
  }
};

// import React, {Component, useState} from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   // Alert,
// } from 'react-native';
// import styles from './Styles';
// import {WARNA_DISABLE, WARNA_GRAYTUA} from '../../utils/constant';
// import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
// import {useNavigation} from '@react-navigation/native';
// import {responsiveHeight} from 'react-native-responsive-dimensions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {url} from '../../utils/url';

// const Login3 = ({navigation}) => {
//   const navigateTo = async page => {
//     navigation.navigate(page);
//   };
//   // const navigations = useNavigation();

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
// const handleLogin = () => {
//   fetch(
//     `${url}auth/login`,
//     // 'http://192.168.1.3/homeii/web/api/v1/auth/login',
//     {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: username,
//         password: password,
//       }),
//     },
//   )
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         console.log(data);
//         alert('Login berhasil');
//         setTimeout(() => {
//           navigation.navigate('MainApp');
//         }, 2000); // 3 detik jeda sebelum pindah ke halaman home
//       } else {
//         alert('Username atau password salah.');
//       }
//     })
//     .catch(error => console.error(error));
// };

//   return (
//     <View style={styles.viewContainer}>
//       <View style={styles.viewWrapper}>
//         <Image
//           source={require('../../assets/Images/logoLOGIN.png')}
//           style={styles.imageLogin}
//         />
//         <Text style={styles.textTitle}>LOGIN</Text>
//       </View>
//       <View style={styles.viewBox}>
//         <View>
//           <Text style={styles.textUser}>Username *</Text>
//           <View style={styles.boxInput}>
//             <View style={styles.boxIcon}>
//               <IconMaterial name="account-box" size={35} style={styles.icon} />
//             </View>
//             <TextInput
//               placeholder="username"
//               placeholderTextColor={WARNA_DISABLE}
//               style={styles.textInput}
//               value={username}
//               onChangeText={text => setUsername(text)}
//             />
//           </View>
//         </View>
//         <View>
//           <Text style={styles.textPass}>Password *</Text>
//           <View style={styles.boxInput}>
//             <View style={styles.boxIcon}>
//               <IconMaterial name="lock" size={35} style={styles.icon} />
//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 // paddingHorizontal: responsiveHeight(0.5),
//                 // marginHorizontal: responsiveHeight(-2),
//               }}>
//               <TextInput
//                 placeholder="••••••••••••"
//                 placeholderTextColor={WARNA_DISABLE}
//                 style={styles.textInput}
//                 secureTextEntry={!showPassword}
//                 value={password}
//                 onChangeText={text => setPassword(text)}
//               />
//               <IconMaterial
//                 name={showPassword ? 'eye' : 'eye-off'}
//                 size={25}
//                 style={{
//                   color: WARNA_GRAYTUA,
//                   // marginHorizontal: responsiveHeight(-2),
//                   // marginRight: responsiveHeight(8),
//                 }}
//                 onPress={() => setShowPassword(!showPassword)}
//               />
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity
//           // onPress={handleForgotPassword}
//           onPress={() => navigation.navigate('ForgotPassword')}>
//           <Text style={styles.textFP}>Forgot Password?</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={handleLogin}
//           // onPress={() => navigateTo('MainApp')}
//         >
//           <View style={styles.viewButton}>
//             <Text style={styles.textLogin}>LOGIN</Text>
//           </View>
//         </TouchableOpacity>
//         <View style={styles.space}>
//           <Text style={styles.textDHA}>Don't have an account?</Text>
//           <TouchableOpacity onPress={() => navigateTo('Register3')}>
//             <Text style={styles.textRegister}>Register</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Login3;

// import React, {Component, useState} from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   SafeAreaView,
//   Alert,
// } from 'react-native';
// import styles from './Styles';
// import {
//   WARNA_DISABLE,
//   WARNA_UTAMA,
//   WARNA_SEKUNDER,
//   WARNA_WHITE,
//   WARNA_GRAYTUA,
// } from '../../utils/constant';
// import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
// import {Checkbox} from 'react-native-paper';
// import {url} from '../../utils/url';

// const Register3 = ({navigation}) => {
//   const navigateTo = async page => {
//     navigation.navigate(page);
//   };
//   const [checked, setChecked] = React.useState(false);
//   const CheckBox = () => {
//     return (
//       <View style={styles.check}>
//         <Checkbox
//           status={checked ? 'checked' : 'unchecked'}
//           onPress={() => {
//             setChecked(!checked);
//           }}
//         />
//       </View>
//     );
//   };

//   const [name, setName] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleRegister = () => {
//     fetch(
//       `${url}auth/register`,
//       // 'http://192.168.1.3/homeii/web/api/v1/auth/register',
//       {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: name,
//           username: username,
//           email: email,
//           phone: phone,
//           password: password,
//         }),
//       },
//     )
//       // .then(response => response.json())
//       // .then(data => {
//       //   console.log(data); // Handle response data here
//       //   alert('Register berhasil');
//       //   setTimeout(() => {
//       //     navigation.navigate('Login3');
//       //   }, 2000); // Navigate to home screen after 3 seconds
//       // })
//       .then(response => response.json())
//       .then(data => {
//         if (data.success) {
//           console.log(data);
//           alert('Register berhasil');
//           setTimeout(() => {
//             navigation.navigate('Login3');
//           }, 2000); // 3 detik jeda sebelum pindah ke halaman home
//         } else {
//           alert('Data salah.');
//         }
//       })
//       .catch(error => console.error(error));
//   };
//   return (
//     <ScrollView>
//       <SafeAreaView style={styles.viewContainer}>
//         <View style={styles.viewWrapper}>
//           <Image
//             source={require('../../assets/Images/logoREGISTER.png')}
//             style={styles.imageRegister}
//           />
//           <Text style={styles.textTitle}>REGISTER</Text>
//         </View>
//         <View style={styles.viewBox}>
//           <View>
//             <Text style={styles.textUser}>Name *</Text>
//             <View style={styles.boxInput}>
//               <View style={styles.boxIcon}>
//                 <IconMaterial name="account" size={35} style={styles.icon} />
//               </View>
//               <TextInput
//                 placeholder="name"
//                 placeholderTextColor={WARNA_DISABLE}
//                 style={styles.textInput}
//                 value={name}
//                 onChangeText={text => setName(text)}
//               />
//             </View>
//           </View>
//           <View>
//             <Text style={styles.textPass}>Username *</Text>
//             <View style={styles.boxInput}>
//               <View style={styles.boxIcon}>
//                 <IconMaterial
//                   name="account-box"
//                   size={35}
//                   style={styles.icon}
//                 />
//               </View>
//               <TextInput
//                 placeholder="username"
//                 placeholderTextColor={WARNA_DISABLE}
//                 style={styles.textInput}
//                 onChangeText={text => setUsername(text)}
//                 value={username}
//               />
//             </View>
//           </View>
//           <View>
//             <Text style={styles.textPass}>Email *</Text>
//             <View style={styles.boxInput}>
//               <View style={styles.boxIcon}>
//                 <IconMaterial name="email" size={35} style={styles.icon} />
//               </View>
//               <TextInput
//                 placeholder="mail@mail.co"
//                 placeholderTextColor={WARNA_DISABLE}
//                 style={styles.textInput}
//                 onChangeText={text => setEmail(text)}
//                 value={email}
//                 keyboardType="email-address"
//               />
//             </View>
//           </View>
//           <View>
//             <Text style={styles.textPass}>Phone *</Text>
//             <View style={styles.boxInput}>
//               <View style={styles.boxIcon}>
//                 <IconMaterial name="phone" size={35} style={styles.icon} />
//               </View>
//               <TextInput
//                 placeholder="08#######"
//                 placeholderTextColor={WARNA_DISABLE}
//                 style={styles.textInput}
//                 onChangeText={text => setPhone(text)}
//                 value={phone}
//                 keyboardType="phone-pad"
//               />
//             </View>
//           </View>

//           <View>
//             <Text style={styles.textPass}>Password *</Text>
//             <View style={styles.boxInput}>
//               <View style={styles.boxIcon}>
//                 <IconMaterial name="lock" size={35} style={styles.icon} />
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   // paddingHorizontal: responsiveHeight(0.5),
//                   // marginHorizontal: responsiveHeight(-2),
//                 }}>
//                 <TextInput
//                   placeholder="••••••••••••"
//                   placeholderTextColor={WARNA_DISABLE}
//                   style={styles.textInput}
//                   secureTextEntry={!showPassword}
//                   onChangeText={text => setPassword(text)}
//                   value={password}
//                 />
//                 <IconMaterial
//                   name={showPassword ? 'eye' : 'eye-off'}
//                   size={25}
//                   style={{
//                     color: WARNA_GRAYTUA,
//                     // marginHorizontal: responsiveHeight(-2),
//                     // marginRight: responsiveHeight(8),
//                   }}
//                   onPress={() => setShowPassword(!showPassword)}
//                 />
//               </View>
//             </View>
//           </View>
//           {/* <View>
//             <Text style={styles.textPass}>Konfirmasi Password *</Text>
//             <View style={styles.boxInput}>
//               <View style={styles.boxIcon}>
//                 <IconMaterial name="lock" size={35} style={styles.icon} />
//               </View>
//               <TextInput
//                 placeholder="Masukan konfirmasi password ..."
//                 placeholderTextColor={WARNA_DISABLE}
//                 secureTextEntry
//                 style={styles.textInput}
//               />
//             </View>
//           </View> */}
//           <View style={styles.space1}>
//             <CheckBox />
//             <Text style={styles.textFP}>
//               Dengan mendaftar, saya menyetujui Syarat dan Ketentuan serta
//               Kebijakan privasi
//             </Text>
//           </View>
//           <TouchableOpacity
//             // onPress={() => navigateTo('Login2')}
//             onPress={handleRegister}>
//             <View style={styles.viewButton}>
//               <Text style={styles.textRegister}>REGISTER</Text>
//             </View>
//           </TouchableOpacity>
//           <View style={styles.space}>
//             <Text style={styles.textAHA}>Aready have an account?</Text>
//             <TouchableOpacity onPress={() => navigateTo('Login3')}>
//               <Text style={styles.textLogin}>Login</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     </ScrollView>
//   );
// };

// export default Register3;
