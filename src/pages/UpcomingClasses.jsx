import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
  Tooltip,
  alpha,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";

import {
  AccessTime,
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  EventNote,
  Celebration,
  MoreVert as MoreVertIcon,
  EventBusy,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  EditRounded,
  LockOutlined as LockOutlinedIcon,
} from "@mui/icons-material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";

import api from "../services/api";

/* ---------------------------------------------------------
 * Dialog imports
 * --------------------------------------------------------- */
import CancelDialog from "../components/CancelDialog";
import RescheduleDialog from "../components/RescheduleDialog";
import AddClassDialog from "../components/AddClassDialog";
import EditClassDialog from "../components/EditClassDialog";

/* ---------------------------------------------------------
 * Cutoff helper
 * After 18:00 on the current day, today's classes can no
 * longer be cancelled or rescheduled.
 * --------------------------------------------------------- */
const LOCK_HOUR = 18; // 6:00 PM

const isTodayLocked = (dateKey) => {
  if (!dateKey) return false;
  const today = dayjs().format("YYYY-MM-DD");
  if (dateKey !== today) return false;
  return dayjs().hour() >= LOCK_HOUR;
};

/* ---------------------------------------------------------
 * Navigation arrow button
 * --------------------------------------------------------- */
const NavArrow = ({ direction, disabled, onClick, sx }) => {
  const theme = useTheme();
  const isLeft = direction === "left";

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Scroll to previous dates" : "Scroll to next dates"}
      sx={{
        ...sx,
        width: 40,
        height: 40,
        flexShrink: 0,
        borderRadius: "50%",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        color: "text.primary",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          borderColor: "primary.main",
          color: "primary.main",
          transform: "translateY(-1px)",
          boxShadow: theme.shadows[2],
        },
        "&:active": { transform: "translateY(0) scale(0.96)" },
        "&.Mui-disabled": {
          borderColor: "divider",
          color: "text.disabled",
          bgcolor: "background.paper",
          opacity: 0.5,
        },
      }}
    >
      {isLeft ? (
        <ChevronLeft fontSize="small" />
      ) : (
        <ChevronRight fontSize="small" />
      )}
    </IconButton>
  );
};

/* ---------------------------------------------------------
 * Holiday panel
 * --------------------------------------------------------- */
const HolidayPanel = ({ holiday, date }) => {
  const theme = useTheme();

  const captions = [
    "No alarms today. Enjoy it.",
    "A little pause in the routine.",
    "Rest, recharge, repeat.",
    "The calendar says: breathe.",
    "Time off, well earned.",
  ];

  const dayIndex = dayjs(date).date();
  const caption = captions[dayIndex % captions.length];

  return (
    <Card
      elevation={0}
      sx={{
        mt: 1,
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: alpha(theme.palette.success.main, 0.25),
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.success.main,
          0.08,
        )} 0%, ${alpha(theme.palette.success.main, 0.02)} 60%, ${alpha(
          theme.palette.warning.main,
          0.06,
        )} 100%)`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.success.main,
            0.18,
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette.warning.main,
            0.14,
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <CardContent
        sx={{
          position: "relative",
          p: { xs: 2.5, sm: 4, md: 6 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: 64, sm: 80, md: 96 },
            height: { xs: 64, sm: 80, md: 96 },
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            color: "#fff",
            boxShadow: `0 16px 40px -12px ${alpha(
              theme.palette.success.main,
              0.55,
            )}`,
            mb: { xs: 2, sm: 3 },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              border: "1px dashed",
              borderColor: alpha(theme.palette.success.main, 0.35),
            },
          }}
        >
          <Celebration sx={{ fontSize: { xs: 32, sm: 40, md: 46 } }} />
        </Box>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            bgcolor: alpha(theme.palette.success.main, 0.12),
            border: "1px solid",
            borderColor: alpha(theme.palette.success.main, 0.25),
            mb: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "0.62rem", sm: "0.7rem" },
              fontWeight: 700,
              textTransform: "uppercase",
              color: theme.palette.success.dark,
            }}
          >
            This day is Holiday
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.2rem", sm: "1.6rem", md: "2.1rem" },
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            color: "text.primary",
            maxWidth: 620,
          }}
        >
          {holiday.occasion}
        </Typography>

        <Stack direction="row" spacing={0.75} sx={{ mt: 1, mb: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.9rem" },
              fontStyle: "italic",
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {caption}
          </Typography>
        </Stack>

        {holiday.description && (
          <Box
            sx={{
              mt: 0.5,
              px: 2,
              py: 1.2,
              maxWidth: 520,
              alignSelf: "center",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
                color: "text.secondary",
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              <Box
                component="span"
                sx={{ fontWeight: 800, color: "text.primary", mr: 0.5 }}
              >
                Note:
              </Box>
              {holiday.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------------------------------------------------------
 * Empty state
 * --------------------------------------------------------- */
const EmptyState = ({ title, subtitle, icon }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "divider",
        background: alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <CardContent>
        <Stack spacing={1.5} py={4} alignItems="center">
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          <Typography color="text.secondary" maxWidth={360} textAlign="center">
            {subtitle}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

/* ---------------------------------------------------------
 * UpcomingClasses
 * --------------------------------------------------------- */
const UpcomingClasses = ({ timetable }) => {
  const theme = useTheme();

  const [loadedTimetable, setLoadedTimetable] = useState(timetable || null);
  const [holidayCalendar, setHolidayCalendar] = useState(null);
  const [persistentExtras, setPersistentExtras] = useState([]);
  const [loading, setLoading] = useState(!timetable);
  const [error, setError] = useState("");

  const scrollRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [overrides, setOverrides] = useState({});

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuEntry, setMenuEntry] = useState(null);
  const [menuDateKey, setMenuDateKey] = useState(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [, setSavingChanges] = useState(false);

  /* Load timetable */
  useEffect(() => {
    if (timetable) return;

    const fetchTimetable = async () => {
      try {
        const response = await api.get("/timetable");
        setLoadedTimetable(response.data.timetable);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load your timetable.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [timetable]);

  useEffect(() => {
    const fetchScheduleOverrides = async () => {
      try {
        const response = await api.get("/schedule-overrides");
        setPersistentExtras(
          (response.data.overrides || []).filter(
            (override) => override.isAdditional,
          ),
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load added classes.",
        );
      }
    };

    fetchScheduleOverrides();
  }, []);

  useEffect(() => {
    const fetchHolidayCalendar = async () => {
      try {
        const response = await api.get("/holiday");
        setHolidayCalendar(response.data.holiday || null);
      } catch {
        setHolidayCalendar(null);
      }
    };

    fetchHolidayCalendar();
  }, []);

  const currentTimetable = loadedTimetable || timetable;

  const upcomingDates = useMemo(() => {
    const dates = [];
    let date = dayjs().startOf("day");
    const endOfYear = dayjs().endOf("year");

    while (date.isBefore(endOfYear, "day") || date.isSame(endOfYear, "day")) {
      dates.push(date);
      date = date.add(1, "day");
    }

    return dates;
  }, []);

  const entryId = (entry) =>
    entry.id ||
    `${entry.subject}|${entry.day}|${entry.startTime}|${entry.faculty || ""}|${
      entry.room || ""
    }`;

  const getDateValue = (values, dateKey) => {
    if (!values) return null;
    return typeof values.get === "function"
      ? values.get(dateKey)
      : values[dateKey];
  };

  const classesByDate = useMemo(() => {
    const result = {};

    if (!currentTimetable?.entries?.length && !persistentExtras.length) {
      return result;
    }

    upcomingDates.forEach((date) => {
      const dayName = date.format("dddd");
      const dateKey = date.format("YYYY-MM-DD");
      const ov = overrides[dateKey];

      let classes = (currentTimetable?.entries || [])
        .filter(
          (entry) => entry.day?.trim().toLowerCase() === dayName.toLowerCase(),
        )
        .map((entry) => {
          const id = entryId(entry);
          const isCancelled =
            entry.cancelledDates?.includes(dateKey) || ov?.cancelled?.has(id);
          const rescheduled =
            getDateValue(entry.rescheduledDates, dateKey) ||
            ov?.rescheduled?.[id];
          const isAdded = entry.addedDates?.includes(dateKey);

          if (rescheduled) {
            return {
              ...entry,
              id,
              startTime:
                rescheduled.startTime ||
                rescheduled.newStartTime ||
                entry.startTime,
              endTime:
                rescheduled.endTime || rescheduled.newEndTime || entry.endTime,
              __added: Boolean(isAdded),
              __cancelled: Boolean(isCancelled),
              __rescheduled: true,
            };
          }
          return {
            ...entry,
            id,
            __added: Boolean(isAdded),
            __cancelled: Boolean(isCancelled),
          };
        })
        .filter(Boolean);

      classes = classes.concat(
        persistentExtras
          .filter(
            (extra) => extra.dateFrom <= dateKey && extra.dateTo >= dateKey,
          )
          .map((extra) => ({
            id: extra._id,
            subject: extra.subject,
            faculty: extra.newFaculty,
            room: extra.newRoom,
            startTime: extra.newStartTime,
            endTime: extra.newEndTime,
            day: dayName,
            __added: true,
          })),
      );

      if (ov?.added?.length) {
        classes = classes.concat(
          ov.added.map((a) => ({ ...a, day: dayName, __added: true })),
        );
      }

      classes.sort((a, b) => a.startTime.localeCompare(b.startTime));

      if (classes.length > 0) {
        result[dateKey] = classes;
      }
    });

    return result;
  }, [currentTimetable, upcomingDates, overrides, persistentExtras]);

  const holidaysByDate = useMemo(() => {
    const result = {};
    holidayCalendar?.entries?.forEach((entry) => {
      const dateKey = String(entry.date || "").slice(0, 10);
      if (dateKey) result[dateKey] = entry;
    });
    return result;
  }, [holidayCalendar]);

  const datesWithClassesOrHolidays = useMemo(
    () =>
      upcomingDates.filter((date) => {
        const dateKey = date.format("YYYY-MM-DD");
        return classesByDate[dateKey]?.length || holidaysByDate[dateKey];
      }),
    [upcomingDates, classesByDate, holidaysByDate],
  );

  const activeDate =
    selectedDate || datesWithClassesOrHolidays[0]?.format("YYYY-MM-DD") || null;

  const selectedClasses = activeDate ? classesByDate[activeDate] || [] : [];
  const activeHoliday = activeDate ? holidaysByDate[activeDate] : null;

  /* Rule: today's classes lock after 18:00 */
  const lockTodayActions = isTodayLocked(activeDate);

  /* Responsive page wrapper — tighter padding on mobile */
  const pageSx = {
    width: "100%",
    maxWidth: 1100,
    mx: "auto",
    px: { xs: 1.5, sm: 3, md: 4 },
    py: { xs: 1.5, sm: 3, md: 4 },
    boxSizing: "border-box",
  };

  /* Scroll helpers */
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    const onScroll = () => updateScrollButtons();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(updateScrollButtons);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [datesWithClassesOrHolidays.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !activeDate) return;
    const active = el.querySelector(`[data-date="${activeDate}"]`);
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeDate]);

  const scrollByAmount = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const persistChanges = async (nextOverrides) => {
    const timetableToSave = currentTimetable;
    if (!timetableToSave) return;

    const entries = timetableToSave.entries.map((entry) => {
      const id = entryId(entry);
      const cancelledDates = new Set(entry.cancelledDates || []);
      const rescheduledDates = { ...(entry.rescheduledDates || {}) };

      Object.entries(nextOverrides).forEach(([dateKey, dayOv]) => {
        if (dayOv.cancelled?.has(id)) cancelledDates.add(dateKey);
        if (dayOv.rescheduled?.[id]) {
          rescheduledDates[dateKey] = dayOv.rescheduled[id];
        }
      });

      return {
        ...entry,
        ...(cancelledDates.size ? { cancelledDates: [...cancelledDates] } : {}),
        ...(Object.keys(rescheduledDates).length ? { rescheduledDates } : {}),
      };
    });

    setSavingChanges(true);
    try {
      const response = await api.post("/timetable/save", {
        title: timetableToSave.title,
        semester: timetableToSave.semester,
        entries,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save schedule change.",
        );
      }

      setLoadedTimetable(
        response.data.timetable || { ...timetableToSave, entries },
      );
      setOverrides((currentOverrides) =>
        Object.fromEntries(
          Object.entries(currentOverrides).filter(
            ([, dayOverride]) => dayOverride.added?.length,
          ),
        ),
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to save schedule change.",
      );
    } finally {
      setSavingChanges(false);
    }
  };

  const applyOverrideForDates = (scope, fromDate, toDate, mutator) => {
    const start = dayjs(fromDate);
    const end = scope === "today" ? start : dayjs(toDate);
    const todayKey = dayjs().format("YYYY-MM-DD");
    const locked = dayjs().hour() >= LOCK_HOUR;

    const next = { ...overrides };
    let cursor = start;
    while (cursor.isBefore(end, "day") || cursor.isSame(end, "day")) {
      const key = cursor.format("YYYY-MM-DD");

      // Skip today if the cutoff has passed
      if (!(locked && key === todayKey)) {
        next[key] = mutator(next[key] || {});
      }

      cursor = cursor.add(1, "day");
    }

    setOverrides(next);
    void persistChanges(next);
  };

  const handleCancelConfirm = ({ scope, fromDate, toDate }) => {
    if (!menuEntry || !menuDateKey) return;
    // Guard: block today's actions after the cutoff
    if (lockTodayActions && scope === "today") return;

    applyOverrideForDates(scope, fromDate, toDate, (dayOv) => {
      const cancelled = new Set(dayOv.cancelled || []);
      const sourceId = entryId(menuEntry);
      cancelled.add(sourceId);
      return { ...dayOv, cancelled };
    });

    setCancelOpen(false);
    setMenuAnchor(null);
    setMenuEntry(null);
    setMenuDateKey(null);
  };

  const handleRescheduleConfirm = ({
    scope,
    fromDate,
    toDate,
    startTime,
    endTime,
  }) => {
    if (!menuEntry || !menuDateKey) return;
    // Guard: block today's actions after the cutoff
    if (lockTodayActions && scope === "today") return;

    const sourceId = entryId(menuEntry);

    applyOverrideForDates(scope, fromDate, toDate, (dayOv) => ({
      ...dayOv,
      rescheduled: {
        ...(dayOv.rescheduled || {}),
        [sourceId]: { startTime, endTime },
      },
    }));

    setRescheduleOpen(false);
    setMenuAnchor(null);
    setMenuEntry(null);
    setMenuDateKey(null);
  };

  const handleAddConfirm = async ({
    classType,
    scope,
    fromDate,
    toDate,
    subject,
    faculty,
    room,
    startTime,
    endTime,
  }) => {
    if (!activeDate) return;

    if (classType === "regular") {
      if (!currentTimetable) return;

      const entries = [
        ...currentTimetable.entries,
        {
          id: `added-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          day: dayjs(activeDate).format("dddd"),
          subject,
          faculty,
          room,
          startTime,
          endTime,
        },
      ];

      try {
        const response = await api.post("/timetable/save", {
          title: currentTimetable.title,
          semester: currentTimetable.semester,
          entries,
        });
        setLoadedTimetable(
          response.data.timetable || { ...currentTimetable, entries },
        );
        setAddOpen(false);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Failed to save regular class.",
        );
      }
      return;
    }

    try {
      const response = await api.post("/schedule-overrides", {
        subject,
        day: "",
        isAdditional: true,
        dateFrom: fromDate,
        dateTo: scope === "today" ? fromDate : toDate,
        newStartTime: startTime,
        newEndTime: endTime,
        newFaculty: faculty,
        newRoom: room,
        type: "custom",
        createdBy: "user",
      });

      setPersistentExtras((extras) => [...extras, response.data.override]);
      setAddOpen(false);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to save extra class.",
      );
    }
  };

  /* ------- Loading / Error / Empty states ------- */
  if (loading) {
    return (
      <Box sx={pageSx}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={pageSx}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!currentTimetable?.entries?.length && !persistentExtras.length) {
    return (
      <Box sx={pageSx}>
        <EmptyState
          icon={<CalendarMonth fontSize="large" />}
          title="No timetable available"
          subtitle="Upload and confirm your timetable to see upcoming classes."
        />
      </Box>
    );
  }

  if (!datesWithClassesOrHolidays.length) {
    return (
      <Box sx={pageSx}>
        <EmptyState
          icon={<EventNote fontSize="large" />}
          title="No upcoming classes"
          subtitle="There are no classes scheduled for the upcoming days."
        />
      </Box>
    );
  }

  /* ------- Main render ------- */
  return (
    <Box sx={pageSx}>
      {/*
        Header — hidden on mobile.
        Desktop only.
      */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "primary.contrastText",
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.22)}`,
          }}
        >
          <CalendarMonth sx={{ fontSize: 22 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              fontSize: { sm: "1.4rem" },
            }}
          >
            Upcoming Classes
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 0.3,
              lineHeight: 1.4,
              fontSize: { sm: "0.8rem" },
            }}
          >
            Your schedule for the days ahead
          </Typography>
        </Box>
      </Box>

      {/* Date strip */}
      <Stack
        direction="row"
        spacing={{ xs: 0, sm: 1.5 }}
        sx={{
          mb: { xs: 2, sm: 3 },
          mt: { xs: 0, sm: 2 },
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: { xs: 1, sm: 1.5 },
        }}
      >
        {/*
          Left nav arrow — hidden on mobile (swipe instead).
        */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <NavArrow
            direction="left"
            disabled={!canScrollLeft}
            onClick={() => scrollByAmount("left")}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              width: { xs: 16, sm: 28 },
              pointerEvents: "none",
              zIndex: 1,
              transition: "opacity 0.25s ease",
            },
            "&::before": {
              left: 0,
              background: `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
              opacity: canScrollLeft ? 1 : 0,
            },
            "&::after": {
              right: 0,
              background: `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
              opacity: canScrollRight ? 1 : 0,
            },
          }}
        >
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              gap: { xs: 0.75, sm: 1.25 },
              overflowX: "auto",
              scrollBehavior: "smooth",
              py: { xs: 0.5, sm: 0.75 },
              px: 0,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
              WebkitOverflowScrolling: "touch",
            }}
          >
            {datesWithClassesOrHolidays.map((date) => {
              const dateKey = date.format("YYYY-MM-DD");
              const isActive = dateKey === activeDate;
              const isHoliday = Boolean(holidaysByDate[dateKey]);

              return (
                <Box
                  key={dateKey}
                  data-date={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  sx={{
                    flex: "0 0 auto",
                    minWidth: { xs: 60, sm: 78 },
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 0.75, sm: 1.25 },
                    borderRadius: { xs: 1, sm: 1.5 },
                    cursor: "pointer",
                    textAlign: "center",
                    userSelect: "none",
                    border: "1px solid",
                    borderColor: isActive
                      ? "primary.main"
                      : isHoliday
                        ? "success.main"
                        : "divider",
                    bgcolor: isActive
                      ? "#1676e3"
                      : isHoliday
                        ? alpha(theme.palette.success.main, 0.08)
                        : "background.paper",
                    color: isActive
                      ? "white"
                      : isHoliday
                        ? "success.dark"
                        : "text.primary",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      color: isActive
                        ? "black"
                        : isHoliday
                          ? "success.dark"
                          : "text.primary",
                      borderColor: "primary.main",
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      opacity: 0.8,
                      fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    }}
                  >
                    {date.format("ddd")}
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{
                      my: 0.25,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      lineHeight: 1.1,
                    }}
                  >
                    {date.format("DD")}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                    }}
                  >
                    {date.format("MMM")}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/*
          Right nav arrow — hidden on mobile.
        */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
          <NavArrow
            direction="right"
            disabled={!canScrollRight}
            onClick={() => scrollByAmount("right")}
          />
        </Box>
      </Stack>

      <Stack
        direction="row"
        mb={2}
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        {/* Left: Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: { xs: "1rem", sm: "1rem" },
            color: "text.primary",
            fontWeight: 700,
          }}
        >
          Today's Classes
        </Typography>

        <Chip
          size="small"
          variant="outlined"
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 0.6,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "1.1rem" },
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {selectedClasses.length}
              </Typography>

              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Classes
              </Typography>
            </Box>
          }
          sx={{
            height: "auto",
            px: { xs: 1.2, sm: 1.5 },
            py: { xs: 0.4, sm: 0.7 },
            borderRadius: 2,
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
            "& .MuiChip-label": {
              px: 0,
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      </Stack>

      {/* Body */}
      {activeHoliday ? (
        <HolidayPanel holiday={activeHoliday} date={activeDate} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1.25, sm: 2 },
            alignItems: "stretch",
          }}
        >
          {selectedClasses.map((entry, index) => (
            <UpcomingClassCard
              key={`${activeDate}-${entry.id || index}`}
              entry={entry}
              disableActions={lockTodayActions}
              onMenuOpen={(e) => {
                setMenuAnchor(e.currentTarget);
                setMenuEntry(entry);
                setMenuDateKey(activeDate);
              }}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 8px)",
                  md: "1 1 calc(33.333% - 11px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                  md: "calc(33.333% - 11px)",
                },
                minWidth: 0,
              }}
            />
          ))}

          <AddClassCard
            onClick={() => setAddOpen(true)}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 8px)",
                md: "1 1 calc(33.333% - 11px)",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 8px)",
                md: "calc(33.333% - 11px)",
              },
              minWidth: 0,
            }}
          />
        </Box>
      )}

      {/* 3-dot menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setMenuEntry(null);
          setMenuDateKey(null);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1.5,
              minWidth: 200,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setEditOpen(true);
            setMenuAnchor(null);
          }}
          sx={{ py: 1.1 }}
        >
          <ListItemIcon>
            <EditRounded
              fontSize="small"
              sx={{ color: theme.palette.info.main }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Edit class"
            slotProps={{
              primary: { sx: { fontSize: "0.88rem", fontWeight: 600 } },
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setCancelOpen(true);
            setMenuAnchor(null);
          }}
          sx={{ py: 1.1 }}
        >
          <ListItemIcon>
            <EventBusy
              fontSize="small"
              sx={{ color: theme.palette.error.main }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Cancel class"
            slotProps={{
              primary: { sx: { fontSize: "0.88rem", fontWeight: 600 } },
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setRescheduleOpen(true);
            setMenuAnchor(null);
          }}
          sx={{ py: 1.1 }}
        >
          <ListItemIcon>
            <ScheduleIcon
              fontSize="small"
              sx={{ color: theme.palette.primary.main }}
            />
          </ListItemIcon>
          <ListItemText
            primary="Reschedule class"
            slotProps={{
              primary: { sx: { fontSize: "0.88rem", fontWeight: 600 } },
            }}
          />
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <CancelDialog
        open={cancelOpen}
        onClose={() => {
          setCancelOpen(false);
          setMenuEntry(null);
          setMenuDateKey(null);
        }}
        onConfirm={handleCancelConfirm}
        entry={menuEntry}
        dateKey={menuDateKey}
      />
      <RescheduleDialog
        open={rescheduleOpen}
        onClose={() => {
          setRescheduleOpen(false);
          setMenuEntry(null);
          setMenuDateKey(null);
        }}
        onConfirm={handleRescheduleConfirm}
        entry={menuEntry}
        dateKey={menuDateKey}
      />
      <AddClassDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={handleAddConfirm}
        dateKey={activeDate}
      />

      <EditClassDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setMenuEntry(null);
          setMenuDateKey(null);
        }}
        entry={menuEntry}
        onSaved={(updatedTimetable) => {
          setLoadedTimetable(updatedTimetable);
          setEditOpen(false);
          setMenuAnchor(null);
          setMenuEntry(null);
          setMenuDateKey(null);
        }}
      />
    </Box>
  );
};

/* ---------------------------------------------------------
 * Class card
 * --------------------------------------------------------- */
const UpcomingClassCard = ({ entry, sx, onMenuOpen, disableActions }) => {
  const theme = useTheme();
  const accent = entry.__cancelled
    ? theme.palette.error.main
    : entry.__added
      ? theme.palette.success.main
      : entry.__rescheduled
        ? theme.palette.warning.main
        : theme.palette.primary.main;

  const hasStatus = entry.__cancelled || entry.__added || entry.__rescheduled;

  const statusLabel = entry.__cancelled
    ? "Cancelled"
    : entry.__added
      ? "Added"
      : "Rescheduled";

  const showMenuButton = !entry.__cancelled && !disableActions;
  const showLockIcon = !entry.__cancelled && disableActions;

  return (
    <Card
      elevation={0}
      sx={{
        ...sx,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
        transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: alpha(accent, 0.4),
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${accent} 0%, ${alpha(
            accent,
            0.55,
          )} 100%)`,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            accent,
            0.08,
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <CardContent
        sx={{
          pl: { xs: 2.25, sm: 3 },
          pr: { xs: 2, sm: 2.5 },
          py: { xs: 1.75, sm: 2.25 },
          position: "relative",
          "&:last-child": { pb: { xs: 1.75, sm: 2.25 } },
        }}
      >
        {/* Header row: subject + time chip */}
        <Stack direction="row" spacing={1.5} sx={{ minHeight: 30 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
              color: "text.primary",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              pr: { xs: 9, sm: 12 },
            }}
          >
            {entry.subject}
          </Typography>

          <Box
            sx={{
              position: "absolute",
              top: { xs: 14, sm: 18 },
              right: { xs: 10, sm: 12 },
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: { xs: 0.85, sm: 1.1 },
              py: { xs: 0.3, sm: 0.4 },
              borderRadius: 1.5,
              bgcolor: alpha(accent, 0.08),
              border: "1px solid",
              borderColor: alpha(accent, 0.15),
              flexShrink: 0,
            }}
          >
            <AccessTime sx={{ fontSize: { xs: 11, sm: 13 }, color: accent }} />
            <Typography
              sx={{
                fontSize: { xs: "0.68rem", sm: "0.75rem" },
                fontWeight: 600,
                color: accent,
                letterSpacing: "-0.005em",
                whiteSpace: "nowrap",
              }}
            >
              {entry.startTime} – {entry.endTime}
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={{ xs: 0.75, sm: 1 }}>
          <UpcomingMetaRow
            icon={<PersonOutlinedIcon sx={{ fontSize: 15 }} />}
            value={entry.faculty || "Not provided"}
          />
          <UpcomingMetaRow
            icon={<MeetingRoomOutlinedIcon sx={{ fontSize: 15 }} />}
            value={entry.room || "Not provided"}
          />
        </Stack>

        {(hasStatus || showMenuButton || showLockIcon) && (
          <Stack direction="row" sx={{ mt: { xs: 1, sm: 1.2 }, minHeight: 30 }}>
            {hasStatus ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1,
                  py: 0.3,
                  borderRadius: 999,
                  bgcolor: alpha(accent, 0.1),
                  color: accent,
                  fontSize: { xs: "0.62rem", sm: "0.68rem" },
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                }}
              >
                {statusLabel}
              </Box>
            ) : (
              <Box />
            )}

            {/* Locked — show lock icon */}
            {showLockIcon && (
              <Tooltip
                title="Classes cannot be cancelled or modified after today's schedule ends"
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    position: "absolute",
                    right: { xs: 8, sm: 12 },
                    bottom: { xs: 12, sm: 18 },
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1.5,
                    bgcolor: alpha(theme.palette.text.primary, 0.05),
                    color: "text.disabled",
                    cursor: "not-allowed",
                  }}
                >
                  <LockOutlinedIcon sx={{ fontSize: 17 }} />
                </Box>
              </Tooltip>
            )}

            {/* Active — show 3-dot menu */}
            {showMenuButton && (
              <IconButton
                size="small"
                onClick={onMenuOpen}
                aria-label="Class actions"
                sx={{
                  position: "absolute",
                  right: { xs: 8, sm: 12 },
                  bottom: { xs: 12, sm: 18 },
                  width: 30,
                  height: 30,
                  color: "text.secondary",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: alpha(theme.palette.text.primary, 0.06),
                    color: "text.primary",
                  },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

const UpcomingMetaRow = ({ icon, value }) => (
  <Stack
    direction="row"
    spacing={{ xs: 1, sm: 1.25 }}
    sx={{ minWidth: 0, alignItems: "center" }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: { xs: 22, sm: 26 },
        height: { xs: 22, sm: 26 },
        borderRadius: 1.25,
        bgcolor: "grey.100",
        color: "text.secondary",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontSize: { xs: "0.78rem", sm: "0.85rem" },
        color: "text.primary",
        fontWeight: 500,
        lineHeight: 1.4,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: 0,
      }}
    >
      {value}
    </Typography>
  </Stack>
);

/* ---------------------------------------------------------
 * Add-Class card
 * --------------------------------------------------------- */
const AddClassCard = ({ onClick, sx }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        ...sx,
        borderRadius: 1.5,
        border: "1.5px dashed",
        borderColor: alpha(theme.palette.primary.main, 0.4),
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        minHeight: { xs: 130, sm: 130 },
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          transform: "translateY(-2px)",
          boxShadow: `0 8px 22px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
        "&:active": {
          transform: "translateY(0)",
        },
      }}
    >
      <Stack spacing={0.75} sx={{ alignItems: "center", textAlign: "center" }}>
        <Box
          sx={{
            width: { xs: 36, sm: 44 },
            height: { xs: 36, sm: 44 },
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <AddIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </Box>
        <Typography
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.85rem" },
            fontWeight: 700,
            color: theme.palette.primary.main,
            letterSpacing: "-0.01em",
          }}
        >
          Add a class
        </Typography>
      </Stack>
    </Card>
  );
};

export default UpcomingClasses;
