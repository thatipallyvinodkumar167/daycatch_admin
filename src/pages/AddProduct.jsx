import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useNavigate } from "react-router-dom";
import { getParentCategories, getSubCategories } from "../api/categoryApi";
import { createProduct } from "../api/productApi";

const AddProduct = () => {
  const navigate = useNavigate();
  const [parentCats, setParentCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    productID: "",
    name: "",
    category: "",
    type: "",
    imagePreview: "",
    quantity: 0,
    ean: "",
    tags: "",
    unit: "",
    mrp: 0,
    price: 0,
    description: "",
  });

  const fetchInitialData = useCallback(async () => {
    try {
      const pRes = await getParentCategories();
      const pData = pRes.data?.results || pRes.data?.data || [];
      setParentCats(pData.map(c => c.name || c["Title"] || c["Category Name"]));

      const sRes = await getSubCategories();
      const sData = sRes.data?.results || sRes.data?.data || [];
      setSubCats(sData.map(s => ({
        name: s.name || s["Title"] || s["Sub Category Name"],
        parent: s.parentCategory || s["Parent Category"]
      })));
    } catch (error) {
       console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1000 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Persistence Error: Payload exceeds 1000 KB limitation.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      alert("Validation Error: Product narrative and categorical mapping required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        "Product Id": formData.productID || ("PROD-" + Math.floor(Math.random() * 1000)),
        "Product Name": formData.name,
        Category: formData.category,
        Type: formData.type,
        "Product Image": formData.imagePreview || "",
        Quantity: Number(formData.quantity),
        "EAN code": formData.ean,
        Tags: formData.tags,
        Unit: formData.unit,
        MRP: Number(formData.mrp),
        price: Number(formData.price),
        description: formData.description,
      };
      await createProduct(payload);
      alert("Operational Sync: New SKU registered in central catalog.");
      navigate("/products");
    } catch (error) {
      console.error("Persistence Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 3 }}>
        <Tooltip title="Back to Catalog">
            <IconButton onClick={() => navigate("/products")} sx={{ backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "14px", p: 1.5 }}>
                <ArrowBackIcon sx={{ color: "#4318ff" }} />
            </IconButton>
        </Tooltip>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Register Inventory SKU
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Establish a fresh root-level entry within the global product taxonomy.
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 5, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
        <Grid container spacing={5}>
          
          {/* Functional Column 1 */}
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>PRODUCT NARRATIVE (NAME)</Typography>
                <TextField 
                    fullWidth 
                    placeholder="e.g. Organic Atlantic Salmon"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                />
              </Box>

              <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>ROOT HIERARCHY</Typography>
                        <Select 
                            fullWidth 
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            displayEmpty
                            sx={{ borderRadius: "16px", backgroundColor: "#f4f7fe", "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        >
                            <MenuItem value="" disabled><Typography variant="body2" color="#a3aed0">Select Parent</Typography></MenuItem>
                            {parentCats.map(name => <MenuItem key={name} value={name}><Typography variant="body2" fontWeight="700">{name}</Typography></MenuItem>)}
                        </Select>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>SUBORDINATE TYPE</Typography>
                        <Select 
                            fullWidth
                            displayEmpty
                            value={formData.type} 
                            onChange={e => setFormData({...formData, type: e.target.value})}
                            sx={{ borderRadius: "16px", backgroundColor: "#f4f7fe", "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        >
                            <MenuItem value=""><Typography variant="body2" color="#a3aed0">General</Typography></MenuItem>
                            <MenuItem value="Regular"><Typography variant="body2" fontWeight="700">Regular Stock</Typography></MenuItem>
                            <MenuItem value="In Season"><Typography variant="body2" fontWeight="700">Seasonal Tier</Typography></MenuItem>
                            {subCats
                                .filter(s => !formData.category || (s.parent && s.parent.toLowerCase().trim() === formData.category.toLowerCase().trim()))
                                .map(s => (
                                    <MenuItem key={s.name} value={s.name}><Typography variant="body2" fontWeight="700">{s.name}</Typography></MenuItem>
                                ))
                            }
                        </Select>
                    </Box>
                  </Grid>
              </Grid>

              <Stack direction="row" spacing={3}>
                 <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>VALUATION (PRICE)</Typography>
                    <TextField 
                        fullWidth 
                        type="number" 
                        value={formData.price} 
                        onChange={e => setFormData({...formData, price: e.target.value})} 
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                    />
                 </Box>
                 <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>AVAILABILITY (QTY)</Typography>
                    <TextField 
                        fullWidth 
                        type="number" 
                        value={formData.quantity} 
                        onChange={e => setFormData({...formData, quantity: e.target.value})} 
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                    />
                 </Box>
              </Stack>
            </Stack>
          </Grid>
          
          {/* Functional Column 2 */}
          <Grid item xs={12} md={6}>
             <Stack spacing={4}>
              <Box>
                <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>DOMINAL IDENTIFIER (SKU ID)</Typography>
                <TextField 
                    fullWidth 
                    placeholder="Auto-generated if blank"
                    value={formData.productID} 
                    onChange={e => setFormData({...formData, productID: e.target.value})} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>VISUAL ASSET (IMAGE)</Typography>
                <Box component="label" sx={{ 
                  display: "flex", alignItems: "center", gap: 2, p: 2, border: "2px dashed #e0e5f2", borderRadius: "18px", cursor: "pointer", transition: "0.2s",
                  "&:hover": { backgroundColor: "#f4f7fe", borderColor: "#4318ff" }
                }}>
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  <CloudUploadIcon sx={{ color: "#a3aed0" }} />
                  <Typography variant="body2" color="#1b2559" fontWeight="700" sx={{ flex: 1, overflow: "hidden" }}>
                    {formData.imagePreview ? "Asset staged for upload" : "Select high-res image"}
                  </Typography>
                </Box>
                {formData.imagePreview && (
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <img src={formData.imagePreview} alt="Preview" style={{ width: "100%", maxHeight: 180, borderRadius: 20, objectFit: "contain", border: "4px solid #f4f7fe" }} />
                    </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>MARKET VALUATION (MRP)</Typography>
                        <TextField 
                            fullWidth 
                            type="number" 
                            value={formData.mrp} 
                            onChange={e => setFormData({...formData, mrp: e.target.value})} 
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                        />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>MEASUREMENT (UNIT)</Typography>
                        <TextField 
                            fullWidth 
                            placeholder="e.g. 1kg, 500g"
                            value={formData.unit} 
                            onChange={e => setFormData({...formData, unit: e.target.value})} 
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                        />
                    </Box>
                  </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid item xs={12}>
              <Box>
                <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>SPECIFICATIONS / PERSISTENT DESCRIPTION</Typography>
                <TextField 
                    fullWidth 
                    multiline 
                    rows={4} 
                    placeholder="Enter detailed SKU metadata..."
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                />
              </Box>
          </Grid>

          <Grid item xs={12}>
              <Divider sx={{ mb: 4, opacity: 0.1 }} />
              <Button 
                variant="contained" 
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Inventory2Icon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ 
                    backgroundColor: "#4318ff", "&:hover": { backgroundColor: "#3311cc" }, borderRadius: "18px", px: 8, py: 2, 
                    fontWeight: "800", textTransform: "none", fontSize: "1.1rem", boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
              >
                {loading ? "Synchronizing SKU..." : "Establish Inventory Entry"}
              </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddProduct;
