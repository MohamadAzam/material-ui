import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';

import BuildIcon from '@mui/icons-material/Build';
import { useTheme } from '@mui/material/styles';

interface HealthMetric {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  value?: number;
  unit?: string;
  description: string;
}

const healthMetrics: HealthMetric[] = [
  {
    id: 'api-status',
    name: 'API Services',
    status: 'operational',
    description: 'All API endpoints responding normally'
  },
  {
    id: 'database',
    name: 'Database',
    status: 'operational',
    description: 'Database connections stable'
  },
  {
    id: 'ai-models',
    name: 'AI Models',
    status: 'operational',
    description: 'Content generation models online'
  },
  {
    id: 'cdn',
    name: 'CDN',
    status: 'degraded',
    description: 'Slightly elevated response times'
  }
];

const performanceMetrics = [
  {
    name: 'API Latency',
    value: 145,
    unit: 'ms',
    target: 200,
    status: 'good'
  },
  {
    name: 'Uptime',
    value: 99.9,
    unit: '%',
    target: 99.5,
    status: 'excellent'
  },
  {
    name: 'Success Rate',
    value: 98.7,
    unit: '%',
    target: 95,
    status: 'good'
  }
];

export default function SystemHealthIndicators() {
  const theme = useTheme();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'degraded':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'outage':
        return <ErrorIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'outage':
        return 'error';
      default:
        return 'success';
    }
  };

  const getPerformanceColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return theme.palette.success.main;
      case 'good':
        return theme.palette.info.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'critical':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getProgressValue = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        System Health
      </Typography>
      
      <Grid container spacing={3}>
        {/* Service Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <CloudIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Service Status
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                {healthMetrics.map((metric) => (
                  <Box key={metric.id}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      {getStatusIcon(metric.status)}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {metric.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {metric.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={metric.status}
                        size="small"
                        color={getStatusColor(metric.status) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <SpeedIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Performance
                </Typography>
              </Stack>
              
              <Stack spacing={3}>
                {performanceMetrics.map((metric, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {metric.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metric.value}{metric.unit}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue(metric.value, metric.target)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getPerformanceColor(metric.status),
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Target: {metric.target}{metric.unit}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Maintenance Notice */}
        <Grid size={12}>
          <Card sx={{ bgcolor: theme.palette.info.light, color: theme.palette.info.contrastText }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <BuildIcon />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Scheduled Maintenance
                  </Typography>
                  <Typography variant="body2">
                    System maintenance scheduled for Sunday 2:00 AM - 4:00 AM EST. 
                    Some services may be temporarily unavailable during this time.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}