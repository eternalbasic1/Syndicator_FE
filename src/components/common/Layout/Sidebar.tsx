// src/components/common/Layout/Sidebar.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  AccountBalance,
  People,
  Work,
  Menu,
} from "@mui/icons-material";

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  isMobile: boolean;
}

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Transactions", icon: <AccountBalance />, path: "/transactions" },
  { text: "Friends", icon: <People />, path: "/friends" },
  { text: "Portfolio", icon: <Work />, path: "/portfolio" },
  // { text: "Syndicate", icon: <TrendingUp />, path: "/syndicate" },
];

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  isMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const drawer = (
    <div>
      <Toolbar
        sx={{
          minHeight: { xs: "56px", sm: "64px" },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Menu sx={{ fontSize: isSmallScreen ? "0rem" : "1.7rem" }} />
      </Toolbar>
      <Divider />
      <List sx={{ px: { xs: 1, sm: 2 } }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  onDrawerToggle();
                }
              }}
              sx={{
                borderRadius: 2,
                mx: { xs: 0.5, sm: 1 },
                py: { xs: 1, sm: 1.5 },
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: { xs: 36, sm: 40 },
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 500,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #E5E7EB",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #E5E7EB",
            boxShadow: "none",
            backgroundColor: "#FFFFFF",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
