import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  CircularProgress,
  Divider,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import {
  NotificationsNoneRounded,
  DoneAllRounded,
  ScheduleRounded,
  AccessTimeRounded,
  CalendarMonthRounded,
  CircleRounded,
} from "@mui/icons-material";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../services/api";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

const AllNotifications = () => {
  const theme = useTheme();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      /*
       * Ask the backend for the 5 most recent notifications.
       * The API should support `?limit=5&sort=-createdAt` so that
       * only the latest 5 records are returned (and not the whole list).
       */
      const response = await api.get("/notifications", {
        params: {
          limit: 5,
          sort: "-createdAt", // newest first
        },
      });

      const list = response.data.notifications || [];

      // Client-side safety net: sort by createdAt desc and keep only 5.
      const recentFive = [...list]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setNotifications(recentFive);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    await api.patch("/notifications/read-all");
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true })),
    );
  };

  const markOne = async (notification) => {
    if (notification.read) return;
    await api.patch(`/notifications/${notification._id}/read`);
    setNotifications((current) =>
      current.map((item) =>
        item._id === notification._id ? { ...item, read: true } : item,
      ),
    );
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  /* Group notifications by day for a cleaner scan */
  const grouped = useMemo(() => {
    const groups = {};
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    sorted.forEach((n) => {
      const d = dayjs(n.createdAt);
      const key = d.format("YYYY-MM-DD");
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });

    return Object.entries(groups).map(([key, items]) => ({
      key,
      date: dayjs(key),
      items,
    }));
  }, [notifications]);

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        maxWidth: 860,
        mx: "auto",
      }}
    >
      {/* ============ Header ============ */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mb: 2.5, justifyContent: "space-between" }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1.25} sx={{ mb: 0.25 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}
            >
              Notifications
            </Typography>

            {unreadCount > 0 && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 999,
                  bgcolor: alpha(theme.palette.error.main, 0.12),
                  color: "error.main",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  alignSelf: "center",
                }}
              >
                {unreadCount} NEW
              </Box>
            )}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Stay updated with class reminders and schedule changes
          </Typography>
        </Box>

        <Button
          startIcon={<DoneAllRounded sx={{ fontSize: 18 }} />}
          onClick={markAllRead}
          disabled={unreadCount === 0}
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.85rem",
            borderRadius: 1,
            px: 1.75,
            color: "text.primary",
            border: "1px solid",
            borderColor: "divider",
            "&:hover": { bgcolor: "action.hover" },
            "&.Mui-disabled": {
              borderColor: "divider",
              color: "text.disabled",
            },
          }}
        >
          Mark all read
        </Button>
      </Stack>

      {/* ============ Body ============ */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {loading ? (
          <Box
            sx={{
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              Loading notifications...
            </Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          grouped.map((group, groupIdx) => (
            <Box key={group.key}>
              {/* Date group header */}
              <DateHeader date={group.date} count={group.items.length} />

              {/* Notifications for this day */}
              {group.items.map((n, idx) => (
                <Box key={n._id}>
                  <NotificationRow
                    notification={n}
                    onClick={() => markOne(n)}
                  />
                  {idx < group.items.length - 1 && (
                    <Divider sx={{ ml: { xs: 7, sm: 8 } }} />
                  )}
                </Box>
              ))}

              {groupIdx < grouped.length - 1 && (
                <Divider sx={{ borderColor: "divider" }} />
              )}
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

/* ========================================= */
/* DATE GROUP HEADER (sticky)                 */
/* ========================================= */
const DateHeader = ({ date, count }) => {
  const theme = useTheme();

  let label;
  if (date.isToday()) label = "Today";
  else if (date.isYesterday()) label = "Yesterday";
  else label = date.format("DD MMM YYYY");

  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,
        position: "sticky",
        top: 0,
        zIndex: 1,
        bgcolor: alpha(theme.palette.background.default, 0.85),
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 600,
            color: "text.disabled",
          }}
        >
          {count} {count === 1 ? "Notification" : "Notifications"}
        </Typography>
      </Stack>
    </Box>
  );
};

/* ========================================= */
/* SINGLE NOTIFICATION ROW                    */
/* ========================================= */
const NotificationRow = ({ notification, onClick }) => {
  const theme = useTheme();
  const unread = !notification.read;

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: { xs: 1.5, sm: 2 },
        px: { xs: 1.75, sm: 2.5 },
        py: 2,
        cursor: unread ? "pointer" : "default",
        bgcolor: unread
          ? alpha(theme.palette.primary.main, 0.045)
          : "transparent",
        transition: "background 0.18s ease",
        "&:hover": {
          bgcolor: unread
            ? alpha(theme.palette.primary.main, 0.08)
            : "action.hover",
        },
      }}
    >
      {/* Unread left accent bar */}
      {unread && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 8,
            bottom: 8,
            width: 3,
            borderRadius: "0 4px 4px 0",
            bgcolor: "primary.main",
          }}
        />
      )}

      {/* Icon tile */}
      <Box
        sx={{
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          flexShrink: 0,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: getIconBg(notification.type, theme),
        }}
      >
        {getIcon(notification.type)}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Row 1: Title + time on the right */}
        <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: unread ? 800 : 600,
              fontSize: "0.92rem",
              lineHeight: 1.35,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
              flex: 1,
            }}
          >
            {notification.title}
          </Typography>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{ flexShrink: 0, alignItems: "center" }}
          >
            {unread && (
              <CircleRounded
                sx={{
                  fontSize: 8,
                  color: "primary.main",
                }}
              />
            )}
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "text.secondary",
                whiteSpace: "nowrap",
              }}
            >
              {formatDateTime(notification.createdAt)}
            </Typography>
          </Stack>
        </Stack>

        {/* Row 2: Message */}
        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.82rem",
            color: "text.secondary",
            lineHeight: 1.5,
            whiteSpace: "pre-line",
            overflowWrap: "break-word",
          }}
        >
          {notification.message}
        </Typography>
      </Box>
    </Box>
  );
};

/* ========================================= */
/* EMPTY STATE                                */
/* ========================================= */
const EmptyState = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: "primary.main",
          mb: 2,
        }}
      >
        <NotificationsNoneRounded sx={{ fontSize: 34 }} />
      </Box>

      <Typography fontWeight={800} sx={{ fontSize: "1.05rem", mb: 0.5 }}>
        No notifications yet
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 320, lineHeight: 1.6 }}
      >
        When class reminders or schedule changes come in, you'll see them here.
      </Typography>
    </Box>
  );
};

/* ========================================= */
/* HELPERS                                    */
/* ========================================= */
const getIcon = (type) => {
  switch (type) {
    case "class_reminder_20":
      return <ScheduleRounded sx={{ fontSize: 20, color: "primary.main" }} />;
    case "class_reminder_10":
      return <AccessTimeRounded sx={{ fontSize: 20, color: "warning.main" }} />;
    case "tomorrow_schedule":
      return (
        <CalendarMonthRounded sx={{ fontSize: 20, color: "secondary.main" }} />
      );
    default:
      return (
        <NotificationsNoneRounded
          sx={{ fontSize: 20, color: "primary.main" }}
        />
      );
  }
};

const getIconBg = (type, theme) => {
  switch (type) {
    case "class_reminder_20":
      return alpha(theme.palette.primary.main, 0.1);
    case "class_reminder_10":
      return alpha(theme.palette.warning.main, 0.12);
    case "tomorrow_schedule":
      return alpha(theme.palette.secondary.main, 0.12);
    default:
      return alpha(theme.palette.primary.main, 0.08);
  }
};

const formatDateTime = (createdAt) => {
  if (!createdAt) return "";
  const date = dayjs(createdAt);
  if (!date.isValid()) return "";

  /* Today → "Today, 10:45 AM" */
  if (date.isToday()) return `Today, ${date.format("h:mm A")}`;

  /* Yesterday → "Yesterday, 10:45 AM" */
  if (date.isYesterday()) return `Yesterday, ${date.format("h:mm A")}`;

  /* Same year → "12 Sep, 10:45 AM" */
  if (date.year() === dayjs().year())
    return `${date.format("DD MMM")}, ${date.format("h:mm A")}`;

  /* Older → "12 Sep 2025, 10:45 AM" */
  return `${date.format("DD MMM YYYY")}, ${date.format("h:mm A")}`;
};

export default AllNotifications;