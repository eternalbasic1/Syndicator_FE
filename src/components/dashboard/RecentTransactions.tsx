import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
} from '@mui/icons-material';
import type { Transaction } from '../../types/transaction.types';
import dayjs from 'dayjs';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  loading,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!transactions.length) {
    return (
      <Box py={4} textAlign="center">
        <Typography color="text.secondary">
          No transactions found
        </Typography>
      </Box>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <List>
      {recentTransactions.map((transaction) => (
        <ListItem key={transaction.transaction_id} divider>
          <ListItemIcon>
            <AccountBalance color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">
                  Transaction #{transaction.transaction_id.slice(0, 8)}
                </Typography>
                <Chip
                  size="small"
                  // TODO: You can add Rupee symbol here
                  label={transaction.total_principal_amount.toLocaleString()}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            }
            secondary={
              <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(transaction.created_at).format('MMM DD, YYYY')}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                  <Typography variant="body2" color="success.main">
                    ₹{transaction.total_interest.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RecentTransactions;