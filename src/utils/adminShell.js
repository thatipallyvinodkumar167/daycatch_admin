import { alpha } from "@mui/material";

export const SHELL_DRAWER_WIDTH = 260;
export const SHELL_TOPBAR_HEIGHT = 70;
export const SHELL_CONTENT_BG = "#f5f5f5";
export const SHELL_SIDEBAR_BG = "#111827";
export const SHELL_BORDER = "rgba(255, 255, 255, 0.05)";

export const getDrawerPaperSx = () => ({
  width: SHELL_DRAWER_WIDTH,
  mt: `${SHELL_TOPBAR_HEIGHT}px`,
  height: `calc(100% - ${SHELL_TOPBAR_HEIGHT}px)`,
  backgroundColor: SHELL_SIDEBAR_BG,
  borderRight: `1px solid ${SHELL_BORDER}`,
  color: "#fff",
  overflowY: "auto",
  boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
  "&::-webkit-scrollbar": { display: "none" },
  scrollbarWidth: "none",
  msOverflowStyle: "none",
});

export const shellSectionLabelSx = {
  fontSize: "11px",
  fontWeight: "700",
  color: "rgba(255,255,255,0.4)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  pl: 1,
};

export const getShellMenuItemSx = (isActive, primaryColor) => ({
  margin: "4px 12px",
  borderRadius: "12px",
  minHeight: "48px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  backgroundColor: isActive ? alpha(primaryColor, 0.1) : "transparent",
  "&:hover": {
    backgroundColor: isActive ? alpha(primaryColor, 0.15) : "rgba(255, 255, 255, 0.05)",
    "& .MuiListItemIcon-root": {
      color: primaryColor,
      transform: "translateX(2px)",
    },
  },
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
    boxShadow: `0 0 10px ${primaryColor}`,
  },
  "& .MuiListItemIcon-root": {
    color: isActive ? primaryColor : "rgba(255, 255, 255, 0.7)",
    minWidth: "40px",
    transition: "all 0.3s ease",
  },
  "& .MuiListItemText-root": {
    "& .MuiTypography-root": {
      color: isActive ? "#fff" : "rgba(255, 255, 255, 0.7)",
      fontWeight: isActive ? 600 : 500,
      fontSize: "0.875rem",
      letterSpacing: "0.01em",
    },
  },
});

export const getShellSubMenuItemSx = (isActive, primaryColor) => ({
  pl: 7,
  py: 1,
  minHeight: "40px",
  margin: "2px 12px",
  borderRadius: "10px",
  transition: "all 0.2s ease",
  backgroundColor: "transparent",
  "& .MuiListItemText-root .MuiTypography-root": {
    fontSize: "0.8125rem",
    color: isActive ? primaryColor : "rgba(255, 255, 255, 0.5)",
    fontWeight: isActive ? 600 : 400,
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    "& .MuiListItemText-root .MuiTypography-root": {
      color: "#fff",
    },
  },
  "&::before": {
    display: "none",
  },
});

export const shellTopbarSx = {
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(20px)",
  color: "#1b2559",
  boxShadow: "none",
  borderBottom: "1px solid",
  borderColor: alpha("#e0e5f2", 0.5),
  zIndex: (theme) => theme.zIndex.drawer + 1,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

export const shellToolbarSx = {
  display: "flex",
  justifyContent: "space-between",
  px: { xs: 2, md: 4 },
  minHeight: `${SHELL_TOPBAR_HEIGHT}px`,
};
