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
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Coupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_limit=8"
      );
      const types = ["Percentage", "Flat", "Free Delivery"];
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        code: `DAY${(item.id * 11 + 100).toString().toUpperCase()}`,
        type: types[index % 3],
        discount: types[index % 3] === "Percentage" ? `${10 + index * 2}%` : types[index % 3] === "Flat" ? `₹${50 + index * 10}` : "Free",
        minOrder: `₹${200 + index * 50}`,
        usageLimit: (index + 1) * 10,
        usedCount: Math.floor(Math.random() * ((index + 1) * 10)),
        expiry: `2024-0${(index % 9) + 1}-${15 + (index % 13)}`,
        status: index % 4 === 0 ? "Expired" : "Active",
      }));
      setCoupons(formattedData);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(prev => prev.filter(item => item.id !== id));
      alert("Coupon deleted successfully!");
    }
  };

  const filtered = coupons.filter(item =>
    item.code.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.type.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Create and manage promotional coupons.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/coupons/add")}
          sx={{
            backgroundColor: "#2d60ff",
            "&:hover": { backgroundColor: "#2046cc" },
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            py: 1.2,
            fontWeight: "700",
            boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)"
          }}
        >
          Add Coupon
        </Button>
      </Box>

      {/* Stats Row */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Coupons", value: coupons.length, color: "#2d60ff", bg: "#e0e7ff" },
          { label: "Active Coupons", value: coupons.filter(c => c.status === "Active").length, color: "#24d164", bg: "#e6f9ed" },
          { label: "Expired Coupons", value: coupons.filter(c => c.status === "Expired").length, color: "#ff4d49", bg: "#fff1f0" },
        ].map((stat) => (
          <Paper key={stat.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg }}>
                <LocalOfferIcon sx={{ color: stat.color, fontSize: "24px" }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="700" color="#1b2559">{stat.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Coupons List</Typography>
          <TextField
            size="small"
            placeholder="Search by code or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "280px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Code</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Discount</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Min. Order</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Usage</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Expiry</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>No coupons found</TableCell>
                </TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.code}
                        icon={<LocalOfferIcon sx={{ fontSize: "14px !important" }} />}
                        sx={{ backgroundColor: "#f0f4ff", color: "#2d60ff", fontWeight: "700", fontSize: "13px" }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.type}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.discount}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.minOrder}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>
                      {item.usedCount}/{item.usageLimit}
                    </TableCell>
                    <TableCell sx={{ color: item.status === "Expired" ? "#ff4d49" : "#475467" }}>{item.expiry}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: item.status === "Active" ? "#e6f9ed" : "#fff1f0",
                          color: item.status === "Active" ? "#24d164" : "#ff4d49",
                          fontWeight: "700"
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => navigate(`/coupons/edit/${item.id}`)}
                            sx={{ backgroundColor: "#24d164", color: "#ffffff", borderRadius: "8px", "&:hover": { backgroundColor: "#1eb856" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(item.id)}
                            sx={{ backgroundColor: "#ff4d49", color: "#ffffff", borderRadius: "8px", "&:hover": { backgroundColor: "#e04340" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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

export default Coupons;