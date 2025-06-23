import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  AvatarGroup,
  Skeleton,
  Button,
} from '@mui/material';
import { 
  Visibility as ViewIcon, 
  AccountBalanceWallet as WalletIcon,
  Percent as PercentIcon,
  People as PeopleIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon, // Added missing import
} from '@mui/icons-material';
import { format } from 'date-fns';
// Alternative: implement our own formatDistanceToNow function
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return options?.addSuffix ? 'just now' : 'now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return options?.addSuffix ? `${minutes} minute${minutes > 1 ? 's' : ''} ago` : `${minutes}m`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return options?.addSuffix ? `${hours} hour${hours > 1 ? 's' : ''} ago` : `${hours}h`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 7) {
    return options?.addSuffix ? `${days} day${days > 1 ? 's' : ''} ago` : `${days}d`;
  }
  return format(date, 'MMM d, yyyy');
};
import type { Transaction } from '../../types/transaction.types';

// Styles
const tableStyles = {
  container: {
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
    border: '1px solid',
    borderColor: 'divider',
  },
  headerCell: {
    backgroundColor: 'background.paper',
    color: 'text.secondary',
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '12px 16px',
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  bodyCell: {
    padding: '16px',
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:last-child': {
      pr: 3,
    },
  },
  amountCell: {
    fontWeight: 600,
    fontFamily: '"Roboto Mono", monospace',
  },
  emptyState: {
    p: 6,
    textAlign: 'center',
    '& .MuiSvgIcon-root': {
      fontSize: '3.5rem',
      color: 'action.disabled',
      mb: 2,
    },
  },
  loadingRow: {
    '& td': {
      padding: '16px',
    },
  },
  syndicatorAvatar: {
    width: 28,
    height: 28,
    fontSize: '0.75rem',
    border: '2px solid',
    borderColor: 'background.paper',
    '&:not(:first-of-type)': {
      marginLeft: -1,
    },
  },
  statusChip: {
    height: 24,
    borderRadius: '6px',
    fontWeight: 500,
    '& .MuiChip-label': {
      px: 1.5,
    },
  },
  actionButton: {
    color: 'text.secondary',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
};

import type { TransactionSyndicatorMetaData as BaseTransactionSyndicatorMetaData } from '../../types/transaction.types';

// Extend the base interface with any additional properties needed for the UI
interface TransactionSyndicatorMetaData extends BaseTransactionSyndicatorMetaData {
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatar?: string;
  };
}

interface TransactionsListProps {
  transactions: Array<Transaction & {
    syndicators?: TransactionSyndicatorMetaData[];
  }>;
  onViewTransaction: (transaction: Transaction) => void;
  loading?: boolean;
  error?: string;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onViewTransaction,
  loading = false,
  error,
}) => {
  // Loading state
  if (loading && (!transactions || transactions.length === 0)) {
    return (
      <Paper elevation={0} sx={tableStyles.container}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.headerCell}>Transaction</TableCell>
                <TableCell sx={tableStyles.headerCell} align="right">Amount</TableCell>
                <TableCell sx={tableStyles.headerCell} align="right">Rate</TableCell>
                <TableCell sx={tableStyles.headerCell} align="right">Interest</TableCell>
                <TableCell sx={tableStyles.headerCell}>Syndicators</TableCell>
                <TableCell sx={tableStyles.headerCell}>Date</TableCell>
                <TableCell sx={tableStyles.headerCell} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((row) => (
                <TableRow key={row} sx={tableStyles.loadingRow}>
                  <TableCell sx={tableStyles.bodyCell}>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell sx={tableStyles.bodyCell} align="right">
                    <Skeleton variant="text" width={80} sx={{ ml: 'auto' }} />
                  </TableCell>
                  <TableCell sx={tableStyles.bodyCell} align="right">
                    <Skeleton variant="text" width={60} sx={{ ml: 'auto' }} />
                  </TableCell>
                  <TableCell sx={tableStyles.bodyCell} align="right">
                    <Skeleton variant="text" width={80} sx={{ ml: 'auto' }} />
                  </TableCell>
                  <TableCell sx={tableStyles.bodyCell}>
                    <Skeleton variant="circular" width={28} height={28} />
                  </TableCell>
                  <TableCell sx={tableStyles.bodyCell}>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.bodyCell, pr: 3 }} align="right">
                    <Skeleton variant="circular" width={32} height={32} sx={{ ml: 'auto' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper elevation={0} sx={tableStyles.emptyState}>
        <Box>
          <Box
            component="img"
            src="/images/error-illustration.svg"
            alt="Error"
            sx={{ width: 120, height: 120, mb: 2, opacity: 0.8 }}
          />
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load transactions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Box>
      </Paper>
    );
  }

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <Paper elevation={0} sx={tableStyles.emptyState}>
        <WalletIcon fontSize="inherit" />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No transactions yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
          Get started by creating your first transaction. Click the "New Transaction" button to begin.
        </Typography>
      </Paper>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 7) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <Paper elevation={0} sx={tableStyles.container}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableStyles.headerCell}>
                <Box display="flex" alignItems="center">
                  <WalletIcon sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                  Transaction
                </Box>
              </TableCell>
              <TableCell sx={tableStyles.headerCell} align="right">Amount</TableCell>
              <TableCell sx={tableStyles.headerCell} align="right">
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  <PercentIcon sx={{ fontSize: 16, mr: 0.5, opacity: 0.7 }} />
                  Rate
                </Box>
              </TableCell>
              <TableCell sx={tableStyles.headerCell} align="right">Interest</TableCell>
              <TableCell sx={tableStyles.headerCell}>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                  Syndicators
                </Box>
              </TableCell>
              <TableCell sx={tableStyles.headerCell}>
                <Box display="flex" alignItems="center">
                  <EventIcon sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                  Date
                </Box>
              </TableCell>
              <TableCell sx={{ ...tableStyles.headerCell, pr: 3 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => {
              
              return (
                <TableRow 
                  key={transaction.transaction_id} 
                  hover 
                  sx={{ 
                    '&:last-child td': { 
                      borderBottom: 'none',
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell sx={tableStyles.bodyCell}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {transaction.transaction_id.slice(0, 8)}...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.transaction_id ? 'Transaction' : 'Loan'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ ...tableStyles.bodyCell, ...tableStyles.amountCell }} align="right">
                    {formatCurrency(transaction.total_principal_amount)}
                  </TableCell>
                  
                  <TableCell sx={tableStyles.bodyCell} align="right">
                    <Chip 
                      label={`${transaction.total_interest}%`}
                      size="small"
                      color={transaction.total_interest >= 10 ? 'success' : 'default'}
                      variant="outlined"
                      sx={tableStyles.statusChip}
                    />
                  </TableCell>
                  
                  <TableCell sx={{ ...tableStyles.bodyCell, ...tableStyles.amountCell }} align="right">
                    {formatCurrency(transaction.total_principal_amount * (transaction.total_interest / 100))}
                  </TableCell>
                  
                  <TableCell sx={tableStyles.bodyCell}>
                    {transaction.syndicators?.length > 0 ? (
                      <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': tableStyles.syndicatorAvatar }}>
                        {transaction.syndicators.map((syndicator, index) => {
                          // Use the username from the syndicator data
                          const displayName = syndicator.username || `Syndicator ${index + 1}`;
                          
                          return (
                            <Tooltip key={syndicator.user_id} title={displayName}>
                              <Avatar 
                                alt={displayName}
                                sx={{ bgcolor: 'primary.main' }}
                              >
                                {displayName.charAt(0).toUpperCase()}
                              </Avatar>
                            </Tooltip>
                          );
                        })}
                      </AvatarGroup>
                    ) : (
                      <Chip 
                        label="No syndicators" 
                        size="small" 
                        variant="outlined"
                        sx={tableStyles.statusChip}
                      />
                    )}
                  </TableCell>
                  
                  <TableCell sx={tableStyles.bodyCell}>
                    <Typography variant="body2">
                      {formatDate(transaction.created_at)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell sx={{ ...tableStyles.bodyCell, pr: 3 }} align="right">
                    <Tooltip title="View details">
                      <IconButton 
                        onClick={() => onViewTransaction(transaction)}
                        size="small"
                        sx={tableStyles.actionButton}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More options">
                      <IconButton size="small" sx={tableStyles.actionButton}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
   
  );
};

export default TransactionsList;