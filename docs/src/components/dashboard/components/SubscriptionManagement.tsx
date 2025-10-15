import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import {
  Check as CheckIcon,
  Star as StarIcon,
  Upgrade as UpgradeIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    apiCalls: number;
    storage: number;
    users: number;
  };
  popular?: boolean;
}

interface UsageData {
  apiCalls: { used: number; limit: number };
  storage: { used: number; limit: number };
  users: { used: number; limit: number };
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    interval: 'month',
    features: [
      'Up to 1,000 API calls/month',
      '1GB storage',
      '1 user account',
      'Basic support',
      'Standard templates',
    ],
    limits: {
      apiCalls: 1000,
      storage: 1,
      users: 1,
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29,
    interval: 'month',
    popular: true,
    features: [
      'Up to 10,000 API calls/month',
      '10GB storage',
      '5 user accounts',
      'Priority support',
      'Premium templates',
      'Advanced analytics',
    ],
    limits: {
      apiCalls: 10000,
      storage: 10,
      users: 5,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited API calls',
      '100GB storage',
      'Unlimited users',
      '24/7 dedicated support',
      'Custom templates',
      'Advanced analytics',
      'White-label options',
      'API access',
    ],
    limits: {
      apiCalls: -1, // -1 represents unlimited
      storage: 100,
      users: -1,
    },
  },
];

const currentSubscription = subscriptionPlans[1]; // Professional plan

const usageData: UsageData = {
  apiCalls: { used: 7500, limit: 10000 },
  storage: { used: 6.5, limit: 10 },
  users: { used: 3, limit: 5 },
};

export default function SubscriptionManagement() {
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  const handleUpgradeConfirm = () => {
    setShowUpgradeDialog(false);
    setSelectedPlan(null);
    // Here you would integrate with your payment system
  };

  const formatUsage = (used: number, limit: number, unit: string) => {
    if (limit === -1) return `${used.toLocaleString()} ${unit} (Unlimited)`;
    return `${used.toLocaleString()} / ${limit.toLocaleString()} ${unit}`;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'primary';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1200px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Subscription Management
      </Typography>

      <Grid container spacing={3}>
        {/* Current Subscription */}
        <Grid size={12}>
          <Card>
            <CardHeader 
              title="Current Subscription" 
              action={
                <Chip 
                  label="Active" 
                  color="success" 
                  variant="outlined"
                />
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h4" gutterBottom>
                    {currentSubscription.name}
                    {currentSubscription.popular && (
                      <Chip 
                        label="Popular" 
                        color="primary" 
                        size="small" 
                        icon={<StarIcon />}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${currentSubscription.price}/{currentSubscription.interval}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Next billing date: January 15, 2024
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<CreditCardIcon />}
                      size="small"
                    >
                      Update Payment
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ReceiptIcon />}
                      size="small"
                    >
                      View Invoices
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Cancel Subscription
                    </Button>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    Usage This Month
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">API Calls</Typography>
                        <Typography variant="body2">
                          {formatUsage(usageData.apiCalls.used, usageData.apiCalls.limit, 'calls')}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage(usageData.apiCalls.used, usageData.apiCalls.limit)}
                        color={getUsageColor(getUsagePercentage(usageData.apiCalls.used, usageData.apiCalls.limit))}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Storage</Typography>
                        <Typography variant="body2">
                          {formatUsage(usageData.storage.used, usageData.storage.limit, 'GB')}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage(usageData.storage.used, usageData.storage.limit)}
                        color={getUsageColor(getUsagePercentage(usageData.storage.used, usageData.storage.limit))}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Users</Typography>
                        <Typography variant="body2">
                          {formatUsage(usageData.users.used, usageData.users.limit, 'users')}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getUsagePercentage(usageData.users.used, usageData.users.limit)}
                        color={getUsageColor(getUsagePercentage(usageData.users.used, usageData.users.limit))}
                      />
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Plans */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            Available Plans
          </Typography>
          <Grid container spacing={3}>
            {subscriptionPlans.map((plan) => (
              <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    border: plan.id === currentSubscription.id ? 2 : 1,
                    borderColor: plan.id === currentSubscription.id ? 'primary.main' : 'divider',
                    position: 'relative',
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Most Popular"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1,
                      }}
                    />
                  )}
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      ${plan.price}
                      <Typography component="span" variant="body1" color="text.secondary">
                        /{plan.interval}
                      </Typography>
                    </Typography>
                    <List dense sx={{ flexGrow: 1 }}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                      {plan.id === currentSubscription.id ? (
                        <Button
                          fullWidth
                          variant="outlined"
                          disabled
                        >
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant={plan.popular ? 'contained' : 'outlined'}
                          startIcon={<UpgradeIcon />}
                          onClick={() => handlePlanSelect(plan)}
                        >
                          {plan.price > currentSubscription.price ? 'Upgrade' : 'Downgrade'}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Upgrade Confirmation Dialog */}
      <Dialog open={showUpgradeDialog} onClose={() => setShowUpgradeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirm Plan Change
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                You are about to {selectedPlan.price > currentSubscription.price ? 'upgrade' : 'downgrade'} to the {selectedPlan.name} plan.
              </Alert>
              <Typography variant="body1" gutterBottom>
                <strong>Current Plan:</strong> {currentSubscription.name} (${currentSubscription.price}/{currentSubscription.interval})
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>New Plan:</strong> {selectedPlan.name} (${selectedPlan.price}/{selectedPlan.interval})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {selectedPlan.price > currentSubscription.price 
                  ? 'You will be charged the prorated amount immediately.'
                  : 'The change will take effect at the next billing cycle.'
                }
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgradeDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgradeConfirm} variant="contained">
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cancel Subscription
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to cancel your subscription?
          </Alert>
          <Typography variant="body1" gutterBottom>
            Your subscription will remain active until the end of your current billing period (January 15, 2024).
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will lose access to all premium features and your data will be deleted after 30 days.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>
            Keep Subscription
          </Button>
          <Button onClick={() => setShowCancelDialog(false)} color="error" variant="contained">
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}