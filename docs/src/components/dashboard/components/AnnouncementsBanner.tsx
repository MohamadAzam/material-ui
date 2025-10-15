import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SecurityIcon from '@mui/icons-material/Security';
import { useRouter } from 'next/router';

interface SystemAlert {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  action?: string;
  dismissible: boolean;
  id: string;
}

const systemAlerts: SystemAlert[] = [
  {
    id: 'feature-update',
    type: 'info',
    title: 'New Feature Available',
    message: 'Enhanced AI models now available in your workspace with improved accuracy and faster response times.',
    action: 'Learn More',
    dismissible: true
  },
  {
    id: 'maintenance',
    type: 'warning',
    title: 'Scheduled Maintenance',
    message: 'System maintenance will occur on Sunday 2AM-4AM EST. Some features may be temporarily unavailable.',
    action: 'View Details',
    dismissible: false
  },
  {
    id: 'security-update',
    type: 'error',
    title: 'Security Update Required',
    message: 'Please update your password to maintain account security. Your current session will remain active.',
    action: 'Update Now',
    dismissible: true
  },
  {
    id: 'tip',
    type: 'success',
    title: 'Pro Tip',
    message: 'Use keyboard shortcuts Ctrl+K to quickly access AI wizards and boost your productivity.',
    dismissible: true
  },
  {
    id: 'community',
    type: 'success',
    title: 'Community Highlight',
    message: 'User @johndoe created an amazing novel using our Book Writing wizard! Join our community showcase.',
    action: 'Read Story',
    dismissible: true
  }
];

export default function AnnouncementsBanner() {
  const [dismissedAlerts, setDismissedAlerts] = React.useState<Set<string>>(new Set());
  const router = useRouter();

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleAction = (action: string, alertId: string) => {
    // Simple routing based on alert id/action
    switch (alertId) {
      case 'feature-update':
        router.push('/saas-frontpage');
        break;
      case 'maintenance':
        router.push('/blog');
        break;
      case 'security-update':
        router.push({ pathname: '/dashboard', query: { section: 'profile' } });
        break;
      case 'community':
        router.push('/blog');
        break;
      case 'enhanced-models':
        router.push('/saas-frontpage');
        break;
      case 'templates-library':
        router.push('/templates');
        break;
      case 'api-changes':
        router.push('/material-ui');
        break;
      default:
        // Fallback to homepage
        router.push('/');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <NewReleasesIcon />;
      case 'warning':
        return <SecurityIcon />;
      case 'success':
        return <TipsAndUpdatesIcon />;
      case 'error':
        return <SecurityIcon />;
      default:
        return <NewReleasesIcon />;
    }
  };

  const visibleAlerts = systemAlerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 2 }}>
        Announcements
      </Typography>
      
      <Stack spacing={2}>
        {visibleAlerts.map((alert) => (
          <Collapse key={alert.id} in={!dismissedAlerts.has(alert.id)}>
            <Alert
              variant="outlined"
              severity={alert.type}
              icon={getAlertIcon(alert.type)}
              action={
                <Stack direction="row" spacing={1} alignItems="center">
                  {alert.action && (
                    <Button
                      color="inherit"
                      size="small"
                      variant="outlined"
                      onClick={() => handleAction(alert.action!, alert.id)}
                      sx={{
                        minWidth: 100,
                        height: 32,
                        px: 2,
                        py: 0.5,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {alert.action}
                    </Button>
                  )}
                  {alert.dismissible && (
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => handleDismiss(alert.id)}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  )}
                </Stack>
              }
              sx={{
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>
                {alert.title}
              </AlertTitle>
              {alert.message}
            </Alert>
          </Collapse>
        ))}
      </Stack>

      {/* Feature Highlights Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
          What's New
        </Typography>
        
        <Stack spacing={2}>
          <Alert 
            variant="outlined"
            severity="success" 
            icon={<CelebrationIcon />}
            action={
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                onClick={() => handleAction('Try Models', 'enhanced-models')}
                sx={{
                  minWidth: 100,
                  height: 32,
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Try Now
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 600 }}>
              Enhanced AI Writing Models
            </AlertTitle>
            Our latest AI models now support 50+ languages and improved context understanding. 
            Experience faster generation speeds and more accurate content creation across all wizards!
          </Alert>
          
          <Alert 
            variant="outlined"
            severity="info" 
            icon={<TipsAndUpdatesIcon />}
            action={
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                onClick={() => handleAction('Browse Templates', 'templates-library')}
                sx={{
                  minWidth: 100,
                  height: 32,
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Browse
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 600 }}>
              New Templates Library
            </AlertTitle>
            Access 100+ professional templates for social media, emails, and articles. 
            Save time with pre-built structures tailored to your specific industry and use case.
          </Alert>

          <Alert 
            variant="outlined"
            severity="warning" 
            icon={<SecurityIcon />}
            action={
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                onClick={() => handleAction('Learn More', 'api-changes')}
                sx={{
                  minWidth: 100,
                  height: 32,
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Learn More
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 600 }}>
              API Updates Coming Soon
            </AlertTitle>
            We're introducing new API endpoints for better integration. 
            Existing endpoints will remain supported with a 6-month transition period.
          </Alert>
        </Stack>
      </Box>
    </Box>
  );
}