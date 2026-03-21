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
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { genericApi } from "../api/genericApi";

const StoreProducts = () => {
  const [storeProducts, setStoreProducts] = useState([]);
  const [search, setSearch] = useState("");

  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchStoreProducts();
  }, []);

  const fetchStoreProducts = async () => {
    try {
      const response = await genericApi.getAll("storeProducts");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((item, index) => {
        return {
          id: item._id || index,
          storeName: item.storeName || item.store || item.company?.name || `Store ${index}`,
          storeImage: item.storeImage || item.logo || `https://ui-avatars.com/api/?name=${item.storeName || "S"}&background=random`,
          productName: item.productName || item.name || `Product ${index}`,
          category: item.category || "Uncategorized",
          price: item.price ? `₹${item.price}` : "₹0",
          status: item.status || "Live"
        };
      });

      setStoreProducts(formattedData);
    } catch (error) {
      console.error("Error fetching store products:", error);
    }
  };

  const filtered = React.useMemo(() => {
    return storeProducts.filter((item) =>
      item.storeName.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.productName.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [storeProducts, search]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Monitor and manage products uploaded by various stores.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
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
            Store Products Management
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: "500" }}>Search:</Typography>
            <TextField
              size="small"
              placeholder="Search store or product..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Store</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Category</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Price</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No store products found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar 
                                src={item.storeImage} 
                                sx={{ width: 35, height: 35, border: "1px solid #f1f1f1" }} 
                            />
                            <Typography variant="body2" fontWeight="700" color="#1b2559">{item.storeName}</Typography>
                        </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{item.productName}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.category}</TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "800" }}>{item.price}</TableCell>
                    <TableCell>
                        <Chip 
                            label={item.status} 
                            size="small" 
                            sx={{ 
                                backgroundColor: item.status === "Live" ? "#e6f9ed" : "#fff8e6", 
                                color: item.status === "Live" ? "#24d164" : "#ffb800",
                                fontWeight: "700",
                                borderRadius: "6px"
                            }} 
                        />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                            <IconButton 
                            sx={{ 
                                backgroundColor: "#f4f7fe", 
                                color: "#2b3674",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#e0e7ff", color: "#4318ff" }
                            }}
                            >
                            <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                            <IconButton 
                            sx={{ 
                                backgroundColor: "#fff1f0", 
                                color: "#ff4d49",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#ffccc7" }
                            }}
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

export default StoreProducts;
