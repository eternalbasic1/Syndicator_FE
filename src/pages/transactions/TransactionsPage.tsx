import React, { useState } from 'react';
import { 
  Container,
  Box, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  useMediaQuery,
  useTheme,
  Stack,
  Skeleton,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';

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

// Styles
const pageStyles = {
  root: {
    width: '100%',
    p: { xs: 2, sm: 3 },
  },
  header: {
    mb: 4,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    justifyContent: 'space-between',
    gap: 2,
  },
  title: {
    fontWeight: 700,
    color: 'text.primary',
    mb: { xs: 2, sm: 0 },
  },
  actionButtons: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
  },
  content: {
    display: 'flex',
    flexDirection: { xs: 'column', lg: 'row' },
    gap: 3,
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
  },
  errorContainer: {
    p: 3,
    borderRadius: 2,
    backgroundColor: 'error.light',
    color: 'error.contrastText',
  },
  card: {
    p: 3,
    mb: 3,
    borderRadius: 3,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
  },
  sectionTitle: {
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
    flexWrap: 'wrap',
    gap: 2,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'background.paper',
    borderRadius: 2,
    px: 2,
    py: 1,
    border: '1px solid',
    borderColor: 'divider',
    '&:focus-within': {
      borderColor: 'primary.main',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
    },
  },
  searchInput: {
    ml: 1,
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '0.9375rem',
    '&::placeholder': {
      color: 'text.secondary',
    },
  },
};

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      <Box sx={pageStyles.root}>
        <Box sx={pageStyles.header}>
          <Skeleton variant="rounded" width={200} height={40} />
          <Skeleton variant="rounded" width={180} height={40} sx={{ ml: 'auto' }} />
        </Box>
        <Box sx={pageStyles.content}>
          <Box sx={pageStyles.mainContent}>
            <Skeleton variant="rounded" width="100%" height={180} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" width="100%" height={400} />
          </Box>
        </Box>
      </Box>
    );
  }

  // Render error state
  if (transactionsError) {
    return (
      <Box sx={pageStyles.root}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            },
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Failed to load transactions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please check your connection and try again.
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small" 
            color="inherit"
            onClick={() => window.location.reload()}
            startIcon={<RefreshIcon />}
            sx={{ ml: 'auto' }}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }
  return (
    <Container maxWidth="xl" sx={pageStyles.root}>
      {/* Header */}
      <Box sx={pageStyles.header}>
        <Typography variant="h4" component="h1" sx={pageStyles.title}>
          Transactions
        </Typography>
        
        <Stack direction="row" spacing={2} sx={pageStyles.actionButtons}>
          <Tooltip title="Refresh data">
            <IconButton 
              color="primary" 
              onClick={() => window.location.reload()}
              sx={{
                backgroundColor: 'action.hover',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FilterIcon />}
            disabled={isLoading}
            sx={{
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.secondary',
                backgroundColor: 'action.hover',
              },
            }}
          >
            {isMobile ? 'Filter' : 'Filter & Sort'}
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
            size={isMobile ? 'medium' : 'large'}
            disabled={isLoading}
            sx={{
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.06)',
              '&:hover': {
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.1)',
              },
            }}
          >
            {isMobile ? 'New' : 'New Transaction'}
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <SummaryCards transactions={transactions} loading={isLoading} />

      <Paper elevation={0} sx={pageStyles.card}>
        <Box sx={pageStyles.toolbar}>
          <Box sx={pageStyles.searchBar}>
            <SearchIcon color="action" fontSize="small" />
            <input
              type="text"
              placeholder="Search transactions..."
              style={pageStyles.searchInput}
            />
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Sort">
              <IconButton 
                size="small" 
                sx={{
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <SortIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              onClick={handleOpenForm}
              startIcon={<AddIcon />}
              size="small"
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                boxShadow: '0 1px 2px 0 rgba(79, 70, 229, 0.05)',
              }}
            >
              Add Transaction
            </Button>
          </Stack>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Transactions List */}
        <TransactionsList
          transactions={transactions}
          onViewTransaction={handleViewTransaction}
          loading={isLoading}
          error={transactionsError}
        />
      </Paper>

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
      
      {/* Debug Info - Only shown in development */}
      {import.meta.env.DEV && (
        <Box sx={{ display: 'none' }}>
          <div>Selected Transaction: {JSON.stringify(selectedTransaction)}</div>
          <div>Dialog Open: {selectedTransaction ? 'true' : 'false'}</div>
        </Box>
      )}
    </Container>
  );
};

export default TransactionsPage;
