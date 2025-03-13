import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, CircularProgress } from '@mui/material';
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
      pending: 0,
      approved: 0,
      transferred: 0,
      total: 0
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

      // Separate money request fetch to handle it specifically
      const moneyRequestPromise = axios.get('http://127.0.0.1:8000/api/v1/donations/ngo/money-request/all/', { headers })
        .catch(error => {
          console.error('Error fetching money requests:', error);
          return { data: [] }; // Return empty array on error
        });

      const [foodRes, schoolRes, bookRes, groceryRes, moneyRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/v1/food/all/', { headers }),
        axios.get('http://127.0.0.1:8000/api/v1/school-supplies/all/', { headers }),
        axios.get('http://127.0.0.1:8000/api/v1/book/all/', { headers }),
        axios.get('http://127.0.0.1:8000/api/v1/grocery/all/', { headers }),
        moneyRequestPromise
      ]);

      console.log('Money requests response:', moneyRes.data); // Debug log

      // Process money requests with null check
      const moneyStats = {
        pending: moneyRes.data?.filter(r => r.status === 'pending')?.length || 0,
        approved: moneyRes.data?.filter(r => r.status === 'approved')?.length || 0,
        transferred: moneyRes.data?.filter(r => r.status === 'transferred')?.length || 0,
        total: moneyRes.data?.length || 0
      };

      console.log('Processed money stats:', moneyStats); // Debug log

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
      // Set default values on error
      setDashboardData(prevState => ({
        ...prevState,
        moneyRequests: {
          pending: 0,
          approved: 0,
          transferred: 0,
          total: 0
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
        'http://127.0.0.1:8000/api/v1/food/metrics/analytics/',
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

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Money Requests</Typography>
              <Typography variant="h4">{dashboardData.moneyRequests.total}</Typography>
              <Typography variant="body2" color="textSecondary">
                Pending: {dashboardData.moneyRequests.pending} | 
                Approved: {dashboardData.moneyRequests.approved} |
                Transferred: {dashboardData.moneyRequests.transferred}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Request Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Request Distribution</Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={dashboardData.requestStats}
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
