import React, { useEffect, useState } from "react";
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
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { genericApi } from "../api/genericApi";

const StoreEarningPaments = () => {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // API Call
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {

      const response = await genericApi.getAll("storepayments");
      const results = response.data.results || response.data || [];
      setOrders(results.map((item, index) => ({
        _id: item._id || index,
        store: item.Store || item.store || "Direct Store",
        address: item.Address || item.address || "N/A",
        totalRevenue: item["Total Revenue"] || item.total_revenue || 0,
        alreadyPaid: item["Already Paid"] || item.already_paid || 0,
        pendingBalance: item["Pending Balance"] || item.pending_balance || 0,
        status: item.status || "Active",
      })));

    } catch (error) {
      console.error("Error fetching store payments:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.store?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h4" fontWeight="600">
         Super Admin Panel.
      </Typography>

   <br/> <br/>

      <Paper sx={{ borderRadius: 2 }}>

        {/* Header */}
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <Typography variant="h6">Store Earning Paments </Typography>
        </Box>

        {/* Search */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ p: 2 }}
        >
          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* <Button variant="outlined">Print</Button>
          <Button variant="outlined">CSV</Button> */}
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>

            <TableHead sx={{ background: "#f5f7fb" }}>
              <TableRow>
                <TableCell>#</TableCell>
               
                <TableCell>STORE </TableCell>
                <TableCell>ADDRESS</TableCell>
                <TableCell>TOAL REVENUE</TableCell>
                <TableCell>ALREADY PAID</TableCell>
                <TableCell>PENDING BALANCE</TableCell>
               
              </TableRow>
            </TableHead>

            <TableBody>

              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No Orders Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                  <TableRow key={order._id || index}>

                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{order.store}</TableCell>

                    <TableCell>{order.address}</TableCell>

                    <TableCell>
                      ₹{order.totalRevenue?.toLocaleString()}
                    </TableCell>

                    <TableCell>₹{order.alreadyPaid?.toLocaleString()}</TableCell>

                    <TableCell>₹{order.pendingBalance?.toLocaleString()}</TableCell>

                    <TableCell>
                      <Button variant="contained" size="small" sx={{ borderRadius: "8px", textTransform: "none" }}>
                        Details
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

export default StoreEarningPaments;