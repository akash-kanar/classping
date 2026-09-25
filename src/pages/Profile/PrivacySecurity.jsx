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
  Button,
  useTheme,
} from "@mui/material";
import { useState } from "react";

import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const PrivacySecurity = () => {
  const theme = useTheme();
  const [twoFactor, setTwoFactor] = useState(false);
  const [hideActivity, setHideActivity] = useState(false);

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
          Privacy & Security
        </Typography>

        <Card
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", mb: 2 }}
        >
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {/* Change Password */}
              <ListItem
                sx={{ px: 2, py: 1.6, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LockRoundedIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  secondary="Update your account password"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: "0.9rem" }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
                <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              </ListItem>

              <Divider />

              {/* Two-factor */}
              <ListItem sx={{ px: 2, py: 1.6 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ShieldRoundedIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Add an extra layer of security"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: "0.9rem" }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
                <Switch
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  size="small"
                />
              </ListItem>

              <Divider />

              {/* Hide activity */}
              <ListItem sx={{ px: 2, py: 1.6 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <VisibilityOffRoundedIcon
                    sx={{ color: theme.palette.primary.main }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Hide Activity Status"
                  secondary="Don't show when you're active"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: "0.9rem" }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
                <Switch
                  checked={hideActivity}
                  onChange={(e) => setHideActivity(e.target.checked)}
                  size="small"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Data actions */}
        <Card
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              <ListItem
                sx={{ px: 2, py: 1.6, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DownloadRoundedIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary="Download Your Data"
                  secondary="Export a copy of your ClassPing data"
                  primaryTypographyProps={{ fontWeight: 700, fontSize: "0.9rem" }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
                <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              </ListItem>

              <Divider />

              <ListItem
                sx={{
                  px: 2,
                  py: 1.6,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <DeleteOutlineRoundedIcon sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Delete Account"
                  secondary="Permanently remove your account and data"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "error.main",
                  }}
                  secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
                <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default PrivacySecurity;