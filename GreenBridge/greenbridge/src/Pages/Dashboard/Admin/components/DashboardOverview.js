import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import axios from 'axios';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    requestsByType: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [foodRes, schoolRes, bookRes, groceryRes, ngoRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/v1/food/all/', { headers }),
        axios.get('http://127.0.0.1:8000/api/v1/school-supplies/all/', { headers }),
        axios.get('http://127.0.0.1:8000/api/v1/book/all/', { headers }),
        axios.get('http://127.0.0.1:8000/api/v1/grocery/all/', { headers }),
        axios.get('http://127.0.0.1:8000/api/ngo/pending/', { headers })
      ]);

      // Process data and update stats
      setStats({
        totalRequests: foodRes.data.length + schoolRes.data.length + 
                      bookRes.data.length + groceryRes.data.length,
        pendingNGOs: ngoRes.data.length,
        requestsByType: [
          { name: 'Food', value: foodRes.data.length },
          { name: 'School Supplies', value: schoolRes.data.length },
          { name: 'Books', value: bookRes.data.length },
          { name: 'Groceries', value: groceryRes.data.length }
        ],
        // Add more stats as needed
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Requests</Typography>
              <Typography variant="h4">{stats.totalRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more stat cards */}

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Request Distribution</Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={stats.requestsByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview; 