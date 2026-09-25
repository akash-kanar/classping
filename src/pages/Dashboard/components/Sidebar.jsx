import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Dashboard, Settings } from "@mui/icons-material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StorageIcon from "@mui/icons-material/Storage";

import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Import your logo — adjust the path to match your project structure
import logo from "../../../assets/logo.png";

const DRAWER_WIDTH = 280;

const SidebarContent = ({ onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    {
      text: "Upcoming Classes",
      icon: <ScheduleIcon />,
      path: "/dashboard/upcoming-classes",
    },
    {
      text: "AI Assistant",
      path: "/dashboard/ai-assistant",
      icon: <AutoAwesomeRoundedIcon />,
    },
    { text: "Upload", icon: <CloudUploadIcon />, path: "/dashboard/upload" },
    {
      text: "Your Storage ",
      icon: <StorageIcon />,
      path: "/dashboard/storage",
    },
    { text: "Settings", icon: <Settings />, path: "/dashboard/settings" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        borderColor: "divider",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? "rgba(255,255,255,0.95)"
            : "rgba(30,30,30,0.95)",
        backdropFilter: "blur(10px)",
        overflow: isMobile ? "auto" : "hidden",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          alignSelf: "center",
          gap: 1.5,
          minHeight: 50,
        }}
      >
        <Box
          sx={{
            width: { xs: 200, sm: 215 },
            height: 65,
            overflow: "hidden",
            flexShrink: 0,
            borderRadius: 1,
            padding: 0.5,

            // Dark-mode-aware background + border
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.3)"
                : "transparent",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="ClassPing"
            sx={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                cursor: "pointer",
                backgroundColor: isActive ? "primary.main" : "transparent",
                color: isActive ? "white" : "text.primary",
                "&:hover": {
                  backgroundColor: isActive ? "primary.dark" : "action.hover",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "white" : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "0.95rem",
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Logout Button */}
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          logout();
          if (isMobile && onClose) onClose();
        }}
        startIcon={<PowerSettingsNewIcon />}
        sx={{
          mt: "auto",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          py: 1.5,
          borderColor: "error.light",
          "&:hover": {
            backgroundColor: "error.light",
            color: "white",
          },
          transition: "all 0.2s ease",
        }}
      >
        Log out
      </Button>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Mobile: render inside a temporary Drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    );
  }

  // Desktop: permanent sidebar
  return (
    <Box
      component="nav"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        height: "100vh",
        position: "relative",
        top: 0,
      }}
    >
      <SidebarContent />
    </Box>
  );
};

export { Sidebar, DRAWER_WIDTH };
export default Sidebar;
