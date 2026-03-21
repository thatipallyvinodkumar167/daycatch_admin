import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { genericApi } from "../api/genericApi";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    setProgress(10);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        setProgress(30);
        
        // Simple CSV parser (assuming first row is headers)
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
        
        // Send to backend bulk endpoint
        try {
          const response = await genericApi.create("Adminproducts/bulk", data);
          setProgress(100);
          setTimeout(() => {
            setUploading(false);
            setFile(null);
            setProgress(0);
            alert(`Successfully uploaded ${data.length} products!`);
          }, 500);
        } catch (error) {
          console.error("Bulk upload error:", error);
          alert(error.response?.data?.error || "Failed to upload products to the database.");
          setUploading(false);
        }
      };
      
      reader.onerror = () => {
        alert("Error reading file.");
        setUploading(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during upload.");
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "Product Id,Product Name,Category,Type,Product Image,Quantity,EAN code,Tags,Unit,MRP,price,description";
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_template.csv";
    a.click();
  };

  const commonCardStyles = {
    p: 4,
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
    },
  };

  const uploadBoxStyles = {
    border: "2px dashed #e2e8f0",
    borderRadius: "20px",
    p: 6,
    backgroundColor: "rgba(248, 250, 252, 0.5)",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      borderColor: "#3b82f6",
      backgroundColor: "rgba(239, 246, 255, 0.8)",
      "& .upload-icon": {
        transform: "scale(1.1) translateY(-3px)",
        color: "#2563eb",
      },
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const primaryBtnStyles = {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "white",
    borderRadius: "12px",
    px: 4,
    py: 1.5,
    textTransform: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      boxShadow: "0 6px 20px rgba(59, 130, 246, 0.6)",
      transform: "scale(1.02)",
    },
    "&:disabled": {
      background: "#e2e8f0",
      boxShadow: "none",
    },
  };

  const secondaryBtnStyles = {
    borderRadius: "12px",
    px: 4,
    py: 1.5,
    textTransform: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
    border: "1.5px solid #e2e8f0",
    color: "#475569",
    transition: "all 0.3s ease",
    "&:hover": {
      border: "1.5px solid #3b82f6",
      color: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.04)",
    },
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4, lg: 6 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Orbs */}
      <Box sx={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(59, 130, 246, 0.1)", borderRadius: "50%", filter: "blur(100px)", zIndex: 0 }} />
      <Box sx={{ position: "absolute", bottom: -150, left: -150, width: 500, height: 500, background: "rgba(139, 92, 246, 0.08)", borderRadius: "50%", filter: "blur(120px)", zIndex: 0 }} />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: "900px", mx: "auto" }}>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              color: "#1e293b",
              letterSpacing: "-0.02em",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 36, color: "#3b82f6" }} />
            Bulk Product Upload
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
            Quickly expand your inventory by uploading your product database.
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Paper sx={commonCardStyles}>
            <Box
              sx={uploadBoxStyles}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <CloudUploadIcon className="upload-icon" sx={{ fontSize: 64, color: "#94a3b8", mb: 2, transition: "all 0.3s" }} />
              <Typography variant="h6" fontWeight="700" color="#334155" sx={{ mb: 0.5 }}>
                {file ? file.name : "Choose CSV or XLSX file"}
              </Typography>
              <Typography variant="body2" color="#94a3b8">
                or drag and drop your template here
              </Typography>
              <input
                type="file"
                id="fileInput"
                hidden
                accept=".csv, .xlsx"
                onChange={handleFileChange}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={downloadTemplate}
                sx={secondaryBtnStyles}
              >
                Download Template
              </Button>
              <Button
                variant="contained"
                disabled={!file || uploading}
                onClick={handleUpload}
                sx={primaryBtnStyles}
              >
                {uploading ? "Processing Catalog..." : "Start Upload"}
              </Button>
            </Stack>

            {uploading && (
              <Box sx={{ mt: 4 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#f1f5f9",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                    },
                  }}
                />
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                  <Typography variant="caption" color="#64748b">
                    Processing your inventory catalog...
                  </Typography>
                  <Typography variant="caption" fontWeight="700" color="#3b82f6">
                    {progress}%
                  </Typography>
                </Stack>
              </Box>
            )}
          </Paper>

          <Paper sx={{ ...commonCardStyles, p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)" }}>
                <InfoIcon sx={{ color: "#3b82f6" }} />
              </Box>
              <Typography variant="h6" fontWeight="700" color="#1e293b">
                Upload Instructions
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2, opacity: 0.6 }} />
            <List>
              {[
                "Download the standard Excel template first to ensure data compatibility.",
                "Ensure Category and Sub-category names match exactly with existing ones.",
                "Duplicate SKU/IDs will be skipped or updated based on the current system rules.",
                "Supported formats are .csv and .xlsx with a maximum size of 10MB.",
              ].map((text, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: "#10b981" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{ fontSize: "0.85rem", color: "#64748b" }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
};

export default BulkUpload;


