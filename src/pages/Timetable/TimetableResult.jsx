import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";

import {
  CheckCircle,
  Edit,
  Person,
  MeetingRoom,
  AccessTime,
  CalendarMonth,
  School,
  EventAvailable,
} from "@mui/icons-material";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TimetableResult = ({
  timetable,
  onEdit,
  onConfirm,
  saving,
  error,
}) => {
  if (!timetable) {
    return null;
  }

  const totalClasses = timetable.entries?.length || 0;
  const activeDays = DAYS.filter((day) =>
    (timetable.entries || []).some((e) => e.day === day)
  ).length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : alpha(theme.palette.primary.main, 0.02),
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 1.5, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%" }}>
        {/* ================= SUCCESS HERO ================= */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 3, sm: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: 72, sm: 84 },
              height: { xs: 72, sm: 84 },
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
              mb: 2,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: -8,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: (theme) =>
                  alpha(theme.palette.success.main, 0.25),
              },
            }}
          >
            <CheckCircle
              sx={{
                fontSize: { xs: 40, sm: 48 },
                color: "success.main",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Timetable Ready
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              maxWidth: 520,
              px: 2,
            }}
          >
            Your timetable has been reviewed. Confirm it to save it to your
            ClassPing account.
          </Typography>
        </Box>

        {/* ================= ERROR ================= */}
        {error && (
          <Box
            sx={{
              mb: 3,
              p: 1.75,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.error.main, 0.2),
            }}
          >
            <Typography
              color="error"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                fontWeight: 500,
              }}
            >
              {error}
            </Typography>
          </Box>
        )}

        {/* ================= MAIN CARD ================= */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3.5,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(0,0,0,0.05)",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.5)
                  : alpha(theme.palette.grey[50], 0.6),
            }}
          >
            <Stack
              direction="row"
              spacing={1.75}
              sx={{ alignItems: "center", minWidth: 0, flex: 1 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  flexShrink: 0,
                  boxShadow: (theme) =>
                    `0 6px 18px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                <School fontSize="small" />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: "1.05rem", sm: "1.2rem" },
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {timetable.title || "My Timetable"}
                </Typography>
                {timetable.semester && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {timetable.semester}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flexShrink: 0 }}
            >
              <Chip
                label="Verified"
                color="success"
                size="small"
                icon={<CheckCircle sx={{ fontSize: 14 }} />}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  borderRadius: 1.5,
                  "& .MuiChip-icon": { color: "inherit" },
                }}
              />
            </Stack>
          </Box>

          {/* Stat strip */}
          <Box
            sx={{
              display: "flex",
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "transparent"
                  : alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <StatCell
              icon={<EventAvailable fontSize="small" />}
              label="Total Classes"
              value={totalClasses}
            />
            <Box sx={{ width: "1px", bgcolor: "divider" }} />
            <StatCell
              icon={<CalendarMonth fontSize="small" />}
              label="Active Days"
              value={activeDays}
            />
          </Box>

          <CardContent sx={{ p: 0 }}>
            {/* ================= DESKTOP TABLE ================= */}
            <TableContainer
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? alpha(theme.palette.primary.main, 0.08)
                            : alpha(theme.palette.primary.main, 0.06),
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "text.secondary",
                        py: 1.5,
                      },
                    }}
                  >
                    <TableCell sx={{ pl: { md: 3 } }}>Day</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Faculty</TableCell>
                    <TableCell sx={{ pr: { md: 3 } }}>Room</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timetable.entries.map((entry, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        transition: "background-color 0.2s ease",
                        "& td": {
                          py: 1.75,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        },
                        "&:last-child td": { borderBottom: "none" },
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.03),
                        },
                      }}
                    >
                      <TableCell sx={{ pl: { md: 3 } }}>
                        <Chip
                          label={entry.day}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            borderRadius: 1.5,
                            bgcolor: (theme) =>
                              alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.75}
                          sx={{ alignItems: "center" }}
                        >
                          <AccessTime
                            sx={{ fontSize: 15, color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                          >
                            {entry.startTime} – {entry.endTime}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: "text.primary" }}
                        >
                          {entry.subject || "—"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.75}
                          sx={{ alignItems: "center" }}
                        >
                          <Person
                            sx={{ fontSize: 15, color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            color={
                              entry.faculty ? "text.primary" : "text.disabled"
                            }
                            sx={{ fontWeight: 500 }}
                          >
                            {entry.faculty || "Not provided"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ pr: { md: 3 } }}>
                        <Stack
                          direction="row"
                          spacing={0.75}
                          sx={{ alignItems: "center" }}
                        >
                          <MeetingRoom
                            sx={{ fontSize: 15, color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            color={entry.room ? "text.primary" : "text.disabled"}
                            sx={{ fontWeight: 500 }}
                          >
                            {entry.room || "Not provided"}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ================= MOBILE CARD LIST ================= */}
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                p: { xs: 1.75, sm: 2.5 },
              }}
            >
              <Stack spacing={1.5}>
                {timetable.entries.map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.background.paper, 0.5)
                          : alpha(theme.palette.grey[50], 0.5),
                      position: "relative",
                      transition: "all 0.2s ease",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 16,
                        bottom: 16,
                        width: 3,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                      },
                      "&:hover": {
                        borderColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.4),
                      },
                    }}
                  >
                    {/* Subject + Day */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        mb: 1.25,
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: "0.95rem",
                          flex: 1,
                          minWidth: 0,
                          wordBreak: "break-word",
                        }}
                      >
                        {entry.subject || "Untitled Class"}
                      </Typography>
                      <Chip
                        label={entry.day}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.68rem",
                          height: 22,
                          borderRadius: 1.5,
                          flexShrink: 0,
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          color: "primary.main",
                        }}
                      />
                    </Stack>

                    {/* Time */}
                    <Stack
                      direction="row"
                      spacing={0.75}
                      sx={{ alignItems: "center", mb: 1.25 }}
                    >
                      <AccessTime
                        sx={{ fontSize: 15, color: "primary.main" }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {entry.startTime} – {entry.endTime}
                      </Typography>
                    </Stack>

                    <Divider sx={{ mb: 1.25 }} />

                    {/* Faculty + Room */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                      >
                        <Person
                          sx={{ fontSize: 15, color: "text.secondary" }}
                        />
                        <Typography
                          variant="caption"
                          color={
                            entry.faculty ? "text.primary" : "text.disabled"
                          }
                          sx={{ fontWeight: 500 }}
                        >
                          {entry.faculty || "Faculty not provided"}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: "center" }}
                      >
                        <MeetingRoom
                          sx={{ fontSize: 15, color: "text.secondary" }}
                        />
                        <Typography
                          variant="caption"
                          color={entry.room ? "text.primary" : "text.disabled"}
                          sx={{ fontWeight: 500 }}
                        >
                          {entry.room || "Room not provided"}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* ================= ACTIONS ================= */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 3 }}
        >
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{
              py: { xs: 1.3, sm: 1.5 },
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              borderColor: "divider",
              color: "text.primary",
              "&:hover": {
                borderColor: "primary.main",
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            Edit Timetable
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={onConfirm}
            disabled={saving}
            sx={{
              py: { xs: 1.3, sm: 1.5 },
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              textTransform: "none",
              boxShadow: (theme) =>
                `0 4px 14px ${alpha(theme.palette.success.main, 0.35)}`,
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: (theme) =>
                  `0 6px 20px ${alpha(theme.palette.success.main, 0.5)}`,
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&.Mui-disabled": {
                boxShadow: "none",
              },
            }}
          >
            {saving ? "Saving..." : "Confirm & Save"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

/* ---------- Stat cell subcomponent ---------- */
const StatCell = ({ icon, label, value }) => (
  <Box
    sx={{
      flex: 1,
      px: { xs: 1.5, sm: 2.5 },
      py: { xs: 1.5, sm: 2 },
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
        color: "primary.main",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          fontSize: "0.68rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          display: "block",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ fontSize: "1.05rem", lineHeight: 1.2 }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default TimetableResult;