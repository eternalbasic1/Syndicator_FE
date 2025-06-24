import React from 'react';
import {
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Button,
  Stack
} from '@mui/material';
import {
  Check as CheckIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useUpdateFriendRequestStatusMutation } from '../../store/api/friendApi';
import type { FriendRequestMetaData } from '../../types/friend.types';

interface FriendRequestCardProps {
  request: FriendRequestMetaData;
  onUpdate?: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ request, onUpdate }) => {
  const [updateFriendRequestStatus, { isLoading }] = useUpdateFriendRequestStatusMutation();

  const handleStatusUpdate = async (status: 'accepted' | 'rejected' | 'canceled') => {
    try {
      await updateFriendRequestStatus({ request_id: request.request_id, status }).unwrap();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update friend request:', error);
    }
  };

  const getStatusChip = (status: string) => {
    const colorMap: { [key: string]: 'success' | 'error' | 'warning' | 'default' } = {
      accepted: 'success',
      rejected: 'error',
      canceled: 'default',
      pending: 'warning',
    };
    return (
      <Chip
        label={status}
        color={colorMap[status] || 'default'}
        size="small"
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  const isReceived = request.request_type === 'received';
  const isPending = request.status === 'pending';
  const otherUser = request.other_user;

  return (
    <Paper 
      variant="outlined" 
      sx={{
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        borderRadius: '12px',
        transition: 'box-shadow 0.3s, border-color 0.3s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          borderColor: 'primary.light'
        }
      }}
    >
      <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
        <PersonIcon />
      </Avatar>
      <Box flexGrow={1}>
        <Typography variant="subtitle1" fontWeight="600" lineHeight={1.2}>
          {otherUser?.name || 'Unknown User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          @{otherUser?.username || 'unknown'}
        </Typography>
      </Box>
      <Box sx={{ ml: 'auto', flexShrink: 0 }}>
        {isPending ? (
          <Stack direction="row" spacing={1}>
            {isReceived ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleStatusUpdate('accepted')}
                  disabled={isLoading}
                  startIcon={<CheckIcon />}
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isLoading}
                  sx={{ textTransform: 'none', borderRadius: '8px' }}
                >
                  Reject
                </Button>
              </>
            ) : (
              <Tooltip title="Cancel Sent Request">
                <IconButton onClick={() => handleStatusUpdate('canceled')} disabled={isLoading}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ) : (
          getStatusChip(request.status)
        )}
      </Box>
    </Paper>
  );
};

export default FriendRequestCard;