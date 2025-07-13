import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import TransactionForm from "./TransactionForm";
import TransactionDetails from "./TransactionDetails";
import TransactionsList from "./TransactionsList";
import SummaryCards from "./SummaryCards";
import { useTransactions } from "./useTransactions";
import { useTransactionForm } from "./useTransactionForm";
import type { Transaction } from "../../types/transaction.types";

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const {
    transactions,
    friends,
    isLoading,
    isCreating,
    transactionsError,
    createTransaction: createTransactionApi,
  } = useTransactions();
  const {
    formData,
    setFormData,
    selectedFriends,
    setSelectedFriends,
    errors,
    validateForm,
    resetForm,
    handleRiskTakerFlagChange,
    handleRiskTakerCommissionChange,
  } = useTransactionForm();

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };
  const handleViewTransaction = (transaction: Transaction) =>
    setSelectedTransaction(transaction);
  const handleCloseDetails = () => setSelectedTransaction(null);
  const handleSubmitTransaction = async (data: typeof formData) => {
    if (!validateForm()) return;
    const result = await createTransactionApi(data);
    if (result.success) handleCloseForm();
  };

  return (
    <Container
      maxWidth={isDesktop ? "xl" : "lg"}
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3 },
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Box mb={{ xs: 2, sm: 3, md: 4 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Title */}
          <Grid item xs={12} sm={6} md={8}>
            <Typography
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
              fontWeight={700}
              color="text.primary"
              sx={{ mb: { xs: 1, sm: 0 } }}
            >
              Transactions
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Manage your syndication transactions and track performance
            </Typography>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} sm={6} md={4}>
            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={1}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              alignItems="center"
            >
              <Tooltip title="Refresh data">
                <IconButton
                  color="primary"
                  onClick={() => window.location.reload()}
                  size={isMobile ? "small" : "medium"}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                color="inherit"
                startIcon={<FilterIcon />}
                disabled={isLoading}
                size={isMobile ? "small" : "medium"}
                sx={{
                  minWidth: { xs: 80, sm: 100 },
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Filter
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenForm}
                size={isMobile ? "small" : "medium"}
                disabled={isLoading}
                sx={{
                  minWidth: { xs: 80, sm: 120 },
                  fontWeight: 600,
                }}
              >
                {isMobile ? "New" : "New Transaction"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Summary Cards Section */}
      <Box mb={{ xs: 2, sm: 3, md: 4 }}>
        <SummaryCards transactions={transactions} loading={isLoading} />
      </Box>

      {/* Main Content Section */}
      <Box>
        <Paper
          elevation={3}
          sx={{
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* Search and Filters Header */}
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8} md={9}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "background.default",
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    "&:focus-within": {
                      borderColor: "primary.main",
                      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                    },
                  }}
                >
                  <SearchIcon
                    sx={{
                      color: "text.secondary",
                      mr: 1,
                      fontSize: { xs: 18, sm: 20 },
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: isMobile ? "14px" : "16px",
                      background: "transparent",
                      color: "inherit",
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    size="small"
                    sx={{ display: { sm: "none" } }}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleOpenForm}
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{ display: { sm: "none" } }}
                  >
                    Add
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Transactions List */}
          <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <TransactionsList
              transactions={transactions}
              onViewTransaction={handleViewTransaction}
              loading={isLoading}
              error={
                typeof transactionsError === "string"
                  ? transactionsError
                  : transactionsError
                  ? "Failed to load transactions."
                  : undefined
              }
            />
          </Box>
        </Paper>
      </Box>

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTransaction}
        loading={isCreating}
        friends={
          Array.isArray(friends)
            ? friends.map(({ username, name }) => ({
                username,
                name: name || "",
              }))
            : []
        }
        errors={errors}
        formData={formData}
        setFormData={setFormData}
        selectedFriends={selectedFriends}
        handleFriendSelection={setSelectedFriends}
        handleRiskTakerFlagChange={handleRiskTakerFlagChange}
        handleRiskTakerCommissionChange={handleRiskTakerCommissionChange}
      />

      {/* Transaction Details Dialog */}
      <TransactionDetails
        open={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={handleCloseDetails}
      />
    </Container>
  );
};

export default TransactionsPage;
