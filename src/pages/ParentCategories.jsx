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
  Avatar,
  LinearProgress,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LayersIcon from "@mui/icons-material/Layers";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
        alert("Persistence Error: Payload exceeds 1000 KB limitation.");
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

  const fetchTaxes = useCallback(async () => {
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
  }, []);

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchTaxes();
  }, [fetchCategories, fetchTaxes]);

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    try {
      const payload = {
        "Cart Id": formData.categoryID.trim() || ("CAT-" + Math.floor(Math.random() * 1000)),
        Title: formData.name.trim(),
        Category: formData.name.trim(),
        Image: imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name.trim())}&background=random`,
        tax: formData.taxType,
        taxtName: formData.taxName,
        "Tax percentage": Number(formData.taxPercent),
        description: formData.description,
      };
      
      if (isEditing) {
        await updateParentCategory(editId, payload);
      } else {
        await addParentCategory(payload);
      }

      setFormData({ categoryID: "", name: "", taxType: "", taxName: "", taxPercent: "", description: "" });
      setSelectedImage(null);
      setImagePreview(null);
      setIsEditing(false);
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error("Persistence Error:", error);
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
    if (window.confirm("Permanently de-register this root category domain?")) {
      try {
        await deleteParentCategory(id);
        fetchCategories();
      } catch (error) {
        console.error("Deletion Failed:", error);
      }
    }
  };

  const filtered = categories.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Taxonomic Hierarchy
        </Typography>
        <Typography variant="body2" color="#a3aed0" fontWeight="600">
            Defining root-level categorical domains for the synchronized product catalog.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }} component={Stack} direction={{ xs: "column", md: "row" }} alignItems="flex-start">
        
        {/* Creation Module */}
        <Grid item xs={12} md={4} sx={{ width: "100%", maxWidth: { md: 400 } }}>
            <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3 }}>
                    {isEditing ? "Modify Root Domain" : "Register Root Domain"}
                </Typography>
                
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>DOMAIN IDENTIFIER (CAT ID)</Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g. CAT-500"
                            value={formData.categoryID}
                            onChange={(e) => setFormData({...formData, categoryID: e.target.value})}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>CATEGORY LABEL (TITLE)</Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g. Premium Seafood"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        />
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>TAX POLICY</Typography>
                            <Select
                                fullWidth
                                value={formData.taxType}
                                onChange={(e) => setFormData({...formData, taxType: e.target.value})}
                                displayEmpty
                                sx={{ borderRadius: "14px", backgroundColor: "#f4f7fe", "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                            >
                                <MenuItem value="" disabled><Typography variant="body2" color="#a3aed0">Select</Typography></MenuItem>
                                <MenuItem value="Exclusive"><Typography variant="body2" fontWeight="700">Exclusive</Typography></MenuItem>
                                <MenuItem value="Inclusive"><Typography variant="body2" fontWeight="700">Inclusive</Typography></MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>TAX TYPE</Typography>
                            <Select
                                fullWidth
                                value={formData.taxName}
                                onChange={(e) => {
                                    const selTax = taxes.find(t => t.name === e.target.value);
                                    setFormData({...formData, taxName: e.target.value, taxPercent: selTax?.percent || ""});
                                }}
                                displayEmpty
                                sx={{ borderRadius: "14px", backgroundColor: "#f4f7fe", "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                            >
                                <MenuItem value="" disabled><Typography variant="body2" color="#a3aed0">Select</Typography></MenuItem>
                                {taxes.map(t => (
                                    <MenuItem key={t.name} value={t.name}><Typography variant="body2" fontWeight="700">{t.name}</Typography></MenuItem>
                                ))}
                            </Select>
                        </Box>
                    </Stack>

                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>PERCENTAGE LOAD (%)</Typography>
                        <TextField
                            fullWidth
                            type="number"
                            value={formData.taxPercent}
                            onChange={(e) => setFormData({...formData, taxPercent: e.target.value})}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>DESCRIPTION</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Define the scope of this domain..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>VISUAL ASSET</Typography>
                        <Box 
                            component="label" 
                            sx={{ 
                                display: "flex", alignItems: "center", gap: 2, p: 2, border: "2px dashed #e0e5f2", borderRadius: "16px", cursor: "pointer", transition: "0.2s",
                                "&:hover": { backgroundColor: "#f4f7fe", borderColor: "#4318ff" }
                            }}
                        >
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            <CloudUploadIcon sx={{ color: "#a3aed0" }} />
                            <Typography variant="body2" color="#1b2559" fontWeight="700" sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {selectedImage ? selectedImage.name : "Select Asset"}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: "#4318ff", "&:hover": { backgroundColor: "#3311cc" }, borderRadius: "16px", py: 2, textTransform: "none", fontWeight: "800",
                            boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                        }}
                    >
                        {isEditing ? "Update Domain" : "Activate Domain"}
                    </Button>

                    {isEditing && (
                        <Button 
                            variant="text" 
                            fullWidth 
                            onClick={() => {
                                setIsEditing(false);
                                setFormData({ categoryID: "", name: "", taxType: "", taxName: "", taxPercent: "", description: "" });
                                setImagePreview(null);
                            }}
                            sx={{ color: "#a3aed0", fontWeight: "800", textTransform: "none" }}
                        >
                            Discard Modifications
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Grid>

        {/* Directory Module */}
        <Grid item xs={12} md={8} sx={{ flex: 1, width: "100%" }}>
            <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
                {loading && (
                    <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
                )}
                
                <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc", borderBottom: "1px solid #e0e5f2" }}>
                    <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Root Registry</Typography>
                    <TextField
                        size="small"
                        placeholder="Search domains..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} /> }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#fff", width: "280px" } }}
                    />
                </Box>

                <TableContainer sx={{ maxHeight: "calc(100vh - 400px)", "&::-webkit-scrollbar": { display: "none" } }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Asset</TableCell>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Cat ID</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4, bgcolor: "#f4f7fe" }}>Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <Typography color="#a3aed0" fontWeight="600">No Root domains identified in the hierarchy.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((item, index) => (
                                    <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                        <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>
                                            #{index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar src={item.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: "12px", border: "2px solid #f4f7fe" }} />
                                        </TableCell>
                                        <TableCell sx={{ color: "#1b2559", fontWeight: "800", fontSize: "15px" }}>{item.name}</TableCell>
                                        <TableCell sx={{ color: "#4318ff", fontWeight: "800" }}>{item.categoryID}</TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <Tooltip title="Modify Domain">
                                                    <IconButton onClick={() => handleEdit(item)} sx={{ backgroundColor: "#f4f7fe", color: "#4318ff", borderRadius: "10px", "&:hover": { backgroundColor: "#e0e5f2" } }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="De-register Domain">
                                                    <IconButton onClick={() => handleDelete(item.id)} sx={{ backgroundColor: "#fff5f5", color: "#ff4d49", borderRadius: "10px", "&:hover": { backgroundColor: "#ffebeb" } }}>
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
        </Grid>

      </Grid>
    </Box>
  );
};

export default ParentCategories;