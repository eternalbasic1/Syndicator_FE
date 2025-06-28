import React from "react";
import { Card, Box, Typography, useTheme } from "@mui/material";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  description,
  color,
}) => {
  const theme = useTheme();
  return (
    <Card
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        minWidth: 200,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: theme.palette.background.paper,
        transition: "box-shadow 0.2s, transform 0.2s",
        boxShadow: "0 2px 16px 0 rgba(60,60,60,0.06)",
        "&:hover": {
          boxShadow: "0 4px 32px 0 rgba(60,60,60,0.12)",
          transform: "translateY(-2px) scale(1.03)",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: color || theme.palette.primary.main,
          color: "#fff",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          fontSize: 28,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={0.5}
        sx={{ fontSize: "2rem" }}
      >
        {value}
      </Typography>
      <Typography
        variant="subtitle1"
        fontWeight={500}
        color="text.secondary"
        mb={0.5}
      >
        {label}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" align="center">
          {description}
        </Typography>
      )}
    </Card>
  );
};

export default StatCard;
