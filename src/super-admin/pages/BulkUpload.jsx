import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Grid,
  Snackbar,
  Alert,
  Fade,
  alpha,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { genericApi } from "../../api/genericApi";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showSnackbar("Please select a file to upload.", "error");
      return;
    }

    setUploading(true);
    setProgress(10);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        setProgress(30);
        
        const lines = text.split("\n").filter(line => line.trim());
        if (lines.length < 2) {
            showSnackbar("File is empty or missing data rows.", "error");
            setUploading(false);
            return;
        }

        const headers = lines[0].split(",").map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim());
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        });

        setProgress(60);
        
        try {
          await genericApi.create("Adminproducts/bulk", data);
          setProgress(100);
          setTimeout(() => {
            setUploading(false);
            setFile(null);
            setProgress(0);
            showSnackbar(`${data.length} products uploaded successfully!`, "success");
          }, 800);
        } catch (error) {
          console.error("Ingestion Error:", error);
          const msg = error.response?.data?.error;
          showSnackbar(typeof msg === 'object' ? JSON.stringify(msg) : String(msg || "Bulk upload failed."), "error");
          setUploading(false);
        }
      };
      
      reader.onerror = () => {
        showSnackbar("Error reading file.", "error");
        setUploading(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error("System Error:", error);
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "Product Id,Product Name,Category,Type,Product Image,Quantity,EAN code,Tags,Unit,MRP,price,description";
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Daycatch_Inventory_Template.csv";
    a.click();
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", mx: "auto" }}>
        <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
                Bulk Product Upload
            </Typography>
            <Typography variant="body1" color="#a3aed0" fontWeight="700">
                Scale your global inventory with high-speed CSV ingestion.
            </Typography>
        </Box>
        <Tooltip title="Documentation">
            <IconButton sx={{ bgcolor: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.05)", p: 1.8 }}>
                <HelpOutlineIcon sx={{ color: "#E53935" }} />
            </IconButton>
        </Tooltip>
      </Box>

      <Stack spacing={4} sx={{ maxWidth: 1000, mx: "auto" }}>
        
        <Paper sx={{ p: 6, borderRadius: "32px", boxShadow: "0 20px 50px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", bgcolor: "#fff", textAlign: "center" }}>
            <Box
                sx={{
                    border: "3px dashed #e0e5f2",
                    borderRadius: "28px",
                    p: 8,
                    cursor: "pointer",
                    transition: "0.3s",
                    bgcolor: file ? alpha("#E53935", 0.02) : "#fafbfc",
                    "&:hover": { borderColor: "#E53935", bgcolor: alpha("#E53935", 0.04) }
                }}
                onClick={() => document.getElementById("fileInput").click()}
            >
                <CloudUploadIcon sx={{ fontSize: 90, color: file ? "#E53935" : "#a3aed0", mb: 3, transition: "0.3s" }} />
                <Typography variant="h4" fontWeight="900" color="#1b2559">
                   {file ? file.name : "Select Product CSV"}
                </Typography>
                <Typography variant="body1" color="#a3aed0" fontWeight="700" sx={{ mt: 1.5 }}>
                    Securely upload your inventory list to the Master Catalog.
                </Typography>
                <input type="file" id="fileInput" hidden accept=".csv" onChange={handleFileChange} />
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mt: 6 }} justifyContent="center">
                <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={downloadTemplate}
                    sx={{ borderRadius: "18px", px: 5, py: 2, textTransform: "none", fontWeight: "900", borderColor: "#E53935", color: "#E53935", fontSize: "16px", "&:hover": { borderColor: "#d32f2f", bgcolor: alpha("#E53935", 0.05) } }}
                >
                    Download Template
                </Button>
                <Button
                    variant="contained"
                    disabled={!file || uploading}
                    onClick={handleUpload}
                    sx={{ backgroundColor: "#E53935", "&:hover": { backgroundColor: "#d32f2f" }, borderRadius: "18px", px: 8, py: 2, textTransform: "none", fontWeight: "900", fontSize: "16px", boxShadow: "0 10px 30px rgba(229, 57, 53, 0.25)" }}
                >
                    {uploading ? "Ingesting Products..." : "Start Global Sync"}
                </Button>
            </Stack>

            {uploading && (
                <Box sx={{ mt: 7 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight="900" color="#1b2559" sx={{ textTransform: "uppercase", letterSpacing: "1px" }}>Global Processing Status</Typography>
                        <Typography variant="caption" fontWeight="900" color="#E53935">{progress}%</Typography>
                    </Stack>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ height: 16, borderRadius: 8, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#E53935", borderRadius: 8 } }} 
                    />
                </Box>
            )}
        </Paper>

        <Paper sx={{ p: 5, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
            <Stack direction="row" alignItems="center" spacing={2.5} sx={{ mb: 4 }}>
                <Box sx={{ p: 2, borderRadius: "14px", background: alpha("#E53935", 0.05) }}>
                    <InfoIcon sx={{ color: "#E53935" }} />
                </Box>
                <Typography variant="h5" fontWeight="900" color="#1b2559">Ingestion Protocol</Typography>
            </Stack>
            <Divider sx={{ mb: 4, opacity: 0.1 }} />
            <Grid container spacing={3}>
                {[
                    "Master Category IDs must be valid matching core categories.",
                    "Unique IDs are generated for new entries automatically.",
                    "Existing ID collisions will trigger an update sync.",
                    "Max Batch Size: 50,000 records per upload."
                ].map((text, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CheckCircleIcon sx={{ fontSize: 24, color: "#05cd99" }} />
                            <Typography variant="body2" color="#707eae" fontWeight="800" sx={{ fontSize: "14px" }}>{text}</Typography>
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Paper>

      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity} 
            variant="filled" 
            sx={{ borderRadius: "16px", fontWeight: "800", boxShadow: "0 12px 40px rgba(0,0,0,0.18)", bgcolor: snackbar.severity === "success" ? "#05cd99" : "#E53935", px: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkUpload;
