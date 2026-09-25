import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slide,
  useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";

// Pick an icon + accent color based on the notification type,
// so a 20-min warning reads differently from tomorrow's schedule.
const getNotificationVisual = (type, theme) => {
  switch (type) {
    case "class_reminder_20":
      return {
        icon: <AccessTimeRoundedIcon fontSize="small" />,
        color: theme.palette.warning.main,
        bg: theme.palette.warning.light,
      };
    case "class_reminder_10":
      return {
        icon: <AccessTimeRoundedIcon fontSize="small" />,
        color: theme.palette.error.main,
        bg: theme.palette.error.light,
      };
    case "tomorrow_schedule":
      return {
        icon: <TodayRoundedIcon fontSize="small" />,
        color: theme.palette.info.main,
        bg: theme.palette.info.light,
      };
    default:
      return {
        icon: <NotificationsActiveRoundedIcon fontSize="small" />,
        color: theme.palette.primary.main,
        bg: theme.palette.primary.light,
      };
  }
};

const AUTO_DISMISS_MS = 6000;

const PushNotificationListener = () => {
  const theme = useTheme();

  // Queue of active toasts — supports more than one stacking
  // if pushes arrive close together.
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleMessage = (event) => {
      if (event.data?.type !== "PUSH_RECEIVED") return;

      const id = `${Date.now()}-${Math.random()}`;

      const toast = {
        id,
        title: event.data.title,
        body: event.data.body,
        notifType: event.data.data?.type,
      };

      setToasts((prev) => [...prev, toast]);

      // If you have a bell icon / notification list fed by
      // an API call or context, trigger its refresh here too:
      // refreshNotifications();

      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, [dismiss]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 12, sm: 20 },
        right: { xs: 12, sm: 20 },
        left: { xs: 12, sm: "auto" },
        zIndex: theme.zIndex.snackbar,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
        width: { xs: "auto", sm: 360 },
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const visual = getNotificationVisual(toast.notifType, theme);

        return (
          <Slide
            key={toast.id}
            direction="left"
            in
            mountOnEnter
            unmountOnExit
          >
            <Paper
              elevation={4}
              sx={{
                pointerEvents: "auto",
                borderRadius: 2.5,
                p: 1.75,
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderLeft: "4px solid",
                borderLeftColor: visual.color,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: visual.bg,
                  color: visual.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mt: 0.25,
                }}
              >
                {visual.icon}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    lineHeight: 1.3,
                    mb: 0.25,
                  }}
                >
                  {toast.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: "text.secondary",
                    lineHeight: 1.4,
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                  }}
                >
                  {toast.body}
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={() => dismiss(toast.id)}
                sx={{ mt: -0.5, mr: -0.5, flexShrink: 0 }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Paper>
          </Slide>
        );
      })}
    </Box>
  );
};

export default PushNotificationListener;