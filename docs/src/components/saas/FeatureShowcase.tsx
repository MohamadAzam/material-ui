import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/GridLegacy';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Zoom from '@mui/material/Zoom';
import { useTheme } from '@mui/material/styles';

// Icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const FeatureSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

const features = [
  {
    icon: AutoAwesomeIcon,
    title: 'AI-Powered Content Generation',
    description: 'Generate high-quality content in seconds using advanced AI models. From blog posts to marketing copy, create engaging content that resonates with your audience.',
    tags: ['GPT-4', 'Natural Language', 'Multi-format'],
  },
  {
    icon: SpeedIcon,
    title: 'Lightning Fast Performance',
    description: 'Experience blazing-fast content generation with our optimized infrastructure. Generate thousands of words in seconds, not hours.',
    tags: ['Sub-second', 'Scalable', 'Optimized'],
  },
  {
    icon: SecurityIcon,
    title: 'Enterprise Security',
    description: 'Your data is protected with enterprise-grade security. SOC 2 compliant with end-to-end encryption and secure data handling.',
    tags: ['SOC 2', 'Encrypted', 'Compliant'],
  },
  {
    icon: CloudIcon,
    title: 'Cloud-Native Architecture',
    description: 'Built on modern cloud infrastructure for maximum reliability and scalability. Access your content from anywhere, anytime.',
    tags: ['99.9% Uptime', 'Global CDN', 'Auto-scaling'],
  },
  {
    icon: AnalyticsIcon,
    title: 'Advanced Analytics',
    description: 'Track content performance with detailed analytics. Understand what works and optimize your content strategy with data-driven insights.',
    tags: ['Real-time', 'Insights', 'ROI Tracking'],
  },
  {
    icon: IntegrationInstructionsIcon,
    title: 'Seamless Integrations',
    description: 'Connect with your favorite tools and platforms. API-first design enables easy integration with your existing workflow.',
    tags: ['REST API', 'Webhooks', '100+ Integrations'],
  },
  {
    icon: SupportAgentIcon,
    title: '24/7 Expert Support',
    description: 'Get help when you need it with our dedicated support team. From onboarding to advanced features, we\'re here to help you succeed.',
    tags: ['24/7 Support', 'Expert Team', 'Priority Response'],
  },
  {
    icon: TrendingUpIcon,
    title: 'Continuous Improvement',
    description: 'Our AI models are constantly learning and improving. Benefit from regular updates and new features that enhance your content quality.',
    tags: ['Auto-updates', 'ML Learning', 'Feature Rich'],
  },
];

export default function FeatureShowcase() {
  const theme = useTheme();

  return (
    <FeatureSection>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8, position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
            <AutoFixHighIcon color="primary" />
            <Typography variant="overline" color="primary" fontWeight="bold">
              Powerful Features
            </Typography>
          </Stack>
          
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              mb: 3,
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            Everything You Need to Create Amazing Content
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Discover the comprehensive suite of features designed to streamline your content creation process 
            and boost your productivity.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <FeatureCard>
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <IconWrapper>
                      <IconComponent />
                    </IconWrapper>
                    
                    <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 3, flexGrow: 1, lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {feature.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          variant="outlined"
                          color="primary"

                        />
                      ))}
                    </Stack>
                  </CardContent>
                </FeatureCard>
              </Grid>
            );
          })}
        </Grid>

        {/* Bottom CTA Section */}
        <Box sx={{ textAlign: 'center', mt: 8, position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Ready to Transform Your Content Creation?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of content creators who are already using our platform to create amazing content.
          </Typography>
        </Box>
      </Container>
    </FeatureSection>
  );
}