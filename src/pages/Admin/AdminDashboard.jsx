import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data.users);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load users"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            ClassPing Admin
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Users
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Manage all ClassPing accounts.
        </Typography>

        <Paper elevation={2} sx={{ overflow: "hidden" }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && error && (
            <Typography color="error" sx={{ p: 3 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && (
            <TableContainer>
              <Table sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((account) => (
                    <TableRow key={account._id} hover>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {account.role}
                      </TableCell>
                      <TableCell>{account.mobile || "-"}</TableCell>
                      <TableCell>{account.course || "-"}</TableCell>
                      <TableCell>
                        {account.createdAt
                          ? new Date(account.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Signed in as {user?.email}
        </Typography>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
