import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

export default function CardAlert() {
  const handleGetDiscount = () => {
    console.log('Get discount clicked');
    // Handle discount action
  };

  return (
    <Alert 
      variant="outlined"
      severity="warning"
      icon={<AutoAwesomeRoundedIcon />}
      action={
        <Button
          color="inherit"
          size="small"
          variant="outlined"
          onClick={handleGetDiscount}
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
          Get the discount
        </Button>
      }
      sx={{ 
        m: 1.5, 
        flexShrink: 0,
        '& .MuiAlert-message': {
          width: '100%'
        }
      }}
    >
      <AlertTitle sx={{ fontWeight: 600 }}>
        Plan about to expire
      </AlertTitle>
      Enjoy 10% off when renewing your plan today.
    </Alert>
  );
}
