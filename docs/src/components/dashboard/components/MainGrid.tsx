import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';
import UserProfile from './UserProfile';
import SubscriptionManagement from './SubscriptionManagement';
import UsageStatistics from './UsageStatistics';
import ContentHistory from './ContentHistory';
import WelcomeHeader from './WelcomeHeader';
import RecentActivityFeed from './RecentActivityFeed';
import AIWizardCards from './AIWizardCards';
import SystemHealthIndicators from './SystemHealthIndicators';
import AnnouncementsBanner from './AnnouncementsBanner';

const data: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

interface MainGridProps {
  selectedSection?: string;
}

export default function MainGrid({ selectedSection = 'overview' }: MainGridProps) {
  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return <UserProfile />;
      case 'subscription':
        return <SubscriptionManagement />;
      case 'usage-statistics':
        return <UsageStatistics />;
      case 'content-history':
        return <ContentHistory />;
      case 'overview':
      default:
        return (
          <>
            {/* Welcome Header */}
            <WelcomeHeader />
            
            {/* Announcements Banner */}
            <AnnouncementsBanner />
            
            {/* AI Wizard Cards */}
            <Box sx={{ mb: 4 }}>
              <AIWizardCards />
            </Box>
            
            {/* Key Metrics */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Key Metrics
            </Typography>
            <Grid
              container
              spacing={2}
              columns={12}
              sx={{ mb: 4 }}
            >
              {data.map((card, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard {...card} />
                </Grid>
              ))}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <HighlightedCard />
              </Grid>
            </Grid>

            {/* Recent Activity and System Health */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <RecentActivityFeed />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Box>
                  <SystemHealthIndicators />
                </Box>
              </Grid>
            </Grid>

            {/* Charts Section */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Analytics Overview
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <SessionsChart />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <PageViewsBarChart />
              </Grid>
            </Grid>

            {/* Detailed Data Section */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Detailed Analytics
            </Typography>
            <Grid container spacing={2} columns={12}>
              <Grid size={{ xs: 12, lg: 9 }}>
                <CustomizedDataGrid />
              </Grid>
              <Grid size={{ xs: 12, lg: 3 }}>
                <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
                  <CustomizedTreeView />
                  <ChartUserByCountry />
                </Stack>
              </Grid>
            </Grid>
          </>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {renderContent()}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
