import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

import {
  ShoppingCart,
  TrendingUp,
  Store,
  Inventory,
  HourglassEmpty,
  People,
  ArrowUpward,
  ArrowDownward
} from "@mui/icons-material";

const StatCard = ({ title, value, change, icon, onClick, comparisonLabel = "last month" }) => {

  const theme = useTheme();
  const isPositive = change?.startsWith("+");

  const getIcon = () => {

    const iconStyle = {
      fontSize: 32,
      color: "white"
    };

    switch (icon) {

      case "orders":
        return <ShoppingCart sx={iconStyle} />;

      case "revenue":
        return <TrendingUp sx={iconStyle} />;

      case "vendors":
        return <Store sx={iconStyle} />;

      case "stock":
        return <Inventory sx={iconStyle} />;

      case "pending":
        return <HourglassEmpty sx={iconStyle} />;

      case "customers":
        return <People sx={iconStyle} />;

      default:
        return <ShoppingCart sx={iconStyle} />;

    }

  };

  return (

    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
    >

      <Box
        onClick={onClick}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
          }
        }}
      >

        {/* Top Section */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2
          }}
        >

          <Box>

            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              {value}
            </Typography>

          </Box>

          {/* Icon */}

          <Box
            sx={{
              height: 56,
              width: 56,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg,
                ${theme.palette.primary.main},
                ${theme.palette.primary.dark}
              )`
            }}
          >
            {getIcon()}
          </Box>

        </Box>

        {/* Change Indicator */}

        {change && (

          <Box
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >

            {isPositive ? (
              <ArrowUpward
                sx={{
                  fontSize: 16,
                  color: theme.palette.primary.main
                }}
              />
            ) : (
              <ArrowDownward
                sx={{
                  fontSize: 16,
                  color: theme.palette.error.main
                }}
              />
            )}

            <Typography
              variant="caption"
              sx={{
                ml: 0.5,
                fontWeight: 600,
                color: isPositive
                  ? theme.palette.primary.main
                  : theme.palette.error.main
              }}
            >
              {change} vs {comparisonLabel}
            </Typography>

          </Box>

        )}

      </Box>

    </motion.div>

  );
};

export default StatCard;