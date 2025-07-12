/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
import { useRegisterMutation } from "../../store/api/authApi";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  phone_number: Yup.string()
    .matches(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
});

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      phone_number: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register(values).unwrap();
      } catch (err) {
        console.error("Registration failed:", err);
      }
    },
  });

  const textFieldStyles = {
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
  };

  if (isSuccess) {
    return (
      <Box sx={{ textAlign: "center", color: "#fff" }}>
        <Alert
          severity="success"
          sx={{
            mb: 3,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            },
          }}
        >
          Registration successful! Please login with your credentials.
        </Alert>
        <Button
          onClick={onSwitchToLogin}
          variant="contained"
          sx={{
            py: { xs: 1.5, sm: 2 },
            px: { xs: 3, sm: 4 },
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
        >
          Go to Login
        </Button>
      </Box>
    );
  }

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
          color: "text.primary",
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
        }}
      >
        Create Account
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
          {(error as any)?.data?.detail ||
            "Registration failed. Please try again."}
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
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        sx={textFieldStyles}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        sx={textFieldStyles}
      />

      <TextField
        margin="normal"
        fullWidth
        id="phone_number"
        label="Phone Number"
        name="phone_number"
        autoComplete="tel"
        value={formik.values.phone_number}
        onChange={formik.handleChange}
        error={
          formik.touched.phone_number && Boolean(formik.errors.phone_number)
        }
        helperText={formik.touched.phone_number && formik.errors.phone_number}
        sx={textFieldStyles}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        sx={{ ...textFieldStyles, mb: 3 }}
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
          "Create Account"
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
        Join the smart financial syndication platform
      </Typography>
    </Box>
  );
};

export default RegisterForm;
