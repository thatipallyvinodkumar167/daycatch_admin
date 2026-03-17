import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";

import { motion } from "framer-motion";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const Dashboard = () => {

  const theme = useTheme();
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [orderDistribution, setOrderDistribution] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulating API response delay
        await new Promise(resolve => setTimeout(resolve, 600));

        
        let currentCount = 20;
        let lastCount = 18;
        let label = "last month";

        if (timeRange === "week") {
          currentCount = 8;
          lastCount = 7;
          label = "last week";
        } else if (timeRange === "today") {
          currentCount = 2;
          lastCount = 1;
          label = "yesterday";
        }

        const generateOrders = (count) => {
          return Array.from({ length: count }).map((_, i) => ({
            id: `ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            customer: `Customer ${i + 1}`,
            amount: Math.floor(Math.random() * 500) + 300,
            status: ["Delivered", "Pending", "Cancelled"][Math.floor(Math.random() * 3)],
            date: new Date()
          }));
        };

        const currentOrders = generateOrders(currentCount);
        const lastOrders = generateOrders(lastCount);

        setOrders(currentOrders);

        const calculateStats = (orders) => {
          const revenue = orders.reduce((sum, o) => sum + o.amount, 0);
          const delivered = orders.filter(o => o.status === "Delivered").length;
          const pending = orders.filter(o => o.status === "Pending").length;
          const customers = new Set(orders.map(o => o.customer)).size;
          const productsSold = orders.length;
          const aov = orders.length > 0 ? Math.floor(revenue / orders.length) : 0;
          return { revenue, delivered, pending, customers, productsSold, aov, count: orders.length };
        };

        const currentStats = calculateStats(currentOrders);
        const previousStats = calculateStats(lastOrders);

        const calculateChange = (current, previous) => {
          if (previous === 0) return "+100%";
          const diff = ((current - previous) / previous) * 100;
          return (diff >= 0 ? "+" : "") + diff.toFixed(0) + "%";
        };

        setStats([
          { title: "Total Orders", value: currentStats.count, change: calculateChange(currentStats.count, previousStats.count), icon: "orders", comparisonLabel: label },
          { title: "Revenue", value: "₹" + currentStats.revenue, change: calculateChange(currentStats.revenue, previousStats.revenue), icon: "revenue", comparisonLabel: label },
          { title: "Avg Order Value", value: "₹" + currentStats.aov, change: calculateChange(currentStats.aov, previousStats.aov), icon: "stock", comparisonLabel: label },
          { title: "Delivered Orders", value: currentStats.delivered, change: calculateChange(currentStats.delivered, previousStats.delivered), icon: "vendors", comparisonLabel: label },
          { title: "Customers", value: currentStats.customers, change: calculateChange(currentStats.customers, previousStats.customers), icon: "customers", comparisonLabel: label },
          { title: "Products Sold", value: currentStats.productsSold, change: calculateChange(currentStats.productsSold, previousStats.productsSold), icon: "stock", comparisonLabel: label }
        ]);

        // Distribution Data
        setOrderDistribution([
          { name: "Delivered", value: currentStats.delivered, color: "#24d164" },
          { name: "Pending", value: currentStats.pending, color: "#ffb800" },
          { name: "Cancelled", value: currentOrders.filter(o => o.status === "Cancelled").length, color: "#ff4d49" },
        ]);

        // Top Products
        setTopProducts([
          { name: "Organic Milk", sales: 150, revenue: "₹4,500" },
          { name: "Farm Fresh Eggs", sales: 120, revenue: "₹2,400" },
          { name: "A2 Ghee 500ml", sales: 85, revenue: "₹12,750" },
          { name: "Basmati Rice 5kg", sales: 60, revenue: "₹18,000" },
          { name: "Cold Pressed Oil", sales: 45, revenue: "₹9,000" },
        ]);

        // Revenue Analytics Data for 6 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const chartData = months.map((m, idx) => ({
          month: m,
          revenue: idx <= 2 ? Math.floor(Math.random() * 5000) + 10000 : 0
        }));
        setRevenueData(chartData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if(loading)
    return (
      <Box p={4}>
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );

  return (

    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ p:4 }}
    >

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 800 }}
        >
          Dashboard Overview
        </Typography>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range-select"
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ bgcolor: "background.paper", borderRadius: 2 }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>

        {/* Stat Cards */}

        {stats.map((stat,i)=>(
          <Grid item xs={12} sm={6} md={4} key={i}>
            <StatCard
              {...stat}
              onClick={()=>{

                if(stat.title==="Total Orders")
                  navigate("/admin/orders");

                if(stat.title==="Delivered Orders")
                  navigate("/admin/orders/delivered");

                if(stat.title==="Pending Orders")
                  navigate("/admin/orders/pending");

                if(stat.title==="Customers")
                  navigate("/admin/customers");

                if(stat.title==="Products Sold")
                  navigate("/admin/products");

                if(stat.title==="Revenue")
                  navigate("/admin/revenue");

              }}
            />
          </Grid>
        ))}

        {/* Revenue Analytics */}

        <Grid item xs={12} md={8}>

          <Box
            sx={{
              p:3,
              bgcolor:"background.paper",
              borderRadius:3,
              boxShadow:3
            }}
          >

            <Typography
              variant="h6"
              sx={{ mb:2 }}
            >
              Revenue Analytics
            </Typography>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart data={revenueData}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </Box>

        </Grid>

        {/* Sales Overview */}

        <Grid item xs={12} md={4}>

          <Box
            sx={{
              p:3,
              bgcolor:"background.paper",
              borderRadius:3,
              boxShadow:3
            }}
          >

            <Typography
              variant="h6"
              sx={{ mb:2 }}
            >
              Sales Overview
            </Typography>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={revenueData}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="month"/>

                <YAxis/>

                <Tooltip/>

                <Bar
                  dataKey="revenue"
                  fill={theme.palette.primary.light}
                />

              </BarChart>

            </ResponsiveContainer>

          </Box>

        </Grid>

        {/* Analytics Breakdown Row */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              height: "100%"
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
              Order Distribution
            </Typography>
            <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
              height: "100%"
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 2 }}>
              Top Selling Products
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#a3aed0", fontWeight: "700" }}>PRODUCT</TableCell>
                    <TableCell sx={{ color: "#a3aed0", fontWeight: "700" }}>SALES</TableCell>
                    <TableCell align="right" sx={{ color: "#a3aed0", fontWeight: "700" }}>REVENUE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell sx={{ fontWeight: "600", color: "#1b2559" }}>{product.name}</TableCell>
                      <TableCell sx={{ color: "#475467" }}>{product.sales} units</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "700", color: "#2d60ff" }}>{product.revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Recent Orders */}

        <Grid item xs={12}>

  <Box
    sx={{
      p: 3,
      bgcolor: "background.paper",
      borderRadius: 3,
      boxShadow: 3
    }}
  >

    <Typography variant="h6" sx={{ mb: 2 }}>
      Recent Orders
    </Typography>

    <TableContainer>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell>#</TableCell>
            <TableCell>CART ID</TableCell>
            <TableCell>CART PRICE</TableCell>
            <TableCell>USER</TableCell>
            <TableCell>DELIVERY DATE</TableCell>
            <TableCell>STATUS</TableCell>
            <TableCell>DETAILS</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {orders.map((order, index) => (

            <TableRow key={order.id} hover>

              <TableCell>{index + 1}</TableCell>

              <TableCell>{order.id}</TableCell>

              <TableCell>₹{order.amount}</TableCell>

              <TableCell>{order.customer}</TableCell>

              <TableCell>
                {order.date.toLocaleDateString()}
              </TableCell>

              <TableCell>

                <Chip
                  label={order.status}
                  color={
                    order.status === "Delivered"
                      ? "success"
                      : order.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                  size="small"
                />

              </TableCell>

              <TableCell>

                <Typography
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  View
                </Typography>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </TableContainer>

  </Box>

</Grid>
      </Grid>

    </Box>

  );

};

export default Dashboard;