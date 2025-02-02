import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, IconButton, CircularProgress,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,
  Dialog, DialogContent, Chip, Switch
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Dashboard, ShoppingCart, People, Store, Business,
  Handshake, Assignment, LocalShipping, Assessment,
  Home, Fastfood, KeyboardArrowDown, KeyboardArrowUp,
  DeleteForever as DeleteForeverIcon,
  Groups as VolunteerIcon,
  Category as CategoryIcon,
  RecyclingRounded as WasteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import ProductForm from '../../../components/Forms/ProductForm';
import OrderForm from '../../../components/Forms/OrderForm';
import UserForm from '../../../components/Forms/UserForm';
import './AdminDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingSHGs, setPendingSHGs] = useState([]);
  const [pendingNGOs, setPendingNGOs] = useState([]);
  const [foodRequests, setFoodRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState('');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalFoodRequests: 0,
    pendingFoodRequests: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    monthlySales: [],
    userTypes: [],
    orderStatus: [],
    revenueByCategory: []
  });
  const [expandedMenu, setExpandedMenu] = useState('');
  const [allSHGs, setAllSHGs] = useState([]);
  const [allNGOs, setAllNGOs] = useState([]);
  const [wasteRequests, setWasteRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [wasteCategories, setWasteCategories] = useState([]);
  const [wasteSubCategories, setWasteSubCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeSection) {
        case 'dashboard':
          await fetchDashboardData();
          break;
        case 'products':
          const productsRes = await axios.get('http://127.0.0.1:8000/api/v1/products/list/', getAuthHeader());
          setProducts(productsRes.data);
          break;
        case 'orders':
          const ordersRes = await axios.get('http://127.0.0.1:8000/api/v1/orders/list/', getAuthHeader());
          setOrders(ordersRes.data);
          break;
        case 'users':
          const usersRes = await axios.get('http://127.0.0.1:8000/api/v1/auth/users/', getAuthHeader());
          setUsers(usersRes.data);
          break;
        case 'pending-shgs':
          const shgsRes = await axios.get('http://127.0.0.1:8000/api/adminpanel/pending/', getAuthHeader());
          setPendingSHGs(shgsRes.data);
          break;
        case 'pending-ngos':
          const ngosRes = await axios.get('http://127.0.0.1:8000/api/ngo/pending/', getAuthHeader());
          setPendingNGOs(ngosRes.data);
          break;
        case 'food-requests':
          const foodRes = await axios.get('http://127.0.0.1:8000/api/v1/food/all/', getAuthHeader());
          setFoodRequests(foodRes.data);
          break;
        case 'all-shgs':
          axios.get('http://127.0.0.1:8000/api/adminpanel/all/', getAuthHeader())
            .then(response => {
              setAllSHGs(response.data);
            })
            .catch(error => console.error('Error fetching SHGs:', error));
          break;
        case 'all-ngos':
          axios.get('http://127.0.0.1:8000/api/ngo/all/', getAuthHeader())
            .then(response => {
              setAllNGOs(response.data);
            })
            .catch(error => console.error('Error fetching NGOs:', error));
          break;
        case 'waste-requests':
          axios.get('http://127.0.0.1:8000/api/v1/waste/requests/', getAuthHeader())
            .then(response => {
              setWasteRequests(response.data);
            })
            .catch(error => console.error('Error fetching waste requests:', error));
          break;
        case 'waste-categories':
          axios.get('http://127.0.0.1:8000/api/v1/waste/categories/', getAuthHeader())
            .then(response => {
              setWasteCategories(response.data);
            })
            .catch(error => console.error('Error fetching waste categories:', error));
          break;
        case 'waste-subcategories':
          axios.get('http://127.0.0.1:8000/api/v1/waste/subcategories/', getAuthHeader())
            .then(response => {
              setWasteSubCategories(response.data);
            })
            .catch(error => console.error('Error fetching waste subcategories:', error));
          break;
        case 'volunteers':
          axios.get('http://127.0.0.1:8000/api/v1/volunteers/', getAuthHeader())
            .then(response => {
              setVolunteers(response.data);
            })
            .catch(error => console.error('Error fetching volunteers:', error));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
    setLoading(false);
  };

  const fetchDashboardData = async () => {
    try {
      const [
        productsRes, 
        ordersRes, 
        usersRes, 
        shgsRes, 
        ngosRes,
        foodRes
      ] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/v1/products/list/', getAuthHeader()),
        axios.get('http://127.0.0.1:8000/api/v1/orders/list/', getAuthHeader()),
        axios.get('http://127.0.0.1:8000/api/v1/auth/users/', getAuthHeader()),
        axios.get('http://127.0.0.1:8000/api/adminpanel/all/', getAuthHeader()),
        axios.get('http://127.0.0.1:8000/api/ngo/all/', getAuthHeader()),
        axios.get('http://127.0.0.1:8000/api/v1/food/all/', getAuthHeader())
      ]);

      // Calculate totals with proper error handling
      const totalProducts = Array.isArray(productsRes.data) ? productsRes.data.length : 0;
      const totalOrders = Array.isArray(ordersRes.data) ? ordersRes.data.length : 0;
      const totalUsers = (
        (Array.isArray(usersRes.data) ? usersRes.data.length : 0) +
        (Array.isArray(shgsRes.data) ? shgsRes.data.length : 0) +
        (Array.isArray(ngosRes.data) ? ngosRes.data.length : 0)
      );

      const totalRevenue = Array.isArray(ordersRes.data) 
        ? ordersRes.data.reduce((acc, order) => {
            const amount = parseFloat(order.total_amount);
            return acc + (isNaN(amount) ? 0 : amount);
          }, 0)
        : 0;

      console.log('Fetched Data:', {
        products: productsRes.data,
        orders: ordersRes.data,
        users: usersRes.data,
        shgs: shgsRes.data,
        ngos: ngosRes.data,
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue
      });

      // Update stats with the calculated values
      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue.toFixed(2)
      });

      // Set the data for other components
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);

      // Update analytics data
      setAnalyticsData({
        monthlySales: processMonthlyData(ordersRes.data || []),
        userTypes: [
          { name: 'Regular Users', value: Array.isArray(usersRes.data) ? usersRes.data.length : 0 },
          { name: 'SHGs', value: Array.isArray(shgsRes.data) ? shgsRes.data.length : 0 },
          { name: 'NGOs', value: Array.isArray(ngosRes.data) ? ngosRes.data.length : 0 }
        ],
        orderStatus: processOrderStatus(ordersRes.data || []),
        revenueByCategory: processRevenueByCategory(ordersRes.data || [], productsRes.data || [])
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  // Data processing functions
  const processMonthlyData = (orders) => {
    const monthlyData = Array(12).fill(0);
    orders.forEach(order => {
      const date = new Date(order.created_at || order.order_date);
      if (!isNaN(date.getTime())) {
        const month = date.getMonth();
        monthlyData[month] += parseFloat(order.total_amount) || 0;
      }
    });
    
    return monthlyData.map((amount, index) => ({
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      amount: parseFloat(amount.toFixed(2))
    }));
  };

  const processUserTypes = (users, shgs, ngos) => [
    { name: 'Regular Users', value: users.length },
    { name: 'SHGs', value: shgs.length },
    { name: 'NGOs', value: ngos.length }
  ];

  const processOrderStatus = (orders) => {
    const statusCount = orders.reduce((acc, order) => {
      const status = order.order_status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count
    }));
  };

  const processRevenueByCategory = (orders, products) => {
    const categoryRevenue = {};
    
    orders.forEach(order => {
      const product = products.find(p => p.product_id === order.product_id);
      if (product) {
        const category = product.category?.name || 'Uncategorized';
        categoryRevenue[category] = (categoryRevenue[category] || 0) + 
          (parseFloat(order.total_amount) || 0);
      }
    });

    return Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue: parseFloat(revenue.toFixed(2))
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleApproval = async (id, type, action) => {
    try {
      if (type === 'shg') {
        await axios.post('http://127.0.0.1:8000/api/adminpanel/approve/', {
          shg_email: id,
          action: action
        }, getAuthHeader());
      } else if (type === 'ngo') {
        await axios.post('http://127.0.0.1:8000/api/ngo/approve/', {
          ngo_email: id,
          action: action
        }, getAuthHeader());
      }
      fetchData();
    } catch (error) {
      console.error('Error handling approval:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleFoodRequestStatus = async (requestId, newStatus) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/v1/food/request/${requestId}/update-status/`,
        { status: newStatus },
        getAuthHeader()
      );
      fetchData();
    } catch (error) {
      console.error('Error updating food request status:', error);
    }
  };

  const handleWasteRequestStatus = async (requestId, newStatus) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/v1/waste/request/${requestId}/update-status/`,
        { status: newStatus },
        getAuthHeader()
      );
      fetchData();
    } catch (error) {
      console.error('Error updating waste request status:', error);
    }
  };

  const handleStatusToggle = async (id, type) => {
    try {
      const endpoint = `http://127.0.0.1:8000/api/v1/${type}/toggle-status/${id}/`;
      await axios.post(endpoint, {}, getAuthHeader());
      fetchData();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const sidebarItems = [
    { text: 'Home', icon: <Home />, section: 'home' },
    { text: 'Dashboard', icon: <Dashboard />, section: 'dashboard' },
    { 
      text: 'Products', 
      icon: <Store />, 
      section: 'products',
      subItems: [
        { text: 'All Products', section: 'products' },
        { text: 'Categories', section: 'categories' },
        { text: 'Material', section: 'material' }
      ]
    },
    { text: 'Orders', icon: <LocalShipping />, section: 'orders' },
    { text: 'Users', icon: <People />, section: 'users' },
    { 
      text: 'SHGs', 
      icon: <Business />, 
      section: 'shgs',
      subItems: [
        { text: 'All SHGs', section: 'all-shgs' },
        { text: 'Pending SHGs', section: 'pending-shgs' }
      ]
    },
    { 
      text: 'NGOs', 
      icon: <Handshake />, 
      section: 'ngos',
      subItems: [
        { text: 'All NGOs', section: 'all-ngos' },
        { text: 'Pending NGOs', section: 'pending-ngos' }
      ]
    },
    { text: 'Food Requests', icon: <Fastfood />, section: 'food-requests' },
    { text: 'Waste Management', icon: <WasteIcon />, section: 'waste', subItems: [
      { text: 'Waste Requests', section: 'waste-requests' },
      { text: 'Categories', section: 'waste-categories' },
      { text: 'Sub Categories', section: 'waste-subcategories' },
      { text: 'Collection Areas', section: 'collection-areas' }
    ] },
    { 
      text: 'Volunteers', 
      icon: <VolunteerIcon />, 
      section: 'volunteers',
      subItems: [
        { text: 'All Volunteers', section: 'all-volunteers' },
        { text: 'Pending Volunteers', section: 'pending-volunteers' }
      ]
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    switch (activeSection) {
      case 'home':
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'users':
        return renderUsers();
      case 'pending-shgs':
        return renderPendingSHGs();
      case 'pending-ngos':
        return renderPendingNGOs();
      case 'all-shgs':
        return renderAllSHGs();
      case 'all-ngos':
        return renderAllNGOs();
      case 'food-requests':
        return renderFoodRequests();
      case 'waste-requests':
        return renderWasteRequests();
      case 'waste-categories':
        return renderWasteCategories();
      case 'volunteers':
        return renderVolunteers();
      default:
        return null;
    }
  };

  const handleAdd = (type) => {
    setDialogType(`add_${type}`);
    setSelectedItem(null);
    setOpenDialog(true);
  };

  const handleEdit = (item, type) => {
    setDialogType(`edit_${type}`);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        let endpoint = '';
        switch (type) {
          case 'product':
            endpoint = `http://127.0.0.1:8000/api/v1/products/delete/${id}/`;
            break;
          case 'order':
            endpoint = `http://127.0.0.1:8000/api/v1/orders/delete/${id}/`;
            break;
          case 'user':
            endpoint = `http://127.0.0.1:8000/api/v1/auth/users/delete/${id}/`;
            break;
          case 'waste-category':
            endpoint = `http://127.0.0.1:8000/api/v1/waste/categories/delete/${id}/`;
            break;
          default:
            return;
        }
        await axios.delete(endpoint, getAuthHeader());
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    }
  };

  const renderDialog = () => {
    switch (dialogType) {
      case 'add_product':
      case 'edit_product':
        return <ProductForm 
          onCancel={() => setOpenDialog(false)} 
          initialProductData={selectedItem}
          isEdit={dialogType === 'edit_product'}
        />;
      case 'add_order':
      case 'edit_order':
        return <OrderForm 
          onCancel={() => setOpenDialog(false)}
          initialOrderData={selectedItem}
          isEdit={dialogType === 'edit_order'}
        />;
      case 'add_user':
      case 'edit_user':
        return <UserForm 
          onCancel={() => setOpenDialog(false)}
          initialUserData={selectedItem}
          isEdit={dialogType === 'edit_user'}
        />;
      default:
        return null;
    }
  };

  const renderStatCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card" elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {stats.totalProducts}
                </Typography>
                <Typography color="textSecondary" variant="subtitle1">
                  Total Products
                </Typography>
              </Box>
              <Store sx={{ fontSize: 40, color: '#4CAF50' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card" elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {stats.totalOrders}
                </Typography>
                <Typography color="textSecondary" variant="subtitle1">
                  Total Orders
                </Typography>
              </Box>
              <LocalShipping sx={{ fontSize: 40, color: '#2196F3' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card" elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {stats.totalUsers}
                </Typography>
                <Typography color="textSecondary" variant="subtitle1">
                  Total Users
                </Typography>
              </Box>
              <People sx={{ fontSize: 40, color: '#FF9800' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card" elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  ${stats.totalRevenue}
                </Typography>
                <Typography color="textSecondary" variant="subtitle1">
                  Total Revenue
                </Typography>
              </Box>
              <Assessment sx={{ fontSize: 40, color: '#F44336' }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDashboard = () => {
    const chartWidth = window.innerWidth < 1200 ? window.innerWidth - 100 : 800;
    const chartHeight = 300;

    return (
      <>
        {renderStatCards()}

        <Grid container spacing={3}>
          {/* Monthly Sales Trend */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Monthly Sales Trend
              </Typography>
              <Box sx={{ width: '100%', height: chartHeight, overflowX: 'auto' }}>
                <LineChart
                  width={chartWidth}
                  height={chartHeight}
                  data={analyticsData.monthlySales}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Sales ($)" />
                </LineChart>
              </Box>
            </Paper>
          </Grid>

          {/* User Distribution */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChart width={300} height={chartHeight}>
                  <Pie
                    data={analyticsData.userTypes}
                    cx={150}
                    cy={150}
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.userTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </Paper>
          </Grid>

          {/* Order Status */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Order Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: chartHeight, overflowX: 'auto' }}>
                <BarChart
                  width={chartWidth / 2}
                  height={chartHeight}
                  data={analyticsData.orderStatus}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Number of Orders" />
                </BarChart>
              </Box>
            </Paper>
          </Grid>

          {/* Revenue by Category */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Revenue by Category
              </Typography>
              <Box sx={{ width: '100%', height: chartHeight, overflowX: 'auto' }}>
                <BarChart
                  width={chartWidth / 2}
                  height={chartHeight}
                  data={analyticsData.revenueByCategory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                </BarChart>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderProducts = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Products Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAdd('product')}
        >
          Add Product
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Switch
                  checked={product.is_active}
                  onChange={() => handleStatusToggle(product.id, 'product')}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(product, 'product')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(product.id, 'product')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderOrders = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Orders Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAdd('order')}
        >
          Add Order
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order_id}>
              <TableCell>{order.order_id}</TableCell>
              <TableCell>{order.user_id}</TableCell>
              <TableCell>{order.order_status}</TableCell>
              <TableCell>${order.total_amount}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(order, 'order')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(order.order_id, 'order')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderUsers = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Users Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAdd('user')}
        >
          Add User
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>{user.is_shg ? 'SHG' : 'Customer'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(user, 'user')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id, 'user')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderPendingSHGs = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Pending SHGs</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingSHGs.map((shg) => (
            <TableRow key={shg.email}>
              <TableCell>{shg.email}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleApproval(shg.email, 'shg', 'approve')}>
                  Approve
                </IconButton>
                <IconButton onClick={() => handleApproval(shg.email, 'shg', 'reject')}>
                  Reject
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderPendingNGOs = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Pending NGOs</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingNGOs.map((ngo) => (
            <TableRow key={ngo.email}>
              <TableCell>{ngo.email}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleApproval(ngo.email, 'ngo', 'approve')}>
                  Approve
                </IconButton>
                <IconButton onClick={() => handleApproval(ngo.email, 'ngo', 'reject')}>
                  Reject
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAllSHGs = () => (
    <TableContainer component={Paper}>
      <Box p={2}>
        <Typography variant="h6">All SHGs</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allSHGs.map((shg) => (
            <TableRow key={shg.id}>
              <TableCell>{shg.name}</TableCell>
              <TableCell>{shg.email}</TableCell>
              <TableCell>{shg.is_active ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(shg.id, 'shg')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(shg.id, 'shg')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderAllNGOs = () => (
    <TableContainer component={Paper}>
      <Box p={2}>
        <Typography variant="h6">All NGOs</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allNGOs.map((ngo) => (
            <TableRow key={ngo.id}>
              <TableCell>{ngo.name}</TableCell>
              <TableCell>{ngo.email}</TableCell>
              <TableCell>{ngo.is_active ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(ngo.id, 'ngo')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(ngo.id, 'ngo')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderFoodRequests = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Food Distribution Requests</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Food Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Expiry Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foodRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.food_type}</TableCell>
              <TableCell>{request.quantity}</TableCell>
              <TableCell>{new Date(request.expiry_time).toLocaleString()}</TableCell>
              <TableCell>
                <Chip 
                  label={request.status}
                  color={
                    request.status === 'pending' ? 'warning' :
                    request.status === 'approved' ? 'success' :
                    request.status === 'cancelled' ? 'error' : 'default'
                  }
                />
              </TableCell>
              <TableCell>{request.contact_number}</TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <>
                    <Button
                      color="success"
                      size="small"
                      onClick={() => handleFoodRequestStatus(request.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleFoodRequestStatus(request.id, 'cancelled')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderWasteRequests = () => (
    <TableContainer component={Paper}>
      <Box p={2}>
        <Typography variant="h6">Waste Collection Requests</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Waste Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wasteRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.user_email}</TableCell>
              <TableCell>{request.waste_type}</TableCell>
              <TableCell>{request.quantity} kg</TableCell>
              <TableCell>
                <Chip 
                  label={request.status}
                  color={
                    request.status === 'pending' ? 'warning' :
                    request.status === 'approved' ? 'success' :
                    request.status === 'completed' ? 'info' : 'error'
                  }
                />
              </TableCell>
              <TableCell>{request.location}</TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <>
                    <Button
                      color="success"
                      size="small"
                      onClick={() => handleWasteRequestStatus(request.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      color="error"
                      size="small"
                      onClick={() => handleWasteRequestStatus(request.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderWasteCategories = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Waste Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAdd('waste-category')}
        >
          Add Category
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wasteCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <Switch
                  checked={category.is_active}
                  onChange={() => handleStatusToggle(category.id, 'waste-category')}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(category, 'waste-category')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(category.id, 'waste-category')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderVolunteers = () => (
    <TableContainer component={Paper}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Volunteers</Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {volunteers.map((volunteer) => (
            <TableRow key={volunteer.id}>
              <TableCell>{volunteer.name}</TableCell>
              <TableCell>{volunteer.email}</TableCell>
              <TableCell>{volunteer.area}</TableCell>
              <TableCell>
                <Switch
                  checked={volunteer.is_active}
                  onChange={() => handleStatusToggle(volunteer.id, 'volunteer')}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(volunteer, 'volunteer')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(volunteer.id, 'volunteer')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className="admin-dashboard-container">
      <Drawer
        variant="permanent"
        className="admin-sidebar"
        classes={{
          paper: 'admin-sidebar'
        }}
      >
        <div className="admin-sidebar-header">
          <Typography variant="h6">Admin Panel</Typography>
        </div>
        <Divider />
        <List>
          {sidebarItems.map((item) => (
            <React.Fragment key={item.section}>
              <ListItem
                button
                onClick={() => {
                  if (item.subItems) {
                    setExpandedMenu(expandedMenu === item.section ? '' : item.section);
                  } else {
                    setActiveSection(item.section);
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (
                  expandedMenu === item.section ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                )}
              </ListItem>
              {item.subItems && expandedMenu === item.section && (
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      button
                      key={subItem.section}
                      sx={{ pl: 4 }}
                      onClick={() => setActiveSection(subItem.section)}
                      selected={activeSection === subItem.section}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      <main className="admin-main-content">
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {renderContent()}
        </Container>
      </main>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {renderDialog()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
