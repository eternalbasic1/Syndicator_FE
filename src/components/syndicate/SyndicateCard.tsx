import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { formatUserName, formatPhoneNumber } from '../../utils/formatters';

export interface Friend {
  user_id: string;
  username: string;
  name?: string;
  email: string;
  phone_number?: string;
}

interface SyndicateCardProps {
  friend: Friend;
  onSelect?: (friend: Friend) => void;
  onViewDetails?: (friend: Friend) => void;
  selected?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

const SyndicateCard: React.FC<SyndicateCardProps> = ({
  friend,
  onSelect,
  onViewDetails,
  selected = false,
  showActions = true,
  compact = false,
}) => {
  const displayName = formatUserName(friend.name, friend.username);
  const formattedPhone = friend.phone_number ? formatPhoneNumber(friend.phone_number) : null;

  const getAvatarColor = (name: string) => {
    const colors = ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#0288d1'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card
      sx={{
        cursor: onSelect ? 'pointer' : 'default',
        border: selected ? 2 : 1,
        borderColor: selected ? 'primary.main' : 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: onSelect ? 'translateY(-2px)' : 'none',
          boxShadow: onSelect ? 3 : 1,
        },
        minHeight: compact ? 'auto' : 200,
      }}
      onClick={() => onSelect?.(friend)}
    >
      <CardContent sx={{ pb: showActions ? 1 : 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(displayName),
              width: compact ? 40 : 56,
              height: compact ? 40 : 56,
              fontSize: compact ? '1rem' : '1.5rem',
              mr: 2,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box flex={1}>
            <Typography variant={compact ? 'body1' : 'h6'} component="div" noWrap>
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              @{friend.username}
            </Typography>
          </Box>

          {!compact && (
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        {!compact && (
          <Box>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {friend.email}
              </Typography>
            </Box>

            {formattedPhone && (
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formattedPhone}
                </Typography>
              </Box>
            )}

            <Box mt={2}>
              <Chip
                icon={<PersonIcon />}
                label="Friend"
                size="small"
                color="success"
                variant="outlined"
              />
            </Box>
          </Box>
        )}
      </CardContent>

      {showActions && !compact && (
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(friend);
            }}
          >
            View Details
          </Button>
          
          {onSelect && (
            <Button
              size="small"
              variant={selected ? 'contained' : 'outlined'}
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(friend);
              }}
            >
              {selected ? 'Selected' : 'Select'}
            </Button>
          )}
        </CardActions>
      )}

      {compact && selected && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" color="white" fontSize="12px">
            ✓
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default SyndicateCard;