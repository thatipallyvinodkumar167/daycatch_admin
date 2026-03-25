import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Grid,
  IconButton,
  alpha,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Description as FileIcon
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";

const StoreBulkUpdate = () => {
  const { store } = useOutletContext();
  
  const BulkSection = ({ title, type }) => (
    <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", height: "100%" }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: alpha("#4318ff", 0.05) }}>
             <FileIcon sx={{ color: "#4318ff" }} />
          </Box>
          <Typography variant="h5" fontWeight="900" color="#1b2559">{title}</Typography>
        </Stack>

        <Box sx={{ bgcolor: "#fafbfc", p: 3, borderRadius: "20px", border: "1px solid #f0f4f8" }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <InfoIcon sx={{ color: "#4318ff", fontSize: 20 }} />
            <Typography variant="subtitle2" fontWeight="800" color="#1b2559">Instructions</Typography>
          </Stack>
          <List dense sx={{ py: 0 }}>
            {[
              "Only CSV file are allowed.",
              "First row need to keep blank or use for column name only.",
              "All fields are must needed in csv file.",
              `fill the id(Which is available in Update ${type} section) in product_id column of csv file.`
            ].map((text, i) => (
              <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                   <CheckCircleIcon sx={{ color: "#05cd99", fontSize: 16 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography variant="caption" fontWeight="600" color="#707eae">{text}</Typography>} 
                />
              </ListItem>
            ))}
          </List>
          
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            sx={{ mt: 2, color: "#4318ff", fontWeight: 800, textTransform: "none", py: 0 }}
          >
            Download Sample File
          </Button>
        </Box>

        <Box>
           <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>SELECT CSV FILE</Typography>
           <Box 
             sx={{ 
               border: "2px dashed #e0e5f2", 
               borderRadius: "16px", 
               p: 4, 
               textAlign: "center",
               cursor: "pointer",
               "&:hover": { borderColor: "#4318ff", bgcolor: alpha("#4318ff", 0.02) }
             }}
           >
              <UploadIcon sx={{ color: "#d1d9e2", fontSize: 32, mb: 1 }} />
              <Typography variant="body2" fontWeight="700" color="#707eae">No file chosen</Typography>
              <Button size="small" sx={{ mt: 1, fontWeight: 800, textTransform: "none" }}>Choose file</Button>
           </Box>
        </Box>
        
        <Button 
          fullWidth 
          variant="contained" 
          sx={{ py: 1.8, borderRadius: "16px", bgcolor: "#4318ff", fontWeight: 900, fontSize: "15px", boxShadow: "0 10px 25px rgba(67,24,255,0.15)" }}
        >
          Proceed Bulk Update
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack spacing={1} sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
            Bulk Update Center
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">
             Efficiently synchronize your large-scale inventory for {store.name}.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={4}>
            <BulkSection title="Bulk Price Update" type="Price/Mrp" />
          </Grid>
          <Grid item xs={12} lg={4}>
            <BulkSection title="Bulk Stock Update" type="Stock" />
          </Grid>
          <Grid item xs={12} lg={4}>
            <BulkSection title="Bulk Order Quantity Update" type="order Quantity" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StoreBulkUpdate;
