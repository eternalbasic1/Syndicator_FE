import React from "react";
import {
  Box,
  Typography,
  Skeleton,
  Avatar,
  Tooltip,
  Divider,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { People, ReceiptLong } from "@mui/icons-material";
import type { Transaction } from "../../types/transaction.types";
import dayjs from "dayjs";

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
  maxItems?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions = [],
  loading = false,
  maxItems = 5,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderSkeleton = () => (
    <Stack spacing={2}>
      {[...Array(3)].map((_, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="circular"
            width={isMobile ? 32 : 40}
            height={isMobile ? 32 : 40}
            sx={{ mr: { xs: 1.5, sm: 2 } }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton width="70%" height={isMobile ? 20 : 24} />
            <Skeleton width="50%" height={isMobile ? 16 : 20} />
          </Box>
          <Skeleton width={isMobile ? 70 : 90} height={isMobile ? 24 : 32} />
        </Paper>
      ))}
    </Stack>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!transactions.length) {
    return (
      <Box py={{ xs: 4, sm: 6 }} textAlign="center">
        <ReceiptLong
          sx={{
            fontSize: { xs: 36, sm: 48 },
            color: "grey.400",
            mb: { xs: 1.5, sm: 2 },
          }}
        />
        <Typography
          variant={isMobile ? "h6" : "h6"}
          color="text.secondary"
          sx={{ fontSize: { xs: "1rem", sm: "1.125rem" } }}
        >
          No Transactions Yet
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Your recent transactions will be displayed here.
        </Typography>
      </Box>
    );
  }

  const recentTransactions = transactions.slice(0, maxItems);

  return (
    <Box>
      <Typography
        variant={isMobile ? "h6" : "h6"}
        component="h2"
        gutterBottom
        fontWeight="600"
        sx={{
          mb: { xs: 1.5, sm: 2 },
          fontSize: { xs: "1rem", sm: "1.125rem" },
        }}
      >
        Recent Transactions
      </Typography>
      <Stack divider={<Divider flexItem />} spacing={{ xs: 1.5, sm: 2 }}>
        {recentTransactions.map((transaction) => (
          <Box
            key={transaction.transaction_id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: { xs: 1, sm: 1.5 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
              <Tooltip title={transaction.risk_taker_name || "Risk Taker"}>
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.main",
                    fontWeight: "bold",
                    mr: { xs: 1.5, sm: 2 },
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    fontSize: { xs: "0.75rem", sm: "1rem" },
                  }}
                >
                  {getInitials(transaction.risk_taker_name || "RT")}
                </Avatar>
              </Tooltip>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="600"
                  noWrap
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  {transaction.risk_taker_name ||
                    transaction.risk_taker_username}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {dayjs(transaction.created_at).format("MMM DD, HH:mm")} •{" "}
                </Typography>
              </Box>
            </Box>

            <Stack
              direction="column"
              alignItems="flex-end"
              spacing={0.5}
              sx={{ pl: 1 }}
            >
              {transaction.syndicators?.length > 0 && (
                <Tooltip
                  title={`${transaction.syndicators.length} syndicator(s)`}
                >
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <People
                      fontSize="small"
                      color="action"
                      sx={{
                        mr: 0.5,
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {transaction.syndicators.length}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default RecentTransactions;
