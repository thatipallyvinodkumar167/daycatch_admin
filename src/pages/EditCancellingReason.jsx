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

const EditCancellingReason = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReason = async () => {
      try {
        setLoading(true);
        // Integrated correctly with genericApi.getOne
        const response = await genericApi.getOne("cancelling reason", id);
        const data = response.data || response;
        setReason(data?.reason || data?.title || data?.name || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cancellation reason:", error);
        setLoading(false);
      }
    };

    fetchReason();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Integrity Violation: A descriptive narrative is required for system logic.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        reason: reason.trim(),
        lastModified: new Date().toISOString()
      };
      await genericApi.update("cancelling reason", id, payload);
      navigate("/cancelling-reasons");
    } catch (error) {
      console.error("Error updating reason:", error);
      alert("Platform Sync Logic Error: Update rejected by persistence layer.");
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
                Update Logic Reason
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Modify the narrative parameters for order cancellation [ID: {id}]
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", p: 4 }}>
        
        {loading ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
                <CircularProgress sx={{ color: "#4318ff" }} />
                <Typography sx={{ mt: 2, color: "#a3aed0", fontWeight: "600" }}>Fetching Logic Narrative...</Typography>
            </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                        NARRATIVE DESCRIPTION
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
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
                            {isSubmitting ? "Syncing Narrative..." : "Commit Update"}
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

export default EditCancellingReason;
