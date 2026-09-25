import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

/**
 * Date-range / scope picker (shared by Cancel, Reschedule, Add)
 */
const ScopePicker = ({
  scope,
  setScope,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => (
  <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
    <FormLabel
      component="legend"
      sx={{
        fontSize: "0.72rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: "text.secondary",
        mb: 0.5,
      }}
    >
      Applies to
    </FormLabel>

    <RadioGroup
      row
      value={scope}
      onChange={(e) => setScope(e.target.value)}
      sx={{ gap: 1 }}
    >
      <FormControlLabel
        value="today"
        control={<Radio size="small" />}
        label={
          <Typography variant="body2" fontWeight={600}>
            Today only
          </Typography>
        }
      />
      <FormControlLabel
        value="range"
        control={<Radio size="small" />}
        label={
          <Typography variant="body2" fontWeight={600}>
            Date range
          </Typography>
        }
      />
    </RadioGroup>

    {scope === "range" && (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ mt: 1.5 }}
      >
        <TextField
          type="date"
          label="From"
          size="small"
          fullWidth
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: dayjs().format("YYYY-MM-DD") },
          }}
        />
        <TextField
          type="date"
          label="To"
          size="small"
          fullWidth
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: fromDate || dayjs().format("YYYY-MM-DD") },
          }}
          error={Boolean(
            fromDate && toDate && dayjs(toDate).isBefore(dayjs(fromDate))
          )}
          helperText={
            fromDate && toDate && dayjs(toDate).isBefore(dayjs(fromDate))
              ? "End date must be after start date"
              : " "
          }
        />
      </Stack>
    )}
  </FormControl>
);

export default ScopePicker;