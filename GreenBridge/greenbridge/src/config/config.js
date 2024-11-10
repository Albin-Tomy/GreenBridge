const config = {
    registrationApi: process.env.REACT_APP_REGISTER_API ,
    loginApi: process.env.REACT_APP_LOGIN_API ,
    passwordResetApi:process.env.REACT_APP_FORGET_PASSWORD_API,
    googleAuthLoginApi: process.env.REACT_APP_GOOGLE_AUTH_API ,
    getProductApi: process.env.REACT_APP_GET_PRODUCT_API ,
    createProductApi: process.env.REACT_APP_ADD_PRODUCT_API ,
    deleteProductApi: process.env.REACT_APP_DELETE_PRODUCT_API ,
    updateProductApi: process.env.REACT_APP_EDIT_PRODUCT_API ,
    productDetailsApi: process.env.REACT_APP_PRODUCT_DETAILS_API ,
    getCategoryApi:process.env.REACT_APP_GET_CATEGORY_API,
    getOrdersApi:process.env.REACT_APP_GET_ORDERS_API,
    getAllUsers:process.env.REACT_APP_GET_USERS_API,
    getBrandsApi:process.env.REACT_APP_GET_BRANDS_API,
    getCountriesApi:process.env.REACT_APP_GET_COUNTRIES_API,
    getMadeofApis:process.env.REACT_APP_GET_MADEOF_API,

    deleteCategoryApi:process.env.REACT_APP_DELETE_CATEGORY_API,
    deleteMadeOfApi:process.env.REACT_APP_DELETE_MADEOF_API,
    deleteCountryApi:process.env.REACT_APP_DELETE_COUNTRIES_API,
    deleteBrandApi:process.env.REACT_APP_DELETE_BRANDS_API,

    // googleAuthLoginApi: 'https://albintomy.pythonanywhere.com/api/v1/auth/google-signin/'

  };
   
  export default config;