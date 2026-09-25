import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    branch: "",
    yearOfStudy: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Password confirmation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Mobile validation
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.mobile,
        form.course,
        form.branch,
        form.yearOfStudy
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f7fb",
        py: 5,
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 650,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
        >
          Create Your ClassPing Account
        </Typography>

        <Typography
          color="text.secondary"
          
          mt={1}
          mb={4}
        >
          Set up your profile to start managing your classes.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          {/* Name */}
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Mobile */}
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            required
            margin="normal"
            slotProps={{
              htmlInput: {
                maxLength: 10,
                inputMode: "numeric",
              },
            }}
            helperText="Enter your 10-digit mobile number"
          />

          {/* Course */}
          <TextField
            fullWidth
            select
            label="Course"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            margin="normal"
          >
            <MenuItem value="B.Tech">
              B.Tech
            </MenuItem>

            <MenuItem value="M.Tech">
              M.Tech
            </MenuItem>

            <MenuItem value="BCA">
              BCA
            </MenuItem>

            <MenuItem value="MCA">
              MCA
            </MenuItem>

            <MenuItem value="B.Sc">
              B.Sc
            </MenuItem>

            <MenuItem value="M.Sc">
              M.Sc
            </MenuItem>

            <MenuItem value="BBA">
              BBA
            </MenuItem>

            <MenuItem value="MBA">
              MBA
            </MenuItem>

            <MenuItem value="Other">
              Other
            </MenuItem>
          </TextField>

          {/* Branch */}
          <TextField
            fullWidth
            label="Branch / Specialization"
            name="branch"
            value={form.branch}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="e.g. Computer Science & Engineering"
          />

          {/* Year */}
          <TextField
            fullWidth
            select
            label="Year of Study"
            name="yearOfStudy"
            value={form.yearOfStudy}
            onChange={handleChange}
            required
            margin="normal"
          >
            <MenuItem value={1}>
              1st Year
            </MenuItem>

            <MenuItem value={2}>
              2nd Year
            </MenuItem>

            <MenuItem value={3}>
              3rd Year
            </MenuItem>

            <MenuItem value={4}>
              4th Year
            </MenuItem>

            <MenuItem value={5}>
              5th Year
            </MenuItem>

            <MenuItem value={6}>
              6th Year
            </MenuItem>
          </TextField>

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </Box>

      <Box style={{ marginTop: "20px" }}>
        <Typography
          
          mt={3}
          color="text.secondary"
        >
          Already have an account?{" "}
          <Link
            to="/auth/login"
            style={{
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign In
          </Link>
        </Typography></Box>
      </Paper>
    </Box>
  );
};

export default Register;
