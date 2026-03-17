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
  Tooltip,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users?_limit=8"
      );
      const catNames = [
        "Fruits & Vegetables", "Dairy & Eggs", "Bakery", "Beverages",
        "Snacks", "Meat & Seafood", "Packaged Foods", "Personal Care"
      ];
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        name: catNames[index % catNames.length],
        image: `https://ui-avatars.com/api/?name=${catNames[index % catNames.length]}&background=random&size=100`,
        productCount: Math.floor(Math.random() * 200) + 10,
      }));
      setCategories(formattedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newCategory.trim(),
      image: `https://ui-avatars.com/api/?name=${newCategory.trim()}&background=random`,
      productCount: 0,
    };
    setCategories([newItem, ...categories]);
    setNewCategory("");
    alert("Category added successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(prev => prev.filter(item => item.id !== id));
    }
  };

  const filtered = categories.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Manage your product categories.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
        {/* Add Category Card */}
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "280px" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Add Category
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Category Name</Typography>
              <TextField
                fullWidth
                placeholder="e.g. Fruits & Vegetables"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Category Image</Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CategoryIcon />}
                sx={{ borderRadius: "10px", py: 1.5, textTransform: "none", borderStyle: "dashed" }}
              >
                Upload Image
              </Button>
            </Box>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddCategory}
              sx={{
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "10px",
                py: 1.5,
                textTransform: "none",
                fontWeight: "700",
              }}
            >
              Save Category
            </Button>
          </Stack>
        </Paper>

        {/* List */}
        <Paper sx={{ flex: 1, borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
            <Typography variant="h6" fontWeight="600" color="#1b2559">Categories List</Typography>
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "240px" }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Category Name</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Products</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>No categories found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item, index) => (
                    <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Avatar src={item.image} variant="rounded" sx={{ width: 42, height: 42, borderRadius: "10px" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.name}</TableCell>
                      <TableCell sx={{ color: "#475467" }}>{item.productCount} Products</TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton sx={{ 
                                backgroundColor: "#00d26a", 
                                color: "#fff", 
                                borderRadius: "10px",
                                "&:hover": { backgroundColor: "#00b85c" }
                            }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(item.id)} 
                            sx={{ 
                                backgroundColor: "#ff4d49", 
                                color: "#fff", 
                                borderRadius: "10px",
                                "&:hover": { backgroundColor: "#e03e3e" }
                            }}>
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
      </Stack>
    </Box>
  );
};

export default Categories;