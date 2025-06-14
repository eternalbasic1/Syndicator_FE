// src/components/transactions/TransactionDetails.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { Transaction } from '../../types';

interface TransactionDetailsProps {
  open: boolean;
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  open,
  transaction,
  onClose,
}) => {
  const getTransactionType = () => {
    return transaction.syndicators.length > 0 ? 'Syndicated' : 'Solo';
  };

  const calculateExpectedReturn = () => {
    return (transaction.total_principal_amount * transaction.total_interest) / 100;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Transaction Details</Typography>
          <Chip
            label={getTransactionType()}
            color={transaction.syndicators.length > 0 ? 'primary' : 'default'}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Principal Amount
                  </Typography>
                  <Typography variant="h5">
                    ₹{transaction.total_principal_amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Interest Rate
                  </Typography>
                  <Typography variant="h5">
                    {transaction.total_interest}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Expected Return
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    ₹{calculateExpectedReturn().toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="h6">
                    {new Date(transaction.start_date).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {transaction.syndicators.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Syndicate Members ({transaction.syndicators.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {transaction.syndicators.map((syndicator, index) => (
                  <Box key={syndicator.user_id} mb={1}>
                    <Chip
                      label={syndicator.username}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {transaction.transaction_id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {new Date(transaction.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetails;