import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';

const ContentCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: alpha(theme.palette.background.paper, 0.95),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: theme.spacing(2),
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
  },
}));

const ContentText = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-line',
  lineHeight: 1.7,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '1rem',
  color: theme.palette.text.primary,
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  '& p': {
    marginBottom: theme.spacing(1.5),
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    marginBottom: theme.spacing(1.5),
  },
  '& li': {
    marginBottom: theme.spacing(0.5),
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
    transform: 'scale(1.05)',
  },
}));

interface GeneratedContentDisplayProps {
  content: string;
  contentType: string;
  prompt: string;
  timestamp?: Date;
  wordCount?: number;
  onCopy?: () => Promise<boolean>;
  onDownload?: (filename?: string) => void;
  onShare?: () => Promise<boolean>;
  onRegenerate?: () => Promise<void>;
  onEdit?: (newContent: string) => void;
  isRegenerating?: boolean;
}

export default function GeneratedContentDisplay({
  content,
  contentType,
  prompt,
  timestamp,
  wordCount,
  onCopy,
  onDownload,
  onShare,
  onRegenerate,
  onEdit,
  isRegenerating = false,
}: GeneratedContentDisplayProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });
  const [editDialog, setEditDialog] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(content);
  const [downloadDialog, setDownloadDialog] = React.useState(false);
  const [filename, setFilename] = React.useState('generated-content');

  React.useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCopy = async () => {
    if (onCopy) {
      const success = await onCopy();
      showSnackbar(success ? 'Content copied to clipboard!' : 'Failed to copy content', success ? 'success' : 'error');
    }
  };

  const handleShare = async () => {
    if (onShare) {
      const success = await onShare();
      showSnackbar(success ? 'Content shared successfully!' : 'Failed to share content', success ? 'success' : 'error');
    }
  };

  const handleDownload = (format: 'txt' | 'md' | 'html' | 'pdf') => {
    const extension = format === 'md' ? 'md' : format === 'html' ? 'html' : format === 'pdf' ? 'pdf' : 'txt';
    const finalFilename = `${filename}.${extension}`;
    
    if (onDownload) {
      onDownload(finalFilename);
      showSnackbar(`Content downloaded as ${finalFilename}!`);
    }
    setDownloadDialog(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(editedContent);
      showSnackbar('Content updated successfully!');
    }
    setEditDialog(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <Fade in timeout={800}>
        <ContentCard elevation={3}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Generated Content
                </Typography>
                <Chip 
                  label={contentType} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                <strong>Prompt:</strong> {prompt.length > 100 ? `${prompt.substring(0, 100)}...` : prompt}
              </Typography>
              <Stack direction="row" spacing={2}>
                {timestamp && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Generated {formatTimestamp(timestamp)}
                  </Typography>
                )}
                {wordCount && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {wordCount} words
                  </Typography>
                )}
              </Stack>
            </Box>
            
            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Copy to clipboard">
                <ActionButton onClick={handleCopy} size="small">
                  <ContentCopyIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="Download">
                <ActionButton onClick={() => setDownloadDialog(true)} size="small">
                  <DownloadIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="Share">
                <ActionButton onClick={handleShare} size="small">
                  <ShareIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="Edit">
                <ActionButton onClick={() => setEditDialog(true)} size="small">
                  <EditIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="Regenerate">
                <ActionButton onClick={onRegenerate} disabled={isRegenerating} size="small">
                  <RefreshIcon 
                    fontSize="small" 
                    sx={{ 
                      animation: isRegenerating ? 'spin 1s linear infinite' : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }} 
                  />
                </ActionButton>
              </Tooltip>
              
              <Tooltip title="More options">
                <ActionButton onClick={handleMenuOpen} size="small">
                  <MoreVertIcon fontSize="small" />
                </ActionButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Content */}
          <ContentText variant="body1">
            {content}
          </ContentText>
        </ContentCard>
      </Fade>

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleCopy(); handleMenuClose(); }}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy to Clipboard</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setDownloadDialog(true); handleMenuClose(); }}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setEditDialog(true); handleMenuClose(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Content</ListItemText>
        </MenuItem>
      </Menu>

      {/* Download Dialog */}
      <Dialog open={downloadDialog} onClose={() => setDownloadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Download Content</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Filename"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Choose format:</Typography>
          <Stack spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              onClick={() => handleDownload('txt')}
              fullWidth
              sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
            >
              Plain Text (.txt)
            </Button>
            <Button
              variant="outlined"
              startIcon={<CodeIcon />}
              onClick={() => handleDownload('md')}
              fullWidth
              sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
            >
              Markdown (.md)
            </Button>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              onClick={() => handleDownload('html')}
              fullWidth
              sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
            >
              HTML (.html)
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setDownloadDialog(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            Edit Content
            <IconButton onClick={() => setEditDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={20}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setEditDialog(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit} startIcon={<SaveIcon />} sx={{ borderRadius: 2 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        TransitionComponent={Zoom}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}