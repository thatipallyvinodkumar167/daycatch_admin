import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  alpha,
  Typography,
} from "@mui/material";
import { genericApi } from "../api/genericApi";

import { useNavigate } from "react-router-dom";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentsIcon from "@mui/icons-material/Payments";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SettingsIcon from "@mui/icons-material/Settings";

import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BadgeIcon from "@mui/icons-material/Badge";
import DescriptionIcon from "@mui/icons-material/Description";
import { useLocation } from "react-router-dom";

const drawerWidth = 260; // Slightly wider for better breathing room

function Sidebar({ open }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const [permissions, setPermissions] = useState(null);

  React.useEffect(() => {
    const fetchPermissions = async () => {
      const userRole = localStorage.getItem("user_role");
      
      // Super Admin or no role set → show everything
      if (!userRole || userRole === "Super Admin") {
        setPermissions("all");
        return;
      }

      // For other roles, try to fetch their permissions
      // On any error, fall back to showing everything
      try {
        const response = await genericApi.getAll("roles");
        const roles = response.data.results || response.data || [];
        const foundRole = roles.find(r => r.name === userRole);
        setPermissions(foundRole?.permissions || "all");
      } catch {
        setPermissions("all");
      }
    };

    fetchPermissions();
  }, []);


  const hasPermission = (section) => {
    if (permissions === "all") return true;
    if (!permissions) return true; // default show all if no permissions set
    return permissions[section] === true;
  };

  const isChildActive = (paths) => paths.some(path => location.pathname === path);

  React.useEffect(() => {
    const path = location.pathname;
    const groups = {
      subAdmin: ["/roles", "/sub-admin"],
      reports: ["/item-requirement", "/sales-report", "/tax-reports", "/reports"],
      users: ["/user-data", "/wallet-history"],
      sendNotifications: ["/push-notification", "/store-notification", "/driver-notification"],
      listNotifications: ["/user-notifications", "/store-notifications", "/driver-notifications"],
      category: ["/categories", "/sub-category"],
      products: ["/products", "/store-products", "/trending-search", "/bulk-upload-products"],
      area: ["/cities", "/areas", "/bulk-upload-areas"],
      stores: ["/stores-list", "/store-earnings", "/store-approval"],
      orders: ["/rejected-by-store", "/all-orders", "/pending-orders", "/cancelled-orders", "/ongoing-orders", "/out-of-delivery-orders", "/payment-failed-orders", "/completed-orders", "/day-wise-orders", "/missed-orders"],
      payout: ["/payout-requests", "/payout-validation"],
      rewards: ["/rewards-list", "/redeem-value"],
      delivery: ["/delivery-boy-list", "/delivery-boy-incentive"],
      pages: ["/about-us", "/terms-conditions"],
      feedback: ["/user-feedback", "/store-feedback", "/delivery-boy-feedback"],
      callback: ["/user-callback-request", "/store-callback-request", "/delivery-boy-callback-request"]
    };

    const foundGroup = Object.keys(groups).find(key => groups[key].includes(path));
    if (foundGroup) {
      setOpenMenu(foundGroup);
    }
  }, [location.pathname]);

  const activeMenu = (pathOrName, childPaths = []) => {

    const isPath = typeof pathOrName === "string" && pathOrName.startsWith("/");
    const currentPath = location.pathname;
    
    let isActive = isPath ? currentPath === pathOrName : isChildActive(childPaths);

    const primaryColor = theme.palette.primary.main;

    return {
      margin: "4px 12px",
      borderRadius: "12px",
      minHeight: "48px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      
      // Background and Hover
      backgroundColor: isActive ? alpha(primaryColor, 0.1) : "transparent",
      "&:hover": {
        backgroundColor: isActive ? alpha(primaryColor, 0.15) : "rgba(255, 255, 255, 0.05)",
        "& .MuiListItemIcon-root": {
          color: primaryColor,
          transform: "translateX(2px)"
        }
      },

      // Accent Bar
      "&::before": {
        content: '""',
        position: "absolute",
        left: "-12px",
        top: "20%",
        bottom: "20%",
        width: "4px",
        borderRadius: "0 4px 4px 0",
        backgroundColor: primaryColor,
        opacity: isActive ? 1 : 0,
        transition: "opacity 0.3s ease",
        boxShadow: `0 0 10px ${primaryColor}`
      },

      // Elements
      "& .MuiListItemIcon-root": {
        color: isActive ? primaryColor : "rgba(255, 255, 255, 0.7)",
        minWidth: "40px",
        transition: "all 0.3s ease"
      },
      "& .MuiListItemText-root": {
        "& .MuiTypography-root": {
          color: isActive ? "#fff" : "rgba(255, 255, 255, 0.7)",
          fontWeight: isActive ? 600 : 500,
          fontSize: "0.875rem",
          letterSpacing: "0.01em"
        }
      }
    };
  };

  const subActiveMenu = (path) => {
    const isActive = location.pathname === path;
    const primaryColor = theme.palette.primary.main;

    return {
      pl: 7,
      py: 1,
      minHeight: "40px",
      margin: "2px 12px",
      borderRadius: "10px",
      transition: "all 0.2s ease",
      backgroundColor: "transparent", // No background for sub-items when active
      "& .MuiListItemText-root .MuiTypography-root": {
        fontSize: "0.8125rem",
        color: isActive ? primaryColor : "rgba(255, 255, 255, 0.5)",
        fontWeight: isActive ? 600 : 400
      },
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        "& .MuiListItemText-root .MuiTypography-root": {
          color: "#fff"
        }
      },
      // Ensure no accent bar for sub-items
      "&::before": {
        display: "none"
      }
    };
  };


  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          mt: "64px",
          backgroundColor: "#111827", 
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
          color: "#fff",
          overflowY: "auto",
          boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }
      }}
    >      <List sx={{ pb: 10 }}>

        {/* NAVIGATION HEADER */}
        <ListItem disablePadding sx={{ mt: 2, px: 2, mb: 1 }}>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: "700",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              pl: 1
            }}
          >
            Navigation
          </Typography>
        </ListItem>

        {/* Dashboard */}
        {hasPermission("Dashboard") && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/") }  sx={activeMenu("/")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}

        {/* Sub Admin Management */}
        {(permissions === "all") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("subAdmin")} sx={activeMenu("subAdmin", ["/roles", "/sub-admin"])}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Sub-Admin Management" />
                {openMenu === "subAdmin" ? <ExpandLess sx={{ color: openMenu === "subAdmin" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "subAdmin"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={subActiveMenu("/roles")}
                  onClick={() => navigate("/roles")}
                >
                  <ListItemText primary="Roles" />
                </ListItemButton>
                <ListItemButton
                  sx={subActiveMenu("/sub-admin")}
                  onClick={() => navigate("/sub-admin")}
                >
                  <ListItemText primary="Sub Admin" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Taxes */}
        {hasPermission("Tax") && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/taxes")} sx={activeMenu("/taxes")}>
              <ListItemIcon>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Taxes" />
            </ListItemButton>
          </ListItem>
        )}

        {/* Identification */}
        {hasPermission("Id") && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/id")} sx={activeMenu("/id")}>
              <ListItemIcon>
                <BadgeIcon  />
              </ListItemIcon>
              <ListItemText primary="Identification" />
            </ListItemButton>
          </ListItem>
        )}

        {/* Membership Plans */}
        {hasPermission("Membership") && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/membership-plain")} sx={activeMenu("/membership-plain")}>
              <ListItemIcon>
                <CardMembershipIcon  />
              </ListItemIcon>
              <ListItemText primary="Membership Plans" />
            </ListItemButton>
          </ListItem>
        )}

        {/* Reports */}
        {hasPermission("Reports") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("reports")} sx={activeMenu("reports", ["/item-requirement", "/sales-report", "/tax-reports", "/reports"])}>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
                {openMenu === "reports" ? <ExpandLess sx={{ color: openMenu === "reports" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "reports"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/item-requirement")} onClick={() => navigate("/item-requirement")}>
                  <ListItemText primary="Item Requirement (Day-Wise)" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/sales-report")} onClick={() => navigate("/sales-report")}>
                  <ListItemText primary="Item Sales Report (Last 30 Days)" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/tax-reports")} onClick={() => navigate("/tax-reports")}>
                  <ListItemText primary="Tax Reports" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/reports")} onClick={() => navigate("/reports")}>
                  <ListItemText primary="Reports" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Send Notifications */}
        {hasPermission("Notification") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("sendNotifications")} sx={activeMenu("sendNotifications", ["/push-notification", "/store-notification", "/driver-notification"])}>
                <ListItemIcon>
                  <NotificationsIcon  />
                </ListItemIcon>
                <ListItemText primary="Send Notifications" />
                {openMenu === "sendNotifications" ? <ExpandLess sx={{ color: openMenu === "sendNotifications" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "sendNotifications"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/users-notification")} onClick={() => navigate("/users-notification")}>
                  <ListItemText primary="Send Notification to User" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/store-notification")} onClick={() => navigate("/store-notification")}>
                  <ListItemText primary="Send Notification to Store" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/driver-notification")} onClick={() => navigate("/driver-notification")}>
                  <ListItemText primary="Send Notification to Driver" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* List Notifications */}
        {hasPermission("Notification") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("listNotifications")} sx={activeMenu("listNotifications", ["/user-notifications", "/store-notifications", "/driver-notifications"])}>
                <ListItemIcon>
                  <FormatListBulletedIcon  />
                </ListItemIcon>
                <ListItemText primary="List Notifications" />
                {openMenu === "listNotifications" ? <ExpandLess sx={{ color: openMenu === "listNotifications" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "listNotifications"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/user-notifications")} onClick={() => navigate("/user-notifications")}>
                  <ListItemText primary="User Notification" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/store-notifications")} onClick={() => navigate("/store-notifications")}>
                  <ListItemText primary="Store Notification" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/driver-notifications")} onClick={() => navigate("/driver-notifications")}>
                  <ListItemText primary="Driver Notification" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Users Management */}
        {hasPermission("Users") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("users")} sx={activeMenu("users", ["/user-data", "/wallet-history"])}>
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="Users Management" />
                {openMenu === "users" ? <ExpandLess sx={{ color: openMenu === "users" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "users"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/user-data")} onClick={() => navigate("/user-data")}>
                  <ListItemText primary="User Data" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/wallet-history")} onClick={() => navigate("/wallet-history")}>
                  <ListItemText primary="Wallet Recharge History" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Category Management */}
        {hasPermission("Category") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("category")} sx={activeMenu("category", ["/categories", "/sub-category"])}>
                <ListItemIcon>
                  <CategoryIcon  />
                </ListItemIcon>
                <ListItemText primary="Category Management" />
                { openMenu === "category" ? <ExpandLess sx={{ color: openMenu === "category" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "category"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/categories")} onClick={() => navigate("/categories")}>
                  <ListItemText primary="Parent Category" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/sub-category")} onClick={() => navigate("/sub-category")}>
                  <ListItemText primary="Sub Category" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Product Catalog */}
        {hasPermission("Product") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("products")} sx={activeMenu("products", ["/products", "/store-products", "/trending-search", "/bulk-upload-products"])}>
                <ListItemIcon>
                  <InventoryIcon  />
                </ListItemIcon>
                <ListItemText primary="Product Catalog" />
                { openMenu === "products" ? <ExpandLess sx={{ color: openMenu === "products" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "products"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/products")} onClick={() => navigate("/products")}>
                  <ListItemText primary="Admin Products" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/store-products")} onClick={() => navigate("/store-products")}>
                  <ListItemText primary="Store Products" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/trending-search")} onClick={() => navigate("/trending-search")}>
                  <ListItemText primary="Trending Search" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/bulk-upload-products")} onClick={() => navigate("/bulk-upload-products")}>
                  <ListItemText primary="Bulk Upload" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Area Management */}
        {hasPermission("Area") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("area")} sx={activeMenu("area", ["/cities", "/areas", "/bulk-upload-areas"])}>
                <ListItemIcon>
                  <LocationOnIcon  />
                </ListItemIcon>
                <ListItemText primary="Area Management" />
                { openMenu === "area" ? <ExpandLess sx={{ color: openMenu === "area" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "area"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/cities")} onClick={() => navigate("/cities")}>
                  <ListItemText primary="Cities" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/areas")} onClick={() => navigate("/areas")}>
                  <ListItemText primary="Society / Areas" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/bulk-upload-areas")} onClick={() => navigate("/bulk-upload-areas")}>
                  <ListItemText primary="Bulk Map Upload" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Store Management */}
        {hasPermission("Store") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("stores")} sx={activeMenu("stores", ["/stores-list", "/store-earnings", "/store-approval"])}>
                <ListItemIcon>
                  <StoreIcon  />
                </ListItemIcon>
                <ListItemText primary="Store Management" />
                { openMenu === "stores" ? <ExpandLess sx={{ color: openMenu === "stores" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "stores"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/stores-list")} onClick={() => navigate("/stores-list")}>
                  <ListItemText primary="Store List" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/store-earnings")} onClick={() => navigate("/store-earnings")}>
                  <ListItemText primary="Store Earning/Payments" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/store-approval")} onClick={() => navigate("/store-approval")}>
                  <ListItemText primary="Store Approval" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Orders Management */}
        {hasPermission("Orders") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("orders")} sx={activeMenu("orders", ["/rejected-by-store", "/all-orders", "/pending-orders", "/cancelled-orders", "/ongoing-orders", "/out-of-delivery-orders", "/payment-failed-orders", "/completed-orders", "/day-wise-orders", "/missed-orders"])}>
                <ListItemIcon>
                  <ShoppingCartIcon  />
                </ListItemIcon>
                <ListItemText primary="Orders Management" />
                { openMenu === "orders" ? <ExpandLess sx={{ color: openMenu === "orders" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "orders"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/rejected-by-store")} onClick={() => navigate("/rejected-by-store")}>
                  <ListItemText primary="Rejected Orders" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/all-orders")} onClick={() => navigate("/all-orders")}>
                  <ListItemText primary="Order History" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/pending-orders")} onClick={() => navigate("/pending-orders")}>
                  <ListItemText primary="Pending Orders" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/cancelled-orders")} onClick={() => navigate("/cancelled-orders")}>
                  <ListItemText primary="Cancelled Orders" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/ongoing-orders")} onClick={() => navigate("/ongoing-orders")}>
                  <ListItemText primary="Ongoing Orders" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/out-of-delivery-orders")} onClick={() => navigate("/out-of-delivery-orders")}>
                  <ListItemText primary="Out for Delivery" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/payment-failed-orders")} onClick={() => navigate("/payment-failed-orders")}>
                  <ListItemText primary="Payment Failed Orders" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/completed-orders")} onClick={() => navigate("/completed-orders")}>
                  <ListItemText primary="Completed Orders" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/day-wise-orders")} onClick={() => navigate("/day-wise-orders")}>
                  <ListItemText primary="Daily Orders" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/missed-orders")} onClick={() => navigate("/missed-orders")}>
                  <ListItemText primary="Missed Orders" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Payout */}
        {hasPermission("Payout") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("payout")} sx={activeMenu("payout", ["/payout-requests", "/payout-validation"])}>
                <ListItemIcon>
                  <PaymentsIcon  />
                </ListItemIcon>
                <ListItemText primary="Payout" />
                { openMenu === "payout" ? <ExpandLess sx={{ color: openMenu === "payout" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "payout"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/payout-requests")} onClick={() => navigate("/payout-requests")}>
                  <ListItemText primary="Payout Requests" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/payout-validation")} onClick={() => navigate("/payout-validation")}>
                  <ListItemText primary="Payout Audit" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Rewards */}
        {hasPermission("Rewards") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("rewards")} sx={activeMenu("rewards", ["/rewards-list", "/redeem-value"])}>
                <ListItemIcon>
                  <EmojiEventsIcon  />
                </ListItemIcon>
                <ListItemText primary="Rewards" />
                { openMenu === "rewards" ? <ExpandLess sx={{ color: openMenu === "rewards" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "rewards"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/rewards-list")} onClick={() => navigate("/rewards-list")}>
                  <ListItemText primary="Reward Rules" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/redeem-value")} onClick={() => navigate("/redeem-value")}>
                  <ListItemText primary="Redemption Rules" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Delivery Boy */}
        {hasPermission("Delivery Boy") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("delivery")} sx={activeMenu("delivery", ["/delivery-boy-list", "/delivery-boy-incentive"])}>
                <ListItemIcon>
                  <DeliveryDiningIcon  />
                </ListItemIcon>
                <ListItemText primary="Drivers" />
                { openMenu === "delivery" ? <ExpandLess sx={{ color: openMenu === "delivery" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "delivery"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/delivery-boy-list")} onClick={() => navigate("/delivery-boy-list")}>
                  <ListItemText primary="Driver List" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/delivery-boy-incentive")} onClick={() => navigate("/delivery-boy-incentive")}>
                  <ListItemText primary="Incentives" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Pages */}
        {hasPermission("Pages") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("pages")} sx={activeMenu("pages", ["/about-us", "/terms-conditions"])}>
                <ListItemIcon>
                  <DescriptionIcon  />
                </ListItemIcon>
                <ListItemText primary="Pages" />
                { openMenu === "pages" ? <ExpandLess sx={{ color: openMenu === "pages" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "pages"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/about-us")} onClick={() => navigate("/about-us")}>
                  <ListItemText primary="About Us" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/terms-conditions")} onClick={() => navigate("/terms-conditions")}>
                  <ListItemText primary="Terms & Conditions" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Feedback  */}
        {hasPermission("Feedback") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("feedback")} sx={activeMenu("feedback", ["/user-feedback", "/store-feedback", "/delivery-boy-feedback"])}>
                <ListItemIcon>
                  <FeedbackIcon  />
                </ListItemIcon>
                <ListItemText primary="Feedback" />
                { openMenu === "feedback" ? <ExpandLess sx={{ color: openMenu === "feedback" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "feedback"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/user-feedback")} onClick={() => navigate("/user-feedback")}>
                  <ListItemText primary="User Feedback" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/store-feedback")} onClick={() => navigate("/store-feedback")}>
                  <ListItemText primary="Store Feedback" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/delivery-boy-feedback")} onClick={() => navigate("/delivery-boy-feedback")}>
                  <ListItemText primary="Driver Feedback" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* Callback Requests */}
        {hasPermission("Callback") && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleToggle("callback")} sx={activeMenu("callback", ["/user-callback-request", "/store-callback-request", "/delivery-boy-callback-request"])}>
                <ListItemIcon>
                  <PhoneCallbackIcon  />
                </ListItemIcon>
                <ListItemText primary="Callback Requests" />
                { openMenu === "callback" ? <ExpandLess sx={{ color: openMenu === "callback" ? theme.palette.primary.main : "#fff" }} /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openMenu === "callback"} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={subActiveMenu("/user-callback-request")} onClick={() => navigate("/user-callback-request")}>
                  <ListItemText primary="User Callback Request" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/store-callback-request")} onClick={() => navigate("/store-callback-request")}>
                  <ListItemText primary="Store Callback Request" />
                </ListItemButton>
                <ListItemButton sx={subActiveMenu("/delivery-boy-callback-request")} onClick={() => navigate("/delivery-boy-callback-request")}>
                  <ListItemText primary="Driver Callback Request" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        )}

        {/* SYSTEM SETTINGS */}
        {(hasPermission("Settings") || hasPermission("Cancelling Reasons")) && (
          <>
            <ListItem disablePadding sx={{ mt: 3, px: 2, mb: 1 }}>
              <Typography 
                sx={{ 
                  fontSize: "11px", 
                  fontWeight: "700", 
                  color: "rgba(255,255,255,0.4)", 
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  pl: 1
                }} 
              >
                Settings
              </Typography>
            </ListItem>

            {/* Settings */}
            {hasPermission("Settings") && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/settings")} sx={activeMenu("/settings")}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </ListItem>
            )}

            {/* Cancelling Reasons */}
            {hasPermission("Cancelling Reasons") && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/cancelling-reasons")} sx={activeMenu("/cancelling-reasons")}>
                  <ListItemIcon>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cancelling Reasons" />
                </ListItemButton>
              </ListItem>
            )}
          </>
        )}
      </List>
    </Drawer>
  );
}

export default Sidebar;