import { useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import ScopePicker from "../components/ScopePicker";

const CancelDialogContent = ({ open, onClose, onConfirm, entry, dateKey }) => {
  const [scope, setScope] = useState("today");
  const [fromDate, setFromDate] = useState(
    dateKey || dayjs().format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(
    dateKey || dayjs().format("YYYY-MM-DD")
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>
        Cancel Class
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {entry?.subject} · {entry?.startTime}–{entry?.endTime}
        </Typography>
        <ScopePicker
          scope={scope}
          setScope={setScope}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disableElevation
          onClick={() => onConfirm({ scope, fromDate, toDate })}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          Confirm Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CancelDialog = (props) => (
  <CancelDialogContent
    {...props}
    key={`${props.open}-${props.dateKey || ""}`}
  />
);

export default CancelDialog;