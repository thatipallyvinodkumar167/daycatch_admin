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
  Avatar,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getParentCategories, addParentCategory, deleteParentCategory } from "../api/categoryApi";

const ParentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getParentCategories();
      const results = response.data?.results || response.data?.data || [];
      
      const formattedData = results.map((item) => ({
        id: item._id,
        name: item["Title"] || item["Category Name"] || item.name || "Unnamed",
        image: item["Image"] || item["Category Image"] || `https://ui-avatars.com/api/?name=${encodeURIComponent(item["Title"] || item["Category Name"] || "C")}&background=random`,
        subCategoryCount: item.subCategoryCount || 0,
        productCount: item.productCount || 0,
      }));
      setCategories(formattedData);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      const payload = {
        "Category Name": newCategory.trim(),
        "Category Image": `https://ui-avatars.com/api/?name=${encodeURIComponent(newCategory.trim())}&background=random`,
        subCategoryCount: 0,
        productCount: 0,
      };
      
      await addParentCategory(payload);
      setNewCategory("");
      fetchCategories();
      alert("Parent category added!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this parent category? All sub-categories under it will also be affected.")) {
      try {
        await deleteParentCategory(id);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category.");
      }
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
          Manage top-level parent categories for the product catalog.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
        {/* Add Form */}
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "280px" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Add Parent Category
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Category Name</Typography>
              <TextField
                fullWidth
                placeholder="e.g. Meat & Seafood"
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
                sx={{ borderRadius: "10px", py: 1.5, textTransform: "none", borderStyle: "dashed" }}
              >
                Upload Image
              </Button>
            </Box>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAdd}
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
        <Paper sx={{ flex: 1, borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", position: "relative" }}>
          {loading && (
            <LinearProgress 
              sx={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                right: 0, 
                backgroundColor: "#fff1f0",
                "& .MuiLinearProgress-bar": { backgroundColor: "#E53935" }
              }} 
            />
          )}
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
            <Typography variant="h6" fontWeight="600" color="#1b2559">Parent Categories</Typography>
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
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Sub-Categories</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Products</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>No categories found</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item, index) => (
                    <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Avatar src={item.image} variant="rounded" sx={{ width: 42, height: 42, borderRadius: "10px" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.name}</TableCell>
                      <TableCell sx={{ color: "#2d60ff", fontWeight: "600" }}>{item.subCategoryCount}</TableCell>
                      <TableCell sx={{ color: "#475467" }}>{item.productCount}</TableCell>
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

export default ParentCategories;