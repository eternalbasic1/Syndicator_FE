// src/theme/theme.ts
import { createTheme, alpha } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    neutral?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
  }
}

const primaryColor = "#4F46E5"; // Indigo-600
const secondaryColor = "#10B981"; // Emerald-500
const errorColor = "#EF4444"; // Red-500
const warningColor = "#F59E0B"; // Amber-500
const infoColor = "#3B82F6"; // Blue-500
const successColor = "#10B981"; // Emerald-500

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: primaryColor,
      light: "#818CF8",
      dark: "#4338CA",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: secondaryColor,
      light: "#6EE7B7",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    error: {
      main: errorColor,
      light: "#FCA5A5",
      dark: "#DC2626",
    },
    warning: {
      main: warningColor,
      light: "#FCD34D",
      dark: "#D97706",
    },
    info: {
      main: infoColor,
      light: "#93C5FD",
      dark: "#2563EB",
    },
    success: {
      main: successColor,
      light: "#6EE7B7",
      dark: "#059669",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    neutral: {
      main: "#9CA3AF",
      light: "#E5E7EB",
      dark: "#4B5563",
      contrastText: "#111827",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.45,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          color: "#111827",
          backgroundColor: "#F9FAFB",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#F3F4F6",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#9CA3AF",
            borderRadius: "4px",
            "&:hover": {
              background: "#6B7280",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 20px",
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
          "&.Mui-disabled": {
            opacity: 0.7,
          },
        },
        contained: {
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        sizeLarge: {
          padding: "10px 24px",
          fontSize: "1rem",
        },
        sizeSmall: {
          padding: "6px 16px",
          fontSize: "0.875rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          border: "1px solid #E5E7EB",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "24px 24px 16px",
        },
        title: {
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#111827",
        },
        subheader: {
          color: "#6B7280",
          marginTop: "4px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px",
          "&:last-child": {
            paddingBottom: "24px",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          backgroundColor: "#FFFFFF",
          color: "#111827",
          borderBottom: "1px solid #E5E7EB",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #E5E7EB",
          boxShadow: "none",
          backgroundColor: "#FFFFFF",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          margin: "0 8px",
          padding: "8px 12px",
          "&.Mui-selected": {
            backgroundColor: alpha(primaryColor, 0.08),
            color: primaryColor,
            "&:hover": {
              backgroundColor: alpha(primaryColor, 0.12),
            },
            "& .MuiListItemIcon-root": {
              color: primaryColor,
            },
          },
          "&:hover": {
            backgroundColor: alpha(primaryColor, 0.04),
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "40px",
          color: "#4B5563",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E5E7EB",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9CA3AF",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            boxShadow: `0 0 0 3px ${alpha(primaryColor, 0.2)}`,
          },
        },
        input: {
          padding: "12px 16px",
          "&::placeholder": {
            color: "#9CA3AF",
            opacity: 1,
          },
        },
        notchedOutline: {
          borderColor: "#E5E7EB",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#4B5563",
          marginBottom: "6px",
          "&.Mui-focused": {
            color: primaryColor,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginTop: "6px",
          "&.Mui-error": {
            color: errorColor,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& .MuiTableHead-root": {
            "& .MuiTableCell-root": {
              color: "#4B5563",
              fontWeight: 600,
              backgroundColor: "#F9FAFB",
              borderBottom: "1px solid #E5E7EB",
            },
          },
          "& .MuiTableBody-root": {
            "& .MuiTableRow-root": {
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
              "&:last-child .MuiTableCell-root": {
                borderBottom: "none",
              },
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #F3F4F6",
          padding: "16px",
        },
        head: {
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 500,
          "&.MuiChip-colorSuccess": {
            backgroundColor: "#ECFDF5",
            color: "#065F46",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "#FEF2F2",
            color: "#B91C1C",
          },
          "&.MuiChip-colorWarning": {
            backgroundColor: "#FFFBEB",
            color: "#92400E",
          },
          "&.MuiChip-colorInfo": {
            backgroundColor: "#EFF6FF",
            color: "#1E40AF",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "0.875rem",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "48px",
        },
        indicator: {
          height: "3px",
          borderRadius: "3px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          minHeight: "48px",
          "&.Mui-selected": {
            color: primaryColor,
          },
        },
      },
    },
  },
});
