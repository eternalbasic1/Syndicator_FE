import type { FunctionComponent } from 'react';
import { Typography, Stack, Divider } from '@mui/material';

interface QuickStatsProps {
  activeTransactions: number;
  pendingRequests: number;
}

const QuickStats: FunctionComponent<QuickStatsProps> = ({ activeTransactions, pendingRequests }) => (
  <Stack spacing={2} mt={2}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" color="text.secondary">
        Active Syndications
      </Typography>
      <Typography variant="h6" fontWeight="medium">
        {activeTransactions}
      </Typography>
    </Stack>
    <Divider />
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" color="text.secondary">
        Pending Friend Requests
      </Typography>
      <Typography variant="h6" fontWeight="medium">
        {pendingRequests}
      </Typography>
    </Stack>
  </Stack>
);

export default QuickStats;
