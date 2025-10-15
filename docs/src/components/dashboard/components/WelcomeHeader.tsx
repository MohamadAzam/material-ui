import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoginIcon from '@mui/icons-material/Login';


interface WelcomeHeaderProps {
  userName?: string;
  userAvatar?: string;
  accountStatus?: 'active' | 'trial' | 'premium' | 'suspended';
  lastLogin?: string;
  sessionDuration?: string;
}

export default function WelcomeHeader({
  userName = 'John Doe',
  userAvatar,
  accountStatus = 'premium',
  lastLogin = '2 hours ago',
  sessionDuration = '1h 23m'
}: WelcomeHeaderProps) {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'premium':
        return 'success';
      case 'active':
        return 'primary';
      case 'trial':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Card 
      sx={(theme) => ({ 
        mb: 2, // Reduced from 3 to 2
        minHeight: { xs: 'auto', sm: 100, md: 120 }, // Reduced from 140/160 to 100/120
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: theme.palette.primary.contrastText,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
          opacity: 0.1,
          zIndex: 0
        }
      })}
    >
      <CardContent 
        sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 }, // Reduced from 3/4/5 to 2/2.5/3
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={(theme) => ({ 
            xs: theme.spacing(3), // Reduced from 5 to 3
            sm: theme.spacing(3.5), // Reduced from 6 to 3.5
            md: theme.spacing(4) // Reduced from 8 to 4
          })}
          alignItems="center"
          justifyContent="center"
          sx={{ 
            width: '100%',
            maxWidth: { xs: '100%', md: 1200 },
            textAlign: { xs: 'center', md: 'left' },
            mx: 'auto',
            gap: { xs: 2.5, sm: 3, md: 3.5 } // Reduced from 4/5/6 to 2.5/3/3.5
          }}
        >
          {/* Avatar Container with Clear Separation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
              order: { xs: 1, md: 1 },
              mb: { xs: 2, sm: 1.5, md: 0 }, // Reduced from 4/3/0 to 2/1.5/0
              mr: { xs: 0, md: 2 }, // Reduced from 4 to 2
              position: 'relative',
              minWidth: { xs: 'auto', md: 100 }, // Reduced from 140 to 100
              isolation: 'isolate'
            }}
          >
            <IconButton 
              sx={{ 
                p: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%'
              }}
              onClick={() => {/* Navigate to profile */}}
            >
              <Avatar
                src={userAvatar}
                sx={(theme) => ({ 
                  width: { xs: 64, sm: 72, md: 80 }, // Reduced from 88/104/120 to 64/72/80
                  height: { xs: 64, sm: 72, md: 80 }, // Reduced from 88/104/120 to 64/72/80
                  border: `3px solid ${theme.palette.primary.contrastText}`, // Reduced from 4px to 3px
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 6px 24px rgba(0, 0, 0, 0.15)`, // Reduced shadow
                  '&:hover': {
                    transform: 'scale(1.05)', // Reduced from 1.08 to 1.05
                    boxShadow: `0 12px 36px rgba(0, 0, 0, 0.25)` // Reduced shadow
                  }
                })}
              >
                <PersonIcon sx={{ fontSize: { xs: 32, sm: 36, md: 40 } }} /> {/* Reduced from 44/52/60 to 32/36/40 */}
              </Avatar>
            </IconButton>
          </Box>

          {/* User Information - Clear Separation */}
          <Stack 
            spacing={(theme) => ({ xs: theme.spacing(1.5), sm: theme.spacing(2) })} // Reduced from 2.5/3 to 1.5/2
            alignItems={{ xs: 'center', md: 'flex-start' }}
            justifyContent="center"
            sx={{ 
              flex: 1,
              order: { xs: 2, md: 2 },
              maxWidth: { xs: '100%', md: 'none' },
              minHeight: { xs: 'auto', md: 80 }, // Reduced from 120 to 80
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              pl: { xs: 0, md: 2 }, // Reduced from 3 to 2
              pr: { xs: 0, md: 1.5 }, // Reduced from 2 to 1.5
              py: { xs: 1, md: 0 }, // Reduced from 2 to 1
              position: 'relative',
              zIndex: 1
            }}
          >
            <Box
              sx={{
                width: '100%',
                minHeight: { xs: 'auto', md: 70 }, // Reduced from 100 to 70
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: { xs: 1, sm: 1.5 } // Reduced from 1.5/2 to 1/1.5
              }}
            >
              <Typography 
                variant="h4" 
                sx={(theme) => ({ 
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  mb: { xs: 0.5, sm: 0.25 }, // Reduced from 1/0.5 to 0.5/0.25
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, // Reduced from 1.75/2/2.25rem to 1.5/1.75/2rem
                  lineHeight: 1.1, // Reduced from 1.2 to 1.1
                  textAlign: { xs: 'center', md: 'left' },
                  wordBreak: 'break-word',
                  hyphens: 'auto'
                })}
              >
                {getGreeting()}, {userName}!
              </Typography>
              <Typography 
                variant="body1" 
                sx={(theme) => ({ 
                  color: theme.palette.primary.contrastText,
                  opacity: 0.9,
                  mb: { xs: 1, sm: 0.75 }, // Reduced from 2/1.5 to 1/0.75
                  fontSize: { xs: '0.875rem', sm: '1rem' }, // Reduced from 1/1.125rem to 0.875/1rem
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.3 // Reduced from 1.4 to 1.3
                })}
              >
                {getCurrentDateTime()}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: { xs: 0.5, sm: 0.25 } // Reduced from 1/0.5 to 0.5/0.25
                }}
              >
                <Chip
                  label={accountStatus.toUpperCase()}
                  color={getAccountStatusColor(accountStatus) as any}
                  size="small" // Changed from medium to small
                  sx={{ 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    height: { xs: 28, sm: 30 }, // Reduced from 32/36 to 28/30
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Reduced from 0.875/1rem to 0.75/0.875rem
                    px: 1.5 // Reduced from 2 to 1.5
                  }}
                />
              </Box>
            </Box>
          </Stack>

          {/* Session Information - Clear Separation */}
          <Stack 
            spacing={(theme) => theme.spacing(1.5)} // Reduced from 2.5 to 1.5
            sx={{ 
              minWidth: { xs: '100%', md: 200 }, // Reduced from 260 to 200
              alignItems: { xs: 'center', md: 'flex-end' },
              justifyContent: 'center',
              order: { xs: 3, md: 3 },
              mt: { xs: 2, sm: 1.5, md: 0 }, // Reduced from 4/3/0 to 2/1.5/0
              ml: { xs: 0, md: 2 }, // Reduced from 3 to 2
              minHeight: { xs: 'auto', md: 80 }, // Reduced from 120 to 80
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              isolation: 'isolate'
            }}
          >
            <Stack 
              direction="row" 
              spacing={(theme) => theme.spacing(1.5)} // Reduced from 2 to 1.5
              alignItems="center"
              sx={{
                justifyContent: { xs: 'center', md: 'flex-end' },
                py: 0.25 // Reduced from 0.5 to 0.25
              }}
            >
              <LoginIcon 
                sx={(theme) => ({ 
                  color: theme.palette.primary.contrastText,
                  opacity: 0.85,
                  fontSize: { xs: 18, sm: 20 } // Reduced from 20/22 to 18/20
                })} 
              />
              <Typography 
                variant="body2" 
                sx={(theme) => ({ 
                  color: theme.palette.primary.contrastText,
                  opacity: 0.95,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Reduced from 0.875/1rem to 0.75/0.875rem
                  fontWeight: 500,
                  lineHeight: 1.3 // Reduced from 1.4 to 1.3
                })}
              >
                Last login: {lastLogin}
              </Typography>
            </Stack>
            <Stack 
              direction="row" 
              spacing={(theme) => theme.spacing(1.5)} // Reduced from 2 to 1.5
              alignItems="center"
              sx={{
                justifyContent: { xs: 'center', md: 'flex-end' },
                py: 0.25 // Reduced from 0.5 to 0.25
              }}
            >
              <AccessTimeIcon 
                sx={(theme) => ({ 
                  color: theme.palette.primary.contrastText,
                  opacity: 0.85,
                  fontSize: { xs: 18, sm: 20 } // Reduced from 20/22 to 18/20
                })} 
              />
              <Typography 
                variant="body2" 
                sx={(theme) => ({ 
                  color: theme.palette.primary.contrastText,
                  opacity: 0.95,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Reduced from 0.875/1rem to 0.75/0.875rem
                  fontWeight: 500,
                  lineHeight: 1.3 // Reduced from 1.4 to 1.3
                })}
              >
                Session: {sessionDuration}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}