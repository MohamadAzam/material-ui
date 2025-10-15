import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Api as ApiIcon,
  Storage as StorageIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

interface StatCardData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: '1y', label: 'Last year' },
];

const statCards: StatCardData[] = [
  {
    title: 'API Calls',
    value: '7,542',
    change: 12.5,
    trend: 'up',
    icon: <ApiIcon />,
    color: 'primary',
  },
  {
    title: 'Storage Used',
    value: '6.5 GB',
    change: -2.1,
    trend: 'down',
    icon: <StorageIcon />,
    color: 'secondary',
  },
  {
    title: 'Active Users',
    value: '3',
    change: 0,
    trend: 'neutral',
    icon: <PeopleIcon />,
    color: 'success',
  },
  {
    title: 'Avg Response Time',
    value: '245ms',
    change: -8.3,
    trend: 'down',
    icon: <SpeedIcon />,
    color: 'warning',
  },
];

const usageMetrics: UsageMetric[] = [
  {
    name: 'API Calls',
    current: 7542,
    limit: 10000,
    unit: 'calls',
    data: [6200, 6800, 7100, 7300, 7400, 7500, 7542],
  },
  {
    name: 'Storage',
    current: 6.5,
    limit: 10,
    unit: 'GB',
    data: [5.2, 5.8, 6.1, 6.3, 6.4, 6.5, 6.5],
  },
  {
    name: 'Bandwidth',
    current: 125,
    limit: 500,
    unit: 'GB',
    data: [98, 110, 115, 120, 122, 124, 125],
  },
];

const chartData: ChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'API Calls',
      data: [1200, 1100, 1300, 1250, 1400, 1350, 1200],
      color: '#1976d2',
    },
    {
      label: 'Errors',
      data: [12, 8, 15, 10, 18, 14, 9],
      color: '#d32f2f',
    },
  ],
};

export default function UsageStatistics() {
  const [timeRange, setTimeRange] = React.useState('30d');

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon fontSize="small" />;
      case 'down':
        return <TrendingDownIcon fontSize="small" />;
      default:
        return <TrendingFlatIcon fontSize="small" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral', isPositive: boolean = true) => {
    if (trend === 'neutral') return 'text.secondary';
    if (trend === 'up') return isPositive ? 'success.main' : 'error.main';
    return isPositive ? 'error.main' : 'success.main';
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'primary';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1200px' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="h2" variant="h6">
          Usage Statistics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: `${stat.color}.light`,
                      color: `${stat.color}.main`,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: getTrendColor(stat.trend, stat.title !== 'Avg Response Time'),
                    }}
                  >
                    {getTrendIcon(stat.trend)}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {stat.change !== 0 ? `${Math.abs(stat.change)}%` : 'No change'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Usage Metrics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Resource Usage" />
            <CardContent>
              <Stack spacing={3}>
                {usageMetrics.map((metric, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {metric.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metric.current.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={getUsagePercentage(metric.current, metric.limit)}
                      color={getUsageColor(getUsagePercentage(metric.current, metric.limit))}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {getUsagePercentage(metric.current, metric.limit).toFixed(1)}% used
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Daily Activity" />
            <CardContent>
              <Box sx={{ height: 200, display: 'flex', alignItems: 'end', justifyContent: 'space-between', mb: 2 }}>
                {chartData.labels.map((label, index) => (
                  <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 160, justifyContent: 'end' }}>
                      {chartData.datasets.map((dataset, datasetIndex) => (
                        <Box
                          key={datasetIndex}
                          sx={{
                            width: 20,
                            height: `${(dataset.data[index] / Math.max(...dataset.data)) * 140}px`,
                            bgcolor: dataset.color,
                            borderRadius: 1,
                            mb: 0.5,
                            opacity: datasetIndex === 0 ? 1 : 0.7,
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {chartData.datasets.map((dataset, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: dataset.color,
                        borderRadius: 1,
                        mr: 1,
                      }}
                    />
                    <Typography variant="caption">{dataset.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Insights */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="Performance Insights" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h6" gutterBottom>
                      Peak Usage Time
                    </Typography>
                    <Typography variant="body1">
                      2:00 PM - 4:00 PM
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Highest API call volume
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="h6" gutterBottom>
                      Most Used Feature
                    </Typography>
                    <Typography variant="body1">
                      Text Generation
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      65% of total API calls
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <Typography variant="h6" gutterBottom>
                      Optimization Tip
                    </Typography>
                    <Typography variant="body1">
                      Cache Responses
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Reduce API calls by 30%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}