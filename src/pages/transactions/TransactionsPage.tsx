import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// Components
import TransactionForm from './TransactionForm';
import TransactionDetails from './TransactionDetails';
import TransactionsList from './TransactionsList';
import SummaryCards from './SummaryCards';

// Hooks
import { useTransactions } from './useTransactions';
import { useTransactionForm } from './useTransactionForm';

// Types
import type { Transaction } from '../../types/transaction.types';

const TransactionsPage: React.FC = () => {
  // State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Hooks
  const {
    transactions,
    friends,
    isLoading,
    isCreating,
    transactionsError,
    createTransaction: createTransactionApi,
  } = useTransactions();
  console.log("mian page, transactions=", transactions)
  const {
    formData,
    setFormData,
    selectedFriends,
    setSelectedFriends,
    errors,
    validateForm,
    resetForm,
  } = useTransactionForm();
  
  // Handle friend selection type issue
  const handleFriendSelectionWrapper = (selected: string[]) => {
    setSelectedFriends(selected);
  };

  // Handlers
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleViewTransaction = (transaction: Transaction) => {
    console.log('handleViewTransaction called with:', transaction);
    setSelectedTransaction(transaction);
    console.log('selectedTransaction state after set:', selectedTransaction);
  };

  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  const handleSubmitTransaction = async (data: typeof formData) => {
    if (!validateForm()) return;
    
    const result = await createTransactionApi(data);
    if (result.success) {
      handleCloseForm();
    } else {
      // Handle error (you might want to show a toast notification here)
      console.error('Failed to create transaction:', result.error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (transactionsError) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load transactions. Please try again later.
        </Alert>
      </Box>
    );
  }
   console.log("HITTINHs")
  return (
    <Box p={3}>
      {/* Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4" component="h1">
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
          size="large"
          disabled={isLoading}
        >
          Create Transaction
        </Button>
      </Box>

      {/* Summary Cards */}
      <SummaryCards
        transactions={transactions}
        loading={isLoading}
      />

      {/* Create Transaction Button */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleOpenForm}
          startIcon={<AddIcon />}
        >
          Create Transaction
        </Button>
      </Box>

      {/* Transactions List */}
      <TransactionsList
        transactions={transactions}
        onViewTransaction={handleViewTransaction}
        loading={isLoading}
        error={transactionsError}
      />

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTransaction}
        loading={isCreating}
        friends={Array.isArray(friends) ? friends.map(({ username, name }) => ({
          username,
          name: name || ''
        })) : []}
        errors={errors}
        formData={formData}
        setFormData={setFormData}
        selectedFriends={selectedFriends}
        handleFriendSelection={handleFriendSelectionWrapper}
      />

      {/* Transaction Details Dialog */}
      <TransactionDetails
        open={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={handleCloseDetails}
      />
      {/* Debug Info */}
      <div style={{ display: 'none' }}>
        <div>Selected Transaction: {JSON.stringify(selectedTransaction)}</div>
        <div>Dialog Open: {selectedTransaction ? 'true' : 'false'}</div>
      </div>
    </Box>
  );
};

export default TransactionsPage;
