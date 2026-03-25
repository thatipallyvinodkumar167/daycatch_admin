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
  Typography,
  useTheme,
  alpha,
  Paper,
  IconButton
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

function StoreItemSaleReport() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [tableData, setTableData] = useState([]);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1px" }}>
              Item Sales Report
            </Typography>
            <Typography variant="body2" fontWeight="700" color="#a3aed0">
              Sales breakdown for {store.name} in the last 30 days
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "28px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2" }}>
          
          <Typography variant="h4" fontWeight="800" color="#1b2559" sx={{ mb: 4 }}>
            Item Sales Report (Last 30 Days)
          </Typography>

          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2", width: "80px", py: 2 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2", py: 2 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2", py: 2, textAlign: "right" }}>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((row, index) => (
                    <TableRow key={index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "0.2s", "&:hover": { bgcolor: alpha("#4318ff", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{row.productName}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#4318ff", py: 2.5, textAlign: "right" }}>{row.stock}</TableCell>
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

export default StoreItemSaleReport;
