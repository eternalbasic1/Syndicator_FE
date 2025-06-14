/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Tooltip,
type SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useGetAllTransactionsQuery, useCreateTransactionMutation, useGetSyndicateQuery } from '../store/api/apiSlice';
import { format } from 'date-fns';

interface SyndicateDetail {
  principal_amount: number;
  interest: number;
}

interface SyndicateDetails {
  [username: string]: SyndicateDetail;
}

interface CreateTransactionData {
  total_principal_amount: number;
  total_interest_amount: number;
  syndicate_details: SyndicateDetails;
}

const TransactionsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [formData, setFormData] = useState<CreateTransactionData>({
    total_principal_amount: 0,
    total_interest_amount: 0,
    syndicate_details: {}
  });
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: transactionsData, isLoading: transactionsLoading, error: transactionsError } = useGetAllTransactionsQuery();
  const { data: syndicateData, isLoading: syndicateLoading } = useGetSyndicateQuery();
  const [createTransaction, { isLoading: createLoading }] = useCreateTransactionMutation();

  const friends = syndicateData?.friends || [];
  const transactions = transactionsData?.transactions || [];

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setFormData({
      total_principal_amount: 0,
      total_interest_amount: 0,
      syndicate_details: {}
    });
    setSelectedFriends([]);
    setErrors({});
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrors({});
  };

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setOpenViewDialog(true);
  };

  const handleFriendSelection = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedFriends(value);
    
    // Update syndicate_details when friends are selected/deselected
    const newSyndicateDetails: SyndicateDetails = {};
    value.forEach(friendUsername => {
      newSyndicateDetails[friendUsername] = formData.syndicate_details[friendUsername] || {
        principal_amount: 0,
        interest: formData.total_interest_amount
      };
    });
    
    setFormData(prev => ({
      ...prev,
      syndicate_details: newSyndicateDetails
    }));
  };

  const handlePrincipalAmountChange = (friendUsername: string, amount: number) => {
    setFormData(prev => ({
      ...prev,
      syndicate_details: {
        ...prev.syndicate_details,
        [friendUsername]: {
          ...prev.syndicate_details[friendUsername],
          principal_amount: amount
        }
      }
    }));
  };

  const handleInterestChange = (newInterest: number) => {
    setFormData(prev => {
      const updatedSyndicateDetails = { ...prev.syndicate_details };
      Object.keys(updatedSyndicateDetails).forEach(friendUsername => {
        updatedSyndicateDetails[friendUsername].interest = newInterest;
      });
      
      return {
        ...prev,
        total_interest_amount: newInterest,
        syndicate_details: updatedSyndicateDetails
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.total_principal_amount <= 0) {
      newErrors.total_principal_amount = 'Total principal amount must be greater than 0';
    }

    if (formData.total_interest_amount <= 0) {
      newErrors.total_interest_amount = 'Total interest amount must be greater than 0';
    }

    if (selectedFriends.length > 0) {
      const totalSyndicateAmount = Object.values(formData.syndicate_details)
        .reduce((sum, detail) => sum + detail.principal_amount, 0);
      
      if (Math.abs(totalSyndicateAmount - formData.total_principal_amount) > 0.01) {
        newErrors.syndicate_total = 'Sum of syndicate principal amounts must equal total principal amount';
      }

      selectedFriends.forEach(friend => {
        if (!formData.syndicate_details[friend] || formData.syndicate_details[friend].principal_amount <= 0) {
          newErrors[`syndicate_${friend}`] = 'Principal amount must be greater than 0';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createTransaction(formData).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const calculateTotalStats = () => {
    const totalPrincipal = transactions.reduce((sum: number, t: any) => sum + t.total_principal_amount, 0);
    const totalInterest = transactions.reduce((sum: number, t: any) => sum + (t.total_principal_amount * t.total_interest / 100), 0);
    return { totalPrincipal, totalInterest };
  };

  const { totalPrincipal, totalInterest } = calculateTotalStats();

  if (transactionsLoading || syndicateLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (transactionsError) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load transactions</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          size="large"
        >
          Create Transaction
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalanceIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" color="primary">
                    Total Principal
                  </Typography>
                  <Typography variant="h4">
                    ₹{totalPrincipal.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" color="success.main">
                    Total Interest
                  </Typography>
                  <Typography variant="h4">
                    ₹{totalInterest.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="info" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" color="info.main">
                    Total Transactions
                  </Typography>
                  <Typography variant="h4">
                    {transactions.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
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
              {transactions.map((transaction: any) => (
                <TableRow key={transaction.transaction_id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {transaction.transaction_id.slice(0, 8)}...
                    </Typography>
                  </TableCell>
                  <TableCell>₹{transaction.total_principal_amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.total_interest}%</TableCell>
                  <TableCell>
                    ₹{(transaction.total_principal_amount * transaction.total_interest / 100).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${transaction.syndicators.length} syndicators`}
                      size="small"
                      color={transaction.syndicators.length > 0 ? "primary" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleViewTransaction(transaction)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {transactions.length === 0 && (
          <Box p={4} textAlign="center">
            <Typography variant="h6" color="textSecondary">
              No transactions found
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Create your first transaction to get started
            </Typography>
            <Button variant="contained" onClick={handleOpenDialog}>
              Create Transaction
            </Button>
          </Box>
        )}
      </Paper>

      {/* Create Transaction Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Principal Amount"
                  type="number"
                  value={formData.total_principal_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, total_principal_amount: Number(e.target.value) }))}
                  error={!!errors.total_principal_amount}
                  helperText={errors.total_principal_amount}
                  InputProps={{ startAdornment: '₹' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Interest Rate (%)"
                  type="number"
                  value={formData.total_interest_amount}
                  onChange={(e) => handleInterestChange(Number(e.target.value))}
                  error={!!errors.total_interest_amount}
                  helperText={errors.total_interest_amount}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Syndicators (Optional)</InputLabel>
                  <Select
                    multiple
                    value={selectedFriends}
                    onChange={handleFriendSelection}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {friends.map((friend: any) => (
                      <MenuItem key={friend.username} value={friend.username}>
                        {friend.name || friend.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {selectedFriends.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Syndicate Details
                  </Typography>
                  {errors.syndicate_total && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.syndicate_total}
                    </Alert>
                  )}
                  <Grid container spacing={2}>
                    {selectedFriends.map((friendUsername) => (
                      <Grid item xs={12} md={6} key={friendUsername}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {friendUsername}
                            </Typography>
                            <TextField
                              fullWidth
                              label="Principal Amount"
                              type="number"
                              value={formData.syndicate_details[friendUsername]?.principal_amount || 0}
                              onChange={(e) => handlePrincipalAmountChange(friendUsername, Number(e.target.value))}
                              error={!!errors[`syndicate_${friendUsername}`]}
                              helperText={errors[`syndicate_${friendUsername}`]}
                              InputProps={{ startAdornment: '₹' }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={createLoading}
            startIcon={createLoading ? <CircularProgress size={20} /> : null}
          >
            Create Transaction
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Transaction Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {selectedTransaction && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                    {selectedTransaction.transaction_id}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created Date
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {format(new Date(selectedTransaction.created_at), 'PPp')}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Principal Amount
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{selectedTransaction.total_principal_amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Interest Rate
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {selectedTransaction.total_interest}%
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Interest Amount
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    ₹{(selectedTransaction.total_principal_amount * selectedTransaction.total_interest / 100).toLocaleString()}
                  </Typography>
                </Grid>
                {selectedTransaction.syndicators.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Syndicators
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {selectedTransaction.syndicators.map((syndicator: any) => (
                        <Chip
                          key={syndicator.user_id}
                          label={syndicator.username}
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;