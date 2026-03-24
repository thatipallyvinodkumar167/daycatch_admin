import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Avatar,
  Tooltip,
  CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useNavigate } from "react-router-dom";
import * as productApi from "../api/productApi";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await productApi.getAllProducts();
      const productList = response.data.data || [];
      
      const formattedData = productList.map((item, index) => ({
        id: item._id || item.id,
        productID: item["Product Id"] || item.id || "N/A",
        name: item["Product Name"] || item.name || "Unnamed Product",
        category: item["Category"] || item.category || "N/A",
        type: item["Type"] || item.type || "N/A",
        image: item["Product Image"] || item.image || `https://picsum.photos/seed/${item._id}/100`,
        hide: item.hide || false
      }));

      setProducts(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return products;
    return products.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.productID.toLowerCase().includes(query)
    );
  }, [products, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this product?")) {
      try {
        await productApi.deleteProduct(id);
        setProducts(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Admin Products
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage all products and inventory in the store.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh List">
                <IconButton 
                    onClick={() => fetchProducts(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate("/products/add")}
                sx={{ 
                    backgroundColor: "#4318ff", 
                    "&:hover": { backgroundColor: "#3311cc" },
                    borderRadius: "14px",
                    textTransform: "none",
                    px: 4,
                    fontWeight: "800",
                    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
            >
                Add Product
            </Button>
        </Stack>
      </Box>

      {/* Stats Analytics Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", width: "fit-content", minWidth: 280, bgcolor: "#fff" }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box sx={{ p: 2, borderRadius: "16px", backgroundColor: "#f4f7fe" }}>
            <Inventory2Icon sx={{ color: "#4318ff", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase" }}>
              Total Products
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {products.length} Items
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Directory Paper */}
      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
        
        {/* Search Toolbar */}
        <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
            <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Product List</Typography>
            <TextField
                size="small"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "12px", 
                        backgroundColor: "#fff",
                        width: "360px"
                    } 
                }}
            />
        </Box>

        <TableContainer sx={{ 
          maxHeight: "calc(100vh - 400px)",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" }
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f7fe" }}>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: "#4318ff" }} />
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Typography color="#a3aed0" fontWeight="600">No products found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>
                      #{index + 1}
                    </TableCell>
                    <TableCell>
                        <Avatar 
                            src={item.image} 
                            variant="rounded" 
                            sx={{ width: 48, height: 48, borderRadius: "12px", border: "2px solid #f4f7fe" }} 
                        />
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800", fontSize: "15px" }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ color: "#4318ff", fontWeight: "800" }}>
                      {item.productID}
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={item.category} 
                            size="small"
                            sx={{ bgcolor: "#f4f7fe", color: "#1b2559", fontWeight: "700", borderRadius: "8px" }}
                        />
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={item.type && item.type !== "N/A" && item.type.trim() !== "" ? item.type : "General"} 
                            size="small"
                            sx={{ bgcolor: "#eef2ff", color: "#4318ff", fontWeight: "700", border: "1px solid #d0d7ff", borderRadius: "8px" }}
                        />
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={item.hide ? "Archived" : "Live"} 
                            size="small"
                            sx={{ 
                                bgcolor: item.hide ? "#fff5f5" : "#f0fff4",
                                color: item.hide ? "#ff4d49" : "#24d164",
                                fontWeight: "800",
                                borderRadius: "8px"
                            }}
                        />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Product">
                            <IconButton 
                                onClick={() => navigate(`/products/edit/${item.id}`)}
                                sx={{ backgroundColor: "#f4f7fe", color: "#4318ff", borderRadius: "12px", "&:hover": { backgroundColor: "#e0e5f2" }, p: 1 }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                            <IconButton 
                                onClick={() => handleDelete(item.id)}
                                sx={{ backgroundColor: "#fff5f5", color: "#ff4d49", borderRadius: "12px", "&:hover": { backgroundColor: "#ffebeb" }, p: 1 }}
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

export default AdminProducts;
