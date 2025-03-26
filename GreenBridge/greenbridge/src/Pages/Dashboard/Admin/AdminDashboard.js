import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import Header from '../../../components/Header';
import AdminSidebar from '../../../components/AdminSidebar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import axios from 'axios';
import RequestsManagement from './components/RequestsManagement';
import NGOManagement from './components/NGOManagement';
import UserManagement from './components/UserManagement';
import MoneyRequestManagement from './components/MoneyRequestManagement';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedMenu, setExpandedMenu] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    requestStats: [],
    monthlyActivity: [],
    moneyRequests: {
      pending: [],
      approved: [],
      transferred: [],
      total: 0,
      totalAmount: 0,
      transferredAmount: 0
    }
  });
  const [metrics, setMetrics] = useState({
    total_food: 0,
    total_beneficiaries: 0,
    total_waste_prevented: 0,
    monthly_trends: []
  });

  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchDashboardData();
      fetchMetrics();
    }
  }, [activeSection]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch money requests with detailed information
      const moneyRequestPromise = axios.get('https://greenbridgeserver.onrender.com/api/v1/donations/ngo/money-request/all/', { headers })
        .then(response => {
          // Process money requests without fetching NGO profiles individually
          return response.data.map(request => ({
            ...request,
            // Use the NGO data that comes with the request
            ngoProfile: request.ngo || {}
          }));
        })
        .catch(error => {
          console.error('Error fetching money requests:', error);
          return [];
        });

      const [foodRes, schoolRes, bookRes, groceryRes, moneyRes] = await Promise.all([
        axios.get('https://greenbridgeserver.onrender.com/api/v1/food/all/', { headers }),
        axios.get('https://greenbridgeserver.onrender.com/api/v1/school-supplies/all/', { headers }),
        axios.get('https://greenbridgeserver.onrender.com/api/v1/book/all/', { headers }),
        axios.get('https://greenbridgeserver.onrender.com/api/v1/grocery/all/', { headers }),
        moneyRequestPromise
      ]);

      // Process money requests data
      const moneyStats = {
        pending: moneyRes.filter(r => r.status === 'pending'),
        approved: moneyRes.filter(r => r.status === 'approved'),
        transferred: moneyRes.filter(r => r.status === 'transferred'),
        total: moneyRes.length,
        totalAmount: moneyRes.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0),
        transferredAmount: moneyRes
          .filter(r => r.status === 'transferred')
          .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
      };

      setDashboardData({
        requestStats: [
          { name: 'Food', value: foodRes.data.length },
          { name: 'School', value: schoolRes.data.length },
          { name: 'Books', value: bookRes.data.length },
          { name: 'Grocery', value: groceryRes.data.length }
        ],
        monthlyActivity: processMonthlyData([...foodRes.data, ...schoolRes.data, ...bookRes.data, ...groceryRes.data]),
        moneyRequests: moneyStats
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prevState => ({
        ...prevState,
        moneyRequests: {
          pending: [],
          approved: [],
          transferred: [],
          total: 0,
          totalAmount: 0,
          transferredAmount: 0
        }
      }));
      setLoading(false);
    }
  };

  const processMonthlyData = (requests) => {
    // Group requests by month
    const monthlyData = requests.reduce((acc, request) => {
      const date = new Date(request.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          name: monthYear,
          requests: 0,
          completed: 0
        };
      }
      
      acc[monthYear].requests++;
      if (request.status === 'distributed') {
        acc[monthYear].completed++;
      }
      
      return acc;
    }, {});

    return Object.values(monthlyData);
  };

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        'https://greenbridgeserver.onrender.com/api/v1/food/metrics/analytics/',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const renderDashboard = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Requests</Typography>
              <Typography variant="h4">
                {dashboardData.requestStats.reduce((acc, curr) => acc + curr.value, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Updated Money Requests Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Money Requests Overview</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Total Requests:</strong> {dashboardData.moneyRequests.total}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Amount:</strong> {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR'
                    }).format(dashboardData.moneyRequests.totalAmount)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Transferred Amount:</strong> {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR'
                    }).format(dashboardData.moneyRequests.transferredAmount)}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Status Breakdown:</Typography>
                <Grid container spacing={1}>
                  <Grid item>
                    <Chip 
                      label={`Pending: ${dashboardData.moneyRequests.pending.length}`}
                      color="warning"
                      size="small"
                    />
                  </Grid>
                  <Grid item>
                    <Chip 
                      label={`Approved: ${dashboardData.moneyRequests.approved.length}`}
                      color="info"
                      size="small"
                    />
                  </Grid>
                  <Grid item>
                    <Chip 
                      label={`Transferred: ${dashboardData.moneyRequests.transferred.length}`}
                      color="success"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Money Requests Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Money Requests Distribution</Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={[
                    { name: 'Pending', value: dashboardData.moneyRequests.pending.length },
                    { name: 'Approved', value: dashboardData.moneyRequests.approved.length },
                    { name: 'Transferred', value: dashboardData.moneyRequests.transferred.length }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {dashboardData.requestStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Activity Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Monthly Activity</Typography>
              <BarChart
                width={800}
                height={300}
                data={dashboardData.monthlyActivity}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#8884d8" name="Total Requests" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'food-requests':
      case 'school-supplies':
      case 'book-requests':
      case 'grocery-requests':
        return <RequestsManagement type={activeSection} />;
      case 'money-requests':
        return <MoneyRequestManagement />;
      case 'pending-ngos':
      case 'approved-ngos':
        return <NGOManagement type={activeSection} />;
      case 'users':
        return <UserManagement />;
      default:
        return renderDashboard();
    }
  };

  const DashboardMetrics = () => {
    return (
      <Grid container spacing={3} className="metrics-container">
        <Grid item xs={12} md={4}>
          <Card className="metric-card">
            <CardContent>
              <Typography variant="h6">Total Distribution</Typography>
              <Typography variant="h4">
                {metrics.total_food.toFixed(2)} kg
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Food distributed to date
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="metric-card">
            <CardContent>
              <Typography variant="h6">Beneficiaries Reached</Typography>
              <Typography variant="h4">
                {metrics.total_beneficiaries}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                People helped
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card className="metric-card">
            <CardContent>
              <Typography variant="h6">Food Waste Prevented</Typography>
              <Typography variant="h4">
                {metrics.total_waste_prevented.toFixed(2)} kg
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Environmental impact
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Trends Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Monthly Distribution Trends</Typography>
              <BarChart
                width={800}
                height={300}
                data={metrics.monthly_trends}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monthly_food" fill="#8884d8" name="Food Distributed (kg)" />
                <Bar dataKey="monthly_beneficiaries" fill="#82ca9d" name="Beneficiaries" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Header />
      <AdminSidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          overflow: 'auto',
          height: 'calc(100vh - 64px)' // Subtract AppBar height
        }}
      >
        {loading && activeSection === 'dashboard' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          renderContent()
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
