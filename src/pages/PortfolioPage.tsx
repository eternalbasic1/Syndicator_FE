import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  useGetPortfolioQuery,
  useGetAllTransactionsQuery,
} from "../store/api/transactionApi";
import type {
  Transaction,
  PortfolioStats as PortfolioStatsType,
} from "../types/transaction.types";
import Portfolio from "../components/portfolio/Portfolio";
import PortfolioChart from "../components/portfolio/PortfolioChart";
import PortfolioStats from "../components/portfolio/PortfolioStats";
import { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";

const PortfolioPage: React.FC = () => {
  const { data: portfolioData, isLoading: portfolioLoading } =
    useGetPortfolioQuery();
  const { data: transactionsResponse, isLoading: transactionsLoading } =
    useGetAllTransactionsQuery();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const allTransactions = useMemo<Transaction[]>(() => {
    if (!transactionsResponse) return [];
    const rawTransactions = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse.transactions || [];
    return rawTransactions.map(
      (tx: Partial<Transaction> & { total_interest_amount?: number }) => ({
        transaction_id: tx.transaction_id || "",
        risk_taker_id: tx.risk_taker_id || "",
        risk_taker_username: tx.risk_taker_username || "",
        risk_taker_name: tx.risk_taker_name || null,
        syndicators: tx.syndicators || [],
        total_principal_amount: tx.total_principal_amount || 0,
        total_interest: tx.total_interest || 0,
        commission_flag: tx.commission_flag || false,
        commission_rate: tx.commission_rate || 0,
        total_commission_earned: tx.total_commission_earned || 0,
        created_at: tx.created_at || new Date().toISOString(),
        start_date: tx.start_date || new Date().toISOString(),
        splitwise_entries: tx.splitwise_entries || [],
      })
    );
  }, [transactionsResponse]);

  const portfolioSummary = useMemo<
    PortfolioStatsType & {
      total_value: number;
      roi_percentage: number;
      monthly_earnings: number;
      total_commission_earned: number;
    }
  >(() => {
    const totalPrincipal = portfolioData?.total_principal_amount || 0;
    const totalInterestAfterCommission =
      portfolioData?.total_interest_after_commission || 0;
    const totalValue = totalPrincipal + totalInterestAfterCommission;
    const roiPercentage =
      totalPrincipal > 0
        ? (totalInterestAfterCommission / totalPrincipal) * 100
        : 0;
    const monthlyEarnings = totalInterestAfterCommission / 12; // Simplified

    // Calculate total commission earned from transactions
    const totalCommissionEarned = allTransactions.reduce(
      (sum, tx) => sum + (tx.total_commission_earned || 0),
      0
    );
    console.log("portfolioDataFINAL=", portfolioData);
    return {
      total_principal_amount: totalPrincipal,
      total_original_interest: portfolioData?.total_original_interest || 0,
      total_interest_after_commission: totalInterestAfterCommission,
      total_commission_impact: portfolioData?.total_commission_impact || 0,
      breakdown: portfolioData?.breakdown || {
        as_risk_taker: {
          principal: 0,
          interest: 0,
          commission_earned: 0,
        },
        as_syndicate_member: {
          principal: 0,
          original_interest: 0,
          interest_after_commission: 0,
          commission_paid: 0,
        },
      },
      total_value: totalValue,
      roi_percentage: roiPercentage,
      monthly_earnings: monthlyEarnings,
      total_commission_earned: totalCommissionEarned,
    };
  }, [portfolioData, allTransactions]);

  // Calculate the total corpus where the user is the risk taker (use transaction principal directly)
  const riskTakerCorpus = useMemo(() => {
    if (!user) return 0;
    return allTransactions.reduce((sum, tx) => {
      if (
        tx.risk_taker_id === user.user_id ||
        tx.risk_taker_username === user.username
      ) {
        return sum + (tx.total_principal_amount || 0);
      }
      return sum;
    }, 0);
  }, [allTransactions, user]);

  // Calculate the total interest for all risk taker transactions
  console.log("allTransactions=", allTransactions);
  console.log("user=", user);
  const riskTakerInterest = useMemo(() => {
    if (!user) return 0;
    return allTransactions.reduce((sum, tx) => {
      if (
        tx.risk_taker_id === user.user_id ||
        tx.risk_taker_username === user.username
      ) {
        return (
          sum + ((tx.total_principal_amount * tx.total_interest) / 100 || 0)
        );
      }
      return sum;
    }, 0);
  }, [allTransactions, user]);

  // Calculate total value as corpus + interest
  const totalValue = useMemo(
    () => riskTakerCorpus + riskTakerInterest,
    [riskTakerCorpus, riskTakerInterest]
  );

  const isLoading = portfolioLoading || transactionsLoading;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
    >
      <Typography
        variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
        component="h1"
        sx={{ mb: { xs: 2, sm: 3, md: 4 }, fontWeight: "bold" }}
      >
        Portfolio Overview
      </Typography>

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}
      >
        {/* Portfolio Summary */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: "12px",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          }}
        >
          <Portfolio
            summary={{
              risk_taker_corpus: riskTakerCorpus,
              risk_taker_interest: riskTakerInterest,
              total_commission_earned:
                portfolioData?.breakdown?.as_risk_taker?.commission_earned ?? 0,
              total_value: totalValue,
              active_transactions: allTransactions.filter(
                (tx) =>
                  tx.risk_taker_id === user?.user_id ||
                  tx.risk_taker_username === user?.username
              ).length,
            }}
            isLoading={isLoading}
          />
        </Paper>

        {/* Detailed Statistics */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: "12px",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          }}
        >
          <PortfolioStats
            transactions={allTransactions}
            totalPrincipal={portfolioSummary.total_principal_amount}
            totalInterest={portfolioSummary.total_interest_after_commission}
            loading={isLoading}
          />
        </Paper>

        {/* Portfolio Distribution & Monthly Performance */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: "12px",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          }}
        >
          <PortfolioChart
            transactions={allTransactions}
            totalPrincipal={riskTakerCorpus}
            totalInterest={riskTakerInterest}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default PortfolioPage;
