/* eslint-disable @typescript-eslint/no-explicit-any */
//TODO: first fix types & come back here
import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Transaction {
  transaction_id: string;
  risk_taker_id: string;
  syndicators: Array<{
    user_id: string;
    username: string;
  }>;
  total_principal_amount: number;
  total_interest: number;
  created_at: string;
  start_date: string;
}

interface PortfolioChartProps {
  transactions: Transaction[];
  totalPrincipal: number;
  totalInterest: number;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  transactions, 
  totalPrincipal, 
  totalInterest 
}) => {
  const theme = useTheme();

  // Prepare pie chart data
  const pieData = [
    {
      name: 'Principal Amount',
      value: totalPrincipal,
      color: theme.palette.primary.main,
    },
    {
      name: 'Interest Amount',
      value: totalInterest,
      color: theme.palette.secondary.main,
    },
  ];

  // Prepare bar chart data (monthly breakdown)
  const monthlyData = React.useMemo(() => {
    const monthlyBreakdown: { [key: string]: { principal: number; interest: number; count: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = { principal: 0, interest: 0, count: 0 };
      }
      
      monthlyBreakdown[monthKey].principal += transaction.total_principal_amount;
      monthlyBreakdown[monthKey].interest += (transaction.total_principal_amount * transaction.total_interest) / 100;
      monthlyBreakdown[monthKey].count += 1;
    });

    return Object.entries(monthlyBreakdown)
      .map(([month, data]) => ({
        month,
        principal: Math.round(data.principal),
        interest: Math.round(data.interest),
        count: data.count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            boxShadow: 3,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {`${entry.dataKey}: ₹${entry.value?.toLocaleString()}`}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Overview
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 300,
              color: 'text.secondary',
            }}
          >
            <Typography variant="body1">
              No transactions available to display
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Pie Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Bar Chart - Monthly Breakdown */}
      {monthlyData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Transaction Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${(value / 1000)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="principal" 
                    fill={theme.palette.primary.main} 
                    name="Principal"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar 
                    dataKey="interest" 
                    fill={theme.palette.secondary.main} 
                    name="Interest"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PortfolioChart;