import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EditIcon from '@mui/icons-material/Edit';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import EmailIcon from '@mui/icons-material/Email';
import ShareIcon from '@mui/icons-material/Share';
import BusinessIcon from '@mui/icons-material/Business';

interface WizardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const wizardCards: WizardCard[] = [
  {
    id: 'content-writer',
    title: 'Content Writer',
    description: 'Generate high-quality articles, blog posts, and web content with AI-powered writing assistance.',
    icon: <EditIcon />,
  },
  {
    id: 'story-creator',
    title: 'Story Creator',
    description: 'Craft compelling narratives, short stories, and creative fiction with intelligent plot development.',
    icon: <AutoStoriesIcon />,
  },
  {
    id: 'blog-assistant',
    title: 'Blog Assistant',
    description: 'Create engaging blog posts with SEO optimization and audience-focused content strategies.',
    icon: <RssFeedIcon />,
  },
  {
    id: 'email-composer',
    title: 'Email Composer',
    description: 'Write professional emails, newsletters, and marketing campaigns with personalized messaging.',
    icon: <EmailIcon />,
  },
  {
    id: 'social-media',
    title: 'Social Media Manager',
    description: 'Generate captivating social media posts, captions, and content calendars for all platforms.',
    icon: <ShareIcon />,
  },
  {
    id: 'business-writer',
    title: 'Business Writer',
    description: 'Create professional reports, proposals, and business documents with industry expertise.',
    icon: <BusinessIcon />,
  },
];

export default function AIWizardCards() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const handleCardClick = (cardId: string) => {
    const mapping: Record<string, string> = {
      'content-writer': 'Blog Post',
      'story-creator': 'Creative Writing',
      'blog-assistant': 'Blog Post',
      'email-composer': 'Email Campaign',
      'social-media': 'Social Media Post',
      'business-writer': 'Marketing Copy',
    };
    const contentType = mapping[cardId] || 'Blog Post';
    router.push({ pathname: '/saas-frontpage', query: { contentType } });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        AI Content Wizards
      </Typography>
      <Grid container spacing={2}>
        {wizardCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={card.id}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                {card.icon}
                <Typography
                  component="h2"
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: '600' }}
                >
                  {card.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
                  {card.description}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  endIcon={<ChevronRightRoundedIcon />}
                  fullWidth={isSmallScreen}
                  onClick={() => handleCardClick(card.id)}
                >
                  Start wizard
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}