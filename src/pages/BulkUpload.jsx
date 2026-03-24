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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { genericApi } from "../api/genericApi";

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
      alert("Please select a file to upload.");
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
            showSnackbar(`${data.length} products uploaded successfully.`, "success");
          }, 800);
        } catch (error) {
          console.error("Ingestion Error:", error);
          showSnackbar(error.response?.data?.error || "Bulk upload failed.", "error");
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
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Bulk Product Upload
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Upload CSV or Excel files to add multiple products at once.
            </Typography>
        </Box>
        <Tooltip title="Upload Help">
            <IconButton sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}>
                <HelpOutlineIcon sx={{ color: "#4318ff" }} />
            </IconButton>
        </Tooltip>
      </Box>

      <Stack spacing={4} sx={{ maxWidth: 900, mx: "auto" }}>
        
        {/* Atomic Import Card */}
        <Paper sx={{ p: 6, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff", textAlign: "center" }}>
            <Box
                sx={{
                    border: "3px dashed #e0e5f2",
                    borderRadius: "24px",
                    p: 8,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { borderColor: "#4318ff", bgcolor: "#f9fbff" }
                }}
                onClick={() => document.getElementById("fileInput").click()}
            >
                <CloudUploadIcon sx={{ fontSize: 80, color: "#a3aed0", mb: 3 }} />
                <Typography variant="h5" fontWeight="800" color="#1b2559">
                   {file ? file.name : "Select File"}
                </Typography>
                <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mt: 1 }}>
                    Click to browse or drag and drop your CSV/Excel file here
                </Typography>
                <input type="file" id="fileInput" hidden accept=".csv, .xlsx" onChange={handleFileChange} />
            </Box>

            <Stack direction="row" spacing={3} sx={{ mt: 5 }} justifyContent="center">
                <Button
                    variant="outlined"
                    startIcon={<FileDownloadIcon />}
                    onClick={downloadTemplate}
                    sx={{ borderRadius: "16px", px: 4, py: 1.8, textTransform: "none", fontWeight: "800", borderColor: "#4318ff", color: "#4318ff", "&:hover": { borderColor: "#3311cc", bgcolor: "#f4f7fe" } }}
                >
                    Download Template
                </Button>
                <Button
                    variant="contained"
                    disabled={!file || uploading}
                    onClick={handleUpload}
                    sx={{ backgroundColor: "#4318ff", "&:hover": { backgroundColor: "#3311cc" }, borderRadius: "16px", px: 6, py: 1.8, textTransform: "none", fontWeight: "800", boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)" }}
                >
                    {uploading ? "Uploading products..." : "Start Upload"}
                </Button>
            </Stack>

            {uploading && (
                <Box sx={{ mt: 6 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ textTransform: "uppercase" }}>Upload Progress</Typography>
                        <Typography variant="caption" fontWeight="900" color="#4318ff">{progress}%</Typography>
                    </Stack>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ height: 12, borderRadius: 6, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#4318ff", borderRadius: 6 } }} 
                    />
                </Box>
            )}
        </Paper>

        {/* Instruction Protocol Card */}
        <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: "12px", background: "rgba(67, 24, 255, 0.05)" }}>
                    <InfoIcon sx={{ color: "#4318ff" }} />
                </Box>
                <Typography variant="h6" fontWeight="800" color="#1b2559">Upload Instructions</Typography>
            </Stack>
            <Divider sx={{ mb: 3, opacity: 0.1 }} />
            <Grid container spacing={2}>
                {[
                    "Use the standard CSV template for consistent data.",
                    "Ensure categories and IDs match the existing list.",
                    "Duplicate product IDs will update existing records.",
                    "Maximum file size: 10MB."
                ].map((text, idx) => (
                    <Grid item xs={12} key={idx}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <CheckCircleIcon sx={{ fontSize: 20, color: "#24d164" }} />
                            <Typography variant="body2" color="#a3aed0" fontWeight="700">{text}</Typography>
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
            sx={{ borderRadius: "14px", fontWeight: "700", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", bgcolor: snackbar.severity === "success" ? "#00d26a" : "#ff4d49" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkUpload;
