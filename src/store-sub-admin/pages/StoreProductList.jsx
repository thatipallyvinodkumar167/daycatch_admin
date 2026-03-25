import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  alpha,
  CircularProgress,
  Button,
  Avatar
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory2Outlined as InventoryIcon
} from "@mui/icons-material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreProductList = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [products] = useState([]); // Default empty for "No data found"

  useEffect(() => {
    // Simulating loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Products
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Manage inventory and product details for {store.name}.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("add")}
            sx={{
              borderRadius: "18px",
              py: 1.5,
              px: 4,
              bgcolor: "#4318ff",
              boxShadow: "0 10px 25px rgba(67,24,255,0.25)",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "15px",
              "&:hover": { bgcolor: "#3310cc" }
            }}
          >
            + New Product
          </Button>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Product List
            </Typography>
            <TextField
              placeholder="Search products..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "14px",
                  bgcolor: "#f8f9fc",
                  width: { xs: "100%", sm: "320px" },
                  fontWeight: 600,
                  "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "18px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6", width: "80px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6" }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6" }}>Product Id</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6" }}>Product Image</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                      <Stack alignItems="center" spacing={2}>
                        <Box sx={{ p: 2, borderRadius: "50%", bgcolor: "#f8f9fc" }}>
                          <InventoryIcon sx={{ color: "#d1d9e2", fontSize: 48 }} />
                        </Box>
                        <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                        <Typography variant="body2" color="#a3aed0" fontWeight="600">You haven't added any products to your list yet.</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#4318ff", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.name}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#707eae" }}>#{row.id}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#4318ff" }}>{row.category}</TableCell>
                      <TableCell>
                        <Avatar
                          src={row.image}
                          variant="rounded"
                          sx={{ width: 48, height: 48, borderRadius: "12px", border: "1px solid #e0e5f2" }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.1), borderRadius: "10px" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#f44336", bgcolor: alpha("#f44336", 0.1), borderRadius: "10px" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
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
    </Box>
  );
};

export default StoreProductList;
