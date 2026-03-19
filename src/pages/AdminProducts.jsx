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
  useTheme,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import * as productApi from "../api/productApi";

const AdminProducts = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAllProducts();
      
      const productList = response.data.data || [];
      
      // Map backend data to our product columns
      const formattedData = productList.map((item, index) => {
        return {
          id: item._id || item.id,
          name: item["Product Name"] || item.name || "Unnamed Product",
          category: item["Category"] || item.category || "N/A",
          subCategory: item["Sub Category"] || item.subCategory || "N/A",
          price: `₹${item["Price"] || item.price || 0}`,
          image: item["Product Image"] || item.image || `https://picsum.photos/seed/${item._id}/100`,
          status: item.status || (index % 3 === 0 ? "Out of Stock" : "In Stock")
        };
      });

      setProducts(formattedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.category.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [products, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.deleteProduct(id);
        setProducts(prev => prev.filter(item => item.id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Manage the central product catalog.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate("/products/add")}
          sx={{ 
            backgroundColor: theme.palette.primary.main, 
            "&:hover": { backgroundColor: theme.palette.primary.dark },
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            py: 1.2,
            fontWeight: "700",
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
          }}
        >
          Add New Product
        </Button>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header & Search */}
        <Box 
          sx={{ 
            p: 3, 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Admin Products List
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: "500" }}>Search:</Typography>
            <TextField
              size="small"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ 
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                width: "300px",
                backgroundColor: "#fff"
              }}
            />
          </Stack>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Sub-Category</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                        <Avatar 
                            src={item.image} 
                            variant="rounded" 
                            sx={{ width: 45, height: 45, borderRadius: "10px", border: "1px solid #f1f1f1" }} 
                        />
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", maxWidth: "180px" }}>{item.name}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.category}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.subCategory}</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.main, fontWeight: "800" }}>{item.price}</TableCell>
                    <TableCell>
                        <Chip 
                            label={item.status} 
                            size="small" 
                            sx={{ 
                                backgroundColor: item.status === "In Stock" ? "#e6f9ed" : "#fff1f0", 
                                color: item.status === "In Stock" ? "#24d164" : "#ff4d49",
                                fontWeight: "700",
                                borderRadius: "6px"
                            }} 
                        />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                          onClick={() => navigate(`/products/edit/${item.id}`)}
                          sx={{ 
                            backgroundColor: "#f4f7fe", 
                            color: "#2b3674",
                            borderRadius: "8px",
                            "&:hover": { backgroundColor: "#e0e7ff", color: "#4318ff" }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(item.id)}
                          sx={{ 
                            backgroundColor: "#fff1f0", 
                            color: "#ff4d49",
                            borderRadius: "8px",
                            "&:hover": { backgroundColor: "#ffccc7" }
                          }}
                        >
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
  );
};

export default AdminProducts;
