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
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { genericApi } from "../api/genericApi";

const ItemSaleReport = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSalesReport();
  }, []);

  const fetchSalesReport = async () => {
    try {
      const response = await genericApi.getAll("item_sale_report");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        productName: item["Product Name"] || item.productName || "Unknown Product",
        variantSize: item["Variant Size"] || item.variantSize || "N/A",
        quantity: Number(item["Quantity"] || item.quantity || 0),
        totalWeight: item["Total Weight"] || item.totalWeight || "0",
      }));
      setSales(formattedData);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };

  const filteredSales = sales.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  const StatsCard = ({ title, value, icon }) => (
    <Paper sx={{ 
        p: 2.5, 
        borderRadius: "20px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)", 
        borderLeft: "6px solid #2d60ff",
        display: "flex",
        alignItems: "center",
        gap: 2.5,
        width: "fit-content",
        minWidth: "240px",
        backgroundColor: "white"
    }}>
        <Box sx={{ p: 1.8, borderRadius: "14px", bgcolor: "#e9edf7", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="body2" fontWeight="700" color="#a3aed0" sx={{ mb: 0.2, fontSize: "0.75rem", textTransform: "uppercase" }}>{title}</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">{value}</Typography>
        </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674">Hi, Day Catch Super Admin Panel.</Typography>
            <Typography variant="h6" color="#707eae" fontWeight="500">Track and analyze total item sales performance over the last 30 days.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ backgroundColor: "#2d60ff", borderRadius: "12px", textTransform: "none", px: 3, py: 1.5, fontWeight: "700", boxShadow: "0 4px 12px rgba(45, 96, 255, 0.2)", "&:hover": { backgroundColor: "#2046cc" } }}>
                Export CSV
            </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 6 }}>
        <StatsCard title="Total Sold Items" value={sales.reduce((acc, curr) => acc + curr.quantity, 0)} icon={<AssessmentIcon sx={{ color: "#2d60ff" }} />} />
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "none" }}>
        <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="700" color="#1b2559">Total Item Sales Report (Last 30 Days)</Typography>
          <TextField
              size="small"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#a3aed0" }} />
                    </InputAdornment>
                ),
              }}
              sx={{ 
                width: "350px",
                "& .MuiOutlinedInput-root": { 
                    borderRadius: "15px", 
                    backgroundColor: "#f4f7fe",
                    "& fieldset": { border: "none" }
                }
              }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>PRODUCT NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3 }}>VARIANT & QUANTITY</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", py: 3, pr: 4 }}>TOTAL WEIGHT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6 }}>No sales data available</TableCell></TableRow>
              ) : (
                filteredSales.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>{item.productName}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>
                        {item.variantSize} × <Typography component="span" fontWeight="800" color="#2d60ff">{item.quantity}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4, color: "#a3aed0", fontWeight: "600" }}>
                        {item.totalWeight}
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

export default ItemSaleReport;