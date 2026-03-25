import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  Grid
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const AddCancellingReason = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Operational Requirement: Narrative description is mandatory.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        reason: reason.trim(),
        isActive: true, // System standard for core logic
        addedAt: new Date().toISOString()
      };
      await genericApi.create("cancelling reason", payload);
      navigate("/cancelling-reasons");
    } catch (error) {
      console.error("Error adding reason:", error);
      alert("Platform Sync Logic Error: Unable to record reason.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/cancelling-reasons")} sx={{ mr: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <ArrowBackIcon sx={{ color: "#4318ff" }} />
        </IconButton>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Define Logic Reason
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Establish a new pre-defined cancellation path for orders.
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", p: 4 }}>
        <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 4, borderBottom: "2px solid #f4f7fe", pb: 2 }}>
            Logic Parameters
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                  REASON NARRATIVE (VISIBLE TO USERS/FLEET)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="e.g. Items out of stock, Operational delay, Fleet unavailability..."
                  variant="outlined"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                  }}
                />
            </Grid>

            <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button 
                        onClick={() => navigate("/cancelling-reasons")}
                        sx={{ color: "#a3aed0", fontWeight: "800", textTransform: "none", borderRadius: "14px", px: 4 }}
                    >
                        Discard
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained" 
                        disabled={isSubmitting}
                        startIcon={<SaveIcon />}
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
                        {isSubmitting ? "Dispatching Logic..." : "Record Narrative"}
                    </Button>
                </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCancellingReason;


