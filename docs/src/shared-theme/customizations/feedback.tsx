import { Theme, alpha, Components } from '@mui/material/styles';
import { gray, orange, green, red, brand } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        color: (theme.vars || theme).palette.text.primary,
        fontWeight: 500,
        '& .MuiAlert-icon': {
          fontSize: '1.25rem',
        },
        '& .MuiAlert-action': {
          paddingTop: 0,
          paddingBottom: 0,
        },
      }),
      standardSuccess: ({ theme }) => ({
        backgroundColor: green[50],
        border: `1px solid ${alpha(green[300], 0.5)}`,
        color: green[800],
        '& .MuiAlert-icon': {
          color: green[600],
        },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(green[900], 0.3),
          border: `1px solid ${alpha(green[700], 0.5)}`,
          color: green[100],
          '& .MuiAlert-icon': {
            color: green[400],
          },
        }),
      }),
      standardWarning: ({ theme }) => ({
        backgroundColor: orange[50],
        border: `1px solid ${alpha(orange[300], 0.5)}`,
        color: orange[800],
        '& .MuiAlert-icon': {
          color: orange[600],
        },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(orange[900], 0.3),
          border: `1px solid ${alpha(orange[700], 0.5)}`,
          color: orange[100],
          '& .MuiAlert-icon': {
            color: orange[400],
          },
        }),
      }),
      standardError: ({ theme }) => ({
        backgroundColor: red[50],
        border: `1px solid ${alpha(red[300], 0.5)}`,
        color: red[800],
        '& .MuiAlert-icon': {
          color: red[600],
        },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(red[900], 0.3),
          border: `1px solid ${alpha(red[700], 0.5)}`,
          color: red[100],
          '& .MuiAlert-icon': {
            color: red[400],
          },
        }),
      }),
      standardInfo: ({ theme }) => ({
        backgroundColor: brand[50],
        border: `1px solid ${alpha(brand[300], 0.5)}`,
        color: brand[800],
        '& .MuiAlert-icon': {
          color: brand[600],
        },
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(brand[900], 0.3),
          border: `1px solid ${alpha(brand[700], 0.5)}`,
          color: brand[100],
          '& .MuiAlert-icon': {
            color: brand[400],
          },
        }),
      }),
      outlinedSuccess: ({ theme }) => ({
        backgroundColor: 'transparent',
        border: `1px solid ${green[300]}`,
        color: green[700],
        '& .MuiAlert-icon': {
          color: green[600],
        },
        ...theme.applyStyles('dark', {
          border: `1px solid ${green[600]}`,
          color: green[200],
          '& .MuiAlert-icon': {
            color: green[400],
          },
        }),
      }),
      outlinedWarning: ({ theme }) => ({
        backgroundColor: 'transparent',
        border: `1px solid ${orange[300]}`,
        color: orange[700],
        '& .MuiAlert-icon': {
          color: orange[600],
        },
        ...theme.applyStyles('dark', {
          border: `1px solid ${orange[600]}`,
          color: orange[200],
          '& .MuiAlert-icon': {
            color: orange[400],
          },
        }),
      }),
      outlinedError: ({ theme }) => ({
        backgroundColor: 'transparent',
        border: `1px solid ${red[300]}`,
        color: red[700],
        '& .MuiAlert-icon': {
          color: red[600],
        },
        ...theme.applyStyles('dark', {
          border: `1px solid ${red[600]}`,
          color: red[200],
          '& .MuiAlert-icon': {
            color: red[400],
          },
        }),
      }),
      outlinedInfo: ({ theme }) => ({
        backgroundColor: 'transparent',
        border: `1px solid ${brand[300]}`,
        color: brand[700],
        '& .MuiAlert-icon': {
          color: brand[600],
        },
        ...theme.applyStyles('dark', {
          border: `1px solid ${brand[600]}`,
          color: brand[200],
          '& .MuiAlert-icon': {
            color: brand[400],
          },
        }),
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles('dark', {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
};
