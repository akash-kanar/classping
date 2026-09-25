import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Stack,
  Button,
  useTheme,
  alpha,
} from "@mui/material";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PolicyRoundedIcon from "@mui/icons-material/PolicyRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const AboutClassPing = () => {
  const theme = useTheme();

  const rows = [
    { label: "Privacy Policy", icon: PolicyRoundedIcon },
    { label: "Terms of Service", icon: DescriptionRoundedIcon },
    { label: "Rate ClassPing", icon: StarRoundedIcon },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1.5, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ mb: 2.5, fontSize: { xs: "1.15rem", sm: "1.35rem" } }}
        >
          About ClassPing
        </Typography>

        {/* Brand hero */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.2),
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.08
            )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
            mb: 2,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 }, textAlign: "center" }}>
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: 3,
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "primary.contrastText",
                mb: 1.5,
                boxShadow: `0 10px 24px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
              }}
            >
              <SchoolRoundedIcon sx={{ fontSize: 34 }} />
            </Box>

            <Typography
              sx={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}
            >
              ClassPing
            </Typography>

            <Typography
              sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}
            >
              Version 0.0.1
            </Typography>

            <Typography
              sx={{
                fontSize: "0.82rem",
                color: "text.secondary",
                mt: 1.5,
                maxWidth: 420,
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Never miss a class. ClassPing keeps your timetable, holidays, and
              reminders in one place — so you can focus on what matters.
            </Typography>
          </CardContent>
        </Card>

        {/* Legal + rate */}
        <Card
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 0 }}>
            {rows.map(({ label, icon: Icon }, i) => (
              <Box key={label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.6,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}
                  >
                    <Icon sx={{ fontSize: 17 }} />
                  </Box>
                  <Typography sx={{ flex: 1, fontWeight: 600, fontSize: "0.9rem" }}>
                    {label}
                  </Typography>
                  <ChevronRightRoundedIcon
                    sx={{ fontSize: 18, color: "text.disabled" }}
                  />
                </Box>
                {i < rows.length - 1 && <Divider />}
              </Box>
            ))}
          </CardContent>
        </Card>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Typography
            sx={{ fontSize: "0.72rem", color: "text.disabled", textAlign: "center" }}
          >
            Made with care · © {new Date().getFullYear()} ClassPing
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default AboutClassPing;