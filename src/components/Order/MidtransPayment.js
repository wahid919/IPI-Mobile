// import React, {useEffect} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {WebView} from 'react-native-webview';
// import axios from 'axios';
// import {URI} from '../../../Redux/URI';

// const MidtransPayment = ({navigation}) => {
//   useEffect(() => {
//     const fetchPaymentToken = async () => {
//       try {
//         const response = await axios.post(
//           `${URI}api/pembayaran/create-pembayaran?totalbayar=400000&tujuan=63&kodepospembeli=12121&berat=5000&ongkir=50000&kurir=jne&paket=undefined&alamatpembeli=sasasa`,
//         );
//         const paymentToken = response.data.paymentToken;
//         setSnapToken(token);
//         console.log(paymentToken);
//         await AsyncStorage.setItem('paymentToken', paymentToken);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     // try {
//     //     const response = await axios.post('URL_API_ANDA/endpoint_payment_token', {
//     //       // Data pembayaran yang diperlukan, misalnya jumlah, deskripsi, dll.
//     //     });
//     //     const paymentToken = response.data.token;
//     //     await AsyncStorage.setItem('paymentToken', paymentToken);
//     //   } catch (error) {
//     //     console.error(error);
//     //   }

//     fetchPaymentToken();
//   }, []);

//   const handleWebViewNavigationStateChange = async newNavState => {
//     const {url} = newNavState;

//     if (url.includes('URL_CALLBACK_ANDA')) {
//       const paymentToken = await AsyncStorage.getItem('paymentToken');
//       await AsyncStorage.removeItem('paymentToken');

//       // Lakukan permintaan ke server Anda untuk memverifikasi pembayaran

//       navigation.navigate('HalamanTerimaKasih');
//     }
//   };
//   console.log(paymentToken);
//   return (
//     <WebView
//       source={{
//         uri: `https://app.sandbox.midtrans.com/snap/v1/transactions/${paymentToken}/redirect`,
//       }}
//       onNavigationStateChange={handleWebViewNavigationStateChange}
//     />
//   );
// };

// export default MidtransPayment;

import React, {useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {TouchableOpacity, Text} from 'react-native';

const MidtransPayment = ({route, navigation}) => {
  const {url} = route.params;

  const handleWebViewClose = () => {
    navigation.goBack();
  };

  return (
    <>
      <TouchableOpacity onPress={handleWebViewClose} style={{padding: 10}}>
        <Text style={{color: 'black'}}>Close</Text>
      </TouchableOpacity>
      <WebView source={{uri: url}} />
    </>
  );
};

export default MidtransPayment;
