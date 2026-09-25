import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";

import { alpha } from "@mui/material/styles";

import PersonIcon from "@mui/icons-material/Person";
import Brightness4Icon from "@mui/icons-material/Brightness4";

import {
  Notifications,
  Person,
  Settings,
  Logout,
  ScheduleRounded,
  AccessTimeRounded,
  CalendarMonthRounded,
  DoneAllRounded,
  NotificationsNoneRounded,
} from "@mui/icons-material";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";
import { useTheme as useAppTheme } from "../../../context/ThemeContext";

import api from "../../../services/api";

/* 👇 Import your logo from the assets folder. */
import brandLogo from "../../../assets/logo.png";

/* How many notifications to preview in the dropdown */
const PREVIEW_COUNT = 2;

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { toggleTheme } = useAppTheme();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /*
   * ==========================================
   * PROFILE MENU
   * ==========================================
   */
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  /*
   * ==========================================
   * NOTIFICATION DATA
   * ==========================================
   */
  const fetchNotifications = useCallback(async () => {
    try {
      const [notificationsResponse, unreadResponse] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ]);

      if (notificationsResponse.data.success) {
        setNotifications(notificationsResponse.data.notifications || []);
      }

      if (unreadResponse.data.success) {
        setUnreadCount(unreadResponse.data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  /*
   * ==========================================
   * NOTIFICATION MENU
   * ==========================================
   */
  const handleNotificationOpen = async (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setNotificationLoading(true);

    try {
      await fetchNotifications();
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationClose = () => setNotificationAnchorEl(null);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await api.patch(`/notifications/${notification._id}/read`);
      }

      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id ? { ...item, read: true } : item,
        ),
      );

      setUnreadCount((current) =>
        notification.read ? current : Math.max(0, current - 1),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  /* Navigate to the All Notifications page (inside the dashboard). */
  const handleShowAllNotifications = () => {
    handleNotificationClose();
    navigate("/dashboard/all-notifications");
  };

  /*
   * ==========================================
   * NOTIFICATION ICON
   * ==========================================
   */
  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case "class_reminder_20":
        return <ScheduleRounded sx={{ fontSize: 20, color: "primary.main" }} />;
      case "class_reminder_10":
        return (
          <AccessTimeRounded sx={{ fontSize: 20, color: "warning.main" }} />
        );
      case "tomorrow_schedule":
        return (
          <CalendarMonthRounded
            sx={{ fontSize: 20, color: "secondary.main" }}
          />
        );
      default:
        return (
          <NotificationsNoneRounded
            sx={{ fontSize: 20, color: "primary.main" }}
          />
        );
    }
  };

  /*
   * ==========================================
   * TIME FORMATTER
   * ==========================================
   */
  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return "";

    const diff = Date.now() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    if (days === 1) return "Yesterday";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   */
  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  /*
   * ==========================================
   * COMMON STYLES
   * ==========================================
   */
  const iconButtonSx = {
    borderRadius: 2,
    "&:hover": { backgroundColor: "action.hover" },
  };

  /* Preview list — only the first N notifications */
  const previewNotifications = notifications.slice(0, PREVIEW_COUNT);
  const hasMoreNotifications = notifications.length > PREVIEW_COUNT;

  /* First initial for the mobile avatar */
  const userInitial = (user?.name?.trim()?.charAt(0) || "?").toUpperCase();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: { xs: "none", md: "1px solid" },
        borderColor: { xs: "none", md: "divider" },
        backdropFilter: { xs: "none", md: "blur(10px)" },
        backgroundColor: isMobile
          ? "transparent"
          : (theme) =>
              theme.palette.mode === "light"
                ? "rgba(255,255,255,0.85)"
                : "rgba(30,30,30,0.85)",
        boxShadow: "none",
      }}
    >
      {/* Top-right indigo glow */}
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          right: -70,
          top: -90,
          background:
            theme.palette.mode === "light"
              ? "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(100,120,255,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 1, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isMobile ? (
            /* ---- Mobile brand: logo image only ---- */
            <Box
              component="img"
              src={brandLogo}
              alt="ClassPing"
              sx={{
                height: 44,
                width: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                background: "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              Dashboard
            </Typography>
          )}
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          <IconButton
            onClick={handleNotificationOpen}
            sx={iconButtonSx}
            aria-label="notifications"
          >
            <Badge
              variant={isMobile ? "dot" : "standard"}
              badgeContent={unreadCount}
              color="error"
              max={9}
              invisible={unreadCount === 0}
            >
              <Notifications sx={{ fontSize: { xs: 30, sm: 24 } }} />
            </Badge>
          </IconButton>

          {!isMobile && (
            <IconButton
              onClick={toggleTheme}
              sx={iconButtonSx}
              aria-label="toggle theme"
            >
              <Brightness4Icon />
            </IconButton>
          )}

          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              p: 0.5,
              borderRadius: 2,
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 38, sm: 36 },
                height: { xs: 38, sm: 36 },
                bgcolor: "primary.main",
                fontWeight: 700,
                fontSize: { xs: 15, sm: 16 },
              }}
            >
              {isMobile ? userInitial : <PersonIcon fontSize="small" />}
            </Avatar>
          </IconButton>
        </Box>

        {/* PROFILE MENU */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1.25,
                minWidth: 260,
                maxWidth: "calc(100vw - 24px)",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 12px 40px -12px rgba(0,0,0,0.18)",
                overflow: "hidden",
                p: 0,
              },
            },
          }}
        >
          {/* ── Header with gradient background ── */}
          <Box
            sx={{
              px: 2,
              py: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.1,
                )} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "primary.main",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  boxShadow: (theme) =>
                    `0 4px 12px -4px ${alpha(theme.palette.primary.main, 0.5)}`,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
              </Avatar>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  noWrap
                  sx={{ lineHeight: 1.3, letterSpacing: "-0.01em" }}
                >
                  {user?.name || "User"}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{
                    display: "block",
                    lineHeight: 1.4,
                    fontSize: "0.75rem",
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── Menu items ── */}
          <Box sx={{ p: 0.5 }}>
            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                navigate("/dashboard/profile");
              }}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 1.5,
                gap: 1.5,
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  flexShrink: 0,
                }}
              >
                <Person sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                Profile
              </Typography>
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleProfileMenuClose();
                navigate("/dashboard/settings");
              }}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 1.5,
                gap: 1.5,
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  flexShrink: 0,
                }}
              >
                <Settings sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "-0.005em",
                }}
              >
                Settings
              </Typography>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                borderRadius: 1.5,
                py: 1,
                px: 1.5,
                gap: 1.5,
                color: "error.main",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  color: "error.main",
                  flexShrink: 0,
                }}
              >
                <Logout sx={{ fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Logout
              </Typography>
            </MenuItem>
          </Box>
        </Menu>

        {/* NOTIFICATION MENU */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1.25,
                width: { xs: 340, sm: 400 },
                maxWidth: "calc(100vw - 24px)",
                maxHeight: 560,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                boxShadow: "0 12px 40px -12px rgba(0,0,0,0.18)",
                p: 0,
              },
            },
          }}
        >
          {/* ── Header with gradient background ── */}
          <Box
            sx={{
              px: 2,
              py: 1.75,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              background: (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.primary.main,
                  0.08,
                )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                sx={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                Notifications
              </Typography>

              {unreadCount > 0 && (
                <Box
                  sx={{
                    px: 0.9,
                    py: 0.15,
                    borderRadius: 999,
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
                    color: "error.main",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: 0.3,
                  }}
                >
                  {unreadCount} NEW
                </Box>
              )}
            </Box>

            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<DoneAllRounded sx={{ fontSize: 16 }} />}
                onClick={handleMarkAllAsRead}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  minWidth: "auto",
                  color: "primary.main",
                  borderRadius: 1.5,
                  px: 1,
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                  "& .MuiButton-startIcon": { mr: 0.5 },
                }}
              >
                Mark all read
              </Button>
            )}
          </Box>

          {/* ── Body ── */}
          {notificationLoading ? (
            <Box
              sx={{
                py: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <CircularProgress size={26} thickness={4} />
              <Typography variant="caption" color="text.secondary">
                Loading notifications...
              </Typography>
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                py: 6,
                px: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  color: "primary.main",
                  mb: 1.5,
                }}
              >
                <NotificationsNoneRounded sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="body2" fontWeight={800} sx={{ mb: 0.25 }}>
                No notifications
              </Typography>
              <Typography variant="caption" color="text.secondary">
                You're all caught up.
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ p: 0.5 }}>
                {previewNotifications.map((notification) => (
                  <MenuItem
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      position: "relative",
                      py: 1.35,
                      px: 1.5,
                      alignItems: "flex-start",
                      gap: 1.5,
                      borderRadius: 1.5,
                      whiteSpace: "normal",
                      transition: "background 0.15s ease",
                      bgcolor: notification.read
                        ? "transparent"
                        : (theme) => alpha(theme.palette.primary.main, 0.045),
                      "&:hover": {
                        bgcolor: notification.read
                          ? "action.hover"
                          : (theme) => alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    {/* Unread left accent bar */}
                    {!notification.read && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 4,
                          top: 10,
                          bottom: 10,
                          width: 3,
                          borderRadius: "0 4px 4px 0",
                          bgcolor: "primary.main",
                        }}
                      />
                    )}

                    {/* Icon tile */}
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        minWidth: 36,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.08),
                        ml: !notification.read ? 0.5 : 0,
                      }}
                    >
                      {getNotificationIcon(notification)}
                    </Box>

                    {/* Content */}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "flex-start", mb: 0.35 }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={notification.read ? 600 : 800}
                          sx={{
                            lineHeight: 1.35,
                            flex: 1,
                            minWidth: 0,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {notification.title}
                        </Typography>

                        {!notification.read && (
                          <Box
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              mt: 0.6,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Stack>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          lineHeight: 1.45,
                          whiteSpace: "pre-line",
                          overflowWrap: "break-word",
                        }}
                      >
                        {notification.message}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.65,
                          color: "text.disabled",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                        }}
                      >
                        {formatNotificationTime(notification.createdAt)}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Box>

              {/* Subtle "more" hint */}
              {hasMoreNotifications && (
                <Box
                  sx={{
                    px: 2,
                    py: 0.85,
                    textAlign: "center",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem", fontWeight: 600 }}
                  >
                    +{notifications.length - PREVIEW_COUNT} more notification
                    {notifications.length - PREVIEW_COUNT === 1 ? "" : "s"}
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* ── Footer — navigate to full page ── */}
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <MenuItem
              onClick={handleShowAllNotifications}
              sx={{
                justifyContent: "center",
                py: 1.4,
                gap: 0.75,
                transition: "background 0.15s ease",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <Typography
                variant="body2"
                color="primary"
                fontWeight={700}
                sx={{ fontSize: "0.83rem", letterSpacing: "-0.005em" }}
              >
                Show all notifications
              </Typography>
            </MenuItem>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
