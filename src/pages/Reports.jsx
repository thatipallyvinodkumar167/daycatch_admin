import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Stack,
  IconButton,
  Grid,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [search, setSearch] = useState("");

  const mainCategories = [
    { 
        id: "delivery", 
        title: "Delivery Boy Reports", 
        icon: <DeliveryDiningIcon sx={{ fontSize: 32, color: "#2d60ff" }} />,
        reports: [
            { id: "delivery_top", name: "Top Delivery Boys" },
            { id: "delivery_orders", name: "Delivery Boy Orders Reports" }
        ]
    },
    { 
        id: "users", 
        title: "Users Reports", 
        icon: <PeopleIcon sx={{ fontSize: 32, color: "#2d60ff" }} />,
        reports: [
            { id: "users_top", name: "Top 10 Users Reports" },
            { id: "users_worst", name: "Worst 10 Users Reports" }
        ]
    },
    { 
        id: "stores", 
        title: "Store Reports", 
        icon: <StorefrontIcon sx={{ fontSize: 32, color: "#2d60ff" }} />,
        reports: [
            { id: "store_top", name: "Top Stores" },
            { id: "store_orders", name: "Store Orders Reports" }
        ]
    }
  ];

  const StatsCard = ({ title, value, icon }) => (
    <Paper sx={{ 
        p: 3, 
        borderRadius: "20px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)", 
        borderLeft: "6px solid #2d60ff",
        display: "flex",
        alignItems: "center",
        gap: 3,
        width: "fit-content",
        minWidth: "260px",
        backgroundColor: "white"
    }}>
        <Box sx={{ 
            p: 2, 
            borderRadius: "14px", 
            bgcolor: "#e9edf7", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center" 
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="body2" fontWeight="700" color="#a3aed0" sx={{ mb: 0.5, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px" }}>{title}</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">{value}</Typography>
        </Box>
    </Paper>
  );

  const renderTable = (headers, data, title, isTopDelivery = false, isTopStore = false, isTopUser = false) => (
    <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <IconButton 
                onClick={() => setActiveTab("main")} 
                sx={{ 
                    bgcolor: "#fff", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    "&:hover": { bgcolor: "#f1f1f1" }
                }}
            >
                <ArrowBackIcon sx={{ color: "#2d60ff" }} />
            </IconButton>
            <Typography variant="h3" fontWeight="700" color="#1b2559" sx={{ fontSize: "2rem" }}>
                {title}
            </Typography>
        </Stack>

        <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "none" }}>
            <Box sx={{ p: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" fontWeight="700" color="#1b2559">{title} Overview</Typography>
                <TextField
                    size="small"
                    placeholder="Search records..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#a3aed0" }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ 
                        width: "350px",
                        "& .MuiOutlinedInput-root": { 
                            borderRadius: "15px", 
                            backgroundColor: "#f4f7fe",
                            "& fieldset": { border: "none" }
                        }
                    }}
                />
            </Box>

            <TableContainer>
                <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            {headers.map((h, i) => (
                                <TableCell key={i} sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "0.85rem", borderBottom: "1px solid #f1f1f1", py: 3 }}>
                                    {h.toUpperCase()}
                                </TableCell>
                            ))}
                            <TableCell sx={{ borderBottom: "1px solid #f1f1f1" }} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow><TableCell colSpan={headers.length + 1} align="center" sx={{ py: 6 }}>No records found</TableCell></TableRow>
                        ) : (
                            data.map((row, i) => (
                                <TableRow key={i} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                                    {Object.entries(row).map(([key, val], j) => {
                                        if (isTopDelivery && key === "mobile") return null;
                                        if (isTopStore && key === "storeId") return null;
                                        if (isTopUser && key === "userMobile") return null;

                                        return (
                                            <TableCell key={j} sx={{ py: 3, borderBottom: "1px solid #f1f1f1" }}>
                                                {isTopDelivery && key === "name" ? (
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="700" color="#1b2559">{val}</Typography>
                                                        <Typography variant="body2" color="#a3aed0">({row.mobile})</Typography>
                                                    </Box>
                                                ) : isTopStore && key === "name" ? (
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="700" color="#1b2559">{val}</Typography>
                                                        <Typography variant="body2" color="#a3aed0">({row.storeId})</Typography>
                                                    </Box>
                                                ) : isTopUser && key === "name" ? (
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="700" color="#1b2559">{val}</Typography>
                                                        <Typography variant="body2" color="#a3aed0">({row.userMobile})</Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body1" fontWeight={j === 1 || j === 0 ? "700" : "500"} color="#1b2559">
                                                        {val}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell sx={{ borderBottom: "1px solid #f1f1f1", textAlign: "right", pr: 4 }}>
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            sx={{ 
                                                borderRadius: "12px", 
                                                bgcolor: "#2d60ff", 
                                                textTransform: "none", 
                                                fontWeight: "600",
                                                px: 3,
                                                py: 1,
                                                boxShadow: "0 4px 12px rgba(45,96,255,0.2)",
                                                "&:hover": { bgcolor: "#2046cc", boxShadow: "0 6px 16px rgba(45,96,255,0.3)" }
                                            }}
                                        >
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    </Box>
  );

  const renderActiveReport = () => {
    switch (activeTab) {
        case "delivery_top":
            return renderTable(
                ["#", "DELIVERY BOY", "LAST 30 DAYS ORDERS"],
                [{ id: 1, name: "Bharath", mobile: "9441457677", orders: 1 }],
                "Top Delivery Boys",
                true
            );
        case "delivery_orders":
            return renderTable(
                ["#", "DELIVERY BOY", "LAST 30 DAYS ORDERS"],
                [{ id: 1, name: "Bharath", mobile: "9441457677", orders: 1 }],
                "Delivery Boy Orders Reports",
                true
            );
        case "users_top":
            return renderTable(
                ["#", "USER", "CURRENT MONTH", "PREVIOUS MONTH", "DIFFERENCE"],
                [{ id: 1, name: "Srinivasan", userMobile: "9876543210", currentMonth: 45, previousMonth: 32, difference: "+13" }],
                "Top 10 Users Reports",
                false,
                false,
                true
            );
        case "users_worst":
            return renderTable(
                ["#", "USER", "CURRENT MONTH", "PREVIOUS MONTH", "DIFFERENCE"],
                [{ id: 1, name: "Varun", userMobile: "9440123456", currentMonth: 2, previousMonth: 15, difference: "-13" }],
                "Worst 10 Users Reports",
                false,
                false,
                true
            );
        case "store_top":
            return renderTable(
                ["#", "STORE", "LAST 30 DAYS ORDERS"],
                [{ id: 1, name: "Vijayawada Store", storeId: "2", orders: 1 }],
                "Top Stores",
                false,
                true
            );
        case "store_orders":
            return renderTable(
                ["#", "STORE", "LAST 30 DAYS ORDERS", "PREVIOUS MONTH ORDERS", "LAST 3 MONTHS ORDERS"],
                [{ id: 1, name: "Hyderabad Store", storeId: "1", orders: 0, prevMonthOrders: 0, last3MonthsOrders: 0 }],
                "Store Orders Reports",
                false,
                true
            );
        default:
            return (
                <Box>
                    <Grid container spacing={4}>
                        {mainCategories.map((cat) => (
                            <Grid item xs={12} md={4} key={cat.id}>
                                <Card sx={{ borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "none", height: "100%" }}>
                                    <Box sx={{ p: 4, textAlign: "center", borderBottom: "1px solid #f1f1f1" }}>
                                        <Box sx={{ p: 2, borderRadius: "20px", bgcolor: "#f4f7fe", display: "inline-flex", mb: 2 }}>{cat.icon}</Box>
                                        <Typography variant="h5" fontWeight="700" color="#1b2559">{cat.title}</Typography>
                                    </Box>
                                    <CardContent sx={{ p: 3 }}>
                                        <Stack spacing={2}>
                                            {cat.reports.map((report) => (
                                                <Button 
                                                    key={report.id}
                                                    fullWidth 
                                                    variant="contained"
                                                    onClick={() => setActiveTab(report.id)}
                                                    startIcon={<TrendingUpIcon />}
                                                    sx={{ 
                                                        bgcolor: "#2d60ff", 
                                                        borderRadius: "15px", 
                                                        py: 2, 
                                                        textTransform: "none", 
                                                        fontWeight: "600",
                                                        boxShadow: "none",
                                                        "&:hover": { bgcolor: "#2046cc", boxShadow: "0 6px 16px rgba(45,96,255,0.2)" }
                                                    }}
                                                >
                                                    {report.name}
                                                </Button>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            );
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="800" color="#2b3674">Analytics & Reports</Typography>
        <Typography variant="h6" color="#707eae" fontWeight="500">Day Catch Intelligent Insights System</Typography>
      </Box>

      {renderActiveReport()}
    </Box>
  );
};

export default Reports;