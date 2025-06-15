// src/components/transactions/TransactionDetails.tsx
// TODO: Grid Fix
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
  Container,
  Divider,
} from '@mui/material';
import type { Transaction } from '../../types/transaction.types';

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
              <Container maxWidth="sm">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Principal Amount
                    </Typography>
                    <Typography variant="h5">
                      ₹{transaction.total_principal_amount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Interest Rate
                    </Typography>
                    <Typography variant="h5">
                      {transaction.total_interest}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Expected Return
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      ₹{calculateExpectedReturn().toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="h6">
                      {new Date(transaction.start_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Container>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Splitwise Entries
              </Typography>
              <Divider sx={{ mb: 2 }} />
                {transaction.splitwise_entries.map((entry) => (
                  <Box key={entry.splitwise_id} mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {entry.syndicator_username}
                    </Typography>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">
                        Principal: ₹{entry.principal_amount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">
                        Interest: ₹{entry.interest_amount.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(entry.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
            </CardContent>
          </Card>

          {transaction.syndicators.length > 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Syndicate Members ({transaction.syndicators.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {transaction.syndicators.map((syndicator) => (
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
              <Container maxWidth="sm">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Transaction ID
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {transaction.transaction_id}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body2">
                      {new Date(transaction.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Container>
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