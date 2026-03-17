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
  MenuItem,
  FormControl,
  Select,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newSubCat, setNewSubCat] = useState("");
  const [selectedParent, setSelectedParent] = useState("Fruits & Vegetables");

  const parentCats = ["Fruits & Vegetables", "Dairy & Eggs", "Bakery", "Beverages", "Snacks"];

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=10");
      const subCatNames = [
        "Seasonal Fruits", "Leafy Greens", "Full Cream Milk", "Butter & Cheese",
        "White Bread", "Multigrain", "Juices", "Energy Drinks", "Biscuits", "Chips"
      ];
      const parents = ["Fruits & Vegetables", "Fruits & Vegetables", "Dairy & Eggs", "Dairy & Eggs",
        "Bakery", "Bakery", "Beverages", "Beverages", "Snacks", "Snacks"];
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        name: subCatNames[index % subCatNames.length],
        parentCategory: parents[index % parents.length],
        image: `https://ui-avatars.com/api/?name=${subCatNames[index % subCatNames.length]}&background=random`,
        productCount: Math.floor(Math.random() * 50) + 5,
      }));
      setSubCategories(formattedData);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  };

  const handleAdd = () => {
    if (!newSubCat.trim()) return;
    const newItem = {
      id: Date.now(),
      name: newSubCat.trim(),
      parentCategory: selectedParent,
      image: `https://ui-avatars.com/api/?name=${newSubCat.trim()}&background=random`,
      productCount: 0,
    };
    setSubCategories([newItem, ...subCategories]);
    setNewSubCat("");
    alert("Sub-category added!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this sub-category?")) {
      setSubCategories(prev => prev.filter(item => item.id !== id));
    }
  };

  const filtered = subCategories.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.parentCategory.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Manage sub-categories under each parent category.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
        {/* Add Form */}
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "280px" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Add Sub-Category
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Parent Category</Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  {parentCats.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Sub-Category Name</Typography>
              <TextField
                fullWidth
                placeholder="e.g. Seasonal Fruits"
                value={newSubCat}
                onChange={(e) => setNewSubCat(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
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
              Save Sub-Category
            </Button>
          </Stack>
        </Paper>

        {/* List */}
        <Paper sx={{ flex: 1, borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
            <Typography variant="h6" fontWeight="600" color="#1b2559">Sub-Categories List</Typography>
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
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Sub-Category</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Parent Category</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Products</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>No sub-categories found</TableCell></TableRow>
                ) : (
                  filtered.map((item, index) => (
                    <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40, borderRadius: "10px" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ backgroundColor: "#f0f4ff", color: "#2d60ff", px: 1.5, py: 0.5, borderRadius: "6px", display: "inline-block", fontWeight: "600" }}>
                          {item.parentCategory}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#475467" }}>{item.productCount} Products</TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton sx={{ backgroundColor: "#f4f7fe", color: "#2b3674", borderRadius: "8px", "&:hover": { backgroundColor: "#e0e7ff" } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(item.id)} sx={{ backgroundColor: "#fff1f0", color: "#ff4d49", borderRadius: "8px", "&:hover": { backgroundColor: "#ffccc7" } }}>
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

export default SubCategories;