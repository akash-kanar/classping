import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";

import api from "../../services/api";

const PersonalInformation = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "admin";

  const getYearLabel = (year) => {
    if (!year) return "N/A";
    const suffix =
      year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";
    return `${year}${suffix} Year`;
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2 },
            mb: 2.5,
            p: { xs: 2, sm: 2.5 },
            borderRadius: 1,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.15),
          }}
        >
          <Avatar
            sx={{
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              fontSize: { xs: 22, sm: 26 },
              bgcolor: "primary.main",
              flexShrink: 0,
            }}
          >
            {user.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.05rem", sm: "1.2rem" },
                lineHeight: 1.2,
              }}
              noWrap
            >
              {user.name}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "0.78rem", sm: "0.85rem" }, color: "text.secondary", mt: 0.25 }}
              noWrap
            >
              {user.email}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.75,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: "primary.main",
                fontSize: "0.68rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              {isAdmin ? "Admin" : "Student"}
            </Box>
          </Box>
        </Box>

        {/* Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 1.5, fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
              Personal Information
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: { xs: 1.25, sm: 1.75 },
              }}
            >
              <InfoRow icon={<PersonIcon />} label="Full Name" value={user.name} />
              <InfoRow icon={<EmailIcon />} label="Email Address" value={user.email} />

              {!isAdmin && (
                <>
                  <InfoRow
                    icon={<PhoneIcon />}
                    label="Mobile Number"
                    value={user.mobile}
                  />
                  <InfoRow icon={<SchoolIcon />} label="Course" value={user.course} />
                  <InfoRow
                    icon={<AccountTreeIcon />}
                    label="Branch / Specialization"
                    value={user.branch}
                  />
                  <InfoRow
                    icon={<CalendarMonthIcon />}
                    label="Year of Study"
                    value={getYearLabel(user.yearOfStudy)}
                  />
                </>
              )}

              {isAdmin && (
                <InfoRow
                  icon={<BadgeIcon />}
                  label="Account Role"
                  value="Administrator"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <Stack
    direction="row"
    spacing={1.5}
    sx={{
      p: { xs: 1.25, sm: 1.5 },
      borderRadius: 1.5,
      bgcolor: "action.hover",
      minWidth: 0,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 1.5,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        sx={{ fontSize: "0.7rem", color: "text.secondary", lineHeight: 1.2 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.25,
          fontSize: { xs: "0.85rem", sm: "0.9rem" },
          fontWeight: 600,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {value || "Not provided"}
      </Typography>
    </Box>
  </Stack>
);

export default PersonalInformation;