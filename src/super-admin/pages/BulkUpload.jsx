import React, { useState } from "react";
import {
  alpha,
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
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  InfoOutlined as InfoIcon,
  Inventory2Outlined as ProductIcon,
} from "@mui/icons-material";
import { genericApi } from "../../api/genericApi";

const BulkUpload = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /* ─── Workspace Section (mirrors StoreBulkUpdate / BulkUploadArea) ─── */
  const WorkspaceSection = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
      if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const downloadTemplate = () => {
      const headers = "product_id,product_name,category,type,product_image,quantity,ean_code,tags,unit,mrp,price,description";
      const blob = new Blob([headers], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Daycatch_Inventory_Template.csv";
      a.click();
    };

    const handleUpload = async () => {
      if (!file) {
        showSnackbar("Please select a CSV file first.", "error");
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
            await genericApi.create("admin_products/bulk", data);
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

    return (
      <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 20px 60px rgba(0,0,0,0.05)", bgcolor: "#fff" }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: "#fafbfc", p: 4, borderRadius: "24px", border: "1px solid #f0f4f8", height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: alpha("#E53935", 0.1) }}>
                  <InfoIcon sx={{ color: "#E53935", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="900" color="#1b2559">Ingestion Protocol</Typography>
              </Stack>
              <List spacing={1}>
                {[
                  "CSV format with standard headers is required.",
                  "Master Category IDs must be valid matching core categories.",
                  "Unique IDs are generated for new entries automatically.",
                  "Existing ID collisions will trigger an update sync.",
                  "Max Batch Size: 50,000 records per upload.",
                ].map((text, i) => (
                  <ListItem key={i} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <CheckCircleIcon sx={{ color: "#05cd99", fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2" fontWeight="700" color="#707eae">{text}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="text"
                startIcon={<DownloadIcon />}
                onClick={downloadTemplate}
                sx={{ mt: 3, color: "#E53935", fontWeight: 900, textTransform: "none", fontSize: "15px" }}
              >
                Download Product Template
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>Data Source (CSV)</Typography>
                <Box
                  sx={{
                    border: "3px dashed #e0e5f2",
                    borderRadius: "24px",
                    p: 6,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "0.2s",
                    bgcolor: file ? alpha("#E53935", 0.02) : "transparent",
                    "&:hover": { borderColor: "#E53935", bgcolor: alpha("#E53935", 0.04) }
                  }}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <UploadIcon sx={{ color: file ? "#E53935" : "#d1d9e2", fontSize: 56, mb: 2 }} />
                  <Typography variant="h5" fontWeight="900" color="#1b2559">
                    {file ? file.name : "Select or Drop CSV File"}
                  </Typography>
                  <Typography variant="body2" color="#a3aed0" fontWeight="700" sx={{ mt: 1 }}>
                    Securely upload your inventory list to the Master Catalog.
                  </Typography>
                  <input type="file" id="fileInput" hidden accept=".csv" onChange={handleFileChange} />
                </Box>
              </Box>

              {uploading && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" fontWeight="900" color="#1b2559">Global Processing Status</Typography>
                    <Typography variant="caption" fontWeight="900" color="#E53935">{progress}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 16, borderRadius: 8, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#E53935" } }} />
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleUpload}
                disabled={!file || uploading}
                sx={{ py: 2.2, borderRadius: "20px", bgcolor: "#E53935", fontWeight: 900, fontSize: "17px", boxShadow: "0 10px 30px rgba(229, 57, 53, 0.22)", "&:hover": { bgcolor: "#d32f2f" } }}
              >
                {uploading ? "Ingesting Products..." : "Start Global Sync"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-3px", mb: 1 }}>
            Bulk Product Upload
          </Typography>
          <Typography variant="body1" color="#a3aed0" fontWeight="700">
            Scale your global inventory with high-speed CSV ingestion.
          </Typography>
        </Box>

        {/* Product Upload Hero Card */}
        <Grid container spacing={3} sx={{ mb: 6 }} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                borderRadius: "32px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #E53935",
                backgroundImage: `linear-gradient(135deg, ${alpha("#E53935", 0.05)}, #fff)`,
                boxShadow: "0 20px 40px rgba(229, 57, 53, 0.08)",
              }}
            >
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Box sx={{ p: 2.5, borderRadius: "20px", bgcolor: "#E53935", color: "#fff" }}>
                  <ProductIcon />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="900" color="#E53935">
                    Product Ingestion
                  </Typography>
                  <Typography variant="caption" fontWeight="800" color="#a3aed0">
                    Upload products in batch via CSV to Master Catalog
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Active Model Workspace */}
        <Box sx={{ position: "relative" }}>
          <Typography variant="caption" fontWeight="900" color="#E53935" sx={{ mb: 2, display: "block", textTransform: "uppercase", letterSpacing: "2px" }}>
            Active Environment: Product Upload
          </Typography>
          <WorkspaceSection />
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "18px", fontWeight: "900", px: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkUpload;
