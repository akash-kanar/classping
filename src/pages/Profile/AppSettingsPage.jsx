import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
  MenuItem,
  TextField,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";

import {
  enablePushNotifications,
  disablePushNotifications,
  getPushStatus,
} from "../../services/pushNotifications";

import { useTheme as useAppTheme } from "../../context/ThemeContext";

const AppSettingsPage = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useAppTheme();

  const [notificationsOn, setNotificationsOn] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(true);
  const [language, setLanguage] = useState("en");

  // Dialog state: holds the intended next value (true/false) while
  // we wait for the user to confirm, or null when the dialog is closed.
  const [pendingToggleValue, setPendingToggleValue] = useState(null);
  const [dialogSubmitting, setDialogSubmitting] = useState(false);

  useEffect(() => {
    const loadPushStatus = async () => {
      try {
        const status = await getPushStatus();
        setNotificationsOn(status.enabled);
      } catch (error) {
        console.error("Push status error:", error);
      } finally {
        setNotificationLoading(false);
      }
    };

    loadPushStatus();
  }, []);

  // Switch just opens the confirmation dialog — it does NOT
  // call the API directly anymore.
  const handleSwitchClick = (event) => {
    setPendingToggleValue(event.target.checked);
  };

  const closeDialog = () => {
    if (dialogSubmitting) return; // don't allow closing mid-request
    setPendingToggleValue(null);
  };

  const confirmToggle = async () => {
    const enabled = pendingToggleValue;

    try {
      setDialogSubmitting(true);
      setNotificationLoading(true);

      if (enabled) {
        await enablePushNotifications();
        setNotificationsOn(true);
      } else {
        await disablePushNotifications();
        setNotificationsOn(false);
      }
    } catch (error) {
      console.error("Notification toggle error:", error);
      setNotificationsOn((prev) => prev); // leave state as-is, don't flip
      alert(error.message || "Unable to update notification settings.");
    } finally {
      setDialogSubmitting(false);
      setNotificationLoading(false);
      setPendingToggleValue(null);
    }
  };

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
          App Settings
        </Typography>

        <Card
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {/* Theme */}
              <ListItem sx={{ px: 2, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DarkModeRoundedIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Dark Mode"
                  secondary={`Currently using ${mode} theme`}
                  slotProps={{
                    primary: { fontWeight: 700, fontSize: "0.9rem" },
                    secondary: { fontSize: "0.75rem" },
                  }}
                />
                <Switch checked={mode === "dark"} onChange={toggleTheme} size="small" />
              </ListItem>

              <Divider />

              {/* Notifications */}
              <ListItem sx={{ px: 2, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <NotificationsActiveRoundedIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Notifications"
                  secondary={
                    notificationsOn
                      ? "Class reminders are enabled"
                      : "Enable browser notifications for class reminders"
                  }
                  slotProps={{
                    primary: { fontWeight: 700, fontSize: "0.9rem" },
                    secondary: { fontSize: "0.75rem" },
                  }}
                />
                <Switch
                  checked={notificationsOn}
                  onChange={handleSwitchClick}
                  disabled={notificationLoading}
                  size="small"
                />
              </ListItem>

              <Divider />

              {/* Language */}
              <ListItem sx={{ px: 2, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LanguageRoundedIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Language"
                  secondary="App display language"
                  slotProps={{
                    primary: { fontWeight: 700, fontSize: "0.9rem" },
                    secondary: { fontSize: "0.75rem" },
                  }}
                />
                <TextField
                  select
                  size="small"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ minWidth: 110 }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिंदी</MenuItem>
                  <MenuItem value="bn">বাংলা</MenuItem>
                </TextField>
              </ListItem>

              <Divider />

              {/* Appearance hint */}
              <ListItem sx={{ px: 2, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PaletteRoundedIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Appearance"
                  secondary="More themes coming soon"
                  slotProps={{
                    primary: { fontWeight: 700, fontSize: "0.9rem" },
                    secondary: { fontSize: "0.75rem" },
                  }}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Confirmation dialog for enabling/disabling notifications */}
      <Dialog
        open={pendingToggleValue !== null}
        onClose={closeDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {pendingToggleValue ? "Enable notifications?" : "Disable notifications?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.875rem" }}>
            {pendingToggleValue
              ? "You'll get browser notifications for class reminders, even when the app is in the background."
              : "You'll stop receiving browser notifications for class reminders. You can turn this back on anytime."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={dialogSubmitting} size="small">
            Cancel
          </Button>
          <Button
            onClick={confirmToggle}
            disabled={dialogSubmitting}
            variant="contained"
            size="small"
          >
            {dialogSubmitting
              ? "Please wait..."
              : pendingToggleValue
              ? "Enable"
              : "Disable"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppSettingsPage;