export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export  const getItemById = (id, data) => {
    return data.find((item) => item.product_id === id);
  };


export  const orderItemById = (id, data) => {
    return data.find((item) => item.order_id === id);
  };

  export  const categoryItemById = (id, data) => {
    return data.find((item) => item.id === id);
  };


export  const getBrandById = (id, data) => {
    return data.find((item) => item.brand_id === id);
  };


export  const getCountryById = (id, data) => {
    return data.find((item) => item.country_id === id);
  };


export  const getMadeofById = (id, data) => {
    return data.find((item) => item.madeof_id === id);
  };
