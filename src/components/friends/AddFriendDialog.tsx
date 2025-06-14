import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useCreateFriendRequestMutation } from '../../store/api/friendApi';
import { validateUsername } from '../../utils/validators';

interface AddFriendDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [createFriend, { isLoading }] = useCreateFriendMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate username
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const result = await createFriend({
        mutual_friend_name: username.trim(),
      }).unwrap();

      // Show success message based on result
      if (result.created) {
        setUsername('');
        onSuccess?.();
        onClose();
      } else {
        setError('Friend request already exists or users are already friends.');
      }
    } catch (err: any) {
      if (err.data?.error) {
        setError(err.data.error);
      } else {
        setError('Failed to send friend request. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setUsername('');
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonAddIcon color="primary" />
            <Typography variant="h6">Add Friend</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the username of the person you'd like to add as a friend.
            </Typography>

            <TextField
              autoFocus
              label="Username"
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    @
                  </InputAdornment>
                ),
              }}
              error={!!error}
              helperText={error || 'Username must be at least 3 characters long'}
              disabled={isLoading}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !username.trim()}
            startIcon={<PersonAddIcon />}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddFriendDialog;