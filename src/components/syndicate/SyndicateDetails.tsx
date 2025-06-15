import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AccountBox as AccountBoxIcon,
  Add as AddIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import type { SyndicateMember } from '../../types/syndicate.types';

interface SyndicateDetailsProps {
  open: boolean;
  onClose: () => void;
  friend?: SyndicateMember;
  syndicateData?: {
    friend_list_id: string;
    user: {
      user_id: string;
      username: string;
    };
    friends: SyndicateMember[];
    created_at: string;
  };
}

const SyndicateDetails: React.FC<SyndicateDetailsProps> = ({
  open,
  onClose,
  friend,
  syndicateData,
}) => {
  const [transactionAmount, setTransactionAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateTransaction = () => {
    if (!friend) return;
    
    try {
      const amount = parseFloat(transactionAmount);
      const interest = parseFloat(interestRate);
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      if (isNaN(interest) || interest < 0) {
        throw new Error('Please enter a valid interest rate');
      }

      // TODO: Implement transaction creation logic
      console.log('Creating transaction:', {
        friend,
        amount,
        interest,
      });
    } catch (error) {
      console.error('Transaction creation error:', error);
      // TODO: Show error message to user
    }
  };

  if (!open || !friend) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 4,
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
              }}
            >
              {friend ? (
                getInitials(friend.name || friend.username)
              ) : (
                <GroupIcon />
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {friend ? (
                  friend.name || friend.username
                ) : (
                  'Syndicate Overview'
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {friend ? `@${friend.username}` : 'Network Details'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {friend ? (
          // Individual Friend Details
          <Box>
            {/* Friend Information */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">
                      {friend.name || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountBoxIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="body1">@{friend.username}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1">{friend.email}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountBoxIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                      {friend.user_id}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Quick Transaction Form */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Quick Transaction
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Create a syndicated transaction with {friend.name || friend.username}
              </Alert>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Principal Amount"
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  placeholder="Enter amount"
                  fullWidth
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  }}
                />
                <TextField
                  label="Interest Rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="Enter interest rate"
                  fullWidth
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateTransaction}
                  disabled={!transactionAmount || !interestRate}
                  sx={{ mt: 1 }}
                >
                  Create Transaction
                </Button>
              </Box>
            </Box>
          </Box>
        ) : syndicateData ? (
          // Syndicate Overview
          <Box>
            <Typography variant="h6" gutterBottom>
              Syndicate Network Overview
            </Typography>
            
            <Box mb={3}>
              <Box display="flex" gap={2} mb={2}>
                <Chip
                  label={`${syndicateData.friends.length} Active Friends`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Created ${formatDate(syndicateData.created_at)}`}
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              Network Members
            </Typography>
            <List>
              {syndicateData.friends.map((networkFriend, index) => (
                <ListItem key={networkFriend.user_id} divider={index < syndicateData.friends.length - 1}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(networkFriend.name || networkFriend.username)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={networkFriend.name || networkFriend.username}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          @{networkFriend.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {networkFriend.email}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Active" size="small" color="success" variant="outlined" />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {syndicateData.friends.length === 0 && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                py={4}
              >
                <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Network Members
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Start by adding friends to build your syndicate network
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <Typography variant="h6" color="text.secondary">
              No data available
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {friend && (
          <Button variant="contained" startIcon={<AddIcon />}>
            Add to Transaction
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SyndicateDetails;