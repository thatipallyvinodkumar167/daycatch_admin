import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const unwrapPayload = (value) => {
  let currentValue = value;
  let depth = 0;

  while (
    currentValue &&
    typeof currentValue === "object" &&
    !Array.isArray(currentValue) &&
    Object.prototype.hasOwnProperty.call(currentValue, "data") &&
    depth < 5
  ) {
    currentValue = currentValue.data;
    depth += 1;
  }

  return currentValue;
};

const getApiErrorMessage = (error, fallbackMessage) => {
  const payload = unwrapPayload(error?.response?.data);

  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (payload && typeof payload === "object") {
    const candidateMessage =
      payload.message || payload.error || payload.details || payload.msg;

    if (typeof candidateMessage === "string" && candidateMessage.trim()) {
      return candidateMessage.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
};

const extractHtmlContent = (response, preferredKeys) => {
  const payload = unwrapPayload(response);

  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return "";
  }

  for (const key of preferredKeys) {
    const value = payload[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  const nestedObject = Object.values(payload).find(
    (entry) => entry && typeof entry === "object" && !Array.isArray(entry)
  );

  if (nestedObject) {
    for (const key of preferredKeys) {
      const value = nestedObject[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  const firstString = Object.values(payload).find(
    (entry) => typeof entry === "string" && entry.trim()
  );

  return typeof firstString === "string" ? firstString.trim() : "";
};

const RichContentPage = ({
  title,
  description,
  fetchContent,
  contentKeys,
  emptyMessage,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchContent();
      const htmlContent = extractHtmlContent(response, contentKeys);
      setContent(htmlContent);
    } catch (requestError) {
      setContent("");
      setError(getApiErrorMessage(requestError, `Unable to load ${title}.`));
    } finally {
      setLoading(false);
    }
  }, [contentKeys, fetchContent, title]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            {title}
          </Typography>
          <Button
            variant="contained"
            onClick={loadContent}
            disabled={loading}
            startIcon={!loading ? <RefreshIcon /> : null}
            sx={{
              backgroundColor: "#2d60ff",
              "&:hover": { backgroundColor: "#2046cc" },
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              fontWeight: "600",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Refresh"}
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {error ? (
            <Alert severity="error" sx={{ borderRadius: "12px" }}>
              {error}
            </Alert>
          ) : loading ? (
            <Box
              sx={{
                minHeight: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : content ? (
            <Box
              sx={{
                color: "#1b2559",
                lineHeight: 1.8,
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  color: "#1b2559",
                  fontWeight: 700,
                  mt: 0,
                  mb: 2,
                },
                "& p": {
                  color: "#475467",
                  mb: 2,
                },
                "& ul, & ol": {
                  color: "#475467",
                  pl: 3,
                  mb: 2,
                },
                "& li": {
                  mb: 1,
                },
                "& a": {
                  color: "#2d60ff",
                },
                "& hr": {
                  border: 0,
                  borderTop: "1px solid #eaecf0",
                  my: 3,
                },
                "& blockquote": {
                  borderLeft: "4px solid #dbe4ff",
                  pl: 2,
                  ml: 0,
                  color: "#344054",
                },
                "& img": {
                  maxWidth: "100%",
                  borderRadius: "12px",
                },
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  mb: 2,
                },
                "& th, & td": {
                  border: "1px solid #eaecf0",
                  p: 1.5,
                },
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <Alert severity="info" sx={{ borderRadius: "12px" }}>
              {emptyMessage}
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RichContentPage;
