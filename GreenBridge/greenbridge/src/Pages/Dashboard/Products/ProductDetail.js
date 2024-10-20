// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import './product-detail.css';
// import Navbar from '../../../components/Header';
// // import { Toast } from 'bootstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ProductDetail = () => {
//   const { id } = useParams(); // Get the product ID from the URL
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState({});
//   const [brands, setBrands] = useState({});
//   const [countries, setCountries] = useState({});
//   const [materials, setMaterials] = useState({});

//   const BASE_URL = 'http://127.0.0.1:8000';
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     // Fetch product details
//     axios.get(`http://127.0.0.1:8000/api/v1/products/details/${id}/`)
//       .then(response => {
//         setProduct(response.data);
//         console.log('Fetched product details:', response.data); 
//         setLoading(false);
//       })
//       .catch(error => {
//         setError('There was a problem fetching product details. Please try again later.');
//         console.error(error);
//         setLoading(false);
//       });

    // // Fetch category data
    // axios.get('http://127.0.0.1:8000/api/v1/products/category-list/')
    //   .then(response => {
    //     const categoryMap = response.data.reduce((acc, category) => {
    //       acc[category.id] = category.name;
    //       return acc;
    //     }, {});
    //     setCategories(categoryMap);
    //   });

//     // Fetch brand data
//     axios.get('http://127.0.0.1:8000/api/v1/products/brand-list/')
//       .then(response => {
//         const brandMap = response.data.reduce((acc, brand) => {
//           acc[brand.brand_id] = brand.name;
//           return acc;
//         }, {});
//         setBrands(brandMap);
//       });

//     // Fetch country data
//     axios.get('http://127.0.0.1:8000/api/v1/products/country-list/')
//       .then(response => {
//         const countryMap = response.data.reduce((acc, country) => {
//           acc[country.country_id] = country.name;
//           return acc;
//         }, {});
//         setCountries(countryMap);
//       });

    // // Fetch material data
    // axios.get('http://127.0.0.1:8000/api/v1/products/madeof-list/')
    //   .then(response => {
    //     const materialMap = response.data.reduce((acc, material) => {
    //       acc[material.madeof_id] = material.name;
    //       return acc;
    //     }, {});
    //     setMaterials(materialMap);
    //   });

//   }, [id]); // Only run when the product ID changes

// const addToCart = (productId, quantity = 1) => {
//   console.log('Product ID to add:', productId); // Debug log

//   const userId = localStorage.getItem('userId');
//   if (!userId) {
//       alert("Please log in first to add items to the cart.");
//       return;
//   }

//   // Step 1: Check if the user already has a cart
//   axios.get(`http://127.0.0.1:8000/api/v1/orders/cart-list/?user_id=${userId}`)
//       .then(response => {
//           let cartId;

//           // Step 2: If the user has a cart, retrieve the cart ID
//           if (response.data.length > 0) {
//               cartId = response.data[0].cart_id; // Assuming first cart for the user
//           } else {
//               // Step 3: If no cart exists, create a new cart for the user
//               return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-list/', { user_id: userId })
//                   .then(response => {
//                       cartId = response.data.cart_id; // Get newly created cart ID
//                       return cartId; // Return the cart ID for the next step
//                   });
//           }

//           return cartId; // Return the cart ID if it already exists
//       })
//       .then(cartId => {
//           // Step 4: Add the product to the cart using the cart ID and include quantity
//           const dataToSend = {
//               user_id: userId,
//               product_id: productId, // Ensure this is included
//               quantity: quantity
//           };
//           console.log('Data being sent to cart-items-create:', dataToSend); // Log the data
//           return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-items-create/', dataToSend);
//       })
//       .then(response => {
//           alert('Product added to cart');
//           toast.success('Product added to cart!'); 
          
//       })
//       .catch(error => {
//           console.error('There was an error adding the product to the cart!', error.response.data);
//       });
// };



//   const addToWishlist = (productId) => {
//     // Retrieve the user_id from localStorage
//     const userId = localStorage.getItem('userId');

//     if (!userId) {
//       alert("Please log in first to add items to the wishlist.");
//       return;
//     }

//     // Step 1: Check if the user already has a wishlist
//     axios.get(`http://127.0.0.1:8000/api/v1/orders/wishlist-list/?user_id=${userId}`)
//       .then(response => {
//         let wishlistId;

//         // Step 2: If the user has a wishlist, retrieve the wishlist ID
//         if (response.data.length > 0) {
//           wishlistId = response.data[0].wishlist_id;  // Assuming first wishlist for the user
//         } else {
//           // Step 3: If no wishlist exists, create a new wishlist for the user
//           return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-list/', { user_id: userId })
//             .then(response => {
//               wishlistId = response.data.wishlist_id;  // Get newly created wishlist ID
//             });
//         }

//         return wishlistId;  // Return the wishlist ID for the next step
//       })
//       .then(wishlistId => {
//         // Step 4: Add the product to the wishlist using the wishlist ID
//         return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-items-create/', {
//           wishlist_id: wishlistId,
//           product_id: productId  // Use the product ID from the parameter
//         });
//       })
//       .then(response => {
//         alert('Product added to wishlist');
//       })
//       .catch(error => {
//         console.error('There was an error adding the product to the wishlist!', error);
//       });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!product) {
//     return <div>Product not found</div>;
//   }

//   return (
//     <div>
//     <Navbar />
//     <div className="product-detail-page">
//       {product && (
//         <>
//           <nav className="breadcrumb">
//             <a href="/products">Home</a> / {categories[product.category]} / {product.name}
//           </nav>

//           <div className="product-container">
//             <div className="product-image-container">
//               <img
//                 src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/150'}
//                 alt={product.name}
//                 className="product-images"
//               />
//             </div>

//             <div className="product-info">
//               <h1>{product.name}</h1>
//               <p className="price">₹ {product.price}</p>
//               <p className="rating">Rating: {product.rating}</p>
//               <p className="description">{product.description}</p>

//               <div className="product-details">
//                 <h4>Product Details</h4>
//                 <ul>
//                   <li>Brand: {brands[product.brand]}</li>
//                   <li>Category: {categories[product.category]}</li>
//                   <li>Material: {materials[product.made_of]}</li>
//                   <li>Country: {countries[product.country]}</li>
//                   <li>Stock Quantity: {product.stock_quantity}</li>
//                 </ul>
//               </div>

//               <div className="product-actions">
//                 <div className="quantity-input">
//                   <label htmlFor="quantity">Quantity:</label>
//                   <input
//                     type="number"
//                     id="quantity"
//                     value={quantity}
//                     onChange={(e) => setQuantity(e.target.value)}
//                     min="1"
//                     max={product.stock_quantity}
//                   />
//                 </div>
//                 <button onClick={() => addToWishlist(product.product_id)} className="wishlist-btn">
//                   <i className="fas fa-heart"></i> Add to Wishlist
//                 </button>
//                 <button onClick={() => addToCart(product.product_id, quantity)} className="cart-btn">
//                   <i className="fas fa-shopping-cart"></i> Add to Cart
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   </div>
//   );
// };

// export default ProductDetail;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './product-detail.css';
import Navbar from '../../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [countries, setCountries] = useState({});
  const [materials, setMaterials] = useState({});
  const BASE_URL = 'http://127.0.0.1:8000';
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Fetch product details
    axios.get(`http://127.0.0.1:8000/api/v1/products/details/${id}/`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was a problem fetching product details. Please try again later.');
        setLoading(false);
      });

    // Fetch additional data (categories, brands, countries, materials)...
    // Fetch category data
    axios.get('http://127.0.0.1:8000/api/v1/products/category-list/')
      .then(response => {
        const categoryMap = response.data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        setCategories(categoryMap);
      });

      // Fetch material data
    axios.get('http://127.0.0.1:8000/api/v1/products/madeof-list/')
    .then(response => {
      const materialMap = response.data.reduce((acc, material) => {
        acc[material.madeof_id] = material.name;
        return acc;
      }, {});
      setMaterials(materialMap);
    });

  }, [id]);

  // const addToCart = (productId, quantity = 1) => {
  //   const userId = localStorage.getItem('userId');
  //   if (!userId) {
  //     toast.error("Please log in first to add items to the cart.");
  //     return;
  //   }

  //   axios.get(`http://127.0.0.1:8000/api/v1/orders/cart-list/?user_id=${userId}`)
  //     .then(response => {
  //       let cartId;

  //       if (response.data.length > 0) {
  //         cartId = response.data[0].cart_id; // Assuming first cart for the user
  //       } else {
  //         return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-list/', { user_id: userId })
  //           .then(response => {
  //             cartId = response.data.cart_id;
  //             return cartId;
  //           });
  //       }

  //       return cartId;
  //     })
  //     .then(cartId => {
  //       const dataToSend = {
  //         user_id: userId,
  //         product_id: productId,
  //         quantity: quantity
  //       };

  //       return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-items-create/', dataToSend);
  //     })
  //     .then(() => {
  //       toast.success('Product added to cart!');
  //     })
  //     .catch(error => {
  //       toast.error('Error adding the product to the cart!');
  //     });
  // };

  const addToCart = (productId, quantity = 1) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("Please log in first to add items to the cart.");
      return;
    }
  
    axios.get(`http://127.0.0.1:8000/api/v1/orders/cart-list/?user_id=${userId}`)
      .then(response => {
        let cartId;
  
        if (response.data.length > 0) {
          cartId = response.data[0].cart_id; // Assuming first cart for the user
        } else {
          return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-list/', { user_id: userId })
            .then(response => {
              cartId = response.data.cart_id;
              return cartId;
            });
        }
  
        return cartId;
      })
      .then(cartId => {
        const dataToSend = {
          user_id: userId,
          product_id: productId,
          quantity: quantity
        };
  
        return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-items-create/', dataToSend);
      })
      .then(() => {
        toast.success('Product added to cart!');
      })
      .catch(error => {
        toast.error('Error adding the product to the cart!');
      });
  };
  

  const addToWishlist = (productId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("Please log in first to add items to the wishlist.");
      return;
    }
  
    axios.get(`http://127.0.0.1:8000/api/v1/orders/wishlist-list/?user_id=${userId}`)
      .then(response => {
        let wishlistId;
  
        if (response.data.length > 0) {
          wishlistId = response.data[0].wishlist_id;
        } else {
          return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-list/', { user_id: userId })
            .then(response => {
              wishlistId = response.data.wishlist_id;
            });
        }
  
        return wishlistId;
      })
      .then(wishlistId => {
        return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-items-create/', {
          wishlist_id: wishlistId,
          product_id: productId
        });
      })
      .then(() => {
        toast.success('Product added to wishlist!');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error === "Product is already in the wishlist") {
          // Display the message if product is already in the wishlist
          toast.info('Product is already in the wishlist.');
        } else {
          // Handle other errors
          toast.error('Error adding product to wishlist!');
        }
      });
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="product-detail-page">
        <ToastContainer 
          position="top-center"  // Centered position
          autoClose={3000}  // Auto close after 3 seconds
          hideProgressBar={false}  // Show progress bar
          newestOnTop={false}  // Older toasts appear at the bottom
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {product && (
          <>
            <nav className="breadcrumb">
              <a href="/products">Home</a> / {categories[product.category]} / {product.name}
            </nav>

            <div className="product-container">
              <div className="product-image-container">
                <img
                  src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="product-images"
                />
              </div>

              <div className="product-info">
                <h1>{product.name}</h1>
                <p className="price">₹ {product.price}</p>
                <p className="rating">Rating: {product.rating}</p>
                <p className="description">{product.description}</p>

                <div className="product-details">
                  <h4>Product Details</h4>
                  <ul>
                    {/* <li>Brand: {brands[product.brand]}</li> */}
                    <li>Category: {categories[product.category]}</li>
                    <li>Material: {materials[product.made_of]}</li>
                    {/* <li>Country: {countries[product.country]}</li> */}
                    <li>Stock Quantity: {product.stock_quantity}</li>
                  </ul>
                </div>

                <div className="product-actions">
                  <div className="quantity-input">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      max={product.stock_quantity}
                    />
                  </div>
                  <button onClick={() => addToWishlist(product.product_id)} className="wishlist-btn">
                    <i className="fas fa-heart"></i> Add to Wishlist
                  </button>
                  <button onClick={() => addToCart(product.product_id, quantity)} className="cart-btn">
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
