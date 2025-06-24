import React from 'react';
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  loading = false,
}) => {
  return (
    <Paper 
      elevation={3} 
      sx={{
        p: 2.5,
        borderRadius: '12px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[6],
          transform: 'translateY(-4px)',
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
            {title}
          </Typography>
          {loading ? (
            <Box sx={{ pt: 1 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Typography variant="h5" component="div" fontWeight="bold">
              {value}
            </Typography>
          )}
        </Stack>
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            borderRadius: '12px',
            backgroundColor: theme.palette[color].light,
            color: theme.palette[color].main,
            '& svg': {
              fontSize: '1.75rem',
            },
          })}>
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
};

export default StatsCard;