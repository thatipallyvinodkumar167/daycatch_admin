import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  alpha,
  CircularProgress,
  Button
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from "@mui/icons-material";
import { useOutletContext, useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreCategoryBanner = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [banners] = useState([
    {
      id: 1,
      title: "First 10 Orders",
      categoryRedirect: "Prawns",
      imageUrl: null
    }
  ]);

  useEffect(() => {
    // Simulating loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredBanners = banners.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.categoryRedirect.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Category Banners
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Manage category-linked promotional banners for {store.name}.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("add")}
            sx={{
              borderRadius: "18px",
              py: 1.5,
              px: 4,
              bgcolor: "#4318ff",
              boxShadow: "0 10px 25px rgba(67,24,255,0.25)",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "15px",
              "&:hover": { bgcolor: "#3310cc" }
            }}
          >
            + Add Banner
          </Button>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Banner List
            </Typography>
            <TextField
              placeholder="Search banners..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "14px",
                  bgcolor: "#f8f9fc",
                  width: { xs: "100%", sm: "300px" },
                  fontWeight: 600,
                  "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "18px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6", width: "80px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6" }}>Category Redirect</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #eef2f6", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8, color: "#a3aed0", fontWeight: 800 }}>No banners found.</TableCell>
                  </TableRow>
                ) : (
                  filteredBanners.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#4318ff", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.title}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#4318ff" }}>{row.categoryRedirect}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            width: 100,
                            height: 50,
                            borderRadius: "10px",
                            bgcolor: "#f6f8fd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e0e5f2",
                            overflow: "hidden"
                          }}
                        >
                          {row.imageUrl ? (
                             <Box component="img" src={row.imageUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                             <ImageIcon sx={{ color: "#a3aed0", fontSize: 20 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" sx={{ color: "#4318ff", bgcolor: alpha("#4318ff", 0.1), borderRadius: "10px" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#f44336", bgcolor: alpha("#f44336", 0.1), borderRadius: "10px" }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>

      </Box>
    </Box>
  );
};

export default StoreCategoryBanner;
