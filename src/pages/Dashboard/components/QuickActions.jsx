import {
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "My Timetable",
    path: "/dashboard/storage/timetable",
    subtitle: "View your schedule",
    icon: CalendarMonthRoundedIcon,
    color: "#4f46e5",
    bg: "rgba(79,70,229,0.10)",
  },
  {
    title: "Holidays",
    path: "/dashboard/storage/holiday",
    subtitle: "Check upcoming holidays",
    icon: BeachAccessRoundedIcon,
    color: "#10b981",
    bg: "rgba(16,185,129,0.10)",
  },
  {
    title: "Upload",
    path: "/dashboard/upload",
    subtitle: "Upload timetable & holidays",
    icon: CloudUploadRoundedIcon,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.10)",
  },
  {
    title: "Notifications",
    path: "/dashboard/all-notifications",
    subtitle: "View class reminders",
    icon: NotificationsRoundedIcon,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.10)",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        height: { xs: "auto", lg: "100%" },
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header — same style as ClassToday */}
      <Box
        sx={{
          px: 2.5,
          py: 1.4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              width: 35,
              height: 35,
              borderRadius: 2,
              bgcolor: isSmall ? "rgba(79,70,229,0.10)" : "primary.main",
              color: isSmall ? "#4f46e5" : "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BoltRoundedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={800}>
              Quick Actions
            </Typography>
            {isSmall && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: -0.3 }}
              >
                Access your important features
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {isSmall ? (
        /* ---- Mobile: colour-tinted card grid, matches reference design ---- */
        <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 1.5,
    p: 2,
  }}
>
  {actions.map((action) => {
    const Icon = action.icon;

    return (
      <Box
        key={action.title}
        onClick={() => navigate(action.path)}
        sx={{
          flex: "1 1 calc(50% - 0.75rem)",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1.75,
          borderRadius: 1.5,
          bgcolor: action.bg,
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition:
            "transform 0.18s ease, box-shadow 0.18s ease",
          "&::after": {
            content: '""',
            position: "absolute",
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${action.color}22 0%, transparent 70%)`,
            pointerEvents: "none",
          },
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 8px 20px ${action.color}22`,
          },
          "&:active": {
            transform: "translateY(0) scale(0.98)",
          },
        }}
      >
        {/* Icon tile */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.75,
            bgcolor: action.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 10px ${action.color}33`,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 18 }} />
        </Box>

        {/* Bottom row: title + arrow */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: 1.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.8rem",
              color: action.color,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            {action.title}
          </Typography>

          <ArrowForwardIosRoundedIcon
            sx={{
              fontSize: 12,
              color: action.color,
              opacity: 0.75,
              flexShrink: 0,
              transition: "transform 0.18s ease, opacity 0.18s ease",
              ".MuiBox-root:hover > &": {
                transform: "translateX(2px)",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>
    );
  })}
</Box>
      ) : (
        /* ---- Tablet / desktop: original vertical list ---- */
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
          }}
        >
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Box
                key={action.title}
                onClick={() => navigate(action.path)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.2,
                  borderRadius: 2.5,
                  cursor: "pointer",

                  transition: "all 0.2s ease",

                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "translateX(3px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 2,
                    bgcolor: action.bg,
                    color: action.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon fontSize="small" />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {action.title}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {action.subtitle}
                  </Typography>
                </Box>

                <ArrowForwardIosRoundedIcon
                  sx={{
                    fontSize: 14,
                    color: "text.disabled",
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default QuickActions;