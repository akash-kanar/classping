import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";

import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import BugReportRoundedIcon from "@mui/icons-material/BugReportRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const HelpSupport = () => {
  const theme = useTheme();

  const faqs = [
    {
      q: "How do I upload my timetable?",
      a: "Go to Dashboard → Upload → Timetable, then upload a PDF or image of your schedule.",
    },
    {
      q: "Why don't I see my class today?",
      a: "Check the Upcoming Classes page. If today is marked as a holiday, no classes will show.",
    },
    {
      q: "How do I reschedule a class?",
      a: "Open Upcoming Classes, tap the three-dot menu on a class, and choose Reschedule.",
    },
    {
      q: "Can I add an extra class?",
      a: "Yes. On the Upcoming Classes page, tap 'Add a class' and choose Extra Class to scope it to a date range.",
    },
  ];

  const actions = [
    { label: "Email Support", icon: EmailRoundedIcon },
    { label: "Live Chat", icon: ChatBubbleOutlineRoundedIcon },
    { label: "Report a Bug", icon: BugReportRoundedIcon },
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
          Help & Support
        </Typography>

        {/* Quick actions */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            mb: 2,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {actions.map(({ label, icon: Icon }, i) => (
                <Box key={label}>
                  <ListItem
                    sx={{ px: 2, py: 1.6, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Icon sx={{ color: theme.palette.primary.main }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{ fontWeight: 700, fontSize: "0.9rem" }}
                    />
                    <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                  </ListItem>
                  {i < actions.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 1.5, fontSize: { xs: "1rem", sm: "1.1rem" } }}
        >
          Frequently Asked Questions
        </Typography>

        <Card
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {faqs.map((item, i) => (
                <Box key={item.q}>
                  <ListItem sx={{ px: 2, py: 1.75, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.3 }}>
                      <HelpOutlineRoundedIcon
                        sx={{ fontSize: 18, color: theme.palette.primary.main }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.q}
                      secondary={item.a}
                      primaryTypographyProps={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        mb: 0.4,
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.78rem",
                        color: "text.secondary",
                        lineHeight: 1.5,
                      }}
                    />
                  </ListItem>
                  {i < faqs.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<EmailRoundedIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
            }}
            href="mailto:support@classping.app"
          >
            Contact Support
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HelpSupport;