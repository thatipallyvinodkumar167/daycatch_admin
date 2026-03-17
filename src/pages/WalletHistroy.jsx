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
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";

const WalletHistory = () => {

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // API Call
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {

      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );

      setOrders(response.data);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.cartId?.toLowerCase().includes(search.toLowerCase())
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
          <Typography variant="h6">Wallet Rechage History</Typography>
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
                <TableCell>USER NAME </TableCell>
                <TableCell>USER MOBILE</TableCell>
                <TableCell> RECHARGE AMOUNT</TableCell>
                <TableCell>RECHARGE DATE</TableCell>
                <TableCell>STATUS</TableCell>
              <TableCell>MEDIUM</TableCell>
              <TableCell>CREATE AMOUNT</TableCell>
              <TableCell>RECHARGE</TableCell>
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

                    <TableCell>{order.cartId}</TableCell>

                    <TableCell>{order.cartPrice}</TableCell>

                    <TableCell>
                      {order.user?.name} ({order.user?.phone})
                    </TableCell>

                    <TableCell>{order.deliveryDate}</TableCell>

                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === "Pending"
                            ? "warning"
                            : order.status === "Completed"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <Button variant="contained" size="small">
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

export default WalletHistory;