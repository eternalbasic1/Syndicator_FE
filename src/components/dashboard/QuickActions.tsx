import React from "react";
import {
  Button,
  Stack,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
//import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { Link as RouterLink } from "react-router-dom";

const QuickActions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 4,
        height: "100%",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h6"}
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: { xs: 1.5, sm: 2 },
          fontSize: { xs: "1rem", sm: "1.125rem" },
        }}
      >
        Quick Actions
      </Typography>
      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        <Button
          component={RouterLink}
          to="/transactions"
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          sx={{
            py: { xs: 1.25, sm: 1.5 },
            textTransform: "none",
            fontWeight: "bold",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            borderRadius: 2,
          }}
        >
          New Transaction
        </Button>
        <Button
          component={RouterLink}
          to="/friends"
          variant="outlined"
          startIcon={<GroupAddIcon />}
          fullWidth
          sx={{
            py: { xs: 1.25, sm: 1.5 },
            textTransform: "none",
            fontWeight: "bold",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            borderRadius: 2,
          }}
        >
          Add Friend
        </Button>
        {/* <Button
          component={RouterLink}
          to="/requests"
          variant="outlined"
          startIcon={<RequestQuoteIcon />}
          fullWidth
          sx={{
            py: { xs: 1.25, sm: 1.5 },
            textTransform: "none",
            fontWeight: "bold",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            borderRadius: 2,
          }}
        >
          View Requests
        </Button> */}
      </Stack>
    </Paper>
  );
};

export default QuickActions;
