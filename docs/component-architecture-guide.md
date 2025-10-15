# Component Architecture Guide

## Overview
This guide provides detailed specifications for implementing components within the Material-UI-based SaaS application, focusing on consistency, reusability, and maintainability.

---

## Component Design Patterns

### 1. Container Components
```typescript
// Pattern: Page-level container component
interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disableGutters?: boolean;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  disableGutters = false,
  className
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      className={className}
      sx={{
        py: 3,
        px: { xs: 2, sm: 3 },
        minHeight: 'calc(100vh - 64px)', // Account for header
      }}
    >
      {children}
    </Container>
  );
};
```

### 2. Layout Components
```typescript
// Pattern: Responsive grid layout
interface ResponsiveLayoutProps {
  sidebar?: React.ReactNode;
  main: React.ReactNode;
  sidebarWidth?: number;
  collapsible?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  sidebar,
  main,
  sidebarWidth = 280,
  collapsible = true
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {sidebar && (
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: sidebar && !isMobile && sidebarOpen ? 0 : `-${sidebarWidth}px`,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {main}
      </Box>
    </Box>
  );
};
```

### 3. Form Components
```typescript
// Pattern: AI Content Generation Form
interface ContentGenerationFormProps {
  onSubmit: (data: ContentGenerationRequest) => void;
  loading?: boolean;
  initialValues?: Partial<ContentGenerationRequest>;
}

const ContentGenerationForm: React.FC<ContentGenerationFormProps> = ({
  onSubmit,
  loading = false,
  initialValues
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ContentGenerationRequest>({
    defaultValues: initialValues,
    mode: 'onChange'
  });

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="prompt"
              control={control}
              rules={{ 
                required: 'Prompt is required',
                minLength: { value: 10, message: 'Minimum 10 characters' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Content Prompt"
                  placeholder="Describe the content you want to generate..."
                  error={!!errors.prompt}
                  helperText={errors.prompt?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Controller
              name="contentType"
              control={control}
              rules={{ required: 'Content type is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.contentType}>
                  <InputLabel>Content Type</InputLabel>
                  <Select {...field} label="Content Type">
                    <MenuItem value="social_media">Social Media</MenuItem>
                    <MenuItem value="blog">Blog Post</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="ad_copy">Ad Copy</MenuItem>
                  </Select>
                  {errors.contentType && (
                    <FormHelperText>{errors.contentType.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isValid || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
              fullWidth
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
```

### 4. Display Components
```typescript
// Pattern: Content Display with Actions
interface ContentDisplayProps {
  content: string[];
  metadata?: ContentMetadata;
  onSave?: (content: string) => void;
  onRegenerate?: () => void;
  onEdit?: (content: string) => void;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  metadata,
  onSave,
  onRegenerate,
  onEdit
}) => {
  const [selectedContent, setSelectedContent] = useState(0);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Generated Content</Typography>
        <Box>
          <IconButton onClick={onRegenerate} title="Regenerate">
            <Refresh />
          </IconButton>
          <IconButton onClick={() => onEdit?.(content[selectedContent])} title="Edit">
            <Edit />
          </IconButton>
          <IconButton onClick={() => onSave?.(content[selectedContent])} title="Save">
            <Save />
          </IconButton>
        </Box>
      </Box>

      {content.length > 1 && (
        <Tabs
          value={selectedContent}
          onChange={(_, newValue) => setSelectedContent(newValue)}
          sx={{ mb: 2 }}
        >
          {content.map((_, index) => (
            <Tab key={index} label={`Variation ${index + 1}`} />
          ))}
        </Tabs>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {content[selectedContent]}
        </Typography>
      </Box>

      {metadata && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip size="small" label={`Model: ${metadata.model}`} />
          <Chip size="small" label={`Time: ${metadata.generationTime}ms`} />
          <Chip size="small" label={`Tokens: ${metadata.tokensUsed}`} />
        </Box>
      )}
    </Paper>
  );
};
```

---

## State Management Patterns

### 1. Page-Level State Hook
```typescript
// Pattern: Custom hook for page state management
interface PageState {
  loading: boolean;
  error: string | null;
  data: any;
}

const usePageState = <T>(initialData?: T) => {
  const [state, setState] = useState<PageState & { data: T }>({
    loading: false,
    error: null,
    data: initialData || {} as T
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const setData = (data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  };

  const reset = () => {
    setState({
      loading: false,
      error: null,
      data: initialData || {} as T
    });
  };

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset
  };
};
```

### 2. API Integration Hook
```typescript
// Pattern: API call hook with error handling
const useApiCall = <T, P = any>(
  apiFunction: (params: P) => Promise<T>
) => {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(params);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, [apiFunction]);

  return {
    ...state,
    execute
  };
};
```

---

## Error Handling Components

### 1. Error Boundary
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We're sorry, but something unexpected happened.
          </Typography>
          <Button
            variant="contained"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}
```

### 2. Error Display Component
```typescript
interface ErrorDisplayProps {
  error: string | Error;
  onRetry?: () => void;
  variant?: 'inline' | 'page' | 'toast';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  variant = 'inline'
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  if (variant === 'toast') {
    return (
      <Snackbar open autoHideDuration={6000}>
        <Alert severity="error" onClose={() => {}}>
          {errorMessage}
        </Alert>
      </Snackbar>
    );
  }

  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        )
      }
      sx={{ mb: 2 }}
    >
      {errorMessage}
    </Alert>
  );
};
```

---

## Loading States

### 1. Skeleton Loaders
```typescript
const ContentSkeleton: React.FC = () => (
  <Paper sx={{ p: 3 }}>
    <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton variant="text" width={100} />
    </Box>
  </Paper>
);

const FormSkeleton: React.FC = () => (
  <Paper sx={{ p: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={120} />
      </Grid>
      <Grid item xs={6}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={6}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rectangular" height={48} />
      </Grid>
    </Grid>
  </Paper>
);
```

### 2. Loading Overlay
```typescript
interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  message = 'Loading...'
}) => (
  <Box sx={{ position: 'relative' }}>
    {children}
    {loading && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    )}
  </Box>
);
```

---

## Accessibility Patterns

### 1. Focus Management
```typescript
const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement>(null);

  const setFocus = useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      // Implement focus trap logic
    }
  }, []);

  return { focusRef, setFocus, trapFocus };
};
```

### 2. Screen Reader Support
```typescript
const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      position: 'absolute',
      left: '-10000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
    }}
  >
    {children}
  </Box>
);

const LiveRegion: React.FC<{ 
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive';
}> = ({ children, politeness = 'polite' }) => (
  <Box
    role="status"
    aria-live={politeness}
    aria-atomic="true"
    sx={{ position: 'absolute', left: '-10000px' }}
  >
    {children}
  </Box>
);
```

---

## Performance Optimization

### 1. Memoization Patterns
```typescript
// Memoize expensive calculations
const ExpensiveComponent: React.FC<{ data: any[] }> = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }));
  }, [data]);

  return <div>{/* Render processed data */}</div>;
};

// Memoize component to prevent unnecessary re-renders
const OptimizedComponent = React.memo<ComponentProps>(({ prop1, prop2 }) => {
  return <div>{/* Component content */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.prop1 === nextProps.prop1 && prevProps.prop2 === nextProps.prop2;
});
```

### 2. Lazy Loading
```typescript
// Lazy load components
const LazyComponent = lazy(() => import('./HeavyComponent'));

const ComponentWithLazyLoading: React.FC = () => (
  <Suspense fallback={<CircularProgress />}>
    <LazyComponent />
  </Suspense>
);

// Lazy load images
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={imgRef}>
      {loaded ? (
        <img src={src} alt={alt} style={{ width: '100%' }} />
      ) : (
        <Skeleton variant="rectangular" height={200} />
      )}
    </Box>
  );
};
```

---

## Testing Patterns

### 1. Component Testing
```typescript
// Test utilities
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {component}
    </ThemeProvider>
  );
};

// Example test
describe('ContentGenerationForm', () => {
  it('should submit form with valid data', async () => {
    const mockSubmit = jest.fn();
    renderWithTheme(<ContentGenerationForm onSubmit={mockSubmit} />);

    const promptInput = screen.getByLabelText(/content prompt/i);
    const contentTypeSelect = screen.getByLabelText(/content type/i);
    const submitButton = screen.getByRole('button', { name: /generate content/i });

    await user.type(promptInput, 'Test prompt for content generation');
    await user.click(contentTypeSelect);
    await user.click(screen.getByText('Social Media'));
    await user.click(submitButton);

    expect(mockSubmit).toHaveBeenCalledWith({
      prompt: 'Test prompt for content generation',
      contentType: 'social_media'
    });
  });
});
```

This component architecture guide provides the foundation for building consistent, maintainable, and accessible components within the Material-UI SaaS application.