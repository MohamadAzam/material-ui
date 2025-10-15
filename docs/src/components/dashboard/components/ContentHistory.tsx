import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface ContentItem {
  id: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  status: 'completed' | 'processing' | 'failed' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  size: string;
  model: string;
  prompt: string;
  content: string;
  tags: string[];
}

const mockContentHistory: ContentItem[] = [
  {
    id: '1',
    title: 'Marketing Blog Post',
    type: 'text',
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:35:00'),
    size: '2.5 KB',
    model: 'GPT-4',
    prompt: 'Write a blog post about digital marketing trends for 2024',
    content: 'Digital marketing in 2024 is evolving rapidly with AI-driven personalization...',
    tags: ['marketing', 'blog', 'trends'],
  },
  {
    id: '2',
    title: 'Product Description',
    type: 'text',
    status: 'completed',
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-14T14:22:00'),
    size: '1.2 KB',
    model: 'GPT-3.5',
    prompt: 'Create a compelling product description for wireless headphones',
    content: 'Experience crystal-clear audio with our premium wireless headphones...',
    tags: ['product', 'description', 'audio'],
  },
  {
    id: '3',
    title: 'Social Media Graphics',
    type: 'image',
    status: 'processing',
    createdAt: new Date('2024-01-14T09:15:00'),
    updatedAt: new Date('2024-01-14T09:15:00'),
    size: 'Processing...',
    model: 'DALL-E 3',
    prompt: 'Create modern social media graphics for a tech startup',
    content: '',
    tags: ['social media', 'graphics', 'tech'],
  },
  {
    id: '4',
    title: 'Email Newsletter',
    type: 'text',
    status: 'draft',
    createdAt: new Date('2024-01-13T16:45:00'),
    updatedAt: new Date('2024-01-13T17:30:00'),
    size: '3.1 KB',
    model: 'GPT-4',
    prompt: 'Write an engaging email newsletter for our monthly update',
    content: 'Dear valued subscribers, this month has been incredible...',
    tags: ['email', 'newsletter', 'monthly'],
  },
  {
    id: '5',
    title: 'Video Script',
    type: 'text',
    status: 'failed',
    createdAt: new Date('2024-01-12T11:00:00'),
    updatedAt: new Date('2024-01-12T11:05:00'),
    size: '0 KB',
    model: 'GPT-4',
    prompt: 'Create a video script for product demonstration',
    content: '',
    tags: ['video', 'script', 'demo'],
  },
];

const ContentHistory: React.FC = () => {
  const [contentHistory, setContentHistory] = useState<ContentItem[]>(mockContentHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const itemsPerPage = 10;

  const filteredContent = useMemo(() => {
    return contentHistory.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesModel = modelFilter === 'all' || item.model === modelFilter;

      return matchesSearch && matchesType && matchesStatus && matchesModel;
    });
  }, [contentHistory, searchTerm, typeFilter, statusFilter, modelFilter]);

  const paginatedContent = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredContent.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredContent, page]);

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setModelFilter('all');
    setPage(1);
  };

  const handleView = (item: ContentItem) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleDelete = (item: ContentItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setContentHistory(prev => prev.filter(item => item.id !== selectedItem.id));
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleDownload = (item: ContentItem) => {
    // Simulate download functionality
    const blob = new Blob([item.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      case 'draft': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'document': return '📄';
      default: return '📄';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Content Generation History
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View and manage your generated content with advanced filtering options.
      </Typography>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                  <MenuItem value="document">Document</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Model</InputLabel>
                <Select
                  value={modelFilter}
                  label="Model"
                  onChange={(e) => setModelFilter(e.target.value)}
                >
                  <MenuItem value="all">All Models</MenuItem>
                  <MenuItem value="GPT-4">GPT-4</MenuItem>
                  <MenuItem value="GPT-3.5">GPT-3.5</MenuItem>
                  <MenuItem value="DALL-E 3">DALL-E 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Clear Filters">
                  <IconButton onClick={handleClearFilters}>
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <IconButton onClick={() => window.location.reload()}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Alert severity="info" sx={{ mb: 2 }}>
        Showing {filteredContent.length} of {contentHistory.length} content items
      </Alert>

      {/* Content Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedContent.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{item.title}</Typography>
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                        {item.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{getTypeIcon(item.type)}</span>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {item.type}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.model}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.createdAt.toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.createdAt.toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.size}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleView(item)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {item.status === 'completed' && (
                        <Tooltip title="Download">
                          <IconButton size="small" onClick={() => handleDownload(item)}>
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem?.title}
          <Typography variant="body2" color="text.secondary">
            {selectedItem?.type} • {selectedItem?.model} • {selectedItem?.createdAt.toLocaleString()}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Prompt:
              </Typography>
              <Typography variant="body2" sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                {selectedItem?.prompt}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Generated Content:
              </Typography>
              <Typography variant="body2" sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                {selectedItem?.content || 'No content available'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tags:
              </Typography>
              <Stack direction="row" spacing={0.5}>
                {selectedItem?.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          {selectedItem?.status === 'completed' && (
            <Button onClick={() => selectedItem && handleDownload(selectedItem)}>
              Download
            </Button>
          )}
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentHistory;