

// src/components/transactions/TransactionCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import type { Transaction } from '../../types/transaction.types';
import dayjs from 'dayjs';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const returnRate = transaction.total_principal_amount > 0 
    ? ((transaction.total_interest / transaction.total_principal_amount) * 100).toFixed(2)
    : '0.00';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccountBalance color="primary" />
            <Typography variant="h6" component="div">
              #{transaction.transaction_id.slice(0, 8)}
            </Typography>
          </Box>
          <Chip 
            label="Active" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Principal Amount
          </Typography>
          <Typography variant="h5" color="primary">
            ₹{transaction.total_principal_amount.toLocaleString()}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TrendingUp sx={{ fontSize: 20, color: 'success.main' }} />
          <Typography variant="body2" color="text.secondary">
            Expected Returns:
          </Typography>
          <Typography variant="body1" color="success.main" fontWeight="medium">
            ₹{transaction.total_interest.toLocaleString()} ({returnRate}%)
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Start Date: {dayjs(transaction.start_date).format('MMM DD, YYYY')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            Syndicators: {transaction.syndicators.length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;