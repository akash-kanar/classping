import { useState } from "react";
import dayjs from "dayjs";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
} from "@mui/material";

import {
  CalendarMonthRounded,
  EventRepeatRounded,
  AddRounded,
} from "@mui/icons-material";

import ScopePicker from "../components/ScopePicker";

const AddClassDialogContent = ({ open, onClose, onConfirm, dateKey }) => {
  const getDefaultDate = () => dateKey || dayjs().format("YYYY-MM-DD");

  const [classType, setClassType] = useState("regular"); // regular | extra
  const [scope, setScope] = useState("today");
  const [fromDate, setFromDate] = useState(getDefaultDate());
  const [toDate, setToDate] = useState(getDefaultDate());

  const [subject, setSubject] = useState("");
  const [faculty, setFaculty] = useState("");
  const [room, setRoom] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const resetForm = () => {
    const date = getDefaultDate();
    setClassType("regular");
    setScope("today");
    setFromDate(date);
    setToDate(date);
    setSubject("");
    setFaculty("");
    setRoom("");
    setStartTime("09:00");
    setEndTime("10:00");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleClassTypeChange = (_, value) => {
    if (!value) return;
    setClassType(value);

    // Regular classes don't use date scope.
    if (value === "regular") {
      const date = getDefaultDate();
      setScope("today");
      setFromDate(date);
      setToDate(date);
    }
  };

  const invalidRange =
    startTime && endTime && endTime.localeCompare(startTime) <= 0;

  const invalidDateRange =
    classType === "extra" &&
    fromDate &&
    toDate &&
    dayjs(toDate).isBefore(dayjs(fromDate), "day");

  const canSubmit =
    subject.trim() &&
    !invalidRange &&
    !invalidDateRange &&
    (classType === "regular" || (fromDate && toDate));

  const handleConfirm = () => {
    if (!canSubmit) return;

    // Regular classes: no scope fields at all.
    // Extra classes: include scope / fromDate / toDate.
    const classData =
      classType === "regular"
        ? {
            classType: "regular",
            subject: subject.trim(),
            faculty: faculty.trim(),
            room: room.trim(),
            startTime,
            endTime,
          }
        : {
            classType: "extra",
            subject: subject.trim(),
            faculty: faculty.trim(),
            room: room.trim(),
            startTime,
            endTime,
            scope,
            fromDate,
            toDate,
          };

    onConfirm(classData);
    resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>
        Add a Class
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.75} sx={{ mt: 2.5 }}>
          {/* =========================
              CLASS TYPE
          ========================== */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 0.75, fontWeight: 700 }}
            >
              Class Type
            </Typography>

            <ToggleButtonGroup
              value={classType}
              exclusive
              onChange={handleClassTypeChange}
              fullWidth
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  py: 1.1,
                  fontWeight: 700,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  gap: 1,
                },
                "& .MuiToggleButton-root.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderColor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                },
                "& .MuiToggleButton-root:first-of-type": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
                "& .MuiToggleButton-root:last-of-type": {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                },
              }}
            > 
            

              <ToggleButton value="extra">
                <CalendarMonthRounded fontSize="small" />
                Extra Class
              </ToggleButton>
              
              <ToggleButton value="regular">
                <EventRepeatRounded fontSize="small" />
                Regular Class
              </ToggleButton>
            </ToggleButtonGroup>

            <Box
  sx={{
    mt: 1.25,
    px: 1.5,
    py: 1,
    borderRadius: 1.5,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "action.hover",
    display: "flex",
  }}
>

  <Typography
    variant="caption"
    color="text.secondary"
    sx={{
      lineHeight: 1.6,
      fontSize: "0.75rem",
    }}
  > Note: {"  "}
    {classType === "regular"
      ? "This class will be added to your existing weekly timetable."
      : "This class will only appear during the selected date range and will not change your regular timetable."}
  </Typography>
</Box>
          </Box>

          <Divider />

          {/* =========================
              CLASS DETAILS
          ========================== */}
          <TextField
            label="Subject"
            size="small"
            fullWidth
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Data Structures"
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Faculty"
              size="small"
              fullWidth
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="e.g. Prof. Sharma"
            />
            <TextField
              label="Room"
              size="small"
              fullWidth
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. B-204"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              type="time"
              label="Start"
              size="small"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="time"
              label="End"
              size="small"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              error={invalidRange}
              helperText={invalidRange ? "End must be after start" : " "}
            />
          </Stack>

          {/* =========================
              EXTRA CLASS DATE SCOPE
          ========================== */}
          {classType === "extra" && (
            <>
              <Divider />

              <ScopePicker
                scope={scope}
                setScope={setScope}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
              />

              {invalidDateRange && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: -0.75, fontWeight: 600 }}
                >
                  To date must be on or after the from date.
                </Typography>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          disableElevation
          startIcon={<AddRounded />}
          disabled={!canSubmit}
          onClick={handleConfirm}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          {classType === "regular" ? "Add Regular Class" : "Add Extra Class"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddClassDialog = (props) => (
  <AddClassDialogContent
    key={`${props.open}-${props.dateKey || ""}`}
    {...props}
  />
);

export default AddClassDialog;