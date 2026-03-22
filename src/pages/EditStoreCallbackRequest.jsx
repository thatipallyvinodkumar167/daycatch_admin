import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  Grid,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UpdateIcon from "@mui/icons-material/Update";
import { useParams, useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const EditStoreCallbackRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: "",
    storePhone: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await genericApi.getOne("storecallbackrequests", id);
        const data = response.data || response;
        
        // Smart mapping for legacy or modern keys
        setFormData({
            storeName: data.storeName || data["Store Name"] || data.store || data.name || "",
            storePhone: data.storePhone || data["Store Phone"] || data.phone || data.mobile || ""
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching callback request:", error);
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeName.trim() || !formData.storePhone.trim()) {
      alert("Validation Error: Store Name and Phone are required for updates.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Syncing with modern camelCase standard
      const updatePayload = {
        storeName: formData.storeName.trim(),
        storePhone: formData.storePhone.trim(),
        lastModified: new Date().toISOString()
      };
      await genericApi.update("storecallbackrequests", id, updatePayload);
      navigate("/store-callback-request");
    } catch (error) {
      console.error("Error updating store callback request:", error);
      alert("Platform Sync Failed: Unable to persist partner updates.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header with Navigation */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/store-callback-request")} sx={{ mr: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <ArrowBackIcon sx={{ color: "#4318ff" }} />
        </IconButton>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Update Store Assistance
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Modify logistical and support ticket details for partner [ID: {id}]
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", p: 4 }}>
        
        {loading ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
                <CircularProgress sx={{ color: "#4318ff" }} />
                <Typography sx={{ mt: 2, color: "#a3aed0", fontWeight: "600" }}>Fetching Partner Data...</Typography>
            </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                        STORE IDENTITY
                    </Typography>
                    <TextField
                        fullWidth
                        name="storeName"
                        variant="outlined"
                        value={formData.storeName}
                        onChange={handleChange}
                        sx={{ 
                            "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                        PRIMARY BUSINESS CONTACT
                    </Typography>
                    <TextField
                        fullWidth
                        name="storePhone"
                        variant="outlined"
                        value={formData.storePhone}
                        onChange={handleChange}
                        sx={{ 
                            "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button 
                            onClick={() => navigate("/store-callback-request")}
                            sx={{ color: "#a3aed0", fontWeight: "800", textTransform: "none", borderRadius: "14px", px: 4 }}
                        >
                            Discard Changes
                        </Button>
                        <Button 
                            type="submit"
                            variant="contained" 
                            disabled={isSubmitting}
                            startIcon={<UpdateIcon />}
                            sx={{ 
                                backgroundColor: "#4318ff", 
                                "&:hover": { backgroundColor: "#3311cc" },
                                borderRadius: "14px",
                                textTransform: "none",
                                px: 6,
                                py: 1.5,
                                fontWeight: "800",
                                boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                            }}
                        >
                            {isSubmitting ? "Syncing Partner Logic..." : "Update Dispatch Logic"}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default EditStoreCallbackRequest;
