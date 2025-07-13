/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../store/api/authApi";
import { useAppDispatch } from "../../hooks/useAuth";
import { setCredentials } from "../../store/authSlice";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        dispatch(
          setCredentials({
            user: result.user,
            token: result.access,
          })
        );
        navigate("/dashboard");
      } catch (err) {
        console.error("Login failed:", err);
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ mt: 1, color: "#fff" }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          textAlign: "center",
          fontWeight: 600,
          color: "black",
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
        }}
      >
        Welcome Back
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            },
          }}
        >
          {(error as any)?.data?.detail || "Login failed. Please try again."}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        sx={{
          mb: 2,
          "& .MuiInputLabel-root": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: "text.secondary",
          },
          "& .MuiInputBase-input": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
            padding: { xs: "14px 16px", sm: "16px 16px" },
          },
          "& .MuiFormHelperText-root": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#111",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: "#111",
            },
          },
        }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        sx={{
          mb: 3,
          "& .MuiInputLabel-root": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: "text.secondary",
          },
          "& .MuiInputBase-input": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
            padding: { xs: "14px 16px", sm: "16px 16px" },
          },
          "& .MuiFormHelperText-root": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#111",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: "#111",
            },
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          mb: 2,
          py: { xs: 1.5, sm: 2 },
          fontSize: { xs: "0.875rem", sm: "1rem" },
          fontWeight: 600,
          borderRadius: "8px",
          textTransform: "none",
          backgroundColor: "#fff",
          color: "#111",
          boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.15)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={isMobile ? 20 : 24} sx={{ color: "#111" }} />
        ) : (
          "Sign In"
        )}
      </Button>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          mt: 2,
        }}
      >
        Secure access to your financial portfolio
      </Typography>
    </Box>
  );
};

export default LoginForm;
