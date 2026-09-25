import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import BeachAccessRoundedIcon from "@mui/icons-material/BeachAccessRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";

import dayjs from "dayjs";

import api from "../../../services/api";

const StatsCards = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const [stats, setStats] = useState([
    {
      title: "Total Classes",
      value: 0,
      subtitle: "This week",
      icon: CalendarMonthRoundedIcon,
      color: "#4f46e5",
      bg: "rgba(79, 70, 229, 0.10)",
      progress: 0,
    },
    {
      title: "Completed",
      value: 0,
      subtitle: "This week",
      icon: CheckCircleRoundedIcon,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.10)",
      progress: 0,
    },
    {
      title: "Upcoming",
      value: 0,
      subtitle: "Remaining",
      icon: ScheduleRoundedIcon,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.10)",
      progress: 0,
    },
    {
      title: "Cancelled",
      value: 0,
      subtitle: "This week",
      icon: EventBusyRoundedIcon,
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.10)",
      progress: 0,
    },
    {
      title: "Holidays",
      value: 0,
      subtitle: "This month",
      icon: BeachAccessRoundedIcon,
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.10)",
      progress: 0,
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      setLoading(true);

      const [timetableResponse, holidayResponse, overridesResponse] =
        await Promise.all([
          api.get("/timetable"),
          api.get("/holiday"),
          api.get("/schedule-overrides"),
        ]);

      const timetable = timetableResponse.data?.timetable;
      const holiday = holidayResponse.data?.holiday;
      const overrides = overridesResponse.data?.overrides || [];

      const entries = timetable?.entries || [];
      const holidays = holiday?.entries || [];

      const persistentExtras = overrides.filter(
        (override) => override.isAdditional
      );

      const now = dayjs();

      const startOfWeek = now.startOf("week");
      const endOfWeek = now.endOf("week");

      let totalClasses = 0;
      let completedClasses = 0;
      let cancelledClasses = 0;

      for (
        let date = startOfWeek;
        date.isBefore(endOfWeek) || date.isSame(endOfWeek, "day");
        date = date.add(1, "day")
      ) {
        const dayName = date.format("dddd");
        const dateKey = date.format("YYYY-MM-DD");

        const isHoliday = holidays.some((holiday) =>
          dayjs(holiday.date).isSame(date, "day")
        );
        if (isHoliday) continue;

        const dayClasses = entries.filter(
          (entry) => normalizeDay(entry.day) === normalizeDay(dayName)
        );

        totalClasses += dayClasses.length;

        dayClasses.forEach((entry) => {
          const isCancelled = entry.cancelledDates?.includes(dateKey);
          if (isCancelled) {
            cancelledClasses++;
            return;
          }

          const rescheduled = entry.rescheduledDates?.[dateKey];
          const effectiveEndTime = rescheduled?.endTime || entry.endTime;

          const classEnd = createClassDateTime(date, effectiveEndTime);
          if (classEnd && classEnd.isBefore(now)) {
            completedClasses++;
          }
        });

        const extrasToday = persistentExtras.filter(
          (extra) => extra.dateFrom <= dateKey && extra.dateTo >= dateKey
        );

        totalClasses += extrasToday.length;

        extrasToday.forEach((extra) => {
          const classEnd = createClassDateTime(date, extra.newEndTime);
          if (classEnd && classEnd.isBefore(now)) {
            completedClasses++;
          }
        });
      }

      const upcomingClasses = Math.max(
        totalClasses - completedClasses - cancelledClasses,
        0
      );

      const holidaysThisMonth = holidays.filter((holiday) =>
        dayjs(holiday.date).isSame(now, "month")
      );

      const completedProgress =
        totalClasses > 0 ? (completedClasses / totalClasses) * 100 : 0;

      const upcomingProgress =
        totalClasses > 0 ? (upcomingClasses / totalClasses) * 100 : 0;

      const cancelledProgress =
        totalClasses > 0 ? (cancelledClasses / totalClasses) * 100 : 0;

      const holidayProgress = Math.min(holidaysThisMonth.length * 20, 100);

      setStats([
        {
          title: "Total Classes",
          value: totalClasses,
          subtitle: "This week",
          icon: CalendarMonthRoundedIcon,
          color: "#4f46e5",
          bg: "rgba(79, 70, 229, 0.10)",
          progress: totalClasses > 0 ? 100 : 0,
        },
        {
          title: "Completed",
          value: completedClasses,
          subtitle: "This week",
          icon: CheckCircleRoundedIcon,
          color: "#10b981",
          bg: "rgba(16, 185, 129, 0.10)",
          progress: completedProgress,
        },
        {
          title: "Upcoming",
          value: upcomingClasses,
          subtitle: "Remaining",
          icon: ScheduleRoundedIcon,
          color: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.10)",
          progress: upcomingProgress,
        },
        {
          title: "Cancelled",
          value: cancelledClasses,
          subtitle: "This week",
          icon: EventBusyRoundedIcon,
          color: "#ef4444",
          bg: "rgba(239, 68, 68, 0.10)",
          progress: cancelledProgress,
        },
        {
          title: "Holidays",
          value: holidaysThisMonth.length,
          subtitle: "This month",
          icon: BeachAccessRoundedIcon,
          color: "#ec4899",
          bg: "rgba(236, 72, 153, 0.10)",
          progress: holidayProgress,
        },
      ]);
    } catch (error) {
      console.error("Failed to calculate dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Convert a hex color to "r,g,b" so we can build rgba() strings */
  const hexToRgb = (hex) => {
    const clean = hex.replace("#", "");
    const full =
      clean.length === 3
        ? clean.split("").map((c) => c + c).join("")
        : clean;
    const num = parseInt(full, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 3,
      }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isLast = index === stats.length - 1;
        const rgb = hexToRgb(stat.color);

        return (
          <Paper
            key={stat.title}
            elevation={0}
            sx={{
              /* Layout — 2 per row on mobile (last spans full), 3 on md, 5 on lg */
              flex: {
                xs: isLast
                  ? "1 1 100%"
                  : "1 1 calc(50% - 4px)",
                sm: "1 1 calc(50% - 4px)",
                md: "1 1 calc(33.333% - 6px)",
                lg: "1 1 0",
              },
              minWidth: { lg: 170 },

              /* Compact padding on mobile */
              p: { xs: 1.5, sm: 2, md: 2.25 },

              borderRadius: 1,
              border: "1px solid",

              /* Tinted border + gradient bg using the stat's color */
              borderColor: isLight
                ? `rgba(${rgb}, 0.18)`
                : `rgba(${rgb}, 0.22)`,

              background: isLight
                ? `linear-gradient(135deg, rgba(${rgb}, 0.10) 0%, rgba(${rgb}, 0.04) 55%, rgba(${rgb}, 0.07) 100%)`
                : `linear-gradient(135deg, rgba(${rgb}, 0.14) 0%, rgba(${rgb}, 0.06) 55%, rgba(${rgb}, 0.10) 100%)`,

              boxShadow: isLight
                ? `0 6px 20px rgba(${rgb}, 0.10)`
                : `0 6px 20px rgba(0, 0, 0, 0.25)`,

              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",

              /* Soft glow in the top-right corner, matching WelcomeCard */
              "&::before": {
                content: '""',
                position: "absolute",
                width: 110,
                height: 110,
                borderRadius: "50%",
                top: -50,
                right: -40,
                background: isLight
                  ? `radial-gradient(circle, rgba(${rgb}, 0.22) 0%, transparent 70%)`
                  : `radial-gradient(circle, rgba(${rgb}, 0.28) 0%, transparent 70%)`,
                pointerEvents: "none",
              },

              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: isLight
                  ? `0 14px 34px rgba(${rgb}, 0.18)`
                  : `0 14px 34px rgba(0, 0, 0, 0.4)`,
                borderColor: `rgba(${rgb}, 0.35)`,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.7rem", sm: "0.78rem" },
                    letterSpacing: 0.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stat.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "1.35rem", sm: "1.65rem", md: "1.8rem" },
                    fontWeight: 800,
                    mt: { xs: 0.25, sm: 0.5 },
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    color: "text.primary",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} thickness={5} />
                  ) : (
                    stat.value
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: { xs: 32, sm: 38, md: 42 },
                  height: { xs: 32, sm: 38, md: 42 },
                  borderRadius: { xs: 1.25, sm: 1.75 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `rgba(${rgb}, 0.16)`,
                  color: stat.color,
                  border: `1px solid rgba(${rgb}, 0.25)`,
                  flexShrink: 0,
                  "& svg": {
                    fontSize: { xs: 16, sm: 18, md: 20 },
                  },
                }}
              >
                <Icon />
              </Box>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: "relative",
                zIndex: 1,
                display: "block",
                mt: { xs: 0.75, sm: 1 },
                fontSize: { xs: "0.66rem", sm: "0.72rem" },
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              {stat.subtitle}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

/* ========================================= */
/* HELPERS                                    */
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

const createClassDateTime = (date, time) => {
  if (!time) return null;
  const timeString = String(time).trim();
  let parsedTime;

  if (/AM|PM/i.test(timeString)) {
    parsedTime = dayjs(
      `${date.format("YYYY-MM-DD")} ${timeString}`,
      [
        "YYYY-MM-DD h:mm A",
        "YYYY-MM-DD hh:mm A",
        "YYYY-MM-DD h A",
        "YYYY-MM-DD hh A",
      ]
    );
  } else {
    parsedTime = dayjs(
      `${date.format("YYYY-MM-DD")} ${timeString}`,
      ["YYYY-MM-DD HH:mm", "YYYY-MM-DD H:mm", "YYYY-MM-DD HH", "YYYY-MM-DD H"]
    );
  }

  return parsedTime.isValid() ? parsedTime : null;
};

export default StatsCards;