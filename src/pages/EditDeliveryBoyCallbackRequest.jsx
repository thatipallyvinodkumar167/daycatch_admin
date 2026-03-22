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

const EditDeliveryBoyCallbackRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deliveryBoyName: "",
    deliveryBoyPhone: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await genericApi.getOne("deliveryboycallbackrequests", id);
        const data = response.data || response;
        
        // Smart mapping for legacy or modern keys
        setFormData({
            deliveryBoyName: data.deliveryBoyName || data["Delivery Boy Name"] || data.name || "",
            deliveryBoyPhone: data.deliveryBoyPhone || data["Delivery Boy Phone"] || data.phone || ""
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
    if (!formData.deliveryBoyName.trim() || !formData.deliveryBoyPhone.trim()) {
      alert("Operational Conflict: Rider Name and Phone are mandatory for field updates.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Syncing with modern camelCase standard
      const updatePayload = {
        deliveryBoyName: formData.deliveryBoyName.trim(),
        deliveryBoyPhone: formData.deliveryBoyPhone.trim(),
        lastModified: new Date().toISOString()
      };
      await genericApi.update("deliveryboycallbackrequests", id, updatePayload);
      navigate("/delivery-boy-callback-request");
    } catch (error) {
      console.error("Error updating delivery boy callback request:", error);
      alert("Fleet Sync Logic Error: Unable to persist field updates.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header with Navigation */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/delivery-boy-callback-request")} sx={{ mr: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <ArrowBackIcon sx={{ color: "#4318ff" }} />
        </IconButton>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Edit Rider Assistance
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Modify field logistics and emergency reports for rider [ID: {id}]
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", p: 4 }}>
        
        {loading ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
                <CircularProgress sx={{ color: "#4318ff" }} />
                <Typography sx={{ mt: 2, color: "#a3aed0", fontWeight: "600" }}>Fetching Fleet Data...</Typography>
            </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                        RIDER IDENTITY
                    </Typography>
                    <TextField
                        fullWidth
                        name="deliveryBoyName"
                        variant="outlined"
                        value={formData.deliveryBoyName}
                        onChange={handleChange}
                        sx={{ 
                            "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                        FIELD MOBILE
                    </Typography>
                    <TextField
                        fullWidth
                        name="deliveryBoyPhone"
                        variant="outlined"
                        value={formData.deliveryBoyPhone}
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
                            onClick={() => navigate("/delivery-boy-callback-request")}
                            sx={{ color: "#a3aed0", fontWeight: "800", textTransform: "none", borderRadius: "14px", px: 4 }}
                        >
                            Reset Ticket
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
                            {isSubmitting ? "Dispatching Updates..." : "Sync Rider Logic"}
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

export default EditDeliveryBoyCallbackRequest;
