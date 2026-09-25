import {
  Box,
  ButtonBase,
  Container,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  CalendarMonth,
  CloudUpload,
  EventAvailable,
} from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import uploadImage from "../../assets/upload.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const UploadCard = ({ title, description, accent, icon, onClick }) => {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "left",
        borderRadius: 2,
        display: "block",
        transition: "transform 0.25s ease",
        "&:hover": { transform: "translateY(-2px)" },
        "&:focus-visible": {
          outline: `3px solid ${alpha(accent, 0.25)}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        sx={{
          minHeight: { xs: 190, sm: 150 },
          p: { xs: 3, sm: 3.5 },
          borderRadius: 1,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.035)}`,
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            borderColor: alpha(accent, 0.3),
            boxShadow: `0 20px 45px -25px ${alpha(accent, 0.4)}`,
          },
        }}
      >
        <Stack direction="row" spacing={2}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.025em",
                fontSize: { xs: "1.3rem", sm: "1.45rem" },
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                color: "text.secondary",
                lineHeight: 1.65,
                fontSize: { xs: "0.88rem", sm: "0.94rem" },
              }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 58,
              height: 58,
              flexShrink: 0,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(accent, 0.08),
              color: accent,
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 3, color: accent, alignItems: "center" }}
        >
          <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>
            Upload now
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Stack>
      </Box>
    </ButtonBase>
  );
};

/* ========================================= */
/* MOBILE — feature card matching the photo   */
/* ========================================= */
const MobileUploadCard = ({
  title,
  description,
  accent,
  accentSoft,
  icon,
  bullets,
  buttonLabel,
  mockup,
  onClick,
}) => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 1.5,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
      p: 2,
      mb: 2,
      boxShadow: `0 2px 8px ${alpha("#000", 0.03)}`,
    }}
  >
    {/* ============ Top: icon + text + chevron ============ */}
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      {/* Icon tile */}
      <Box
        sx={{
          width: 60,
          height: 60,
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

      {/* Text block */}
      <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
        <Typography
          sx={{
            fontWeight: 700,
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

    {/* ============ Image slot (right side, reserved) ============ */}
    <Box
      sx={{
        position: "absolute",
        right: 8,
        top: 60,
        width: 120,
        height: 120,
        pointerEvents: "none",
      }}
    >
      {/* Soft organic blob behind the illustration */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50% 50% 55% 45% / 60% 55% 45% 40%",
          bgcolor: alpha(accent, 0.14),
          filter: "blur(0.5px)",
          transform: "rotate(-8deg) scale(1.05)",
          pointerEvents: "none",
        }}
      />
      {/* Illustration goes here */}
      {mockup}
    </Box>

    {/* ============ Bullets (constrained so they don't overlap the image) ============ */}
    <Stack
      spacing={1}
      sx={{ mt: 2, maxWidth: "62%", position: "relative", zIndex: 1 }}
    >
      {bullets.map((b) => (
        <Stack key={b} direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 18,
              height: 18,
              flexShrink: 0,
              borderRadius: "50%",
              bgcolor: accent,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 12 }} />
          </Box>
          <Typography
            sx={{
              fontSize: "0.76rem",
              color: "text.secondary",
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {b}
          </Typography>
        </Stack>
      ))}
    </Stack>

    {/* ============ Full-width gradient CTA ============ */}
    <ButtonBase
      onClick={onClick}
      sx={{
        mt: 2,
        width: "70%",
        py: 1.35,
        borderRadius: 1,
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
        boxShadow: `0 10px 22px ${alpha(accent, 0.32)}`,
        position: "relative",
        zIndex: 1,
        "&:active": { transform: "scale(0.98)" },
      }}
    >
      <CloudUploadRoundedIcon sx={{ fontSize: 19 }} />
      {buttonLabel}
      <ArrowForwardIcon sx={{ fontSize: 17 }} />
    </ButtonBase>
  </Box>
);

/* Small tilted "timetable" mockup card, decorative only */
const TimetableMockup = () => (
  <Box
    sx={{
      position: "absolute",
      right: 12,
      top: 14,

      width: 100,
      height: 95,
      borderRadius: 1,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
      transform: "rotate(10deg)",
      p: 1,
    }}
  >
    <Typography
      sx={{
        fontFamily: "'Caveat', 'Segoe Script', cursive",
        fontWeight: 700,
        fontSize: "0.72rem",
        color: "text.primary",
        transform: "rotate(-2deg)",
        mb: 0.5,
      }}
    >
      Class Timetable
    </Typography>
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.4 }}
    >
      {["#6366f1", "#3b82f6", "#10b981", "#a5b4fc", "#93c5fd", "#f59e0b"].map(
        (c, i) => (
          <Box
            key={i}
            sx={{ height: 12, borderRadius: 0.5, bgcolor: alpha(c, 0.55) }}
          />
        ),
      )}
    </Box>
  </Box>
);

/* Small tilted "holiday calendar" mockup card, decorative only */
const HolidayMockup = () => (
  <Box
    sx={{
      position: "absolute",
      right: 10,
      top: 12,
      width: 100,
      height: 95,
      borderRadius: 1,
      bgcolor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 10px 22px rgba(0,0,0,0.1)",
      overflow: "hidden",
      transform: "rotate(6deg)",
      p: 1,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Top accent stripe — evokes a calendar's spiral binding */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        bgcolor: "#10b981",
        borderTopLeftRadius: 1.5,
        borderTopRightRadius: 1.5,
      }}
    />

    {/* Binding rings */}
    <Box
      sx={{
        position: "absolute",
        top: 2,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        px: 1.2,
        pointerEvents: "none",
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: 6,
            borderRadius: 0.5,
            bgcolor: "background.paper",
          }}
        />
      ))}
    </Box>

    {/* Heading */}
    <Typography
      sx={{
        mt: 0.75,
        fontFamily: "'Caveat', 'Segoe Script', cursive",
        fontWeight: 700,
        fontSize: "0.72rem",
        color: "text.primary",
        transform: "rotate(-2deg)",
        mb: 0.5,
        lineHeight: 1.1,
      }}
    >
      Holiday List
    </Typography>

    {/* Calendar grid */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0.4,
        mt: 0.25,
      }}
    >
      {Array.from({ length: 9 }).map((_, i) =>
        i === 4 ? (
          // Highlighted holiday — red tile with a star
          <Box
            key={i}
            sx={{
              height: 14,
              borderRadius: 0.5,
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(239,68,68,0.35)",
            }}
          >
            <StarRoundedIcon sx={{ fontSize: 10, color: "#fff" }} />
          </Box>
        ) : i === 7 ? (
          // A second, softer "special day" marker
          <Box
            key={i}
            sx={{
              height: 14,
              borderRadius: 0.5,
              bgcolor: alpha("#10b981", 0.7),
            }}
          />
        ) : (
          <Box
            key={i}
            sx={{
              height: 14,
              borderRadius: 0.5,
              bgcolor: alpha("#94a3b8", 0.16),
            }}
          />
        ),
      )}
    </Box>
  </Box>
);

const Upload = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  /* ===================== MOBILE VERSION ===================== */
  if (isSmall) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100%" }}>
        <Box sx={{ px: 1, pb: 2, py: 1.5 }}>
          {/* Hero */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 1,
              p: 2.25,
              mb: 2,
              background: `linear-gradient(135deg, ${alpha("#818cf8", 0.16)} 0%, ${alpha(
                "#c4b5fd",
                0.14,
              )} 60%, ${alpha("#93c5fd", 0.14)} 100%)`,
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1, maxWidth: "55%" }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Upload
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  lineHeight: 1.5,
                }}
              >
                Choose what you want to add to ClassPing.
              </Typography>
            </Box>

            {/* Decorative cloud-upload illustration */}
            <Box
              component="img"
              src={uploadImage}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              sx={{
                position: "absolute",
                right: { xs: -4, sm: 6 },
                bottom: 0,
                height: "106%",
                maxHeight: { xs: 110, sm: 170 },
                width: "auto",
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
          <MobileUploadCard
            title="Timetable"
            description="Upload your weekly class schedule with timings, faculty, and rooms."
            accent="#6D5EF0"
            accentSoft={alpha("#6D5EF0", 0.1)}
            icon={<CalendarMonth sx={{ fontSize: 34 }} />}
            bullets={[
              "Supports PDF, Excel or Image",
              "Auto-extracts class details",
              "Helps you get notified on time",
            ]}
            buttonLabel="Upload Timetable"
            mockup={<TimetableMockup />}
            onClick={() => navigate("/dashboard/timetable/upload")}
          />

          {/* Holiday calendar card */}
          <MobileUploadCard
            title="Holiday calendar"
            description="Upload your college holiday calendar and important occasions."
            accent="#0F9D6B"
            accentSoft={alpha("#0F9D6B", 0.1)}
            icon={<EventAvailable sx={{ fontSize: 34 }} />}
            bullets={[
              "Supports PDF, Excel or Image",
              "Auto-extracts holiday dates",
              "Helps in better planning",
            ]}
            buttonLabel="Upload Holiday Calendar"
            mockup={<HolidayMockup />}
            onClick={() => navigate("/dashboard/holiday/upload")}
          />
        </Box>
      </Box>
    );
  }

  /* ===================== DESKTOP / TABLET VERSION ===================== */
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", sm: "100vh", md: "100vh" },
        bgcolor: "background.default",
        py: { xs: 2, sm: 2, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            mb: 2,
            p: { xs: 2.5, sm: 3, md: 3.5 },
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: `0 4px 18px ${alpha(theme.palette.common.black, 0.035)}`,
            display: { xs: "flex", sm: "flex" },
          }}
        >
          <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }}>
            <Box
              sx={{
                width: { xs: 44, sm: 60 },
                height: { xs: 44, sm: 65 },
                borderRadius: { xs: 2.5, sm: 3 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                bgcolor: alpha(theme.palette.primary.main, 0.09),
                color: "primary.main",
              }}
            >
              <CloudUpload sx={{ fontSize: { xs: 24, sm: 30 } }} />
            </Box>
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.15,
                  fontSize: { xs: "1.45rem", sm: "1.75rem", md: "2rem" },
                }}
              >
                Upload
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  color: "text.secondary",
                  fontSize: { xs: "0.84rem", sm: "0.92rem" },
                }}
              >
                Choose what you want to add to ClassPing.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          <UploadCard
            title="Timetable"
            description="Upload your weekly class schedule with timings, faculty, and rooms."
            accent="#6D5EF0"
            icon={<CalendarMonth sx={{ fontSize: 32 }} />}
            onClick={() => navigate("/dashboard/timetable/upload")}
          />
          <UploadCard
            title="Holiday calendar"
            description="Upload your college holiday calendar and important occasions."
            accent="#0F9D6B"
            icon={<EventAvailable sx={{ fontSize: 32 }} />}
            onClick={() => navigate("/dashboard/holiday/upload")}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Upload;
