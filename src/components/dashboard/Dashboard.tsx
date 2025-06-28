// src/components/dashboard/Dashboard.tsx
// TODO: Come back later, Grid Issue
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Container,
  Paper,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  Group,
  Assessment,
  MonetizationOn,
  Savings,
  People,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetPortfolioQuery,
  useGetAllTransactionsQuery,
} from "../../store/api/transactionApi";
import { useGetSyndicateViewQuery } from "../../store/api/syndicateApi";
import LoadingSpinner from "../common/LoadingSpinner";
import StatCard from "../common/StatCard";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: portfolio, isLoading: portfolioLoading } =
    useGetPortfolioQuery();
  const { data: transactions, isLoading: transactionsLoading } =
    useGetAllTransactionsQuery();
  const { data: syndicate, isLoading: syndicateLoading } =
    useGetSyndicateViewQuery();

  if (portfolioLoading || transactionsLoading || syndicateLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Calculate total commission earned
  const totalCommissionEarned =
    transactions?.transactions?.reduce((sum, transaction) => {
      return sum + (transaction.total_commission_earned || 0);
    }, 0) || 0;
  console.log("totalCommissionEarned", totalCommissionEarned);
  const stats = [
    {
      title: "Total Portfolio Value",
      value: `₹${portfolio?.total_principal_amount?.toLocaleString() || 0}`,
      icon: <AccountBalance />,
      color: "#1976d2",
      onClick: () => navigate("/portfolio"),
    },
    {
      title: "Expected Interest",
      value: `₹${
        portfolio?.total_interest_after_commission?.toLocaleString() || 0
      }`,
      icon: <TrendingUp />,
      color: "#2e7d32",
      onClick: () => navigate("/portfolio"),
    },
    {
      title: "Total Commission Earned",
      value: `₹${totalCommissionEarned.toLocaleString()}`,
      icon: <MonetizationOn />,
      color: "#ed6c02",
      onClick: () => navigate("/transactions"),
    },
    {
      title: "Active Transactions",
      value: transactions?.transaction_counts?.total || 0,
      icon: <Assessment />,
      color: "#9c27b0",
      onClick: () => navigate("/transactions"),
    },
    {
      title: "Syndicate Members",
      value: syndicate?.friends?.length || 0,
      icon: <Group />,
      color: "#ff9800",
      onClick: () => navigate("/syndicate"),
    },
  ];

  const statCards = [
    {
      icon: <Savings fontSize="inherit" />,
      label: "Total Invested",
      value: stats[0].value,
      color: "#6366f1",
      description: undefined,
    },
    {
      icon: <TrendingUp fontSize="inherit" />,
      label: "Total Returns",
      value: stats[1].value,
      color: "#22c55e",
      description: undefined,
    },
    {
      icon: <MonetizationOn fontSize="inherit" />,
      label: "Total Commission",
      value: stats[2].value,
      color: "#f59e42",
      description: undefined,
    },
    {
      icon: <AccountBalance fontSize="inherit" />,
      label: "Active Syndications",
      value: stats[3].value,
      color: "#3b82f6",
      description: undefined,
    },
    {
      icon: <People fontSize="inherit" />,
      label: "Pending Requests",
      value: stats[4].value,
      color: "#a855f7",
      description: undefined,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Overview
        </Typography>
        <Grid container spacing={3}>
          {statCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2.4} key={card.label}>
              <StatCard {...card} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/transactions/create")}
                  fullWidth
                >
                  Create New Transaction
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/friends")}
                  fullWidth
                >
                  Manage Friends
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {transactions?.transactions
                ?.slice(0, 3)
                .map((transaction: any) => (
                  <Box key={transaction.transaction_id} mb={2}>
                    <Typography variant="body2">
                      Transaction: ₹
                      {transaction.total_principal_amount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                )) || (
                <Typography variant="body2" color="text.secondary">
                  No recent transactions
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
