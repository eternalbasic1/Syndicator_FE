import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import type { Transaction } from "../../types/transaction.types";

interface TransactionsListProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
  loading: boolean;
  error?: string;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions = [],
  onViewTransaction,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="text.secondary">
          No transactions found
        </Typography>
      </Box>
    );
  }
  console.log("transactionslknl", transactions);
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {transactions.map((transaction) => (
          <Paper
            key={transaction.transaction_id}
            elevation={2}
            sx={{ p: 2, flex: 1, minWidth: 300 }}
          >
            <Stack spacing={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" component="div">
                  {transaction.risk_taker_username}
                </Typography>
                <Chip
                  label={`Syndicate (${transaction.syndicators.length})`}
                  color="primary"
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID:
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                  {transaction.transaction_id}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Principal Amount:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{transaction.total_principal_amount.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Interest Rate:
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {transaction.total_interest}%
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Created:
                </Typography>
                <Typography variant="body1">
                  {new Date(transaction.created_at).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Start Date:
                </Typography>
                <Typography variant="body1">
                  {new Date(transaction.start_date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Syndicators:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {transaction.syndicators.map((syndicator) => (
                    <Chip
                      key={syndicator.user_id}
                      label={syndicator.username}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Splitwise Contributions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {transaction.splitwise_entries.map((entry) => (
                    <Paper
                      key={entry.splitwise_id}
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" color="primary">
                            {entry.syndicator_username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Email: {entry.syndicator_email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Created:{" "}
                            {new Date(entry.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography variant="h6" color="primary">
                              ₹{entry.principal_amount.toLocaleString()}
                            </Typography>
                            <Chip
                              label={`${entry.original_interest}% Interest`}
                              color="success"
                              size="small"
                              sx={{ height: "auto" }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Splitwise ID: {entry.splitwise_id}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => onViewTransaction(transaction)}
                >
                  View Details
                </Button>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default TransactionsList;
