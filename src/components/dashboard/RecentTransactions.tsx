import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Skeleton,
  Avatar,
  ListItemAvatar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AccessTime,
} from '@mui/icons-material';
import type { TransactionMetaData } from '../../types/transaction.types';
import dayjs from 'dayjs';

interface RecentTransactionsProps {
  transactions: TransactionMetaData[];
  loading?: boolean;
  maxItems?: number;
  showDivider?: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions = [],
  loading = false,
  maxItems = 5,
  // showDivider = true,
}) => {
  if (loading) {
    return (
      <Box>
        {[...Array(3)].map((_, index) => (
          <React.Fragment key={index}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton width="60%" height={24} />
                <Skeleton width="40%" height={20} />
              </Box>
              <Skeleton width={80} height={24} />
            </Box>
            {index < 2 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </Box>
    );
  }


  if (!transactions.length) {
    return (
      <Box py={4} textAlign="center">
        <AccessTime fontSize="large" color="disabled" sx={{ mb: 1 }} />
        <Typography color="text.secondary" variant="body2">
          No recent transactions found
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Your transactions will appear here
        </Typography>
      </Box>
    );
  }

  const recentTransactions = transactions.slice(0, maxItems);
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {recentTransactions.map((transaction, index) => (
        <React.Fragment key={transaction.transaction_id}>
          <ListItem alignItems="flex-start" disablePadding>
            <ListItemAvatar>
              <Tooltip title={`${transaction.risk_taker_id === 'You' ? 'You' : 'Risk Taker'}`}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {transaction.risk_taker_id === 'You' ? 'You' : getInitials(transaction.risk_taker_id || '')}
                </Avatar>
              </Tooltip>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="subtitle2" component="span">
                    {`#${transaction.transaction_id.slice(0, 8)}`}
                  </Typography>
                  <Chip
                    size="small"
                    label={`₹${transaction.total_principal_amount.toLocaleString()}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(transaction.created_at).format('MMM DD, YYYY')}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                    <Typography variant="caption" color="success.main">
                      +₹{transaction.total_interest.toLocaleString()} interest
                    </Typography>
                    {transaction.syndicators?.length > 0 && (
                      <Tooltip 
                        title={`${transaction.syndicators.length} ${transaction.syndicators.length === 1 ? 'syndicator' : 'syndicators'}`}
                      >
                        <Box display="flex" alignItems="center" ml="auto">
                          <People fontSize="small" color="action" sx={{ mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            {transaction.syndicators.length}
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              }
              sx={{ my: 1 }}
            />
          </ListItem>
          {index < recentTransactions.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RecentTransactions;