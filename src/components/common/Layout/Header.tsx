import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Logout } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import { useAppDispatch } from "../../../hooks/useAuth";
import { logout } from "../../../store/authSlice";

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ drawerWidth, onDrawerToggle }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        height: { xs: "56px", sm: "64px" },
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        backgroundColor: "#FFFFFF",
        color: "#111827",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{ minHeight: { xs: "56px", sm: "64px" }, px: { xs: 2, sm: 3 } }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{
            mr: { xs: 1, sm: 2 },
            display: { sm: "none" },
            p: { xs: 1, sm: 1.5 },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
          }}
        >
          Syndicator
        </Typography>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {user?.username}
          </Typography>
          <IconButton
            size={isMobile ? "small" : "medium"}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <Avatar
              sx={{
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              "& .MuiPaper-root": {
                mt: 1,
                minWidth: { xs: "120px", sm: "150px" },
              },
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              <Logout sx={{ mr: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
