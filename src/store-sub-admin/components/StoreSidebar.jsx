import React, { useState } from "react";
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  STORE_MENU_GROUPS,
  STORE_SETTINGS_ITEMS,
} from "../config/navigation";
import {
  getDrawerPaperSx,
  getShellMenuItemSx,
  getShellSubMenuItemSx,
  shellSectionLabelSx,
} from "../../utils/adminShell";

const buildRoute = (path, store) => {
  if (path === null || path === undefined) return null;
  const resolvedPath = typeof path === "function" ? path(store) : path;
  if (resolvedPath === null || resolvedPath === undefined) return null;
  if (resolvedPath.startsWith("/")) return resolvedPath;
  const baseRoute = `/stores/details/${encodeURIComponent(store?.id || "")}`;
  return resolvedPath ? `${baseRoute}/${resolvedPath}` : baseRoute;
};

function StoreSidebar({ store, open }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const currentPath = location.pathname;
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (key) => {
    setOpenMenu((current) => (current === key ? null : key));
  };

  const isRouteActive = React.useCallback(
    (route) => Boolean(route) && currentPath === route,
    [currentPath]
  );

  React.useEffect(() => {
    const activeGroup = STORE_MENU_GROUPS.find((item) => {
      if (item.type !== "group") return false;
      return item.children.some((child) => {
        const childRoute = buildRoute(child.route, store);
        return isRouteActive(childRoute);
      });
    });

    if (activeGroup?.key) {
      setOpenMenu(activeGroup.key);
    }
  }, [store, isRouteActive]);

  const activeMenuSx = (isActive) => ({
    ...getShellMenuItemSx(isActive, primaryColor),
  });

  const subActiveMenuSx = (isActive) => ({
    ...getShellSubMenuItemSx(isActive, primaryColor),
  });

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          ...getDrawerPaperSx(),
        },
      }}
    >
      <List sx={{ pb: 10 }}>
        <ListItem disablePadding sx={{ mt: 2, px: 2, mb: 1 }}>
          <Typography
            sx={shellSectionLabelSx}
          >
            Navigation
          </Typography>
        </ListItem>

        {STORE_MENU_GROUPS.map((item) => {
          if (item.type === "group") {
            const isOpen = openMenu === item.key;
            const isActive = item.children.some((child) => {
              const childRoute = buildRoute(child.route, store);
              return isRouteActive(childRoute);
            });
            const Icon = item.icon;

            return (
              <React.Fragment key={item.key}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => toggleMenu(item.key)} sx={activeMenuSx(isActive)}>
                    <ListItemIcon><Icon /></ListItemIcon>
                    <ListItemText primary={item.label} />
                    {isOpen ? (
                      <ExpandLessIcon sx={{ color: isActive ? primaryColor : "#fff" }} />
                    ) : (
                      <ExpandMoreIcon sx={{ color: isActive ? primaryColor : "#fff" }} />
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => {
                      const route = buildRoute(child.route, store);
                      const isChildActive = isRouteActive(route);
                      return (
                        <ListItemButton
                          key={child.label}
                          sx={{ ...subActiveMenuSx(isChildActive), ...(!route && { opacity: 0.5 }) }}
                          onClick={() => route && navigate(route)}
                        >
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          const route = buildRoute(item.route, store);
          const Icon = item.icon;
          const isActive = isRouteActive(route);

          return (
            <ListItem disablePadding key={item.label}>
              <ListItemButton
                onClick={() => route && navigate(route)}
                sx={{ ...activeMenuSx(isActive), ...(!route && { opacity: 0.5 }) }}
              >
                <ListItemIcon><Icon /></ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}

        <ListItem disablePadding sx={{ mt: 3, px: 2, mb: 1 }}>
          <Typography
            sx={shellSectionLabelSx}
          >
            Settings
          </Typography>
        </ListItem>

        {STORE_SETTINGS_ITEMS.map((item) => {
          const route = buildRoute(item.route, store);
          const Icon = item.icon;
          const isActive = isRouteActive(route);

          return (
            <ListItem disablePadding key={item.label}>
              <ListItemButton
                onClick={() => route && navigate(route)}
                sx={{ ...activeMenuSx(isActive), ...(!route && { opacity: 0.5 }) }}
              >
                <ListItemIcon><Icon /></ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default StoreSidebar;
