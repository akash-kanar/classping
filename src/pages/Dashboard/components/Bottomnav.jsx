import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

/*
 * Each item's `match` decides which pathnames light it up as active.
 * Adjust the `path` values here if your real routes differ.
 */
const NAV_ITEMS = [
  {
    label: "Home",
    path: "/dashboard",
    // Only match the exact dashboard root — no sub-routes should light Home up
    match: (pathname) =>
      pathname === "/dashboard" || pathname === "/dashboard/",
    iconActive: HomeRoundedIcon,
    iconInactive: HomeOutlinedIcon,
  },
  {
    label: "Timetable",
    path: "/dashboard/upcoming-classes",
    match: (pathname) =>
      pathname.startsWith("/dashboard/upcoming-classes"),
    iconActive: CalendarMonthRoundedIcon,
    iconInactive: CalendarMonthOutlinedIcon,
  },
  {
    label: "Upload",
    path: "/dashboard/upload",
    match: (pathname) =>
      pathname.startsWith("/dashboard/upload") ||
      pathname.startsWith("/dashboard/timetable/upload") ||
      pathname.startsWith("/dashboard/holiday/upload") ||
      pathname.startsWith("/dashboard/timetable/preview") ||
      pathname.startsWith("/dashboard/timetable/result") ||
      pathname.startsWith("/dashboard/holiday/review"),
    iconActive: CloudUploadRoundedIcon,
    iconInactive: CloudUploadOutlinedIcon,
  },
  {
    label: "Storage",
    path: "/dashboard/storage",
    match: (pathname) =>
      pathname.startsWith("/dashboard/storage") ||
      pathname.startsWith("/dashboard/view/"),
    iconActive: FolderRoundedIcon,
    iconInactive: FolderOutlinedIcon,
  },
  {
    label: "Profile",
    path: "/dashboard/profile",
    match: (pathname) =>
      pathname.startsWith("/dashboard/profile") ||
      pathname === "/dashboard/settings" ||
      pathname === "/dashboard/help" ||
      pathname === "/dashboard/privacy" ||
      pathname === "/dashboard/about",
    iconActive: PersonRoundedIcon,
    iconInactive: PersonOutlineRoundedIcon,
  },
];

/* Export so parent layouts can reserve space for the fixed bar */
export const BOTTOM_NAV_HEIGHT = 62;

const BottomNav = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  if (!isSmall) return null;

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (t) => t.zIndex.appBar,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-around",
        height: BOTTOM_NAV_HEIGHT,
        pb: "env(safe-area-inset-bottom)",
        bgcolor: (t) =>
          t.palette.mode === "dark" ? "background.paper" : "#ffffff",
        borderTop: "1px solid",
        borderColor: "divider",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.match(location.pathname);
        const Icon = active ? item.iconActive : item.iconInactive;

        return (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.3,
              cursor: "pointer",
              color: active ? "primary.main" : "text.secondary",
              bgcolor: active ? "action.selected" : "transparent",
              transition: "background-color 0.2s, color 0.2s",
              borderRadius: 1,
              mt: 0.5,
              mb: 0.5,
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
            <Typography
              sx={{
                fontSize: "0.66rem",
                fontWeight: active ? 700 : 500,
                lineHeight: 1,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default BottomNav;