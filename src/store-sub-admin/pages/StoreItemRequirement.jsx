import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { formatStoreDate, matchesStoreRecord } from "../utils/storeWorkspace";

const normalizeRequirementRows = (record, index) => {
  const dateValue =
    record?.Date || record?.date || record?.["Created At"] || record?.createdAt || "";

  const nestedItems = record?.Items || record?.items;
  if (Array.isArray(nestedItems)) {
    return nestedItems.map((item, itemIndex) => ({
      id: `${record._id || index}-${item._id || itemIndex}`,
      productName:
        item?.["Product Name"] || item?.productName || item?.name || "Unnamed Product",
      stock: Number(item?.Stock ?? item?.stock ?? item?.qty ?? item?.quantity ?? 0),
      date: dateValue,
    }));
  }

  const productListValue =
    record?.["Item Sale Report"] ||
    record?.itemSaleReport ||
    record?.Products ||
    record?.products ||
    "";

  const productNames = String(productListValue)
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return productNames.map((productName, productIndex) => ({
    id: `${record._id || index}-${productIndex}`,
    productName,
    stock: Number(record?.Stock ?? record?.stock ?? 0),
    date: dateValue,
  }));
};

function StoreItemRequirement() {
  const { store } = useOutletContext();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchRequirementReport = async () => {
      try {
        const response = await genericApi.getAll("item_requirement");
        const rows = response?.data?.results || response?.data?.data || [];
        const scopedRows = rows.filter((row) => matchesStoreRecord(row, store));
        const effectiveRows = scopedRows.length ? scopedRows : rows;

        setTableData(
          effectiveRows.flatMap((row, index) => normalizeRequirementRows(row, index))
        );
      } catch (error) {
        console.error("Unable to load item requirements:", error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirementReport();
  }, [store]);

  const filteredRows = useMemo(
    () =>
      tableData.filter((row) => {
        const matchesSearch = row.productName
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trim());

        if (!selectedDate) {
          return matchesSearch;
        }

        if (!row.date) {
          return matchesSearch;
        }

        const parsedDate = new Date(row.date);
        if (Number.isNaN(parsedDate.getTime())) {
          return matchesSearch;
        }

        return matchesSearch && parsedDate.toISOString().slice(0, 10) === selectedDate;
      }),
    [searchTerm, selectedDate, tableData]
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Item Requirement
            </Typography>
            <Typography variant="body2" fontWeight="700" color="#a3aed0">
              Required Product List for {store.name}
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "28px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Required Product List
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <TextField
                placeholder="Search products..."
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
                    borderRadius: "12px",
                    bgcolor: "#f8f9fc",
                    width: "260px",
                    fontWeight: 700,
                    color: "#1b2559",
                    "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                  },
                }}
              />

              <Box>
                <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ display: "block", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Date (DD-MM-YYYY)
                </Typography>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      bgcolor: "#f8f9fc",
                      fontWeight: 700,
                      color: "#1b2559",
                      "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                      "&:hover fieldset": { borderColor: "#E53935" },
                      "&.Mui-focused fieldset": { borderColor: "#E53935", borderWidth: "2px" },
                    },
                  }}
                />
              </Box>
            </Stack>
          </Stack>

          <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8f9fc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "80px", py: 2 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", py: 2, textAlign: "right" }}>Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <CircularProgress sx={{ color: "#E53935" }} />
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 }, transition: "0.2s", "&:hover": { bgcolor: alpha("#E53935", 0.03) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559", py: 2.5 }}>{row.productName}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0", py: 2.5 }}>{formatStoreDate(row.date)}</TableCell>
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

export default StoreItemRequirement;
