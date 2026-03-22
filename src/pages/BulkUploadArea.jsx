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
  IconButton
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

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
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStatus(false);
          setFile(null);
          setProgress(0);
          alert(`Operational Sync: Bulk ${isCity ? "Cities" : "Societies"} ingestion finalized.`);
        }, 500);
      }
    }, 100);
  };

  const commonCardStyles = {
    p: 4,
    borderRadius: "28px",
    background: "#fff",
    border: "1px solid #e0e5f2",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden"
  };

  const uploadBoxStyles = {
    border: "2px dashed #e0e5f2",
    borderRadius: "20px",
    p: 6,
    backgroundColor: "#f4f7fe",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      borderColor: "#4318ff",
      backgroundColor: "#eff2ff",
      "& .upload-icon": {
        transform: "translateY(-5px)",
        color: "#4318ff",
      },
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const primaryBtnStyles = {
    backgroundColor: "#4318ff",
    color: "white",
    borderRadius: "16px",
    px: 4,
    py: 2,
    textTransform: "none",
    fontWeight: "800",
    fontSize: "1rem",
    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#3311cc",
      boxShadow: "0 12px 25px rgba(67, 24, 255, 0.25)",
    },
    "&:disabled": {
      backgroundColor: "#f4f7fe",
      color: "#a3aed0"
    },
  };

  const secondaryBtnStyles = {
    borderRadius: "14px",
    px: 3,
    py: 1.5,
    textTransform: "none",
    fontWeight: "800",
    fontSize: "0.9rem",
    color: "#4318ff",
    backgroundColor: "#f4f7fe",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e0e7ff",
    },
  };

  const InstructionList = ({ extraInfo }) => (
    <List spacing={1} sx={{ mt: 2 }}>
      {[
        "Universal CSV standard only.",
        "Header validation required (Row 1).",
        "Mandatory attribute fields for mapping.",
        ...(extraInfo || []),
      ].map((text, idx) => (
        <ListItem key={idx} sx={{ px: 0, py: 0.8 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <CheckCircleIcon sx={{ fontSize: 20, color: "#24d164" }} />
          </ListItemIcon>
          <ListItemText
            primary={text}
            primaryTypographyProps={{ fontSize: "0.9rem", color: "#1b2559", fontWeight: "600" }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f4f7fe" }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
          Geospatial Bulk Import
        </Typography>
        <Typography variant="body2" color="#a3aed0" fontWeight="600">
          Scaling regional domains and residential clusters through automated ingestion.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* CITIES UPLOAD */}
        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            <Paper sx={commonCardStyles}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: "14px", backgroundColor: "#f4f7fe" }}>
                    <LocationCityOutlinedIcon sx={{ color: "#4318ff" }} />
                    </Box>
                    <Typography variant="h6" fontWeight="800" color="#1b2559">
                    Metropolitan Protocol
                    </Typography>
                </Stack>
                <Button startIcon={<FileDownloadIcon />} sx={secondaryBtnStyles}>
                    Sample
                </Button>
              </Stack>
              <Divider sx={{ mb: 2, opacity: 0.1 }} />
              <InstructionList />
            </Paper>

            <Paper sx={commonCardStyles}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <CloudUploadIcon sx={{ color: "#4318ff", fontSize: 20 }} /> Bulk City Ingestion
              </Typography>
              <Box sx={uploadBoxStyles} onClick={() => document.getElementById("cityInput").click()}>
                {cityFile ? (
                    <>
                        <FilePresentIcon className="upload-icon" sx={{ fontSize: 60, color: "#4318ff", mb: 2 }} />
                        <Typography variant="h6" fontWeight="800" color="#1b2559">{cityFile.name}</Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="600">Click to change selection</Typography>
                    </>
                ) : (
                    <>
                        <CloudUploadIcon className="upload-icon" sx={{ fontSize: 60, color: "#a3aed0", mb: 2, transition: "0.3s" }} />
                        <Typography variant="body1" fontWeight="800" color="#1b2559">Dispatch CSV Hub</Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="600">Drag to drop or browse system</Typography>
                    </>
                )}
                <input type="file" id="cityInput" hidden accept=".csv" onChange={handleCityFileChange} />
              </Box>

              <Button
                variant="contained"
                fullWidth
                disabled={!cityFile || uploadingCity}
                onClick={() => simulateUpload("city")}
                sx={{ ...primaryBtnStyles, mt: 4 }}
              >
                {uploadingCity ? "Processing Domains..." : "Execute Bulk Import"}
              </Button>

              {uploadingCity && (
                <Box sx={{ mt: 4 }}>
                  <LinearProgress
                    variant="determinate"
                    value={cityProgress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#f4f7fe",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="700">Persisting Records...</Typography>
                    <Typography variant="caption" fontWeight="800" color="#4318ff">{cityProgress}%</Typography>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>

        {/* SOCIETY UPLOAD */}
        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            <Paper sx={commonCardStyles}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: "14px", backgroundColor: "#f4f7fe" }}>
                    <GroupsOutlinedIcon sx={{ color: "#4318ff" }} />
                    </Box>
                    <Typography variant="h6" fontWeight="800" color="#1b2559">
                    Territory Protocol
                    </Typography>
                </Stack>
                <Button startIcon={<FileDownloadIcon />} sx={secondaryBtnStyles}>
                    Sample
                </Button>
              </Stack>
              <Divider sx={{ mb: 2, opacity: 0.1 }} />
              <InstructionList extraInfo={["Link via parent City_ID identifier."]} />
            </Paper>

            <Paper sx={commonCardStyles}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <CloudUploadIcon sx={{ color: "#4318ff", fontSize: 20 }} /> Bulk Society Ingestion
              </Typography>
              <Box sx={uploadBoxStyles} onClick={() => document.getElementById("societyInput").click()}>
                {societyFile ? (
                    <>
                        <FilePresentIcon className="upload-icon" sx={{ fontSize: 60, color: "#4318ff", mb: 2 }} />
                        <Typography variant="h6" fontWeight="800" color="#1b2559">{societyFile.name}</Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="600">Click to change selection</Typography>
                    </>
                ) : (
                    <>
                        <CloudUploadIcon className="upload-icon" sx={{ fontSize: 60, color: "#a3aed0", mb: 2, transition: "0.3s" }} />
                        <Typography variant="body1" fontWeight="800" color="#1b2559">Dispatch CSV Hub</Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="600">Drag to drop or browse system</Typography>
                    </>
                )}
                <input type="file" id="societyInput" hidden accept=".csv" onChange={handleSocietyFileChange} />
              </Box>

              <Button
                variant="contained"
                fullWidth
                disabled={!societyFile || uploadingSociety}
                onClick={() => simulateUpload("society")}
                sx={{ ...primaryBtnStyles, mt: 4 }}
              >
                {uploadingSociety ? "Processing Clusters..." : "Execute Bulk Import"}
              </Button>

              {uploadingSociety && (
                <Box sx={{ mt: 4 }}>
                  <LinearProgress
                    variant="determinate"
                    value={societyProgress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#f4f7fe",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="700">Persisting Clusters...</Typography>
                    <Typography variant="caption" fontWeight="800" color="#4318ff">{societyProgress}%</Typography>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 6, p: 3, borderRadius: "20px", border: "1px dashed #4318ff", backgroundColor: "rgba(67, 24, 255, 0.02)", display: "flex", alignItems: "center", gap: 2 }}>
          <InfoOutlinedIcon sx={{ color: "#4318ff" }} />
          <Typography variant="body2" color="#1b2559" fontWeight="700">
            Precision Note: Ensure CSV logic alignment before execution. Bulk ingestion is atomic and non-reversible.
          </Typography>
      </Paper>
    </Box>
  );
};

export default BulkUploadArea;
