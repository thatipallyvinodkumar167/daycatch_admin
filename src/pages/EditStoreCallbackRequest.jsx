import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
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

  // Fetch the specific request to edit
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await genericApi.getOne("storecallbackrequests", id);
        setFormData({
            storeName: response.data?.storeName || response.data?.store || response.data?.name || "",
            storePhone: response.data?.storePhone || response.data?.phone || ""
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching store callback request:", error);
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
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.update("storecallbackrequests", id, formData);

      alert("Store callback request updated successfully!");
      navigate("/store-callback-request");
    } catch (error) {
      console.error("Error updating store callback request:", error);
      alert("Failed to update request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here is your admin panel.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Edit Store Callback Request
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" fontWeight="500" color="#1b2559" sx={{ mb: 1 }}>
                  Store Name
                </Typography>
                <TextField
                  fullWidth
                  name="storeName"
                  variant="outlined"
                  value={formData.storeName}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    backgroundColor: "#fff"
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" fontWeight="500" color="#1b2559" sx={{ mb: 1 }}>
                  Store Phone
                </Typography>
                <TextField
                  fullWidth
                  name="storePhone"
                  variant="outlined"
                  value={formData.storePhone}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                    backgroundColor: "#fff"
                  }}
                />
              </Box>

              <Box>
                <Button 
                  type="submit"
                  variant="contained" 
                  disabled={loading || isSubmitting}
                  sx={{ 
                    backgroundColor: "#2d60ff", 
                    "&:hover": { backgroundColor: "#2046cc" },
                    borderRadius: "8px",
                    textTransform: "none",
                    px: 4,
                    py: 1,
                    fontSize: "16px"
                  }}
                >
                  {isSubmitting ? "Updating..." : "Submit"}
                </Button>
              </Box>
            </Stack>
          </form>
        </Box>

      </Paper>
    </Box>
  );
};

export default EditStoreCallbackRequest;
