import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DeliveryBoyOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [boyName, setBoyName] = useState("test");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch boy name
        const userRes = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setBoyName(userRes.data.name);

        // Fetch mock orders (empty for now as requested by "No data found")
        // But I will provide a structure for when data exists
        setOrders([]); 
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading and Back Button */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button 
            onClick={() => navigate(-1)}
            sx={{ 
                minWidth: "auto", 
                backgroundColor: "white", 
                borderRadius: "10px", 
                p: 1, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                color: "#2b3674",
                "&:hover": { backgroundColor: "#f0f0f0" }
            }}
        >
            <ArrowBackIcon />
        </Button>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Delivery Boy ({boyName}) Order List
            </Typography>
            <Typography variant="body1" color="textSecondary">
                List of orders assigned to this delivery partner.
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Assigned Orders
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Cart ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Cart price</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Cart Products</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Assign</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="textSecondary" fontWeight="500">
                        No data found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((item, index) => (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: "600", color: "#2d60ff" }}>{item.cartId}</TableCell>
                    <TableCell sx={{ fontWeight: "700" }}>₹{item.price}</TableCell>
                    <TableCell>{item.user}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.products}</TableCell>
                    <TableCell align="center">
                        <Button size="small" variant="outlined" sx={{ borderRadius: "6px", textTransform: "none" }}>
                            Reassign
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DeliveryBoyOrders;
