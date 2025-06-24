import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import FriendsList from '../components/friends/FriendsList';
import FriendRequests from '../components/friends/FriendRequests';

const FriendsPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Friends
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your friends and connect with others
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: '12px', p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              My Friends
            </Typography>
            <FriendsList />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: '12px', p: 3, height: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Friend Requests
            </Typography>
            <FriendRequests />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FriendsPage;