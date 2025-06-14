/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/transactions/TransactionList.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Grid,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useGetAllTransactionsQuery } from '../../store/api/transactionApi';
import LoadingSpinner from '../common/LoadingSpinner';
import TransactionDetails from './TransactionDetails';
import type { Transaction } from '../../types/transaction.types';

const TransactionList: React.FC = () => {
  const { data, isLoading } = useGetAllTransactionsQuery("sufgsu");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (isLoading) {
    return <LoadingSpinner message="Loading transactions..." />;
  }

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  const getTransactionType = (syndicators: any[]) => {
    return syndicators.length > 0 ? 'Syndicated' : 'Solo';
  };

  return (
    <Box>
      {/*TODO: Need to fix types first then come back to here later*/}
      <Typography variant="h6" gutterBottom>
        All Transactions ({data?.transaction_count || 0})
      </Typography>
      
      {!data?.transactions?.length ? (
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No transactions found. Create your first transaction to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {data.transactions.map((transaction) => (
            <Grid item xs={12} key={transaction.transaction_id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="flex-start">
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6">
                          ₹{transaction.total_principal_amount.toLocaleString()}
                        </Typography>
                        <Chip
                          label={getTransactionType(transaction.syndicators)}
                          size="small"
                          color={transaction.syndicators.length > 0 ? 'primary' : 'default'}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Interest Rate: {transaction.total_interest}% | 
                        Created: {new Date(transaction.created_at).toLocaleDateString()}
                      </Typography>
                      
                      {transaction.syndicators.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Syndicators: {transaction.syndicators.map(s => s.username).join(', ')}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(transaction)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {selectedTransaction && (
        <TransactionDetails
          open={detailsOpen}
          transaction={selectedTransaction}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </Box>
  );
};

export default TransactionList;
