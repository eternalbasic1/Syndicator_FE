// src/pages/TransactionsPage.tsx
//TODO: Fix Grid issue
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useGetAllTransactionsQuery } from '../../store/api/transactionApi';
import TransactionCard from '../../components/transactions/TransactionCard';
import CreateTransactionDialog from '../../components/transactions/CreateTransactionDialog';

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const { 
    data: transactions, 
    isLoading, 
    error, 
    refetch 
  } = useGetAllTransactionsQuery(user?.username || '');

  const handleCreateTransaction = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCreateDialog(false);
    refetch();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateTransaction}
        >
          Create Transaction
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load transactions. Please try again.
        </Alert>
      )}

      {transactions && transactions.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No transactions found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Create your first transaction to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateTransaction}
          >
            Create Transaction
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {transactions?.map((transaction) => (
            <Grid item xs={12} md={6} lg={4} key={transaction.transaction_id}>
              <TransactionCard transaction={transaction} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateTransactionDialog
        open={openCreateDialog}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default TransactionsPage;
