import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Chip,
  Button
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

function StoreCoupons() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data matching the requested fields
  const [coupons] = useState([
    {
      id: 1,
      name: "Promotion Coupon",
      discount: "0",
      amountType: "regular",
      fromDate: "2026-02-26 23:37:00",
      toDate: "2026-03-27 23:36:00",
      useLimit: 10,
      cartValue: 0
    }
  ]);

  const filteredCoupons = coupons.filter(coupon => 
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1px" }}>
              Store Coupons
            </Typography>
            <Typography variant="body2" fontWeight="700" color="#a3aed0">
              Manage promotion vouchers for {store.name}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("../add-coupon")}
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
            + Add Coupon
          </Button>
        </Stack>

        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: "28px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2" }}>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Coupon List
            </Typography>
            <TextField
              placeholder="Search coupons..."
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
                  width: { xs: "100%", sm: "280px" },
                  fontWeight: 600,
                  "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                }
              }}
            />
          </Stack>

          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>Coupon Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>Discount</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>From Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>To Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>Uses Limit</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>Cart Value</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCoupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="#a3aed0" fontWeight="800">No coupons found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCoupons.map((row) => (
                    <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#4318ff", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="800" color="#1b2559">{row.name}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#05cd99" }}>{row.discount}%</TableCell>
                      <TableCell>
                        <Chip label={row.amountType} size="small" sx={{ fontWeight: 900, textTransform: "uppercase", fontSize: "10px", bgcolor: "#eef4ff", color: "#4318ff" }} />
                      </TableCell>
                      <TableCell sx={{ color: "#707eae", fontSize: "0.8rem", fontWeight: 700 }}>{row.fromDate}</TableCell>
                      <TableCell sx={{ color: "#707eae", fontSize: "0.8rem", fontWeight: 700 }}>{row.toDate}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.useLimit}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>₹{row.cartValue}</TableCell>
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
}

export default StoreCoupons;
