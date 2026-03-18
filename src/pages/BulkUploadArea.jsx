import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

const BulkUploadArea = () => {
  const [cityFile, setCityFile] = useState(null);
  const [societyFile, setSocietyFile] = useState(null);
  const [uploadingCity, setUploadingCity] = useState(false);
  const [uploadingSociety, setUploadingSociety] = useState(false);
  const [cityProgress, setCityProgress] = useState(0);
  const [societyProgress, setSocietyProgress] = useState(0);

  const handleCityFileChange = (e) => {
    if (e.target.files[0]) {
      setCityFile(e.target.files[0]);
    }
  };

  const handleSocietyFileChange = (e) => {
    if (e.target.files[0]) {
      setSocietyFile(e.target.files[0]);
    }
  };

  const simulateUpload = (type) => {
    const isCity = type === "city";
    const setStatus = isCity ? setUploadingCity : setUploadingSociety;
    const setProgress = isCity ? setCityProgress : setSocietyProgress;
    const setFile = isCity ? setCityFile : setSocietyFile;

    setStatus(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStatus(false);
          setFile(null);
          setProgress(0);
          alert(`Bulk ${isCity ? "Cities" : "Societies"} uploaded successfully!`);
        }, 500);
      }
    }, 200);
  };

  const commonCardStyles = {
    p: 3,
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
    p: 4,
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

  const InstructionList = ({ extraInfo }) => (
    <List spacing={1} sx={{ mt: 2 }}>
      {[
        "Only CSV file are allowed.",
        "First row need to keep blank or use for column name only.",
        "All fields are must needed in csv file.",
        ...(extraInfo || []),
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
  );

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

      <Box sx={{ position: "relative", zIndex: 1 }}>
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
            Bulk Area Management
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
            Import multiple cities and societies efficiently.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* CITIES UPLOAD */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Paper sx={commonCardStyles}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)" }}>
                    <LocationCityOutlinedIcon sx={{ color: "#3b82f6" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" color="#1e293b">
                    City Instructions
                  </Typography>
                </Stack>
                <Divider sx={{ opacity: 0.6 }} />
                <InstructionList />
                <Button
                  startIcon={<FileDownloadIcon />}
                  sx={{ ...secondaryBtnStyles, mt: 2, border: "none", backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                >
                  Download Sample File
                </Button>
              </Paper>

              <Paper sx={commonCardStyles}>
                <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 3 }}>
                  Bulk Cities Upload
                </Typography>
                <Box
                  sx={uploadBoxStyles}
                  onClick={() => document.getElementById("cityInput").click()}
                >
                  <CloudUploadIcon className="upload-icon" sx={{ fontSize: 48, color: "#94a3b8", mb: 2, transition: "all 0.3s" }} />
                  <Typography variant="body1" fontWeight="600" color="#334155" sx={{ mb: 0.5 }}>
                    {cityFile ? cityFile.name : "Choose CSV file"}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    or drag and drop it here
                  </Typography>
                  <input
                    type="file"
                    id="cityInput"
                    hidden
                    accept=".csv"
                    onChange={handleCityFileChange}
                  />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!cityFile || uploadingCity}
                  onClick={() => simulateUpload("city")}
                  sx={{ ...primaryBtnStyles, mt: 3 }}
                >
                  {uploadingCity ? "Importing Cities..." : "Import Cities"}
                </Button>

                {uploadingCity && (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={cityProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                        },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                      <Typography variant="caption" color="#64748b">
                        Processing records...
                      </Typography>
                      <Typography variant="caption" fontWeight="700" color="#3b82f6">
                        {cityProgress}%
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Paper>
            </Stack>
          </Grid>

          {/* SOCIETY UPLOAD */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Paper sx={commonCardStyles}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)" }}>
                    <GroupsOutlinedIcon sx={{ color: "#8b5cf6" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" color="#1e293b">
                    Society Instructions
                  </Typography>
                </Stack>
                <Divider sx={{ opacity: 0.6 }} />
                <InstructionList
                  extraInfo={[
                    "fill the city id(Which is available in city list section) in city_id column of csv file.",
                  ]}
                />
                <Button
                  startIcon={<FileDownloadIcon />}
                  sx={{ ...secondaryBtnStyles, mt: 2, border: "none", backgroundColor: "rgba(139, 92, 246, 0.05)" }}
                >
                  Download Sample File
                </Button>
              </Paper>

              <Paper sx={commonCardStyles}>
                <Typography variant="h6" fontWeight="700" color="#1e293b" sx={{ mb: 3 }}>
                  Bulk Society Upload
                </Typography>
                <Box
                  sx={uploadBoxStyles}
                  onClick={() => document.getElementById("societyInput").click()}
                >
                  <CloudUploadIcon className="upload-icon" sx={{ fontSize: 48, color: "#94a3b8", mb: 2, transition: "all 0.3s" }} />
                  <Typography variant="body1" fontWeight="600" color="#334155" sx={{ mb: 0.5 }}>
                    {societyFile ? societyFile.name : "Choose CSV file"}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    or drag and drop it here
                  </Typography>
                  <input
                    type="file"
                    id="societyInput"
                    hidden
                    accept=".csv"
                    onChange={handleSocietyFileChange}
                  />
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  disabled={!societyFile || uploadingSociety}
                  onClick={() => simulateUpload("society")}
                  sx={{ ...primaryBtnStyles, mt: 3 }}
                >
                  {uploadingSociety ? "Importing Societies..." : "Import Society"}
                </Button>

                {uploadingSociety && (
                  <Box sx={{ mt: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={societyProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                        },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                      <Typography variant="caption" color="#64748b">
                        Processing records...
                      </Typography>
                      <Typography variant="caption" fontWeight="700" color="#3b82f6">
                        {societyProgress}%
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Paper>
            </Stack>
          </Grid>
        </Grid>

        <Alert 
          severity="info" 
          sx={{ 
            mt: 4, 
            borderRadius: "16px", 
            background: "rgba(255, 255, 255, 0.4)", 
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            color: "#1e293b",
            "& .MuiAlert-icon": { color: "#3b82f6" }
          }}
        >
          Note: Bulk upload connectivity is currently in development. Template guidance is active.
        </Alert>
      </Box>
    </Box>
  );
};

export default BulkUploadArea;

