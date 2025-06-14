/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useUpdateFriendRequestStatusMutation } from '../../store/api/friendApi';
// TODO: fix utils
import { formatDate } from '../../utils/formatters';
import type { FriendRequest } from '../../types/friend.types';

interface FriendRequestCardProps {
  request: FriendRequest;
  currentUserId: string;
  onUpdate?: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentUserId,
  onUpdate,
}) => {
  const [updateFriendRequestStatus, { isLoading }] = useUpdateFriendRequestStatusMutation();

  const handleStatusUpdate = async (status: 'accepted' | 'rejected' | 'canceled') => {
    try {
      await updateFriendRequestStatus({
        request_id: request.request_id,
        status,
      }).unwrap();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update friend request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'canceled':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const isSentRequest = request.request_type === 'sent';
  const isReceivedRequest = request.request_type === 'received';
  const isPending = request.status === 'pending';

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: isPending ? '2px solid' : '1px solid',
        borderColor: isPending ? 'primary.main' : 'divider',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {request.other_user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{request.other_user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isSentRequest ? 'Request sent' : 'Request received'} • {formatDate(request.created_at)}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              color={getStatusColor(request.status) as any}
              size="small"
            />

            {isPending && isReceivedRequest && (
              <Box display="flex" gap={1}>
                <Tooltip title="Accept">
                  <IconButton
                    color="success"
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={isLoading}
                    size="small"
                  >
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton
                    color="error"
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={isLoading}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {isPending && isSentRequest && (
              <Tooltip title="Cancel Request">
                <IconButton
                  color="warning"
                  onClick={() => handleStatusUpdate('canceled')}
                  disabled={isLoading}
                  size="small"
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {request.status === 'accepted' && (
          <Box mt={2}>
            <Typography variant="body2" color="success.main">
              ✓ You are now friends with {request.other_user.name}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendRequestCard;