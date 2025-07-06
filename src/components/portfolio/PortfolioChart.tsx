import React from "react";
import {
  Typography,
  useTheme,
  Paper,
  Stack,
  Divider,
  Skeleton,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { Transaction } from "../../types/transaction.types";
import { formatCurrency } from "../../utils/formatters";

interface PortfolioChartProps {
  transactions: Transaction[];
  totalPrincipal: number;
  totalInterest: number;
  loading?: boolean;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 1.5, borderRadius: 2 }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          {label}
        </Typography>
        {payload.map((entry) => (
          <Typography
            key={entry.name}
            variant="caption"
            sx={{ color: entry.color, display: "block" }}
          >
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

const PortfolioChart: React.FC<PortfolioChartProps> = ({
  transactions,
  totalPrincipal,
  totalInterest,
  loading = false,
}) => {
  const theme = useTheme();

  const pieData = [
    { name: "Total Principal", value: totalPrincipal },
    { name: "Total Interest", value: totalInterest },
  ];

  // const monthlyData = React.useMemo(() => {
  //   const monthlyBreakdown: {
  //     [key: string]: { principal: number; interest: number };
  //   } = {};
  //   transactions.forEach((transaction) => {
  //     const date = new Date(transaction.created_at);
  //     const monthKey = date.toLocaleString("default", {
  //       month: "short",
  //       year: "2-digit",
  //     });
  //     if (!monthlyBreakdown[monthKey]) {
  //       monthlyBreakdown[monthKey] = { principal: 0, interest: 0 };
  //     }
  //     monthlyBreakdown[monthKey].principal +=
  //       transaction.total_principal_amount;
  //     monthlyBreakdown[monthKey].interest += transaction.total_interest;
  //   });
  //   return Object.entries(monthlyBreakdown)
  //     .map(([month, data]) => ({ month, ...data }))
  //     .sort(
  //       (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  //   );
  // }, [transactions]);

  const PIE_COLORS = [theme.palette.primary.light, theme.palette.success.light];

  if (loading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={350} sx={{ borderRadius: 4 }} />
        <Skeleton variant="rounded" height={350} sx={{ borderRadius: 4 }} />
      </Stack>
    );
  }

  if (transactions.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 4,
          textAlign: "center",
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No transaction data available to render charts.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            Portfolio Distribution
          </Typography>
          <Divider />
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      </Paper>

      {/* {monthlyData.length > 0 && (
        <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>Monthly Performance</Typography>
            <Divider />
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatAmount(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="principal" stackId="a" fill={theme.palette.primary.main} name="Principal" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interest" stackId="a" fill={theme.palette.success.main} name="Interest" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Stack>
        </Paper>
      )} */}
    </Stack>
  );
};

export default PortfolioChart;
