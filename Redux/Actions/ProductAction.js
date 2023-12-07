import axios from 'axios';
import {URI} from '../URI';
import {useSelector, useDispatch} from 'react-redux';
export const getProduct =
  (keyword = '') =>
  async dispatch => {
    try {
      dispatch({
        type: 'allProductRequest',
      });
      const {data} = await axios.get(
        `${URI}api/produk/list-produk?id_kat=${keyword}`,
      );
      dispatch({
        type: 'allProductSuccess',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'allProductFail',
        payload: error.response.data.message,
      });
    }
  };

// add to wishlist
export const addWishList =
  (
    productName,
    quantity,
    productImage,
    productPrice,
    userId,
    productId,
    Stock,
  ) =>
  async dispatch => {
    try {
      dispatch({
        type: 'addWishListRequest',
      });
      const {data} = await axios.post(
        `${URI}/api/v2/addToWishlist`,
        {
          productName,
          quantity,
          productImage,
          productPrice,
          userId,
          productId,
          Stock,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      dispatch({
        type: 'addWishListSuccess',
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: 'addWishListFail',
        payload: error.response.data.message,
      });
    }
  };

// remove from wishlist
export const removeWishList = id => async dispatch => {
  try {
    dispatch({
      type: 'removeWishListRequest',
    });
    const {data} = await axios.delete(`${URI}/api/v2/removeWishlist/${id}`);
    dispatch({
      type: 'removeWishListSuccess',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'removeWishListFail',
      payload: error.response.data.message,
    });
  }
};

// get wishlist data
export const getWishList = () => async dispatch => {
  try {
    dispatch({
      type: 'getWishListRequest',
    });
    const {data} = await axios.get(`${URI}/api/v2/wishlist`);
    dispatch({
      type: 'getWishListSuccess',
      payload: data.wishlistData,
    });
  } catch (error) {
    dispatch({
      type: 'getWishListFail',
      payload: error.response.data.message,
    });
  }
};

// add to cart
export const addCart =
  (
    // productName,
    produk_id,
    user_id,
    variant1,
    variant2,
    harga,
    jumlah,
    // id_transaksi=0,
    // productImage,
    // productPrice,
    // Stock,
  ) =>
  async dispatch => {
    dispatch({
      type: 'addCartRequest',
    });
    return fetch(`${URI}api/keranjang/add-cart`, {
      method: 'POST',
      headers: {
        'Accept-type': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        produk_id,
        user_id,
        variant1,
        variant2,
        harga,
        jumlah,
      }),
    })
      .then(response => response.json())
      .then(cartt => {
        console.log(cartt);
        if (cartt.success) {
          dispatch({
            type: 'addCartSuccess',
            payload: cartt,
          });
        } else {
          dispatch({
            type: 'addCartFail',
            payload: error.response.cartt.message,
          });
          console.log(error.response.cartt.message);
        }
        // if (user.success) {
        //   const IP1m4rt = user.user.secret_token;
        //   console.log(IP1m4rt);
        //   // Menyimpan secret token di storage lokal (misalnya AsyncStorage di React Native)
        //   AsyncStorage.setItem('IP1m4rt', IP1m4rt)
        //     .then(() => {
        //       // Jika penyimpanan berhasil, memperbarui state aplikasi dengan status login
        //       console.log(username);
        //       console.log(user);
        //       setTimeout(() => {
        //         dispatch({
        //           type: 'userLoginSuccess',
        //           payload: user.user,
        //         });
        //       }, 2000); // 3 detik jeda sebelum pindah ke halaman home
        //     })
        //     .catch(error => {
        //       // Menangani kesalahan saat menyimpan secret token
        //       setTimeout(() => {
        //         dispatch({type: 'userLoginFalse', payload: user.message});
        //       }, 2000);
        //     });
        // } else {
        //   console.log(password);
        //   console.log(user);
        //   setTimeout(() => {
        //     dispatch({type: 'userLoginFalse', payload: user.message});
        //   }, 2000);
        // }
        // console.log(user);
      })
      .catch(error => {
        dispatch({
          type: 'addCartFail',
          payload: error.response.cartt.message,
        });
        console.log(error.response.cartt.message);
      });
    // try {
    //   console.log(product_id);
    //   console.log(user_id);
    //   console.log(variant1);
    //   console.log(variant2);
    //   console.log(harga);
    //   console.log(jumlah);
    //   dispatch({
    //     type: 'addCartRequest',
    //   });
    //   const config = {
    //     headers: {
    //       'Accept-type': 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //   };
    //   const {data} = await axios.post(config, `${URI}api/keranjang/add-cart`, {
    //     product_id,
    //     user_id,
    //     variant1,
    //     variant2,
    //     harga,
    //     jumlah,
    //   });
    //   dispatch({
    //     type: 'addCartSuccess',
    //     payload: data,
    //   });
    // } catch (error) {
    //   dispatch({
    //     type: 'addCartFail',
    //     payload: error.response.data.message,
    //   });
    //   console.log(error.response.data.message);
    // }
  };

export const getCart = () => async dispatch => {
  const {user} = useSelector(state => state.user);
  try {
    dispatch({
      type: 'getCartRequest',
    });
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
          return {
            ...item,
            nama: productData.nama,
            image: productData.foto_banner,
          };
        }),
      );
      dispatch({
        type: 'getCartSuccess',
        payload: cartData,
      });
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    dispatch({
      type: 'getCartFail',
      payload: error.response.data.message,
    });
  }
};

// remove from cart
export const removeCart = id => async dispatch => {
  try {
    dispatch({
      type: 'removeCartRequest',
    });
    const {data} = await axios.delete(
      `${URI}/api/keranjang/remove-cart/?id=` + id,
    );
    console.log(data);
    dispatch({
      type: 'removeCartSuccess',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'removeCartFail',
      payload: error.response.data.message,
    });
  }
};

// update cart
export const updateCart = (id, quantity) => async dispatch => {
  try {
    dispatch({
      type: 'updateCartRequest',
    });
    const {data} = await axios.put(`${URI}/api/v2/cart/update/${id}`, {
      quantity,
    });
    dispatch({
      type: 'updateCartSuccess',
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: 'updateCartFail',
      payload: error.response.data.message,
    });
  }
};

// create review
export const createReview = (rating, comment, productId) => async dispatch => {
  try {
    dispatch({
      type: 'createReviewRequest',
    });
    const config = {
      headers: {'Content-Type': 'application/json'},
    };
    const {data} = await axios.post(
      `${URI}/api/v2/product/review`,
      {
        rating,
        comment,
        productId,
      },
      config,
    );
    dispatch({
      type: 'createReviewSuccess',
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: 'createReviewFail',
      payload: error.response.data.message,
    });
  }
};
