import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";
import GridItem from "../../components/common/GridItem";
import { format } from "date-fns";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PercentIcon from "@mui/icons-material/Percent";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CommissionIcon from "@mui/icons-material/AccountBalance";
import type { Transaction as TransactionType } from "../../types/transaction.types";

interface TransactionDetailsProps {
  open: boolean;
  transaction: TransactionType | null;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  open,
  transaction,
  onClose,
}) => {
  React.useEffect(() => {
    console.log("TransactionDetails - open state:", open);
    console.log("TransactionDetails - transaction prop:", transaction);
  }, [open, transaction]);

  if (!transaction) {
    console.log("No transaction data available", transaction);
    return null;
  }

  console.log("Rendering TransactionDetails with:", {
    open,
    transactionId: transaction.transaction_id,
    transaction,
  });

  const totalInterestAmount =
    (transaction.total_principal_amount * transaction.total_interest) / 100;
  const totalAmount = transaction.total_principal_amount + totalInterestAmount;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      data-testid="transaction-details-dialog"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <MonetizationOnIcon color="primary" />
          <Typography variant="h6">Transaction Details</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Basic Transaction Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <GridItem xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Transaction ID
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "monospace", mb: 2 }}
                  >
                    {transaction.transaction_id}
                  </Typography>
                </GridItem>
                <GridItem xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Created Date
                      </Typography>
                      <Typography variant="body1" mb={2}>
                        {format(new Date(transaction.created_at), "PPpp")}
                      </Typography>
                    </Box>
                  </Box>
                </GridItem>
                <GridItem xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {format(new Date(transaction.start_date), "PP")}
                  </Typography>
                </GridItem>
              </Grid>
            </CardContent>
          </Card>

          {/* Risk Taker Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Risk Taker
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {transaction.risk_taker_name ||
                      transaction.risk_taker_username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Username: {transaction.risk_taker_username}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    ID: {transaction.risk_taker_id}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Financial Summary
              </Typography>
              <Grid container spacing={3}>
                <GridItem xs={12} md={3}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <MonetizationOnIcon fontSize="small" color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      Principal Amount
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ₹{transaction.total_principal_amount.toLocaleString()}
                  </Typography>
                </GridItem>
                <GridItem xs={12} md={3}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PercentIcon fontSize="small" color="success" />
                    <Typography variant="subtitle2" color="textSecondary">
                      Interest Rate
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {transaction.total_interest}%
                  </Typography>
                </GridItem>
                <GridItem xs={12} md={3}>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    Interest Amount
                  </Typography>
                  <Typography
                    variant="h5"
                    color="success.main"
                    fontWeight="bold"
                  >
                    ₹{totalInterestAmount.toLocaleString()}
                  </Typography>
                </GridItem>
                <GridItem xs={12} md={3}>
                  <Typography variant="subtitle2" color="textSecondary" mb={1}>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" color="error.main" fontWeight="bold">
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                </GridItem>
              </Grid>

              {/* Commission Information */}
              {transaction.commission_flag && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "warning.light",
                    borderRadius: 1,
                  }}
                >
                  <Grid container spacing={3}>
                    <GridItem xs={12} md={4}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CommissionIcon fontSize="small" color="warning" />
                        <Typography variant="subtitle2" color="textSecondary">
                          Commission Rate
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        color="warning.main"
                        fontWeight="bold"
                      >
                        {transaction.commission_rate}%
                      </Typography>
                    </GridItem>
                    <GridItem xs={12} md={4}>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        mb={1}
                      >
                        Commission Earned
                      </Typography>
                      <Typography
                        variant="h6"
                        color="warning.main"
                        fontWeight="bold"
                      >
                        ₹{transaction.total_commission_earned.toLocaleString()}
                      </Typography>
                    </GridItem>
                    <GridItem xs={12} md={4}>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        mb={1}
                      >
                        Commission Status
                      </Typography>
                      <Chip
                        label="Active"
                        color="warning"
                        variant="outlined"
                        size="small"
                      />
                    </GridItem>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Syndicators Overview */}
          {transaction.syndicators && transaction.syndicators.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Syndicators ({transaction.syndicators.length})
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {transaction.syndicators.map((syndicator) => (
                    <Chip
                      key={syndicator.user_id}
                      avatar={
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <AccountCircleIcon fontSize="small" />
                        </Avatar>
                      }
                      label={syndicator.username}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Splitwise Entries Detailed Breakdown */}
          {transaction.splitwise_entries &&
            transaction.splitwise_entries.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Splitwise Entries ({transaction.splitwise_entries.length})
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Splitwise ID</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Syndicator</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Email</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Principal</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Original Interest</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Interest After Commission</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>Commission Deducted</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Risk Taker</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Created</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {transaction.splitwise_entries.map((entry) => (
                          <TableRow key={entry.splitwise_id} hover>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontFamily: "monospace" }}
                              >
                                {entry.splitwise_id.slice(0, 8)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {entry.syndicator_name ||
                                    entry.syndicator_username}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  @{entry.syndicator_username}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {entry.syndicator_email}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color={
                                  entry.principal_amount > 0
                                    ? "primary"
                                    : "textSecondary"
                                }
                              >
                                ₹{entry.principal_amount.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="success.main">
                                ₹
                                {(
                                  (entry.original_interest / 100) *
                                  entry.principal_amount
                                ).toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="success.main">
                                ₹
                                {entry.interest_after_commission.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="warning.main">
                                ₹{entry.commission_deducted.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={entry.is_risk_taker ? "Yes" : "No"}
                                color={
                                  entry.is_risk_taker ? "primary" : "default"
                                }
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {format(new Date(entry.created_at), "PP")}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Splitwise Summary */}
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <GridItem container spacing={2}>
                      <GridItem xs={12} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total Splitwise Principal
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ₹
                          {transaction.splitwise_entries
                            .reduce(
                              (sum, entry) => sum + entry.principal_amount,
                              0
                            )
                            .toLocaleString()}
                        </Typography>
                      </GridItem>
                      <GridItem xs={12} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total Original Interest
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          ₹
                          {transaction.splitwise_entries
                            .reduce(
                              (sum, entry) => sum + entry.original_interest,
                              0
                            )
                            .toLocaleString()}
                        </Typography>
                      </GridItem>
                      <GridItem xs={12} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total Interest After Commission
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          ₹
                          {transaction.splitwise_entries
                            .reduce(
                              (sum, entry) =>
                                sum + entry.interest_after_commission,
                              0
                            )
                            .toLocaleString()}
                        </Typography>
                      </GridItem>
                      <GridItem xs={12} md={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Total Commission Deducted
                        </Typography>
                        <Typography variant="h6" color="warning.main">
                          ₹
                          {transaction.splitwise_entries
                            .reduce(
                              (sum, entry) => sum + entry.commission_deducted,
                              0
                            )
                            .toLocaleString()}
                        </Typography>
                      </GridItem>
                    </GridItem>
                  </Box>
                </CardContent>
              </Card>
            )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained" size="large">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetails;
