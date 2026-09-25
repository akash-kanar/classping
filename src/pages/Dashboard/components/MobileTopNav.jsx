import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SecurityIcon from "@mui/icons-material/Security";

import { useLocation, useNavigate } from "react-router-dom";

const MobileTopNav = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const location = useLocation();
  const navigate = useNavigate();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const menuOpen = Boolean(menuAnchor);

  const pageConfig = useMemo(() => {
    const pathname = location.pathname;

    /* Home — no top nav */
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      return null;
    }

    if (pathname.startsWith("/dashboard/upcoming-classes")) {
      return { title: "Upcoming Classes", back: "/dashboard", menu: false };
    }

    if (pathname === "/dashboard/upload") {
      return { title: "Upload", back: "/dashboard", menu: false };
    }

    if (pathname === "/dashboard/timetable/upload") {
      return {
        title: "Upload Timetable",
        back: "/dashboard/upload",
        menu: false,
      };
    }

    if (pathname === "/dashboard/holiday/upload") {
      return {
        title: "Upload Holiday",
        back: "/dashboard/upload",
        menu: false,
      };
    }

    if (pathname === "/dashboard/storage") {
      return { title: "Storage", back: "/dashboard", menu: false };
    }

    if (pathname.startsWith("/dashboard/storage/timetable")) {
      return { title: "Your Saved Timetables", back: "/dashboard/storage", menu: false };
    }

    if (pathname.startsWith("/dashboard/storage/holiday")) {
      return { title: "Your Saved Holidays", back: "/dashboard/storage", menu: false };
    }

    /* Profile root */
    if (pathname === "/dashboard/profile") {
      return { title: "My Profile", back: "/dashboard", menu: true };
    }

    /* Profile sub-pages */
    if (pathname === "/dashboard/profile/personal-information") {
      return {
        title: "Personal Information",
        back: "/dashboard/profile",
        menu: true,
      };
    }

    if (pathname === "/dashboard/settings") {
      return { title: "App Settings", back: "/dashboard/profile", menu: false };
    }

    if (pathname === "/dashboard/help") {
      return {
        title: "Help & Support",
        back: "/dashboard/profile",
        menu: false,
      };
    }

    if (pathname === "/dashboard/privacy") {
      return {
        title: "Privacy & Security",
        back: "/dashboard/profile",
        menu: false,
      };
    }

    if (pathname === "/dashboard/about") {
      return {
        title: "About ClassPing",
        back: "/dashboard/profile",
        menu: true,
      };
    }

    if (pathname === "/dashboard/all-notifications") {
      return { title: "Notifications", back: "/dashboard", menu: false };
    }

    if (pathname === "/dashboard/ai-assistant") {
      return { title: "AI Assistant", back: "/dashboard", menu: false };
    }

    return { title: "ClassPing", back: null, menu: false };
  }, [location.pathname]);

  /* =========================================================
     Guard: hide MobileTopNav when:
       - not on mobile viewport, OR
       - on the home route (pageConfig === null)
     ========================================================= */
  if (!isSmall || !pageConfig) {
    return null;
  }

  /* ---------- Below this line, pageConfig is guaranteed non-null ---------- */

  const handleBack = () => {
    if (pageConfig.back) {
      navigate(pageConfig.back);
      return;
    }
    navigate("/dashboard");
  };

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleSupport = () => {
    handleMenuClose();
    navigate("/dashboard/help");
  };

  const handleprivacy = () => {
    handleMenuClose();
    navigate("/dashboard/privacy");
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("classping_token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{
          display: "block",
          bgcolor:
            theme.palette.mode === "dark" ? "background.paper" : "#ffffff",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (t) => t.zIndex.appBar - 1,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 58,
            px: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Back */}
          <Box
            sx={{
              width: 42,
              display: "flex",
              justifyContent: "flex-start",
              flexShrink: 0,
            }}
          >
            {pageConfig.back && (
              <IconButton
                onClick={handleBack}
                aria-label="Go back"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  color: "text.primary",
                  "&:active": { transform: "scale(0.94)" },
                }}
              >
                <ArrowBackRoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="subtitle1"
            sx={{
              flex: 1,
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {pageConfig.title}
          </Typography>

          {/* Right */}
          <Box
            sx={{
              width: 42,
              display: "flex",
              justifyContent: "flex-end",
              flexShrink: 0,
            }}
          >
            {pageConfig.menu && (
              <IconButton
                onClick={handleMenuOpen}
                aria-label="More options"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  color: "text.secondary",
                  "&:active": { transform: "scale(0.94)" },
                }}
              >
                <MoreVertRoundedIcon sx={{ fontSize: 23 }} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              minWidth: 190,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 12px 35px rgba(0,0,0,0.45)"
                  : "0 12px 35px rgba(0,0,0,0.12)",
              overflow: "hidden",
            },
          },
        }}
      >
        <MenuItem
          onClick={handleSupport}
          sx={{ minHeight: 46, gap: 1.5, fontSize: "0.9rem", fontWeight: 600 }}
        >
          <SupportAgentRoundedIcon
            sx={{ fontSize: 21, color: "primary.main" }}
          />
          Help & Support
        </MenuItem>

        <MenuItem
          onClick={handleprivacy}
          sx={{ minHeight: 46, gap: 1.5, fontSize: "0.9rem", fontWeight: 600 }}
        >
          <SecurityIcon sx={{ fontSize: 21, color: "primary.main" }} />
          Privacy & Security
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            minHeight: 46,
            gap: 1.5,
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "error.main",
          }}
        >
          <LogoutRoundedIcon sx={{ fontSize: 21 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default MobileTopNav;
