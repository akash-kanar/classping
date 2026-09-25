import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";

import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

import heroImage from "../../../assets/hero.png";

const WelcomeCard = () => {
  const { user } = useAuth();
  const { mode } = useTheme();

  const muiTheme = useMuiTheme();
  const isSmall = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const firstName = user?.name?.split(" ")[0] || "Student";

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isLight = mode === "light";

  // Real-time clock
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num) => String(num).padStart(2, "0");

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  /* "Good Morning / Afternoon / Evening" — matches the reference card */
  const greeting = (() => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  /* ===================== MOBILE VERSION ===================== */
  if (isSmall) {
    return (
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2, sm: 2.75 },
          mb: 1,
          borderRadius: 1,
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "light"
              ? {
                  xs: "rgba(99,102,241,0.06)",
                  sm: "rgba(99,102,241,0.08)",
                  md: "rgba(99,102,241,0.15)",
                }
              : {
                  xs: "rgba(255,255,255,0.02)",
                  sm: "rgba(255,255,255,0.03)",
                  md: "rgba(255,255,255,0.06)",
                },

          background: isLight
            ? "linear-gradient(135deg, #eef2ff 0%, #f7f9ff 55%, #eef4ff 100%)"
            : "linear-gradient(135deg, #202536 0%, #171a24 60%, #141720 100%)",

          boxShadow: isLight
            ? "0 12px 36px rgba(31, 65, 114, 0.10)"
            : "0 12px 36px rgba(0, 0, 0, 0.30)",

          transition: "box-shadow 0.3s ease, transform 0.3s ease",

          "&:hover": {
            boxShadow: isLight
              ? "0 16px 44px rgba(31, 65, 114, 0.14)"
              : "0 16px 44px rgba(0, 0, 0, 0.35)",
          },
        }}
      >
        {/* ============ Decorative background layer ============ */}

        {/* Top-right indigo glow */}
        <Box
          sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            right: -70,
            top: -90,
            background: isLight
              ? "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(100,120,255,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Bottom-right violet glow */}
        <Box
          sx={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            right: 20,
            bottom: -80,
            background: isLight
              ? "radial-gradient(circle, rgba(124,77,255,0.16) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(124,77,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Subtle dot pattern (top-left) */}
        <Box
          sx={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 44,
            height: 44,
            opacity: isLight ? 0.25 : 0.15,
            backgroundImage: isLight
              ? "radial-gradient(circle, rgba(99,102,241,0.9) 1.2px, transparent 1.2px)"
              : "radial-gradient(circle, rgba(180,190,255,0.9) 1.2px, transparent 1.2px)",
            backgroundSize: "8px 8px",
            pointerEvents: "none",
          }}
        />

        {/* ============ Content ============ */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: { xs: "62%", sm: "58%" },
            minWidth: 0,
          }}
        >
          {/* Greeting */}
          <Typography
            sx={{
              fontSize: { xs: "0.82rem", sm: "0.9rem" },
              fontWeight: 600,
              color: "text.secondary",
              lineHeight: 1.3,
              letterSpacing: 0.2,
            }}
          >
            {greeting},
          </Typography>

          {/* Name + wave */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mt: 0.25,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.45rem", sm: "1.6rem" },
                fontWeight: 800,
                letterSpacing: "-0.5px",
                lineHeight: 1.15,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {firstName}
            </Typography>

            <WavingHandRoundedIcon
              sx={{
                color: "#f59e0b",
                fontSize: { xs: 22, sm: 24 },
                flexShrink: 0,
              }}
            />
          </Box>

          {/* Tagline */}
          <Typography
            color="text.secondary"
            sx={{
              fontSize: "0.8rem",
              lineHeight: 1.55,
              mt: 0.75,
              maxWidth: 240,
            }}
          >
            Stay on top of your classes and never miss an important update.
          </Typography>

          {/* Date chip */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              mt: 1.5,
              px: 1.1,
              py: 0.5,
              borderRadius: 999,
              bgcolor: isLight
                ? "rgba(99,102,241,0.10)"
                : "rgba(120,140,255,0.12)",
              border: "1px solid",
              borderColor: isLight
                ? "rgba(99,102,241,0.18)"
                : "rgba(120,140,255,0.20)",
            }}
          >
            <CalendarMonthRoundedIcon
              sx={{ fontSize: 15, color: "primary.main" }}
            />
            <Typography
              sx={{
                fontWeight: 700,
                color: isLight ? "primary.main" : "#c7d2fe",
                fontSize: "0.76rem",
                letterSpacing: 0.2,
                whiteSpace: "nowrap",
              }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        {/* ============ Illustration ============ */}
        <Box
          component="img"
          src={heroImage}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          sx={{
            position: "absolute",
            right: { xs: -4, sm: 6 },
            bottom: 0,
            height: "106%",
            maxHeight: { xs: 150, sm: 170 },
            width: "auto",
            zIndex: 1,
            pointerEvents: "none",
            filter: isLight
              ? "drop-shadow(0 8px 20px rgba(99,102,241,0.18))"
              : "drop-shadow(0 8px 20px rgba(0,0,0,0.45))",
          }}
        />
      </Paper>
    );
  }

  /* ===================== DESKTOP / TABLET VERSION ===================== */
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: {
          xs: 2.5,
          sm: 3,
          md: 3.5,
        },
        mb: 1.5,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",

        background: isLight
          ? "linear-gradient(135deg, #eef4ff 0%, #f8fbff 55%, #eef2ff 100%)"
          : "linear-gradient(135deg, #202536 0%, #171a24 60%, #141720 100%)",

        boxShadow: isLight
          ? "0 10px 35px rgba(31, 65, 114, 0.08)"
          : "0 10px 35px rgba(0, 0, 0, 0.25)",
      }}
    >
      {/* Decorative background */}
      <Box
        sx={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          right: -80,
          top: -110,
          background: isLight
            ? "rgba(66, 133, 244, 0.08)"
            : "rgba(100, 120, 255, 0.08)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 140,
          height: 140,
          borderRadius: "50%",
          right: 100,
          bottom: -100,
          background: isLight
            ? "rgba(124, 77, 255, 0.05)"
            : "rgba(124, 77, 255, 0.06)",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          justifyContent: "space-between",
          gap: 3,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        {/* Left */}
        <Box sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              mb: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontSize: {
                  xs: "1.4rem",
                  sm: "2rem",
                },
              }}
            >
              Welcome back, {firstName}
            </Typography>

            <WavingHandRoundedIcon
              sx={{
                color: "#f59e0b",
                fontSize: {
                  xs: 22,
                  sm: 30,
                },
              }}
            />
          </Box>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
              },
              maxWidth: 620,
              lineHeight: 1.7,
            }}
          >
            Stay organized, keep track of your classes, and make every day
            count.
          </Typography>

          {/* Date */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <CalendarMonthRoundedIcon
              sx={{
                fontSize: 19,
                color: "primary.main",
              }}
            />

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
              }}
            >
              {formattedDate}
            </Typography>
          </Box>
        </Box>

        {/* Right - Real-time Digital Clock (large screens only) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
            py: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: isLight
              ? "rgba(66, 133, 244, 0.15)"
              : "rgba(100, 120, 255, 0.15)",
            background: isLight
              ? "rgba(255, 255, 255, 0.6)"
              : "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(8px)",
            minWidth: 180,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 0.4,
            }}
          >
            {[hours, minutes, seconds].map((unit, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Roboto Mono', 'Courier New', monospace",
                    fontWeight: 700,
                    fontSize: "1.75rem",
                    letterSpacing: "1px",
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  {unit}
                </Typography>
                {index < 2 && (
                  <Typography
                    sx={{
                      fontFamily: "'Roboto Mono', 'Courier New', monospace",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "primary.main",
                      mx: 0.3,
                      lineHeight: 1,
                      animation: "blink 1s step-start infinite",
                      "@keyframes blink": {
                        "50%": { opacity: 0.3 },
                      },
                    }}
                  >
                    :
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default WelcomeCard;
