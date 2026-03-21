import React, { useEffect, useState, useCallback } from "react";
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
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getSubCategories, addSubCategory, deleteSubCategory, getParentCategories, updateSubCategory } from "../api/categoryApi";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [parentCats, setParentCats] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    categoryID: "",
    name: "",
    selectedParent: "",
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

  const fetchSubCategories = useCallback(async () => {
    try {
      const response = await getSubCategories();
      const results = response.data?.results || response.data?.data || [];
      
      const formattedData = results.map((item) => ({
        id: item._id,
        categoryID: item["Cart id"] || item.catID || item.id || "N/A",
        name: item["Title"] || item["Sub Category Name"] || item.name || "Unnamed",
        parentCategory: item["Parent Category"] || item.parent || "General",
        image: item["Category Image"] || item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item["Title"] || item["Sub Category Name"] || "SC")}&background=random`,
        description: item.description || "",
      }));
      setSubCategories(formattedData);
    } catch (error) {
      console.error("Error fetching sub-categories:", error);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const parentRes = await getParentCategories();
      const pResults = parentRes.data?.results || parentRes.data?.data || [];
      const formattedParents = pResults.map(p => ({
        id: p._id,
        name: p["Title"] || p["Category Name"] || p.name || "Unnamed"
      }));
      setParentCats(formattedParents);

      await fetchSubCategories();
    } catch (error) {
      console.error("Error fetching initial sub-category data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchSubCategories]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.selectedParent) return;
    try {
      const payload = {
        "Cart id": formData.categoryID.trim() || ("SCAT-" + Math.floor(Math.random() * 1000)),
        Title: formData.name.trim(),
        "Parent Category": formData.selectedParent,
        "Category Image": imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name.trim())}&background=random`,
        description: formData.description,
      };
      
      if (isEditing) {
        await updateSubCategory(editId, payload);
        alert("Sub-category updated!");
      } else {
        await addSubCategory(payload);
        alert("Sub-category added!");
      }

      setFormData({
        name: "",
        categoryID: "",
        selectedParent: "",
        description: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      setIsEditing(false);
      setEditId(null);
      fetchSubCategories();
    } catch (error) {
      console.error("Error saving sub-category:", error.response?.data || error.message);
      const detail = error.response?.data?.message || error.response?.data?.error?.message || error.message;
      alert(`Failed to save sub-category: ${detail}`);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      categoryID: item.categoryID,
      name: item.name,
      selectedParent: item.parentCategory,
      description: item.description,
    });
    setEditId(item.id);
    setIsEditing(true);
    setImagePreview(item.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this sub-category?")) {
      try {
        await deleteSubCategory(id);
        fetchSubCategories();
      } catch (error) {
        console.error("Error deleting sub-category:", error);
        alert("Failed to delete sub-category.");
      }
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
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "320px" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            {isEditing ? "Edit Sub-Category" : "Add Sub-Category"}
          </Typography>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Parent Category</Typography>
              <FormControl fullWidth size="small">
                <Select
                  displayEmpty
                  value={formData.selectedParent}
                  onChange={(e) => setFormData({...formData, selectedParent: e.target.value})}
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">Select Parent Category</MenuItem>
                  {parentCats.map((cat, idx) => (
                    <MenuItem key={`${cat.id || cat.name}-${idx}`} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Cat Id</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. SCAT-001"
                value={formData.categoryID}
                onChange={(e) => setFormData({...formData, categoryID: e.target.value})}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Title</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Fresh Chicken"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Brief description..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
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
              {isEditing ? "Update Sub-Category" : "Save Sub-Category"}
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
                    name: "",
                    categoryID: "",
                    selectedParent: "",
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
            <Typography variant="h6" fontWeight="600" color="#1b2559">Sub-Categories List</Typography>
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
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc" }}>Parent Category</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc" }}>Category Image</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc" }}>Cat Id</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", bgcolor: "#fafbfc", pr: 4 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>No sub-categories found</TableCell></TableRow>
                ) : (
                  filtered.map((item, index) => (
                    <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ backgroundColor: "#f0f4ff", color: "#2d60ff", px: 1.5, py: 0.5, borderRadius: "6px", display: "inline-block", fontWeight: "600" }}>
                          {item.parentCategory}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40, borderRadius: "10px" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{item.categoryID}</TableCell>
                      <TableCell align="right" sx={{ pr: 4 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                          <IconButton onClick={() => handleDelete(item.id)} sx={{ 
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

export default SubCategories;