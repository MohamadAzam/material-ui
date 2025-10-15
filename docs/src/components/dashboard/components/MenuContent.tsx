import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SubscriptionsRoundedIcon from '@mui/icons-material/SubscriptionsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const mainListItems = [
  { text: 'Overview', icon: <HomeRoundedIcon />, id: 'overview' },
  { text: 'Usage Statistics', icon: <AnalyticsRoundedIcon />, id: 'usage-statistics' },
  { text: 'Profile', icon: <PersonRoundedIcon />, id: 'profile' },
  { text: 'Subscription', icon: <SubscriptionsRoundedIcon />, id: 'subscription' },
  { text: 'Content History', icon: <HistoryRoundedIcon />, id: 'content-history' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, id: 'settings' },
  { text: 'About', icon: <InfoRoundedIcon />, id: 'about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, id: 'feedback' },
];

interface MenuContentProps {
  selectedSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function MenuContent({ selectedSection = 'overview', onSectionChange }: MenuContentProps) {
  const handleItemClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              selected={selectedSection === item.id}
              onClick={() => handleItemClick(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              selected={selectedSection === item.id}
              onClick={() => handleItemClick(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
