import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import api from "../../../services/api";

dayjs.extend(customParseFormat);

const ClassToday = () => {
  const theme = useTheme();

  const [timetable, setTimetable] = useState(null);
  const [holiday, setHoliday] = useState(null);
  const [persistentExtras, setPersistentExtras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      setLoading(true);

      const [timetableResponse, holidayResponse, overridesResponse] =
        await Promise.all([
          api.get("/timetable"),
          api.get("/holiday"),
          api.get("/schedule-overrides"),
        ]);

      setTimetable(timetableResponse.data?.timetable || null);
      setHoliday(holidayResponse.data?.holiday || null);
      setPersistentExtras(
        (overridesResponse.data?.overrides || []).filter(
          (override) => override.isAdditional,
        ),
      );
    } catch (error) {
      console.error("Failed to load today's classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const today = dayjs();
  const todayKey = today.format("YYYY-MM-DD");
  const todayDay = today.format("dddd");

  const todayHoliday = holiday?.entries?.find(
    (item) => item.date && dayjs(item.date).isSame(today, "day"),
  );

  const todayClasses = useMemo(() => {
    const hasTimetableEntries = Boolean(timetable?.entries?.length);
    const hasExtras = persistentExtras.length > 0;
    if (!hasTimetableEntries && !hasExtras) return [];

    const normalizedToday = normalizeDay(todayDay);

    /* ---------- 1. Timetable entries for today ---------- */
    let classes = (timetable?.entries || [])
      .filter((entry) => normalizeDay(entry.day) === normalizedToday)
      .map((entry, index) => {
        const id =
          entry.id ||
          `${entry.subject}|${entry.day}|${entry.startTime}|${
            entry.faculty || ""
          }|${entry.room || ""}`;

        const isCancelled = entry.cancelledDates?.includes(todayKey);
        const isAdded = entry.addedDates?.includes(todayKey);
        const rescheduled = entry.rescheduledDates?.[todayKey];

        const startTime = rescheduled?.startTime || entry.startTime;
        const endTime = rescheduled?.endTime || entry.endTime;
        const room = rescheduled?.room || entry.room;

        const baseStatus = getClassStatus(startTime, endTime);

        let status = baseStatus;
        let statusKind = "schedule";

        if (isCancelled) {
          status = "Cancelled";
          statusKind = "cancelled";
        } else if (isAdded) {
          status = "Added";
          statusKind = "added";
        } else if (rescheduled) {
          status = "Rescheduled";
          statusKind = "rescheduled";
        }

        return {
          ...entry,
          id,
          room,
          startTime,
          endTime,
          status,
          statusKind,
          baseStatus,
          icon: getSubjectIcon(entry.subject, index),
          color: getSubjectColor(index),
        };
      })
      .filter(Boolean);

    /* ---------- 2. Persisted extra classes covering today ---------- */
    const extrasToday = persistentExtras
      .filter((extra) => extra.dateFrom <= todayKey && extra.dateTo >= todayKey)
      .map((extra, index) => {
        const startTime = extra.newStartTime;
        const endTime = extra.newEndTime;
        const baseStatus = getClassStatus(startTime, endTime);

        return {
          id: extra._id || `extra-${index}`,
          subject: extra.subject,
          faculty: extra.newFaculty,
          room: extra.newRoom,
          startTime,
          endTime,
          day: todayDay,
          status: "Added",
          statusKind: "added",
          baseStatus,
          icon: getSubjectIcon(extra.subject, index),
          color: getSubjectColor(index),
        };
      });

    classes = classes.concat(extrasToday);

    /* ---------- 3. Sort by start time ---------- */
    classes.sort((a, b) => {
      const timeA = createClassTime(today, a.startTime);
      const timeB = createClassTime(today, b.startTime);
      if (!timeA || !timeB) return 0;
      return timeA.valueOf() - timeB.valueOf();
    });

    return classes;
  }, [timetable, persistentExtras, todayDay, todayKey, today]);

  return (
    <Paper
      elevation={0}
      sx={{
        minHeight: 300,
        height: { xs: "auto", lg: "100%" },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* ============ Header — desktop / tablet (sm+) ============ */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.25}>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              width: 34,
              height: 34,
              borderRadius: 1.75,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "primary.contrastText",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 10px ${alpha(
                theme.palette.primary.main,
                0.25,
              )}`,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 18 }} />
          </Box>

          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              letterSpacing: "-0.02em",
            }}
          >
            Today's Classes
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            px: 1.4,
            py: 0.5,
            borderRadius: 999,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "action.hover",
            flexShrink: 0,
          }}
        >
          <CalendarMonthIcon
            sx={{ fontSize: 13, color: "primary.main", alignSelf: "center" }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.3px",
              color: "text.secondary",
              whiteSpace: "nowrap",
              fontSize: "0.7rem",
            }}
          >
            {today.format("DD MMM YYYY")}
          </Typography>
        </Stack>
      </Box>

      {/* ============ Header — mobile (xs only), matches reference photo ============ */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          px: 2,
          py: 1.6,
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: "center", minWidth: 0 }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: 1.75,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.25)}`,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 19 }} />
          </Box>

          <Box sx={{ minWidth: 0, gap: 0.25 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
              noWrap
            >
              Today's Classes
            </Typography>
            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "text.secondary",
                lineHeight: 1.3,
              }}
              noWrap
            >
              Your schedule for today
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={0.3}
          sx={{ alignItems: "center", flexShrink: 0 }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "text.secondary",
              whiteSpace: "nowrap",
            }}
          >
            {today.format("DD MMM YYYY")}
          </Typography>
        </Stack>
      </Box>

      <Divider />

      {/* ============ Body ============ */}
      {loading ? (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack spacing={1.5}>
            <CircularProgress size={28} sx={{ alignSelf: "center" }} />
            <Typography variant="body2" color="text.secondary">
              Checking today's schedule...
            </Typography>
          </Stack>
        </Box>
      ) : todayHoliday ? (
        <HolidayToday holiday={todayHoliday} />
      ) : todayClasses.length === 0 ? (
        <NoClassesToday />
      ) : (
        <ClassList classes={todayClasses} />
      )}
    </Paper>
  );
};

/* ========================================= */
/* CLASS LIST (scrollable on desktop)        */
/* ========================================= */
const ClassList = ({ classes }) => {
  return (
    <Box
      sx={{
        maxHeight: { xs: "none", sm: 300 },
        overflowY: { xs: "visible", sm: "auto" },
        overflowX: "hidden",
        px: { xs: 0, sm: 1.75 },
        py: { xs: 0, sm: 1.25 },
        "&::-webkit-scrollbar": { width: 6 },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "divider",
          borderRadius: 3,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "text.disabled",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,0,0,0.2) transparent",
      }}
    >
      {/* Mobile: flush rows separated by dividers, matches reference photo */}
      <Stack sx={{ display: { xs: "flex", sm: "none" } }}>
        {classes.map((item, index) => (
          <Box key={item.id}>
            <ClassRow item={item} />
            {index < classes.length - 1 && <Divider />}
          </Box>
        ))}
      </Stack>

      {/* Desktop / tablet: original spaced cards */}
      <Stack spacing={1.25} sx={{ display: { xs: "none", sm: "flex" } }}>
        {classes.map((item) => (
          <ClassRow key={item.id} item={item} />
        ))}
      </Stack>
    </Box>
  );
};

/* ========================================= */
/* SINGLE CLASS ROW — responsive              */
/* ========================================= */
const ClassRow = ({ item }) => {
  const isCancelled = item.statusKind === "cancelled";

  const statusConfig = getStatusConfig(item.status);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: { xs: 0, sm: 1.5 },
        border: { xs: "none", sm: "1px solid transparent" },

        borderColor: { sm: alpha(item.color, 0.25) },
        bgcolor: "background.paper",
        opacity: isCancelled ? 0.65 : 1,
        transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        p: { xs: 0, sm: 2 },
        "&:hover": {
          borderColor: { sm: alpha(item.color, 0.4) },
          boxShadow: { sm: `0 6px 18px ${alpha(item.color, 0.08)}` },
        },
      }}
    >
      {/* ========================================= */}
      {/* MOBILE LAYOUT (xs only) — compact single row, */}
      {/* matches the reference photo                */}
      {/* ========================================= */}
      <Stack
        direction="row"
        spacing={1.1}
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          px: 2,
          py: 1.5,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 1.75,
            bgcolor: alpha(item.color, 0.12),
            color: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MenuBookRoundedIcon sx={{ fontSize: 21 }} />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "0.86rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textDecoration: isCancelled ? "line-through" : "none",
              color: isCancelled ? "text.disabled" : "text.primary",
            }}
          >
            {item.subject}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "text.secondary",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              mt: 0.15,
            }}
          >
            {item.faculty || "Faculty TBA"} • {item.room || "Room TBA"}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right", flexShrink: 0, ml: "auto" }}>
          <Typography
            sx={{
              fontSize: "0.66rem",
              fontWeight: 700,
              color: "text.secondary",
              whiteSpace: "nowrap",
              mb: 0.5,
            }}
          >
            {item.startTime} – {item.endTime}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.35,
              px: 0.9,
              py: 0.25,
              borderRadius: 999,
              bgcolor: statusConfig.bg,
              color: statusConfig.color,
              fontSize: "0.64rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
              "& svg": { fontSize: 12 },
            }}
          >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </Box>
        </Box>
      </Stack>

      {/* ========================================= */}
      {/* DESKTOP / TABLET LAYOUT  (sm and up)      */}
      {/* ========================================= */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: { sm: 60, md: 68 },
            height: { sm: 60, md: 68 },
            flexShrink: 0,
            borderRadius: 2,
            bgcolor: alpha(item.color, 0.1),
            color: item.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MenuBookRoundedIcon sx={{ fontSize: { sm: 30, md: 34 } }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={{ sm: 1.25 }}
            sx={{
              minWidth: 0,
              flexWrap: "wrap",
              rowGap: 0.75,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { sm: "1.1rem", md: "1.2rem" },
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textDecoration: isCancelled ? "line-through" : "none",
                  color: isCancelled ? "text.disabled" : "text.primary",
                }}
              >
                {item.subject}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.1,
                py: 0.3,
                borderRadius: 999,
                bgcolor: statusConfig.bg,
                color: statusConfig.color,
                fontSize: "0.75rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
                border: "1px solid",
                borderColor: alpha(statusConfig.color, 0.18),
                flexShrink: 0,
                "& svg": { fontSize: 14 },
              }}
            >
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={{ sm: 1.75 }}
            divider={
              <Box
                sx={{
                  width: "1px",
                  height: 22,
                  bgcolor: "divider",
                  flexShrink: 0,
                }}
              />
            }
            sx={{ mt: { sm: 1.25 }, flexWrap: "nowrap" }}
          >
            <InfoBlock
              icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
              iconBg={alpha("#8b5cf6", 0.12)}
              iconColor="#8b5cf6"
              label="Timing"
              value={`${item.startTime} – ${item.endTime}`}
            />
            <InfoBlock
              icon={<PersonOutlineRoundedIcon sx={{ fontSize: 14 }} />}
              iconBg={alpha("#f59e0b", 0.14)}
              iconColor="#d97706"
              label="Teacher"
              value={item.faculty || "Not provided"}
            />
            <InfoBlock
              icon={<PlaceOutlinedIcon sx={{ fontSize: 14 }} />}
              iconBg={alpha("#3b82f6", 0.12)}
              iconColor="#2563eb"
              label="Room"
              value={item.room || "Not provided"}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

/* ========================================= */
/* INFO BLOCK (used on desktop/tablet)       */
/* ========================================= */
const InfoBlock = ({ icon, iconBg, iconColor, label, value }) => (
  <Stack direction="row" spacing={0.75} sx={{ minWidth: 0, flexShrink: 0 }}>
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        bgcolor: iconBg,
        color: iconColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "0.62rem",
          color: "text.secondary",
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: { sm: "0.82rem" },
          color: "text.primary",
          fontWeight: 700,
          lineHeight: 1.25,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: { sm: 150, md: 190 },
        }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
);

/* ========================================= */
/* HOLIDAY COMPONENT */
/* ========================================= */
const HolidayToday = ({ holiday }) => {
  return (
    <Box
      sx={{
        minHeight: 300,
        p: { xs: 3, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(
          "#ec4899",
          0.06,
        )}, ${alpha("#f59e0b", 0.06)})`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: alpha("#ec4899", 0.08),
          top: -80,
          right: -50,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: alpha("#f59e0b", 0.08),
          bottom: -60,
          left: -30,
        }}
      />

      <Stack
        spacing={1.5}
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            background: "linear-gradient(135deg, #ec4899, #f59e0b)",
            color: "#fff",
            boxShadow: "0 10px 26px rgba(236,72,153,0.25)",
          }}
        >
          <CelebrationRoundedIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h6" fontWeight={800}>
          It's a Holiday!
        </Typography>

        <Typography variant="body2" color="text.secondary">
          No classes scheduled today
        </Typography>

        <Box
          sx={{
            mt: 0.5,
            px: 2.25,
            py: 0.8,
            borderRadius: 2.5,
            bgcolor: alpha("#ec4899", 0.1),
            color: "#db2777",
          }}
        >
          <Typography fontWeight={800} fontSize="0.9rem">
            {holiday.occasion}
          </Typography>
        </Box>

        {holiday.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 420, fontSize: "0.85rem" }}
          >
            {holiday.description}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

/* ========================================= */
/* NO CLASSES COMPONENT */
/* ========================================= */
const NoClassesToday = () => {
  return (
    <Box
      sx={{
        minHeight: 300,
        p: { xs: 3, md: 4 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(
          "#6366f1",
          0.04,
        )}, ${alpha("#3b82f6", 0.05)})`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: `1px dashed ${alpha("#6366f1", 0.2)}`,
          top: -100,
          right: -50,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 130,
          height: 130,
          borderRadius: "50%",
          border: `1px dashed ${alpha("#3b82f6", 0.2)}`,
          bottom: -70,
          left: -40,
        }}
      />

      <Stack
        spacing={1.5}
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            bgcolor: alpha("#6366f1", 0.09),
            color: "primary.main",
          }}
        >
          <NightShelterIcon sx={{ fontSize: 32 }} />
        </Box>

        <Typography variant="h6" fontWeight={800}>
          No classes today
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.85rem", maxWidth: 420 }}
        >
          Your schedule is clear for today. Take a break, catch up on your work,
          or enjoy some well-deserved free time!
        </Typography>
      </Stack>
    </Box>
  );
};

/* ========================================= */
/* DAY NORMALIZATION */
/* ========================================= */
const normalizeDay = (day) => {
  if (!day) return "";
  const value = String(day).trim().toLowerCase();
  const days = {
    sun: "sunday",
    sunday: "sunday",
    mon: "monday",
    monday: "monday",
    tue: "tuesday",
    tues: "tuesday",
    tuesday: "tuesday",
    wed: "wednesday",
    wednesday: "wednesday",
    thu: "thursday",
    thur: "thursday",
    thurs: "thursday",
    thursday: "thursday",
    fri: "friday",
    friday: "friday",
    sat: "saturday",
    saturday: "saturday",
  };
  return days[value] || value;
};

/* ========================================= */
/* CLASS TIME */
/* ========================================= */
const createClassTime = (date, time) => {
  if (!time) return null;
  const value = String(time).trim();
  let parsed;

  if (/AM|PM/i.test(value)) {
    parsed = dayjs(`${date.format("YYYY-MM-DD")} ${value}`, [
      "YYYY-MM-DD h:mm A",
      "YYYY-MM-DD hh:mm A",
      "YYYY-MM-DD h A",
      "YYYY-MM-DD hh A",
    ]);
  } else {
    parsed = dayjs(`${date.format("YYYY-MM-DD")} ${value}`, [
      "YYYY-MM-DD H:mm",
      "YYYY-MM-DD HH:mm",
      "YYYY-MM-DD H",
      "YYYY-MM-DD HH",
    ]);
  }

  return parsed.isValid() ? parsed : null;
};

/* ========================================= */
/* CLASS STATUS */
/* ========================================= */
const getClassStatus = (startTime, endTime) => {
  const now = dayjs();
  const start = createClassTime(now, startTime);
  const end = createClassTime(now, endTime);

  if (!start || !end) return "Upcoming";
  if (now.isAfter(end)) return "Completed";
  if (now.isAfter(start) && now.isBefore(end)) return "Ongoing";
  return "Upcoming";
};

/* ========================================= */
/* STATUS CONFIG */
/* ========================================= */
const getStatusConfig = (status) => {
  switch (status) {
    case "Cancelled":
      return {
        label: "Cancelled",
        bg: alpha("#ef4444", 0.12),
        color: "#dc2626",
        icon: <EventBusyRoundedIcon sx={{ fontSize: 14 }} />,
      };
    case "Rescheduled":
      return {
        label: "Rescheduled",
        bg: alpha("#f59e0b", 0.14),
        color: "#d97706",
        icon: <UpdateRoundedIcon sx={{ fontSize: 14 }} />,
      };
    case "Added":
      return {
        label: "Added",
        bg: alpha("#10b981", 0.14),
        color: "#059669",
        icon: <AddCircleRoundedIcon sx={{ fontSize: 14 }} />,
      };
    case "Completed":
      return {
        label: "Completed",
        bg: alpha("#10b981", 0.12),
        color: "#059669",
        icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
      };
    case "Ongoing":
      return {
        label: "Ongoing",
        bg: alpha("#4f46e5", 0.12),
        color: "#4f46e5",
        icon: <PlayCircleRoundedIcon sx={{ fontSize: 14 }} />,
      };
    default:
      return {
        label: "Upcoming",
        bg: alpha("#10b981", 0.14),
        color: "#059669",
        icon: <ScheduleRoundedIcon sx={{ fontSize: 14 }} />,
      };
  }
};

/* ========================================= */
/* SUBJECT ICON */
/* ========================================= */
const getSubjectIcon = (subject, index) => {
  const value = String(subject || "").toLowerCase();

  if (
    value.includes("web") ||
    value.includes("html") ||
    value.includes("javascript")
  )
    return LanguageRoundedIcon;
  if (value.includes("network") || value.includes("communication"))
    return HubRoundedIcon;
  if (
    value.includes("database") ||
    value.includes("dbms") ||
    value.includes("sql")
  )
    return StorageRoundedIcon;
  if (
    value.includes("algorithm") ||
    value.includes("program") ||
    value.includes("coding") ||
    value.includes("data structure")
  )
    return CodeRoundedIcon;
  if (
    value.includes("math") ||
    value.includes("calculus") ||
    value.includes("algebra") ||
    value.includes("geometry") ||
    value.includes("trigonometry") ||
    value.includes("statistics") ||
    value.includes("probability") ||
    value.includes("mme")
  )
    return FunctionsRoundedIcon;

  const icons = [
    CodeRoundedIcon,
    LanguageRoundedIcon,
    HubRoundedIcon,
    StorageRoundedIcon,
  ];
  return icons[index % icons.length];
};

/* ========================================= */
/* SUBJECT COLOR */
/* ========================================= */
const getSubjectColor = (index) => {
  const colors = [
    "#6366f1",
    "#3b82f6",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
  ];
  return colors[index % colors.length];
};

export default ClassToday;
