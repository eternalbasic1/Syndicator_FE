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
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import GridItem from '../../components/common/GridItem';
import { format } from 'date-fns';
import type { Transaction as TransactionType } from '../../types/transaction.types';

interface TransactionDetailsProps {
  open: boolean;
  transaction: TransactionType | null;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  open,
  transaction,
  onClose,
}) => {
  React.useEffect(() => {
    console.log('TransactionDetails - open state:', open);
    console.log('TransactionDetails - transaction prop:', transaction);
  }, [open, transaction]);

  if (!transaction) {
    console.log('No transaction data available', transaction);
    return null;
  }

  console.log('Rendering TransactionDetails with:', {
    open,
    transactionId: transaction.transaction_id,
    transaction
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      data-testid="transaction-details-dialog"
    >
      <DialogTitle>Transaction Details</DialogTitle>
      <DialogContent>
        {transaction && (
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <GridItem xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Transaction ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                  {transaction.transaction_id}
                </Typography>
              </GridItem>
              <GridItem xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body1" mb={2}>
                  {format(new Date(transaction.created_at), 'PPpp')}
                </Typography>
              </GridItem>
              <GridItem xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Principal Amount
                </Typography>
                <Typography variant="h6" color="primary">
                  ₹{transaction.total_principal_amount.toLocaleString()}
                </Typography>
              </GridItem>
              <GridItem xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Interest Rate
                </Typography>
                <Typography variant="h6" color="success.main">
                  {transaction.total_interest}%
                </Typography>
              </GridItem>
              <GridItem xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Interest Amount
                </Typography>
                <Typography variant="h6" color="success.main">
                  ₹{((transaction.total_principal_amount * transaction.total_interest) / 100).toLocaleString()}
                </Typography>
              </GridItem>
              
              {transaction.syndicators && transaction.syndicators.length > 0 && (
                <GridItem xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Syndicators
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {transaction.syndicators.map((syndicator) => (
                      <Chip
                        key={syndicator.user_id}
                        label={syndicator.username}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </GridItem>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetails;
