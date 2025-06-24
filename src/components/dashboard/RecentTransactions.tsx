import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Skeleton,
  Avatar,
  Tooltip,
  Divider,
  Stack,

  Paper
} from '@mui/material';
import {
  TrendingUp,
  People,
  ReceiptLong,
} from '@mui/icons-material';
import type { Transaction } from '../../types/transaction.types';
import dayjs from 'dayjs';

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const renderSkeleton = () => (
    <Stack spacing={2}>
      {[...Array(3)].map((_, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2, borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton width="70%" height={24} />
            <Skeleton width="50%" height={20} />
          </Box>
          <Skeleton width={90} height={32} />
        </Paper>
      ))}
    </Stack>
  );

  if (loading) {
    return renderSkeleton();
  }

  if (!transactions.length) {
    return (
      <Box py={6} textAlign="center">
        <ReceiptLong sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No Transactions Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your recent transactions will be displayed here.
        </Typography>
      </Box>
    );
  }

  const recentTransactions = transactions.slice(0, maxItems);

  return (
    <Stack divider={<Divider flexItem />} spacing={2}>
      {recentTransactions.map((transaction) => (
        <Box 
          key={transaction.transaction_id} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 1.5 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Tooltip title={transaction.risk_taker_name || 'Risk Taker'}>
              <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 'bold', mr: 2 }}>
                {getInitials(transaction.risk_taker_name || 'RT')}
              </Avatar>
            </Tooltip>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight="600" noWrap>
                {`Transaction #${transaction.transaction_id.substring(0, 8)}...`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dayjs(transaction.created_at).format('MMMM DD, YYYY')}
              </Typography>
            </Box>
          </Box>

          <Stack direction="column" alignItems="flex-end" spacing={0.5} sx={{ pl: 1 }}>
            <Chip
              icon={<TrendingUp />}
              label={`₹${transaction.total_principal_amount.toLocaleString()}`}
              color="success"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
            {transaction.syndicators?.length > 0 && (
              <Tooltip title={`${transaction.syndicators.length} syndicator(s)`}>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <People fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {transaction.syndicators.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default RecentTransactions;