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
} from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

function StoreItemSaleReport() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [tableData, setTableData] = useState([]);

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Item Sales Report
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Sales breakdown for {store.name} in the last 30 days
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2" }}>
          
          <Typography variant="h4" fontWeight="800" color="#1b2559" sx={{ mb: 4 }}>
            Item Sales Report (Last 30 Days)
          </Typography>

          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "80px", py: 2 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2, textAlign: "right" }}>Stock</TableCell>
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
                    <TableRow key={index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "0.2s", "&:hover": { bgcolor: alpha("#E53935", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{row.productName}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#E53935", py: 2.5, textAlign: "right" }}>{row.stock}</TableCell>
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
