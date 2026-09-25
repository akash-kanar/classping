import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  ButtonBase,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { AutoAwesome, CalendarMonth } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

import folderImage from "../../assets/storage.png";

import api from "../../services/api";

/* ----------------------------- Motifs ----------------------------- */

const TimetableMotif = ({ accent }) => (
  <Box
    sx={{
      width: 78,
      height: 78,
      borderRadius: 1,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: "5px",
      p: "17px 15px 14px",
      background: `linear-gradient(
        145deg,
        ${alpha(accent, 0.06)} 0%,
        ${alpha(accent, 0.13)} 100%
      )`,
      border: "1px solid",
      borderColor: alpha(accent, 0.12),
    }}
  >
    {/* Decorative grid */}
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        opacity: 0.35,
        backgroundImage: `
          linear-gradient(${alpha(accent, 0.1)} 1px, transparent 1px),
          linear-gradient(90deg, ${alpha(accent, 0.1)} 1px, transparent 1px)
        `,
        backgroundSize: "16px 16px",
      }}
    />

    {[0.55, 0.85, 0.4, 1, 0.65].map((h, i) => (
      <Box
        key={i}
        sx={{
          position: "relative",
          zIndex: 1,
          width: 6,
          height: `${h * 100}%`,
          minHeight: 12,
          borderRadius: "4px 4px 2px 2px",
          bgcolor: accent,
          opacity: i === 3 ? 1 : 0.3,
        }}
      />
    ))}
  </Box>
);

const HolidayMotif = ({ accent }) => (
  <Box
    sx={{
      width: 78,
      height: 78,
      borderRadius: 1,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `linear-gradient(
        145deg,
        ${alpha(accent, 0.06)} 0%,
        ${alpha(accent, 0.13)} 100%
      )`,
      border: "1px solid",
      borderColor: alpha(accent, 0.12),
    }}
  >
    <CalendarMonth
      sx={{
        fontSize: 39,
        color: accent,
        opacity: 0.85,
      }}
    />
  </Box>
);

/* ----------------------------- Card ----------------------------- */

const StorageCard = ({ title, description, meta, accent, motif, onClick }) => {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "left",
        borderRadius: 1,
        display: "block",
        transition: "transform 0.25s ease",

        "&:hover": {
          transform: "translateY(-2px)",
        },

        "&:focus-visible": {
          outline: `3px solid ${alpha(accent, 0.25)}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: 200, sm: 130 },
          p: { xs: 3, sm: 3.5 },
          borderRadius: 1,
          overflow: "hidden",

          bgcolor: "background.paper",

          border: "1px solid",
          borderColor: "divider",

          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.035)}`,

          transition: "border-color 0.25s ease, box-shadow 0.25s ease",

          "&:hover": {
            borderColor: alpha(accent, 0.3),
            boxShadow: `0 20px 45px -25px ${alpha(accent, 0.4)}`,
          },

          /* Accent glow */
          "&::after": {
            content: '""',
            position: "absolute",
            width: 180,
            height: 180,
            right: -80,
            bottom: -90,
            borderRadius: "50%",
            bgcolor: alpha(accent, 0.035),
            pointerEvents: "none",
          },
        }}
      >
        <Stack
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top section with text on left and motif on right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: 1, pr: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  letterSpacing: "-0.025em",
                  fontSize: {
                    xs: "1.3rem",
                    sm: "1.45rem",
                  },
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  lineHeight: 1.65,
                  maxWidth: 390,
                  fontSize: {
                    xs: "0.88rem",
                    sm: "0.94rem",
                  },
                }}
              >
                {description}
              </Typography>
            </Box>
            {motif}
          </Box>

          {/* Bottom action */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: 3,
              color: accent,
              width: "fit-content",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {meta}
            </Typography>

            <ArrowForwardIcon
              sx={{
                fontSize: 16,
                display: "block",
                flexShrink: 0,
                transition: "transform 0.2s ease",
                ".MuiButtonBase-root:hover &": {
                  transform: "translateX(4px)",
                },
              }}
            />
          </Stack>
        </Stack>
      </Box>
    </ButtonBase>
  );
};

/* ========================================= */
/* MOBILE — feature card matching the photo   */
/* ========================================= */
const MobileStorageCard = ({
  title,
  description,
  accent,
  accentSoft,
  icon,
  stats,
  buttonLabel,
  onClick,
}) => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 1,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      mb: 2,
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        borderColor: alpha(accent, 0.28),
        boxShadow: `0 12px 28px ${alpha(accent, 0.1)}`,
      },
    }}
  >
    {/* ============ Colored top strip ============ */}
    <Box
      sx={{
        height: 4,
        background: `linear-gradient(90deg, ${accent} 0%, ${alpha(
          accent,
          0.5,
        )} 100%)`,
      }}
    />

    <Box sx={{ p: 2 }}>
      {/* ============ Header: icon + title + chevron ============ */}
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box
          sx={{
            width: 55,
            height: 55,
            flexShrink: 0,
            borderRadius: 1,
            bgcolor: accentSoft,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: "0.8rem",
              color: "text.secondary",
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Stack>

      {/* ============ Stats: full-width info strip ============ */}
      {stats && stats.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "stretch",
            borderRadius: 1,
            bgcolor: alpha(accent, 0.04),
            border: "1px solid",
            borderColor: alpha(accent, 0.12),
            overflow: "hidden",
          }}
        >
          {stats.map((s) => (
            <Box
              key={s.label}
              sx={{
                flex: 1,
                minWidth: 0,
                px: 1.25,
                py: 1.1,
                display: "flex",
                alignItems: "center",
                gap: 1,
                position: "relative",
                "&:not(:last-of-type)::after": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: "20%",
                  bottom: "20%",
                  width: "1px",
                  bgcolor: alpha(accent, 0.15),
                },
              }}
            >
              {/* Icon on the left */}
              {s.icon && (
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,
                    borderRadius: 0.5,
                    bgcolor: alpha(accent, 0.12),
                    color: accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.icon}
                </Box>
              )}

              {/* Two-line block: label on top, value below */}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: alpha(accent, 0.85),
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    lineHeight: 1.15,
                  }}
                >
                  {s.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ============ CTA ============ */}
      <ButtonBase
        onClick={onClick}
        sx={{
          mt: 1.75,
          width: "100%",
          py: 1.35,
          borderRadius: 1.5,
          background: `linear-gradient(135deg, ${accent} 0%, ${alpha(
            accent,
            0.82,
          )} 100%)`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          fontWeight: 700,
          fontSize: "0.9rem",
          boxShadow: `0 8px 20px ${alpha(accent, 0.28)}`,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            boxShadow: `0 10px 24px ${alpha(accent, 0.4)}`,
            transform: "translateY(-1px)",
          },
          "&:active": { transform: "translateY(0) scale(0.98)" },
        }}
      >
        {buttonLabel}
        <ArrowForwardIcon sx={{ fontSize: 17 }} />
      </ButtonBase>
    </Box>
  </Box>
);

/* Small tilted "timetable" mockup, decorative only */
const TimetableMockup = () => (
  <Box
    sx={{
      position: "absolute",
      right: 4,
      top: 10,
      width: 96,
      height: 96,
      borderRadius: 2,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
      transform: "rotate(4deg)",
      p: 1,
    }}
  >
    <Box
      sx={{
        width: "70%",
        height: 4,
        borderRadius: 2,
        bgcolor: alpha("#94a3b8", 0.35),
        mb: 1,
      }}
    />
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.4 }}
    >
      {["#6366f1", "#3b82f6", "#f59e0b", "#a5b4fc", "#93c5fd", "#10b981"].map(
        (c, i) => (
          <Box
            key={i}
            sx={{ height: 14, borderRadius: 0.5, bgcolor: alpha(c, 0.55) }}
          />
        ),
      )}
    </Box>
  </Box>
);

/* Small tilted "holiday calendar" mockup, decorative only */
const HolidayMockup = () => (
  <Box
    sx={{
      position: "absolute",
      right: 4,
      top: 10,
      width: 92,
      height: 96,
      borderRadius: 2,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
      overflow: "hidden",
      transform: "rotate(-3deg)",
    }}
  >
    <Box sx={{ height: 16, bgcolor: "#10b981" }} />
    <Box
      sx={{
        p: 0.9,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0.4,
      }}
    >
      {Array.from({ length: 9 }).map((_, i) =>
        i === 4 ? (
          <Box
            key={i}
            sx={{
              height: 12,
              borderRadius: 0.5,
              bgcolor: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StarRoundedIcon sx={{ fontSize: 9, color: "#fff" }} />
          </Box>
        ) : (
          <Box
            key={i}
            sx={{
              height: 12,
              borderRadius: 0.5,
              bgcolor: alpha("#94a3b8", 0.18),
            }}
          />
        ),
      )}
    </Box>
  </Box>
);

/* ----------------------------- Page ----------------------------- */

const Storage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [timetable, setTimetable] = useState(null);
  const [holiday, setHoliday] = useState(null);

  /*
   * Pull real counts where the API actually gives us something to work
   * with. There's no per-file metadata in these responses, so "Files"
   * falls back to "—" rather than a made-up number.
   */
  useEffect(() => {
    if (!isSmall) return;

    const fetchSummary = async () => {
      try {
        const [timetableRes, holidayRes] = await Promise.all([
          api.get("/timetable"),
          api.get("/holiday"),
        ]);
        setTimetable(timetableRes.data?.timetable || null);
        setHoliday(holidayRes.data?.holiday || null);
      } catch (error) {
        console.error("Failed to load storage summary:", error);
      }
    };

    fetchSummary();
  }, [isSmall]);

  /* ===================== MOBILE VERSION ===================== */
  if (isSmall) {
    const classesCount = timetable?.entries?.length ?? "—";
    const holidaysCount = holiday?.entries?.length ?? "—";
    const timetableUpdated = timetable?.updatedAt
      ? dayjs(timetable.updatedAt).format("DD MMM YYYY")
      : "—";
    const holidayUpdated = holiday?.updatedAt
      ? dayjs(holiday.updatedAt).format("DD MMM YYYY")
      : "—";

    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100%" }}>
        <Box sx={{ px: 0.5, pb: 0, py: 1 }}>
          {/* Hero */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 0.5,
              p: 2.25,
              mb: 2,
              minHeight: 100,
              background: `linear-gradient(135deg, ${alpha(
                "#818cf8",
                0.16,
              )} 0%, ${alpha("#c4b5fd", 0.14)} 60%, ${alpha("#93c5fd", 0.14)} 100%)`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Text content — left side */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: "58%",
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.2rem", sm: "1.35rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                All your academic files in one place
              </Typography>

              <Typography
                sx={{
                  mt: 0.75,
                  fontSize: "0.8rem",
                  color: "text.secondary",
                  lineHeight: 1.5,
                }}
              >
                Your timetables and holiday calendars, organized and easy to
                access.
              </Typography>
            </Box>

            {/* 3D folder illustration — right side */}
            <Box
              component="img"
              src={folderImage}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              sx={{
                position: "absolute",
                right: -10,
                top: "50%",
                transform: "translateY(-50%)",
                height: 150,
                width: "auto",
                maxWidth: 220,
                zIndex: 1,
                pointerEvents: "none",
                filter:
                  theme.palette.mode === "light"
                    ? "drop-shadow(0 8px 20px rgba(99,102,241,0.18))"
                    : "drop-shadow(0 8px 20px rgba(0,0,0,0.45))",
              }}
            />
          </Box>

          {/* Timetable card */}
          <MobileStorageCard
            title="Timetable"
            description="Your Weekly class schedule with timings and faculty."
            accent="#6D5EF0"
            accentSoft={alpha("#6D5EF0", 0.1)}
            icon={<BarChartRoundedIcon sx={{ fontSize: 30 }} />}
            stats={[
              {
                icon: <GroupsRoundedIcon sx={{ fontSize: 15 }} />,
                value: classesCount,
                label: "Classes",
              },
              {
                icon: <AccessTimeRoundedIcon sx={{ fontSize: 15 }} />,
                value: timetableUpdated,
                label: "Last updated",
              },
            ]}
            buttonLabel="View timetable"
            mockup={<TimetableMockup />}
            onClick={() => navigate("/dashboard/storage/timetable")}
          />

          {/* Holidays card */}
          <MobileStorageCard
            title="Holidays"
            description="Your college holiday calendar with dates, festivals, and important occasions."
            accent="#0F9D6B"
            accentSoft={alpha("#0F9D6B", 0.1)}
            icon={<EventAvailableRoundedIcon sx={{ fontSize: 30 }} />}
            stats={[
              {
                icon: <CalendarMonthRoundedIcon sx={{ fontSize: 15 }} />,
                value: holidaysCount,
                label: "Holidays",
              },
              {
                icon: <AccessTimeRoundedIcon sx={{ fontSize: 15 }} />,
                value: holidayUpdated,
                label: "Last updated",
              },
            ]}
            buttonLabel="View holidays"
            mockup={<HolidayMockup />}
            onClick={() => navigate("/dashboard/storage/holiday")}
          />
        </Box>
      </Box>
    );
  }

  /* ===================== DESKTOP / TABLET VERSION ===================== */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: {
          xs: 5,
          sm: 6,
          md: 8,
        },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box
          sx={{
            mb: 2,
            p: { xs: 2.5, sm: 3, md: 3.5 },
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: `0 4px 18px ${alpha(theme.palette.common.black, 0.035)}`,
          }}
        >
          <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }}>
            {/* Icon */}
            <Box
              sx={{
                width: { xs: 44, sm: 60 },
                height: { xs: 44, sm: 65 },
                borderRadius: { xs: 2.5, sm: 1 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                bgcolor: alpha(theme.palette.primary.main, 0.09),
                color: "primary.main",
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.12),
              }}
            >
              <AutoAwesome
                sx={{
                  fontSize: { xs: 21, sm: 24 },
                }}
              />
            </Box>

            {/* Text */}
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.15,
                  fontSize: {
                    xs: "1.45rem",
                    sm: "1.75rem",
                    md: "2rem",
                  },
                }}
              >
                Your storage
              </Typography>

              <Typography
                sx={{
                  mt: { xs: 0.5, sm: 0.75 },
                  color: "text.secondary",
                  fontSize: {
                    xs: "0.84rem",
                    sm: "0.92rem",
                    md: "0.96rem",
                  },
                  lineHeight: 1.5,
                  maxWidth: 560,
                }}
              >
                Your timetables and holiday calendars, organized in one place.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Storage Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          <StorageCard
            title="Timetable"
            description="Your weekly class schedule with timings, faculty, rooms, and other details."
            meta="View timetable"
            accent="#6D5EF0"
            motif={<TimetableMotif accent="#6D5EF0" />}
            onClick={() => navigate("/dashboard/storage/timetable")}
          />

          <StorageCard
            title="Holidays"
            description="Your college holiday calendar with dates, festivals, and important occasions."
            meta="View holidays"
            accent="#0F9D6B"
            motif={<HolidayMotif accent="#0F9D6B" />}
            onClick={() => navigate("/dashboard/storage/holiday")}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Storage;
