import React, { useState } from "react";
import {
  alpha,
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  InfoOutlined as InfoIcon,
  PriceCheckOutlined as PricingIcon,
  Inventory2Outlined as StockIcon,
  SpeedOutlined as LimitsIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const StoreBulkUpdate = () => {
  const { store } = useOutletContext();
  const [activeTab, setActiveTab] = useState("Pricing");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const options = [
    { id: "Pricing", title: "Mass Price Sync", icon: <PricingIcon />, subtitle: "Update price & MRP in batch" },
    { id: "Stock", title: "Inventory Ingestion", icon: <StockIcon />, subtitle: "Execute high-volume stock sync" },
    { id: "Order Limits", title: "Elasticity Control", icon: <LimitsIcon />, subtitle: "Configure bulk purchase limits" },
  ];

  const WorkspaceSection = ({ type }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };

    const downloadTemplate = () => {
        let headers = "Product Id,Product Name,Value";
        if (type === "Pricing") headers = "Product Id,Product Name,price,mrp";
        if (type === "Order Limits") headers = "Product Id,Product Name,minOrderQuantity,maxOrderQuantity";
        
        const blob = new Blob([headers], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Daycatch_Store_${type.replace(/\s/g, '_')}_Template.csv`;
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
            showSnackbar("File is empty or missing data.", "error");
            setUploading(false);
            return;
          }

          const headers = lines[0].split(",").map(h => h.trim());
          const data = lines.slice(1).map(line => {
            const values = line.split(",").map(v => v.trim());
            const obj = {};
            headers.forEach((header, index) => {
               const key = header.toLowerCase().replace(/\s/g, '');
               obj[key === "productid" ? "productId" : key] = values[index];
            });
            return obj;
          });

          try {
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const productId = item.productId || item.productId;
                if (!productId) continue;

                try {
                    if (type === "Pricing") {
                        await storeWorkspaceApi.updateCatalogPricing(store.id, productId, {
                            price: Number(item.price || item.value),
                            mrp: Number(item.mrp || item.value),
                        });
                    } else if (type === "Stock") {
                        await storeWorkspaceApi.updateCatalogStock(store.id, productId, {
                            stock: Number(item.stock || item.value || item.Quantity),
                        });
                    } else if (type === "Order Limits") {
                        await storeWorkspaceApi.updateCatalogOrderQuantity(store.id, productId, {
                            minOrderQuantity: Number(item.minorderquantity || item.min || 1),
                            maxOrderQuantity: Number(item.maxorderquantity || item.max || 100),
                        });
                    }
                    successCount++;
                } catch (err) { failCount++; }
                setProgress(30 + Math.floor(((i + 1) / data.length) * 70));
            }

            setUploading(false);
            setFile(null);
            showSnackbar(failCount === 0 ? `Successfully synced ${successCount} items!` : `Synced ${successCount} items with ${failCount} errors.`, failCount === 0 ? "success" : "warning");
          } catch (error) {
            const msg = error.response?.data?.error;
            showSnackbar(typeof msg === 'object' ? JSON.stringify(msg) : String(msg || "Sync failed."), "error");
            setUploading(false);
          }
        };
        reader.readAsText(file);
      } catch (err) {
        setUploading(false);
        showSnackbar("FileSystem error.", "error");
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
                        <Typography variant="h5" fontWeight="900" color="#1b2559">Sync Protocol</Typography>
                    </Stack>
                    <List spacing={1}>
                      {[
                        "CSV format with standard headers is required.",
                        "Direct IDs from 'Update Catalog' recommended.",
                        "All changes are effective immediately across store.",
                        "Max threshold: 5,000 products per ingestion cycle."
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
                      Download {type} Template
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
                            onClick={() => document.getElementById(`file-${type}`).click()}
                        >
                            <UploadIcon sx={{ color: file ? "#E53935" : "#d1d9e2", fontSize: 56, mb: 2 }} />
                            <Typography variant="h5" fontWeight="900" color="#1b2559">
                                {file ? file.name : "Select or Drop CSV File"}
                            </Typography>
                            <Typography variant="body2" color="#a3aed0" fontWeight="700" sx={{ mt: 1 }}>
                                Only .csv formats are permitted for high-speed ingestion.
                            </Typography>
                            <input type="file" id={`file-${type}`} hidden accept=".csv" onChange={handleFileChange} />
                        </Box>
                    </Box>

                    {uploading && (
                        <Box>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                                <Typography variant="caption" fontWeight="900" color="#1b2559">Verification Progress</Typography>
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
                        {uploading ? "Executing Batch Sync..." : `Finalize ${type} Import`}
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
            Bulk Update Center
          </Typography>
          <Typography variant="body1" color="#a3aed0" fontWeight="700">
             Choose an update model to modify your large-scale inventory for {store.name}.
          </Typography>
        </Box>

        {/* Option Selector Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }} alignItems="stretch">
          {options.map((opt) => (
            <Grid item xs={12} md={4} key={opt.id}>
              <Paper 
                onClick={() => setActiveTab(opt.id)}
                sx={{ 
                    p: 4, 
                    borderRadius: "32px", 
                    cursor: "pointer",
                    height: "100%", // Maintain equal height
                    display: "flex", // Enable flex
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "0.3s all cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "2px solid",
                    borderColor: activeTab === opt.id ? "#E53935" : "transparent",
                    backgroundImage: activeTab === opt.id ? `linear-gradient(135deg, ${alpha("#E53935", 0.05)}, #fff)` : "#fff",
                    boxShadow: activeTab === opt.id ? "0 20px 40px rgba(229, 57, 53, 0.08)" : "0 10px 30px rgba(0,0,0,0.02)",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box sx={{ 
                        p: 2.5, 
                        borderRadius: "20px", 
                        bgcolor: activeTab === opt.id ? "#E53935" : alpha("#a3aed0", 0.1),
                        color: activeTab === opt.id ? "#fff" : "#a3aed0",
                        transition: "0.3s"
                    }}>
                        {opt.icon}
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight="900" color={activeTab === opt.id ? "#E53935" : "#1b2559"}>
                            {opt.title}
                        </Typography>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0">
                            {opt.subtitle}
                        </Typography>
                    </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Active Model Workspace */}
        <Box sx={{ position: "relative" }}>
           <Typography variant="caption" fontWeight="900" color="#E53935" sx={{ mb: 2, display: "block", textTransform: "uppercase", letterSpacing: "2px" }}>
              Active Environment: {activeTab}
           </Typography>
           <WorkspaceSection type={activeTab} key={activeTab} />
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "18px", fontWeight: "900", px: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreBulkUpdate;
