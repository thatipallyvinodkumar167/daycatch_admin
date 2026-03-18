import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InfoIcon from "@mui/icons-material/Info";

const BulkUploadArea = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Import multiple societies and delivery areas at once via Excel.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Paper
          sx={{
            p: 5,
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              border: "2px dashed #d1d5db",
              borderRadius: "15px",
              p: 6,
              backgroundColor: "#fafbfc",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#4318ff", backgroundColor: "#f4f7fe" },
              mb: 4,
            }}
            onClick={() => document.getElementById("fileInputArea").click()}
          >
            <CloudUploadIcon sx={{ fontSize: "64px", color: "#4318ff", mb: 2 }} />
            <Typography variant="h6" fontWeight="700" color="#1b2559">
              {file ? file.name : "Choose Excel file for Areas"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Supported formats: .xlsx, .csv (Max size: 5MB)
            </Typography>
            <input
              type="file"
              id="fileInputArea"
              hidden
              accept=".csv, .xlsx"
              onChange={handleFileChange}
            />
          </Box>

          <Alert
            severity="info"
            sx={{
              mb: 4,
              textAlign: "left",
              borderRadius: "14px",
              backgroundColor: "#eef4ff",
              color: "#1b2559",
            }}
          >
            Bulk upload is not connected yet because no backend upload endpoint has been shared.
            The screen stays available for template guidance, but import actions are intentionally
            disabled for now.
          </Alert>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              disabled
              sx={{
                borderRadius: "10px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "700",
                borderColor: "#4318ff",
                color: "#4318ff",
              }}
            >
              Sample Pending
            </Button>
            <Button
              variant="contained"
              disabled
              sx={{
                backgroundColor: "#4318ff",
                "&:hover": { backgroundColor: "#3311cc" },
                borderRadius: "10px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: "700",
                boxShadow: "0 4px 12px rgba(67, 24, 255, 0.3)",
              }}
            >
              Import Pending
            </Button>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: 4,
            mt: 4,
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="700"
            color="#1b2559"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <InfoIcon sx={{ color: "#4318ff" }} /> Mapping Requirements
          </Typography>
          <List>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <CheckCircleIcon sx={{ fontSize: "18px", color: "#4318ff" }} />
              </ListItemIcon>
              <ListItemText
                primary="Column A should be City Name (must exist in City list)."
                primaryTypographyProps={{ fontSize: "14px" }}
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <CheckCircleIcon sx={{ fontSize: "18px", color: "#4318ff" }} />
              </ListItemIcon>
              <ListItemText
                primary="Column B should be Area/Society Name."
                primaryTypographyProps={{ fontSize: "14px" }}
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: "35px" }}>
                <CheckCircleIcon sx={{ fontSize: "18px", color: "#4318ff" }} />
              </ListItemIcon>
              <ListItemText
                primary="Column C should be Pincode (Optional)."
                primaryTypographyProps={{ fontSize: "14px" }}
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default BulkUploadArea;
