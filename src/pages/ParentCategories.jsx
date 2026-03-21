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
  Avatar,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getParentCategories, addParentCategory, deleteParentCategory, updateParentCategory } from "../api/categoryApi";

const ParentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    categoryID: "",
    name: "",
    taxType: "",
    taxName: "",
    taxPercent: "",
    description: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000 * 1024) {
        alert("Image size should be less then 1000 KB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const { genericApi } = await import("../api/genericApi");
      const response = await genericApi.getAll("tax");
      const results = response.data.results || response.data || [];
      setTaxes(results.map(t => ({
        name: t["Tax Type name"] || t.name || "Unnamed",
        percent: t["Tax percentage"] || t.rate || 0
      })));
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getParentCategories();
      const results = response.data?.results || response.data?.data || [];
      
      const formattedData = results.map((item) => ({
        id: item._id,
        categoryID: item["Cart Id"] || item.catID || item.id || "N/A",
        name: item["Title"] || item["Category Name"] || item.name || "Unnamed",
        image: item["Image"] || item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item["Title"] || item["Category Name"] || "C")}&background=random`,
        taxType: item.tax || "",
        taxName: item.taxtName || "",
        taxPercent: item["Tax percentage"] || "",
        description: item.description || "",
      }));
      setCategories(formattedData);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    try {
      const payload = {
        "Cart Id": formData.categoryID.trim() || ("CAT-" + Math.floor(Math.random() * 1000)),
        Title: formData.name.trim(),
        Category: formData.name.trim(), // Assuming Title and Category are same in model
        Image: imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name.trim())}&background=random`,
        tax: formData.taxType,
        taxtName: formData.taxName,
        "Tax percentage": Number(formData.taxPercent),
        description: formData.description,
      };
      
      if (isEditing) {
        await updateParentCategory(editId, payload);
        alert("Parent category updated!");
      } else {
        await addParentCategory(payload);
        alert("Parent category added!");
      }

      setFormData({
        categoryID: "",
        name: "",
        taxType: "",
        taxName: "",
        taxPercent: "",
        description: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setIsEditing(false);
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error.response?.data || error.message);
      const detail = error.response?.data?.message || error.response?.data?.error?.message || error.message;
      alert(`Failed to save category: ${detail}`);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      categoryID: item.categoryID,
      name: item.name,
      taxType: item.taxType,
      taxName: item.taxName,
      taxPercent: item.taxPercent,
      description: item.description,
    });
    setEditId(item.id);
    setIsEditing(true);
    setImagePreview(item.image);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this parent category? All sub-categories under it will also be affected.")) {
      try {
        await deleteParentCategory(id);
        fetchCategories();
      } catch (error) {
      console.error("Error saving sub-category:", error.response?.data || error.message);
      const detail = error.response?.data?.message || error.response?.data?.error?.message || error.message;
      alert(`Failed to save sub-category: ${detail}`);
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
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "300px" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            {isEditing ? "Edit Parent Category" : "Add Parent Category"}
          </Typography>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Category ID</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. CAT-001"
                value={formData.categoryID}
                onChange={(e) => setFormData({...formData, categoryID: e.target.value})}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Category Name (Title)</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Meat & Seafood"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Tax</Typography>
              <FormControl fullWidth size="small">
                <Select
                  displayEmpty
                  value={formData.taxType}
                  onChange={(e) => setFormData({...formData, taxType: e.target.value})}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">Select Tax</MenuItem>
                  <MenuItem value="Exclusive">Exclusive</MenuItem>
                  <MenuItem value="Inclusive">Inclusive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Tax Name</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.taxName}
                  onChange={(e) => {
                    const selTax = taxes.find(t => t.name === e.target.value);
                    setFormData({...formData, taxName: e.target.value, taxPercent: selTax?.percent || ""});
                  }}
                  sx={{ borderRadius: "10px" }}
                >
                  {taxes.map(t => (
                    <MenuItem key={t.name} value={t.name}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Tax Percentage (%)</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={formData.taxPercent}
                onChange={(e) => setFormData({...formData, taxPercent: e.target.value})}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Short description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 0.5 }}>
                Image (It Should Be Less Then 1000 KB)
              </Typography>
              <Box 
                component="label" 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  p: 1.5, 
                  border: "1px dashed #d1d9e8", 
                  borderRadius: "10px", 
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f8faff" }
                }}
              >
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                <Typography variant="body2" color="textSecondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {selectedImage ? selectedImage.name : "No file chosen"}
                </Typography>
                <Button 
                  component="span" 
                  size="small" 
                  variant="contained" 
                  sx={{ 
                    ml: "auto", 
                    textTransform: "none", 
                    borderRadius: "8px", 
                    backgroundColor: "#2d60ff",
                    fontSize: "0.75rem"
                  }}
                >
                  Choose file
                </Button>
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              startIcon={isEditing ? <EditIcon /> : <AddIcon />}
              onClick={handleAdd}
              sx={{
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "10px",
                py: 1.5,
                textTransform: "none",
                fontWeight: "700",
                mb: isEditing ? 1.5 : 0
              }}
            >
              {isEditing ? "Update Category" : "Save Category"}
            </Button>

            {isEditing && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setFormData({
                    categoryID: "",
                    name: "",
                    taxType: "",
                    taxName: "",
                    taxPercent: "",
                    description: "",
                  });
                }}
                sx={{
                  borderRadius: "10px",
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: "700",
                  color: "#2d60ff",
                  borderColor: "#2d60ff"
                }}
              >
                Cancel Edit
              </Button>
            )}
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

          <TableContainer sx={{ 
            maxHeight: "calc(100vh - 400px)", 
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc" }}>Category Image</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc" }}>Cat Id</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc", pr: 4 }}>Actions</TableCell>
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
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.name}</TableCell>
                      <TableCell>
                        <Avatar src={item.image} variant="rounded" sx={{ width: 42, height: 42, borderRadius: "10px" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{item.categoryID}</TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton 
                            onClick={() => handleEdit(item)}
                            sx={{ 
                                backgroundColor: "#00d26a", 
                                color: "#fff", 
                                borderRadius: "10px",
                                width: "40px",
                                height: "40px",
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
                                width: "40px",
                                height: "40px",
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