import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Button,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VerifiedIcon from "@mui/icons-material/Verified";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");

        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to load profile:", error);

        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  /*
   * Avatar photo picker — this only previews the image locally.
   * There's no upload endpoint wired up yet, so nothing is persisted.
   * Hook this up to your actual upload API when it exists.
   */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
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
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin";

  const getYearLabel = (year) => {
    if (!year) return "N/A";

    const suffix =
      year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th";

    return `${year}${suffix} Year`;
  };

  /* ===================== MOBILE VERSION ===================== */
  if (isSmall) {
    const menuItems = [
      {
        title: "Personal Information",
        subtitle: "View and update your details",
        icon: PersonOutlineRoundedIcon,
        path: "/dashboard/profile/personal-information",
      },
      {
        title: "App Settings",
        subtitle: "Theme, language, notifications and app preferences",
        icon: SettingsRoundedIcon,
        path: "/dashboard/settings",
        divideAfter: true,
      },
      {
        title: "Help & Support",
        subtitle: "FAQs, contact support, report an issue",
        icon: HelpOutlineRoundedIcon,
        path: "/dashboard/help",
      },
      {
        title: "Privacy & Security",
        subtitle: "Manage your data and security",
        icon: ShieldRoundedIcon,
        path: "/dashboard/privacy",
        divideAfter: true,
      },
      {
        title: "About ClassPing",
        subtitle: "Version 0.0.1",
        icon: InfoRoundedIcon,
        path: "/dashboard/about",
      },
    ];

    /*
     * Stats have no backing API yet (no classesAttended / attendance /
     * subjects fields on the user object). Falling back to "—" rather
     * than inventing numbers — wire these up to real endpoints when
     * available.
     */

    return (
      <Box sx={{ px: 0.5, py: 2, pb: 3 }}>
        {/* Hero card */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
            p: 2.25,
            mb: 2,
            background: (theme) =>
              theme.palette.mode === "light"
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.12,
                  )} 0%, ${alpha(theme.palette.primary.main, 0.03)} 60%, ${alpha(
                    "#8b5cf6",
                    0.08,
                  )} 100%)`
                : `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.18,
                  )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 60%, ${alpha(
                    "#8b5cf6",
                    0.12,
                  )} 100%)`,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.15),
            boxShadow: (theme) =>
              theme.palette.mode === "light"
                ? `0 10px 28px -10px ${alpha(theme.palette.primary.main, 0.25)}`
                : `0 10px 28px -10px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Top-right blob */}
          <Box
            sx={{
              position: "absolute",
              width: 140,
              height: 140,
              borderRadius: "42% 58% 55% 45% / 50% 45% 55% 50%",
              right: -40,
              top: -50,
              background: alpha(theme.palette.primary.main, 0.1),
              pointerEvents: "none",
            }}
          />

          {/* Bottom-right emerald accent */}
          <Box
            sx={{
              position: "absolute",
              width: 90,
              height: 90,
              borderRadius: "50%",
              right: 15,
              bottom: -40,
              background: alpha("#10b981", 0.1),
              pointerEvents: "none",
            }}
          />

          {/* Subtle dot pattern (top-left) */}
          <Box
            sx={{
              position: "absolute",
              left: 12,
              top: 12,
              width: 40,
              height: 40,
              opacity: 0.15,
              backgroundImage: `radial-gradient(circle, ${alpha(
                theme.palette.primary.main,
                0.9,
              )} 1.2px, transparent 1.2px)`,
              backgroundSize: "8px 8px",
              pointerEvents: "none",
            }}
          />

          {/* Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              gap: 1.75,
              alignItems: "center",
            }}
          >
            {/* Avatar with online badge */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box
                sx={{
                  p: "3px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(
                    "#8b5cf6",
                    0.9,
                  )} 100%)`,
                  display: "inline-flex",
                }}
              >
                <Avatar
                  src={user.avatarUrl}
                  sx={{
                    width: 64,
                    height: 64,
                    fontSize: 26,
                    fontWeight: 700,
                    bgcolor: "background.paper",
                    color: "primary.main",
                    border: "2px solid",
                    borderColor: "background.paper",
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Box>

              {/* Verified badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 1,
                  right: 2,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "#10b981",
                  border: "1px solid",
                  borderColor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 2px 6px ${alpha("#10b981", 0.4)}`,
                }}
              >
                <VerifiedIcon sx={{ fontSize: 16, color: "#fff" }} />
              </Box>
            </Box>

            {/* Text block */}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                }}
                noWrap
              >
                {user.name}
              </Typography>

              {!isAdmin && user.course && (
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "text.secondary",
                    mt: 0.35,
                    fontWeight: 500,
                  }}
                  noWrap
                >
                  {user.course &&
                    user.branch &&
                    `${user.course} - ${user.branch}`}
                </Typography>
              )}

              {/* Role chip */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  mt: 0.85,
                  px: 1.1,
                  py: 0.3,
                  borderRadius: 999,
                  bgcolor: alpha(theme.palette.primary.main, 0.14),
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.22),
                }}
              >
                <SchoolIcon sx={{ fontSize: 16 }} />
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {isAdmin ? "Admin" : "Student"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Menu list */}
        <Stack spacing={1.25} sx={{ mb: 2 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                elevation={0}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    borderColor: alpha(theme.palette.primary.main, 0.35),
                    transform: "translateY(-1px)",
                    boxShadow: `0 6px 16px ${alpha(
                      theme.palette.primary.main,
                      0.08,
                    )}`,
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.6,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      flexShrink: 0,
                      borderRadius: "50%",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon sx={{ fontSize: 19 }} />
                  </Box>

                  {/* Text */}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: "0.9rem" }}
                      noWrap
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.72rem", color: "text.secondary" }}
                      noWrap
                    >
                      {item.subtitle}
                    </Typography>
                  </Box>

                  {/* Chevron */}
                  <ChevronRightRoundedIcon
                    sx={{ fontSize: 18, color: "text.disabled", flexShrink: 0 }}
                  />
                </Box>
              </Card>
            );
          })}
        </Stack>

        {/* Logout */}
        <Box
          onClick={handleLogout}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 1.5,
            borderRadius: 3,
            bgcolor: alpha("#ef4444", 0.1),
            color: "#dc2626",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            "&:active": { bgcolor: alpha("#ef4444", 0.16) },
          }}
        >
          <PowerSettingsNewIcon sx={{ fontSize: 19 }} />
          Logout
        </Box>
      </Box>
    );
  }

  /* ===================== DESKTOP / TABLET VERSION ===================== */
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            display: "flex",
            alignItems: "flex-start",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          {/* Back Button */}
          <Tooltip title="Go back">
            <Button
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              aria-label="Go back"
              variant="outlined"
              sx={{
                mt: 0.5,
                minWidth: { xs: 88, sm: 96 },
                height: { xs: 40, sm: 44 },
                px: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                borderColor: "divider",
                color: "text.primary",
                backgroundColor: "background.paper",
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "0.95rem" },
                fontWeight: 600,
                flexShrink: 0,
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                transition: "all 0.2s ease",

                "& .MuiButton-startIcon": {
                  marginRight: { xs: 0.5, sm: 0.75 },
                  marginLeft: 0,
                },

                "&:hover": {
                  backgroundColor: "action.hover",
                  borderColor: "text.secondary",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                },

                "&:active": {
                  transform: "translateY(1px)",
                },
              }}
            >
              Back
            </Button>
          </Tooltip>
        </Box>

        {/* Profile Header Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: { xs: 2.5, sm: 3 },
            border: "1px solid",
            borderColor: "divider",
            mb: { xs: 2, sm: 3 },
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                sm: 3,
                md: 4,
              },
              "&:last-child": {
                pb: {
                  xs: 2.5,
                  sm: 3,
                  md: 4,
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 2, sm: 2.5 },
                flexWrap: "wrap",
              }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  width: {
                    xs: 64,
                    sm: 72,
                    md: 80,
                  },
                  height: {
                    xs: 64,
                    sm: 72,
                    md: 80,
                  },
                  fontSize: {
                    xs: 26,
                    sm: 30,
                    md: 32,
                  },
                  bgcolor: "primary.main",
                  flexShrink: 0,
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              {/* User Info */}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    fontSize: {
                      xs: "1.25rem",
                      sm: "1.4rem",
                      md: "1.5rem",
                    },
                    wordBreak: "break-word",
                  }}
                >
                  {user.name}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.875rem",
                      md: "1rem",
                    },
                    wordBreak: "break-word",
                  }}
                >
                  {user.email}
                </Typography>

                {/* Role Badge */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.7,
                    mt: 1.25,
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <BadgeIcon sx={{ fontSize: 16 }} />

                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      fontSize: "0.7rem",
                      letterSpacing: 0.3,
                    }}
                  >
                    {isAdmin ? "ADMIN" : "STUDENT"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: { xs: 2.5, sm: 3 },
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2.5,
                sm: 3,
                md: 4,
              },
              "&:last-child": {
                pb: {
                  xs: 2.5,
                  sm: 3,
                  md: 4,
                },
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mb: 2,
                fontSize: {
                  xs: "1.05rem",
                  sm: "1.15rem",
                  md: "1.25rem",
                },
              }}
            >
              Personal Information
            </Typography>

            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

            {/* Responsive CSS Grid — NOT MUI Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: {
                  xs: 1.5,
                  sm: 2,
                  md: 2.5,
                },
              }}
            >
              <ProfileItem
                icon={<PersonIcon />}
                label="Full Name"
                value={user.name}
              />

              <ProfileItem
                icon={<EmailIcon />}
                label="Email Address"
                value={user.email}
              />

              {!isAdmin && (
                <>
                  <ProfileItem
                    icon={<PhoneIcon />}
                    label="Mobile Number"
                    value={user.mobile}
                  />

                  <ProfileItem
                    icon={<SchoolIcon />}
                    label="Course"
                    value={user.course}
                  />

                  <ProfileItem
                    icon={<AccountTreeIcon />}
                    label="Branch / Specialization"
                    value={user.branch}
                  />

                  <ProfileItem
                    icon={<CalendarMonthIcon />}
                    label="Year of Study"
                    value={getYearLabel(user.yearOfStudy)}
                  />
                </>
              )}

              {isAdmin && (
                <ProfileItem
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

const ProfileItem = ({ icon, label, value }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2 },
        p: {
          xs: 1.5,
          sm: 2,
        },
        minWidth: 0,
        borderRadius: 2,
        bgcolor: "action.hover",
        transition: "background-color 0.2s ease",
        "&:hover": {
          bgcolor: "action.selected",
        },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: {
            xs: 38,
            sm: 42,
          },
          height: {
            xs: 38,
            sm: 42,
          },
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      {/* Text */}
      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
            },
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body1"
          fontWeight={600}
          sx={{
            mt: 0.3,
            fontSize: {
              xs: "0.85rem",
              sm: "0.9rem",
              md: "1rem",
            },
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {value || "Not provided"}
        </Typography>
      </Box>
    </Box>
  );
};

export default Profile;
