import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
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
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h5" component="div">
                {value}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: ${color}.light,
              color: ${color}.main,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;