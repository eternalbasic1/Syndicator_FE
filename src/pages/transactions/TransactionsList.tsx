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
  Button,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { Visibility as ViewIcon, Add as AddIcon } from '@mui/icons-material';
import type { Transaction } from '../../types/transaction.types';
import { CircularProgress } from '@mui/material';

interface TransactionsListProps {
  transactions: Transaction[];
  onViewTransaction: (transaction: Transaction) => void;
  onCreateTransaction: () => void;
  loading?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onViewTransaction,
  onCreateTransaction,
  loading = false,
}) => {
  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }


  if (transactions.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No transactions found
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={2}>
          Create your first transaction to get started
        </Typography>
        <Button 
          variant="contained" 
          onClick={onCreateTransaction}
          startIcon={<AddIcon />}
        >
          Create Transaction
        </Button>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Principal Amount</TableCell>
              <TableCell>Interest Rate</TableCell>
              <TableCell>Interest Amount</TableCell>
              <TableCell>Syndicators</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transaction_id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {transaction.transaction_id.slice(0, 8)}...
                  </Typography>
                </TableCell>
                <TableCell>₹{transaction.total_principal_amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.total_interest}%</TableCell>
                <TableCell>
                  ₹{((transaction.total_principal_amount * transaction.total_interest) / 100).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${transaction.syndicators?.length || 0} syndicators`}
                    size="small"
                    color={transaction.syndicators?.length ? "primary" : "default"}
                    variant={transaction.syndicators?.length ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton 
                      onClick={() => onViewTransaction(transaction)}
                      size="small"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionsList;
