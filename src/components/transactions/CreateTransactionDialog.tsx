/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/transactions/CreateTransactionDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useCreateTransactionMutation } from '../../store/api/transactionApi';
import { useGetSyndicateViewQuery } from '../../store/api/syndicateApi';
import LoadingSpinner from '../common/LoadingSpinner';

interface CreateTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

interface SyndicateDetail {
  username: string;
  principal_amount: number;
  interest: number;
}

const CreateTransactionDialog: React.FC<CreateTransactionDialogProps> = ({
  open,
  onClose,
}) => {
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const { data: syndicate } = useGetSyndicateViewQuery("sufgsu");
  
  const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [isSyndicated, setIsSyndicated] = useState(false);
  const [syndicateDetails, setSyndicateDetails] = useState<SyndicateDetail[]>([]);
  const [error, setError] = useState<string>('');

  const handleReset = () => {
    setTotalPrincipal(0);
    setTotalInterest(0);
    setIsSyndicated(false);
    setSyndicateDetails([]);
    setError('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addSyndicateDetail = () => {
    setSyndicateDetails([
      ...syndicateDetails,
      { username: '', principal_amount: 0, interest: totalInterest },
    ]);
  };

  const removeSyndicateDetail = (index: number) => {
    setSyndicateDetails(syndicateDetails.filter((_, i) => i !== index));
  };

  const updateSyndicateDetail = (index: number, field: keyof SyndicateDetail, value: string | number) => {
    const updated = [...syndicateDetails];
    updated[index] = { ...updated[index], [field]: value };
    setSyndicateDetails(updated);
  };

  const validateForm = (): boolean => {
    if (totalPrincipal <= 0) {
      setError('Total principal amount must be greater than 0');
      return false;
    }
    
    if (totalInterest <= 0) {
      setError('Total interest must be greater than 0');
      return false;
    }

    if (isSyndicated) {
      if (syndicateDetails.length === 0) {
        setError('Add at least one syndicate member');
        return false;
      }

      const totalSyndicatePrincipal = syndicateDetails.reduce(
        (sum, detail) => sum + detail.principal_amount,
        0
      );

      if (Math.abs(totalSyndicatePrincipal - totalPrincipal) > 0.01) {
        setError('Sum of syndicate principal amounts must equal total principal');
        return false;
      }

      for (const detail of syndicateDetails) {
        if (!detail.username) {
          setError('All syndicate members must have a username');
          return false;
        }
        if (detail.principal_amount <= 0) {
          setError('All principal amounts must be greater than 0');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      const payload: any = {
        total_principal_amount: totalPrincipal,
        total_interest_amount: totalInterest,
      };

      if (isSyndicated && syndicateDetails.length > 0) {
        payload.syndicate_details = syndicateDetails.reduce((acc, detail) => {
          acc[detail.username] = {
            principal_amount: detail.principal_amount,
            interest: detail.interest,
          };
          return acc;
        }, {} as any);
      }

      await createTransaction(payload).unwrap();
      handleClose();
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to create transaction');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Transaction</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            label="Total Principal Amount"
            type="number"
            value={totalPrincipal}
            onChange={(e) => setTotalPrincipal(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />
          
          <TextField
            label="Interest Rate (%)"
            type="number"
            value={totalInterest}
            onChange={(e) => {
              const newInterest = Number(e.target.value);
              setTotalInterest(newInterest);
              // Update all syndicate details with new interest rate
              setSyndicateDetails(details => 
                details.map(detail => ({ ...detail, interest: newInterest }))
              );
            }}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isSyndicated}
                onChange={(e) => setIsSyndicated(e.target.checked)}
              />
            }
            label="Syndicated Transaction"
          />

          {isSyndicated && (
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Syndicate Details</Typography>
                  <Button
                    startIcon={<Add />}
                    onClick={addSyndicateDetail}
                    variant="outlined"
                    size="small"
                  >
                    Add Member
                  </Button>
                </Box>
                //TODO: Need to completely revamp code as i can see friends is not in syndicate data
                {syndicate?.friends && (
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Available Friends:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {syndicate.friends.map((friend) => (
                        <Chip
                          key={friend.user_id}
                          label={friend.username}
                          size="small"
                          onClick={() => {
                            if (!syndicateDetails.find(d => d.username === friend.username)) {
                              setSyndicateDetails([
                                ...syndicateDetails,
                                { username: friend.username, principal_amount: 0, interest: totalInterest },
                              ]);
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {syndicateDetails.map((detail, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Username"
                            value={detail.username}
                            onChange={(e) => updateSyndicateDetail(index, 'username', e.target.value)}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Principal Amount"
                            type="number"
                            value={detail.principal_amount}
                            onChange={(e) => updateSyndicateDetail(index, 'principal_amount', Number(e.target.value))}
                            fullWidth
                            size="small"
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Interest (%)"
                            type="number"
                            value={detail.interest}
                            onChange={(e) => updateSyndicateDetail(index, 'interest', Number(e.target.value))}
                            fullWidth
                            size="small"
                            inputProps={{ min: 0, step: 0.01 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <IconButton
                            onClick={() => removeSyndicateDetail(index)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}

                {syndicateDetails.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Total Syndicate Principal: ₹
                      {syndicateDetails.reduce((sum, detail) => sum + detail.principal_amount, 0).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating}
        >
          {isCreating ? <LoadingSpinner size={20} /> : 'Create Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTransactionDialog;
