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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setFile(null);
          setProgress(0);
          alert("Bulk products uploaded successfully!");
        }, 500);
      }
    }, 200);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Bulk upload products using Excel or CSV templates.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Paper sx={{ p: 5, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "center" }}>
          
          <Box 
            sx={{ 
                border: "2px dashed #d1d5db", 
                borderRadius: "15px", 
                p: 6, 
                backgroundColor: "#fafbfc",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#2d60ff", backgroundColor: "#f0f4ff" },
                mb: 4
            }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <CloudUploadIcon sx={{ fontSize: "64px", color: "#2d60ff", mb: 2 }} />
            <Typography variant="h6" fontWeight="700" color="#1b2559">
              {file ? file.name : "Choose a file or drag & drop"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Supported formats: .xlsx, .csv (Max size: 10MB)
            </Typography>
            <input 
              type="file" 
              id="fileInput" 
              hidden 
              accept=".csv, .xlsx"
              onChange={handleFileChange}
            />
          </Box>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Button 
                variant="outlined" 
                startIcon={<FileDownloadIcon />}
                sx={{ borderRadius: "10px", px: 4, py: 1.5, textTransform: "none", fontWeight: "700" }}
            >
                Download Template
            </Button>
            <Button 
                variant="contained" 
                disabled={!file || uploading}
                onClick={handleUpload}
                sx={{ 
                    backgroundColor: "#2d60ff", 
                    "&:hover": { backgroundColor: "#2046cc" },
                    borderRadius: "10px", 
                    px: 4, 
                    py: 1.5, 
                    textTransform: "none", 
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)"
                }}
            >
                {uploading ? "Uploading..." : "Start Upload"}
            </Button>
          </Stack>

          {uploading && (
            <Box sx={{ mt: 4, width: "100%" }}>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Processing: {progress}%
                </Typography>
            </Box>
          )}

        </Paper>

        <Paper sx={{ p: 4, mt: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <InfoIcon color="primary" /> Instructions
            </Typography>
            <List>
                <ListItem sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: "35px" }}><CheckCircleIcon sx={{ fontSize: "18px", color: "#24d164" }} /></ListItemIcon>
                    <ListItemText primary="Download the standard Excel template first." primaryTypographyProps={{ fontSize: "14px" }} />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: "35px" }}><CheckCircleIcon sx={{ fontSize: "18px", color: "#24d164" }} /></ListItemIcon>
                    <ListItemText primary="Ensure Category and Sub-category names match exactly with existing ones." primaryTypographyProps={{ fontSize: "14px" }} />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: "35px" }}><CheckCircleIcon sx={{ fontSize: "18px", color: "#24d164" }} /></ListItemIcon>
                    <ListItemText primary="Duplicate SKU/IDs will be skipped or updated based on selection." primaryTypographyProps={{ fontSize: "14px" }} />
                </ListItem>
            </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default BulkUpload;
