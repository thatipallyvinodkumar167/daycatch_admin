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

const EditDeliveryBoyCallbackRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deliveryBoyName: "",
    deliveryBoyPhone: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the specific request to edit
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await genericApi.getOne("deliveryboycallbackrequests", id);
        setFormData({
            deliveryBoyName: response.data?.deliveryBoyName || response.data?.name || "",
            deliveryBoyPhone: response.data?.deliveryBoyPhone || response.data?.phone || ""
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching delivery boy callback request:", error);
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
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.update("deliveryboycallbackrequests", id, formData);

      alert("Delivery Boy callback request updated successfully!");
      navigate("/delivery-boy-callback-request");
    } catch (error) {
      console.error("Error updating delivery boy callback request:", error);
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
            Edit Delivery Boy Callback Request
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="body1" fontWeight="500" color="#1b2559" sx={{ mb: 1 }}>
                  Delivery Boy Name
                </Typography>
                <TextField
                  fullWidth
                  name="deliveryBoyName"
                  variant="outlined"
                  value={formData.deliveryBoyName}
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
                  Delivery Boy Phone
                </Typography>
                <TextField
                  fullWidth
                  name="deliveryBoyPhone"
                  variant="outlined"
                  value={formData.deliveryBoyPhone}
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

export default EditDeliveryBoyCallbackRequest;
