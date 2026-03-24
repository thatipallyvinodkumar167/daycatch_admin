import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
  Stack,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Default Story if API is empty


const unwrapPayload = (value) => {
  let currentValue = value;
  let depth = 0;
  while (currentValue && typeof currentValue === "object" && !Array.isArray(currentValue) && Object.prototype.hasOwnProperty.call(currentValue, "data") && depth < 5) {
    currentValue = currentValue.data;
    depth += 1;
  }
  return currentValue;
};

const extractHtmlContent = (response, preferredKeys) => {
  const payload = unwrapPayload(response);
  if (typeof payload === "string" && payload.trim()) return payload.trim();
  if (!payload || typeof payload !== "object") return "";
  for (const key of preferredKeys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const RichContentPage = ({
  title,
  description,
  fetchContent,
  updateContent,
  contentKeys,
  emptyMessage,
  fallbackContent,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchContent();
      let htmlContent = extractHtmlContent(response, contentKeys);
      if (!htmlContent || htmlContent === "N/A" || htmlContent.length < 10) {
        htmlContent = fallbackContent || "";
      }
      setContent(htmlContent);
    } catch (requestError) {
      setContent(fallbackContent || "");
    } finally {
      setLoading(false);
    }
  }, [contentKeys, fetchContent, fallbackContent]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSave = async () => {
    if (!updateContent) return;
    setIsSaving(true);
    try {
      await updateContent(content);
      setShowNotification(true);
    } catch (err) {
      console.error("Save error:", err);
      const is404 = err.response?.status === 404;
      alert(is404 ? "Server Update Endpoint Not Found. Please ensure your backend is restarted and running with the new PATCH routes." : "Failed to commit changes to database. Please check server connectivity.");
    } finally {
      setIsSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Platform Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Content Settings
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">
            {description}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh">
                <IconButton onClick={loadContent} sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                    <RefreshIcon sx={{ color: "#4318ff" }} />
                </IconButton>
            </Tooltip>
            <Button
                variant="contained"
                startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                onClick={handleSave}
                disabled={isSaving}
                sx={{
                    backgroundColor: "#4318ff",
                    "&:hover": { backgroundColor: "#3311cc" },
                    borderRadius: "14px",
                    textTransform: "none",
                    px: 4,
                    fontWeight: "800",
                    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
            >
                {isSaving ? "Saving..." : "Save"}
            </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Left: Editor Console */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 0, borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Box sx={{ p: 2.5, bgcolor: "#fafbfc", borderBottom: "1px solid #e0e5f2", display: "flex", alignItems: "center", gap: 1.5 }}>
                <EditIcon sx={{ color: "#4318ff", fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight="800" color="#1b2559">Editor</Typography>
            </Box>
            <Box sx={{ 
                "& .ql-container": { border: "none !important", minHeight: "600px" },
                "& .ql-toolbar": { border: "none !important", borderBottom: "1px solid #e0e5f2 !important", bgcolor: "#fff" },
                "& .ql-editor": { p: 4, fontSize: "16px", color: "#475467" }
            }}>
                <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={quillModules} 
                />
            </Box>
          </Paper>
        </Grid>

        {/* Right: Live Brand Preview */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 0, borderRadius: "24px", height: "100%", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", position: "relative" }}>
            <Box sx={{ p: 2.5, bgcolor: "#4318ff", color: "#fff", display: "flex", alignItems: "center", gap: 1.5 }}>
                <VisibilityIcon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight="800">Preview</Typography>
            </Box>
            
            <Box sx={{ 
                height: "calc(100% - 60px)", 
                overflowY: "auto", 
                p: 4, 
                backgroundColor: "#fff",
                "& h1": { fontSize: "32px", fontWeight: 800, color: "#2b3674", mb: 3, letterSpacing: "-1px" },
                "& h2": { fontSize: "24px", fontWeight: 800, color: "#1b2559", mt: 4, mb: 2 },
                "& p": { lineHeight: 1.8, color: "#475467", mb: 2, fontSize: "15px" },
                "& ul": { pl: 3, mb: 2, "& li": { mb: 1.5, color: "#475467", fontWeight: 500 } },
                "& strong": { color: "#1b2559", fontWeight: 800 }
            }}>
                {/* Simulated Web View Container */}
                <Box sx={{ 
                    p: 4, 
                    borderRadius: "16px", 
                    bgcolor: "#f4f7fe", 
                    border: "1px solid #e0e5f2",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)"
                }}>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={() => setShowNotification(false)}
        message="Content saved successfully."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default RichContentPage;
