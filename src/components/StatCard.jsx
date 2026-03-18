import React from "react";
import { Box, Typography, Stack, useTheme, alpha } from "@mui/material";
import { motion } from "framer-motion";
import {
  ShoppingCartOutlined,
  TrendingUpOutlined,
  StoreOutlined,
  Inventory2Outlined,
  HourglassEmptyOutlined,
  PeopleOutlined,
  ArrowUpward,
  ArrowDownward,
  AccountBalanceWalletOutlined,
  CancelOutlined
} from "@mui/icons-material";

const StatCard = ({ title, value, change, icon, onClick, comparisonLabel = "last month" }) => {
  const theme = useTheme();
  const isPositive = change?.startsWith("+");
  const isDark = theme.palette.mode === 'dark';

  const getIcon = () => {
    const iconStyle = { fontSize: 26, color: "white" };
    switch (icon) {
      case "orders": return <ShoppingCartOutlined sx={iconStyle} />;
      case "revenue": return <AccountBalanceWalletOutlined sx={iconStyle} />;
      case "vendors": return <StoreOutlined sx={iconStyle} />;
      case "stock": return <Inventory2Outlined sx={iconStyle} />;
      case "pending": return <HourglassEmptyOutlined sx={iconStyle} />;
      case "customers": return <PeopleOutlined sx={iconStyle} />;
      case "cancelled": return <CancelOutlined sx={iconStyle} />;
      default: return <TrendingUpOutlined sx={iconStyle} />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Box
        onClick={onClick}
        sx={{
          p: 3,
          borderRadius: "24px",
          background: isDark 
            ? "rgba(30, 41, 59, 0.7)" 
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.5)"}`,
          boxShadow: isDark 
            ? "0 10px 30px rgba(0,0,0,0.3)" 
            : "0 10px 30px rgba(0,0,0,0.04)",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/* Glow Effect */}
        <Box 
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${theme.palette.primary.light}22 0%, transparent 70%)`,
            zIndex: 0
          }}
        />

        <Stack direction="row" spacing={2} alignItems="center" sx={{ position: "relative", zIndex: 1, mb: 1.5 }}>
          <Box
            sx={{
              height: 48,
              width: 48,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: `0 8px 16px ${theme.palette.primary.main}44`
            }}
          >
            {getIcon()}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mt: 0.5, letterSpacing: -0.5 }}>
              {value}
            </Typography>
          </Box>
        </Stack>

        {change && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ position: "relative", zIndex: 1, mt: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                backgroundColor: isPositive ? alpha("#10b981", 0.1) : alpha(theme.palette.error.main, 0.1),
                color: isPositive ? "#10b981" : theme.palette.error.main
              }}
            >
              {isPositive ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
              <Typography variant="caption" sx={{ ml: 0.3, fontWeight: 700 }}>
                {change}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
              vs {comparisonLabel}
            </Typography>
          </Stack>
        )}
      </Box>
    </motion.div>
  );
};

export default StatCard;