
import React, { useEffect, useState } from 'react';
import DataTable from './DataTable'; 
import axios from 'axios';
import { IoMdClose } from "react-icons/io";

function OrderItemsTable({ data, handleCloseForm }) {
  const [orderItems, setOrderItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const columns = React.useMemo(
    () => [
      { Header: 'Order Item ID', accessor: 'order_item_id' },
      { Header: 'Order ID', accessor: 'order_id' },
      {
        Header: 'Product',
        accessor: 'product_id',
        Cell: ({ row }) => {
          const product = allProducts.find(prod => prod.product_id === row.original.product_id);
          
          return (
            <div>
              <strong>{product ? product.name : 'Unknown Product'}</strong>
              {product && (
                <div className="admin-table-subtext">
                  <sub>Id: {row.original.product_id}</sub>
                </div>
              )}
            </div>
          );
        },
      },
      { Header: 'Quantity', accessor: 'quantity' },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Created At', accessor: 'created_at' },
    ],
    [allProducts]
  );

  useEffect(() => {
    fetchProducts();
    fetchOrderItems();
  }, [data]);

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/v1/products/list/')
      .then((response) => {
        setAllProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchOrderItems = () => {
    axios.get(`http://127.0.0.1:8000/api/v1/orders/items-list/${data?.order_id}/`)
      .then((response) => {
        setOrderItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (item) => {
    console.log('Delete item:', item);
    axios.delete(`http://127.0.0.1:8000/api/v1/orders/items-detail/${item?.order_item_id}/`)
      .then(() => {
        fetchOrderItems();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="order-items-table-container" style={{ position: 'relative' }}>
      <h2>Order Id #{data.order_id}</h2>
      <p>Order Items</p>
      <DataTable
        columns={columns}
        data={orderItems ?? []}
        onEdit={() => {}} 
        onDelete={handleDelete}
        hideActiveButton={true}
        showViewMoreIcon={false}
      />
      <button 
        onClick={handleCloseForm} 
        style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', background: 'none', border: 'none' }}
        aria-label="Close"
      >
        <IoMdClose style={{ fontSize: '24px' }} />
      </button>
    </div>
  );
}

export default OrderItemsTable;