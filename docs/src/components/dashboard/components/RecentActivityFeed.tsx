import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import ArticleIcon from '@mui/icons-material/Article';
import SocialIcon from '@mui/icons-material/Share';
import BookIcon from '@mui/icons-material/MenuBook';
import EmailIcon from '@mui/icons-material/Email';
import { useTheme } from '@mui/material/styles';

interface ActivityItem {
  id: string;
  type: 'social' | 'article' | 'book' | 'email' | 'other';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'draft';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'social',
    title: 'Instagram Post - Product Launch',
    description: 'Created engaging social media content for new product announcement',
    timestamp: '2 hours ago',
    status: 'completed'
  },
  {
    id: '2',
    type: 'article',
    title: 'Tech Blog Article',
    description: 'AI trends in 2024: A comprehensive analysis',
    timestamp: '5 hours ago',
    status: 'completed'
  },
  {
    id: '3',
    type: 'book',
    title: 'Chapter 3 - Character Development',
    description: 'Fantasy novel chapter focusing on protagonist growth',
    timestamp: '1 day ago',
    status: 'in-progress'
  },
  {
    id: '4',
    type: 'email',
    title: 'Marketing Campaign Email',
    description: 'Newsletter for Q1 product updates and features',
    timestamp: '2 days ago',
    status: 'completed'
  },
  {
    id: '5',
    type: 'article',
    title: 'SEO Optimization Guide',
    description: 'Complete guide to improving website search rankings',
    timestamp: '3 days ago',
    status: 'draft'
  }
];

export default function RecentActivityFeed() {
  const theme = useTheme();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'social':
        return <SocialIcon />;
      case 'article':
        return <ArticleIcon />;
      case 'book':
        return <BookIcon />;
      case 'email':
        return <EmailIcon />;
      default:
        return <CreateIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'social':
        return theme.palette.primary.main;
      case 'article':
        return theme.palette.success.main;
      case 'book':
        return theme.palette.secondary.main;
      case 'email':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Recent Activity
          </Typography>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => {/* Navigate to full history */}}
          >
            View All
          </Button>
        </Box>
        
        <List sx={{ p: 0 }}>
          {mockActivities.map((activity, index) => (
            <ListItem
              key={activity.id}
              sx={{
                px: 0,
                py: 1.5,
                borderBottom: index < mockActivities.length - 1 ? `1px solid ${theme.palette.divider}` : 'none'
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: getActivityColor(activity.type),
                    width: 40,
                    height: 40
                  }}
                >
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {activity.title}
                    </Typography>
                    <Chip
                      label={activity.status}
                      size="small"
                      color={getStatusColor(activity.status) as any}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.timestamp}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}