# System Integration Guide

## Overview
This guide provides comprehensive specifications for integrating new pages and components with the existing SaaS application infrastructure, including APIs, authentication, data flow, and third-party services.

---

## API Integration Patterns

### 1. Core API Client Setup
```typescript
// Base API client configuration
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

class ApiClient {
  private config: ApiConfig;
  private axiosInstance: AxiosInstance;

  constructor(config: ApiConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth tokens
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or redirect to login
          await this.handleAuthError();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.axiosInstance.delete(url);
    return response.data;
  }
}

// API client instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. AI Content Generation API
```typescript
// AI Content Generation Service
interface ContentGenerationRequest {
  prompt: string;
  contentType: 'social_media' | 'blog' | 'email' | 'ad_copy' | 'product_description';
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'creative' | 'formal' | 'friendly';
  length?: 'short' | 'medium' | 'long';
  language?: string;
  brandGuidelines?: BrandGuidelines;
  userId: string;
  sessionId: string;
  model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro';
  temperature?: number; // 0-1 for creativity control
  maxTokens?: number;
}

interface ContentGenerationResponse {
  id: string;
  content: string[];
  metadata: {
    model: string;
    generationTime: number;
    tokensUsed: number;
    confidence: number;
    cost: number;
  };
  suggestions?: string[];
  relatedTopics?: string[];
  variations?: ContentVariation[];
}

interface ContentVariation {
  id: string;
  content: string;
  score: number;
  reasoning: string;
}

interface BrandGuidelines {
  companyName: string;
  industry: string;
  values: string[];
  avoidTerms: string[];
  preferredStyle: string;
  colorScheme?: string;
  logoUrl?: string;
}

class ContentGenerationService {
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    try {
      const response = await apiClient.post<ContentGenerationResponse>('/ai/generate-content', request);
      
      // Track usage analytics
      this.trackUsage(request, response);
      
      return response;
    } catch (error) {
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  async getGenerationHistory(userId: string, limit = 20): Promise<ContentGenerationResponse[]> {
    return apiClient.get<ContentGenerationResponse[]>(`/ai/history/${userId}`, { limit });
  }

  async saveGeneration(generationId: string, userId: string): Promise<void> {
    await apiClient.post('/ai/save', { generationId, userId });
  }

  async regenerateContent(originalRequest: ContentGenerationRequest): Promise<ContentGenerationResponse> {
    return this.generateContent({
      ...originalRequest,
      sessionId: generateSessionId(),
    });
  }

  private trackUsage(request: ContentGenerationRequest, response: ContentGenerationResponse) {
    // Analytics tracking
    analytics.track('content_generated', {
      userId: request.userId,
      contentType: request.contentType,
      model: response.metadata.model,
      tokensUsed: response.metadata.tokensUsed,
      generationTime: response.metadata.generationTime,
    });
  }
}

export const contentGenerationService = new ContentGenerationService();
```

### 3. User Management API
```typescript
// User Management Service
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: SubscriptionTier;
  preferences: UserPreferences;
  usage: UsageStats;
  createdAt: Date;
  lastLoginAt: Date;
}

interface SubscriptionTier {
  plan: 'free' | 'pro' | 'enterprise';
  features: string[];
  limits: {
    monthlyGenerations: number;
    maxTokensPerGeneration: number;
    advancedModels: boolean;
    brandGuidelines: boolean;
    apiAccess: boolean;
  };
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate?: Date;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  defaultContentType: string;
  defaultTone: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  savedTemplates: Template[];
}

interface UsageStats {
  currentPeriod: {
    generationsUsed: number;
    tokensUsed: number;
    periodStart: Date;
    periodEnd: Date;
  };
  allTime: {
    totalGenerations: number;
    totalTokens: number;
    favoriteContentType: string;
  };
}

class UserService {
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me');
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    return apiClient.put<User>('/users/me', updates);
  }

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return apiClient.put<UserPreferences>('/users/me/preferences', preferences);
  }

  async getUsageStats(userId: string): Promise<UsageStats> {
    return apiClient.get<UsageStats>(`/users/${userId}/usage`);
  }

  async upgradeSubscription(plan: string): Promise<SubscriptionTier> {
    return apiClient.post<SubscriptionTier>('/users/me/subscription/upgrade', { plan });
  }
}

export const userService = new UserService();
```

### 4. Analytics and Tracking
```typescript
// Analytics Service
interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId: string;
  pageId: string;
  timestamp: Date;
  properties: Record<string, any>;
  metadata: {
    userAgent: string;
    referrer: string;
    viewport: { width: number; height: number };
  };
}

class AnalyticsService {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  track(eventType: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      eventType,
      userId: this.userId,
      sessionId: this.sessionId,
      pageId: window.location.pathname,
      timestamp: new Date(),
      properties,
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    };

    // Send to analytics service
    this.sendEvent(event);
  }

  page(pageName: string, properties: Record<string, any> = {}) {
    this.track('page_view', {
      pageName,
      ...properties,
    });
  }

  identify(userId: string, traits: Record<string, any> = {}) {
    this.userId = userId;
    this.track('user_identified', traits);
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      await apiClient.post('/analytics/events', event);
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    // Track page views automatically
    window.addEventListener('beforeunload', () => {
      this.track('page_unload');
    });

    // Track errors
    window.addEventListener('error', (event) => {
      this.track('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });
  }
}

export const analytics = new AnalyticsService();
```

---

## Authentication Integration

### 1. Authentication Context
```typescript
// Authentication Context
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const user = await userService.getCurrentUser();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication failed',
      });
    }
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('authToken', response.token);
      analytics.identify(response.user.id);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed',
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    analytics.track('user_logout');
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register: async (userData) => {
      // Implementation
    },
    refreshToken: async () => {
      // Implementation
    },
    resetPassword: async (email) => {
      // Implementation
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 2. Protected Route Component
```typescript
// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  fallback = <CircularProgress />,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check permissions
  if (requiredPermissions.length > 0 && user) {
    const hasPermission = requiredPermissions.every(permission =>
      user.subscription.features.includes(permission)
    );

    if (!hasPermission) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Upgrade Required
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This feature requires a higher subscription tier.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/pricing')}>
            View Plans
          </Button>
        </Paper>
      );
    }
  }

  return <>{children}</>;
};
```

---

## Data Flow Architecture

### 1. State Management with Context
```typescript
// Global App State
interface AppState {
  theme: 'light' | 'dark';
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    theme: 'light',
    notifications: [],
    loading: false,
    error: null,
  });

  const setTheme = (theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { ...notification, id }],
    }));

    // Auto-remove after delay
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
  };

  const removeNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  const value: AppContextType = {
    ...state,
    setTheme,
    addNotification,
    removeNotification,
    setLoading: (loading) => setState(prev => ({ ...prev, loading })),
    setError: (error) => setState(prev => ({ ...prev, error })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

### 2. Real-time Updates with WebSocket
```typescript
// WebSocket Service
class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(userId: string) {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws?userId=${userId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(userId);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'content_generation_complete':
        // Handle content generation completion
        break;
      case 'usage_limit_warning':
        // Handle usage limit warnings
        break;
      case 'subscription_updated':
        // Handle subscription updates
        break;
    }
  }

  private attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(userId);
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const webSocketService = new WebSocketService();
```

---

## Third-Party Integrations

### 1. Payment Processing (Stripe)
```typescript
// Stripe Integration
interface PaymentService {
  createSubscription: (priceId: string) => Promise<{ clientSecret: string }>;
  updateSubscription: (subscriptionId: string, priceId: string) => Promise<void>;
  cancelSubscription: (subscriptionId: string) => Promise<void>;
  getPaymentMethods: () => Promise<PaymentMethod[]>;
}

class StripePaymentService implements PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }

  async createSubscription(priceId: string): Promise<{ clientSecret: string }> {
    const response = await apiClient.post<{ clientSecret: string }>('/payments/create-subscription', {
      priceId,
    });
    return response;
  }

  async updateSubscription(subscriptionId: string, priceId: string): Promise<void> {
    await apiClient.put(`/payments/subscriptions/${subscriptionId}`, { priceId });
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await apiClient.delete(`/payments/subscriptions/${subscriptionId}`);
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return apiClient.get<PaymentMethod[]>('/payments/payment-methods');
  }
}

export const paymentService = new StripePaymentService();
```

### 2. Email Service Integration
```typescript
// Email Service
interface EmailService {
  sendWelcomeEmail: (user: User) => Promise<void>;
  sendPasswordReset: (email: string, resetToken: string) => Promise<void>;
  sendUsageLimitWarning: (user: User, usage: UsageStats) => Promise<void>;
  sendSubscriptionUpdate: (user: User, subscription: SubscriptionTier) => Promise<void>;
}

class EmailServiceImpl implements EmailService {
  async sendWelcomeEmail(user: User): Promise<void> {
    await apiClient.post('/emails/welcome', { userId: user.id });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<void> {
    await apiClient.post('/emails/password-reset', { email, resetToken });
  }

  async sendUsageLimitWarning(user: User, usage: UsageStats): Promise<void> {
    await apiClient.post('/emails/usage-warning', { userId: user.id, usage });
  }

  async sendSubscriptionUpdate(user: User, subscription: SubscriptionTier): Promise<void> {
    await apiClient.post('/emails/subscription-update', { userId: user.id, subscription });
  }
}

export const emailService = new EmailServiceImpl();
```

---

## Error Handling and Monitoring

### 1. Error Reporting Service
```typescript
// Error Reporting
interface ErrorReport {
  error: Error;
  context: {
    userId?: string;
    page: string;
    userAgent: string;
    timestamp: Date;
    additionalData?: Record<string, any>;
  };
}

class ErrorReportingService {
  report(error: Error, additionalData?: Record<string, any>) {
    const report: ErrorReport = {
      error,
      context: {
        userId: this.getCurrentUserId(),
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
        additionalData,
      },
    };

    // Send to error reporting service (e.g., Sentry)
    this.sendErrorReport(report);
  }

  private async sendErrorReport(report: ErrorReport) {
    try {
      await apiClient.post('/errors/report', report);
    } catch (error) {
      console.error('Failed to report error:', error);
    }
  }

  private getCurrentUserId(): string | undefined {
    // Get current user ID from auth context
    return undefined;
  }
}

export const errorReporting = new ErrorReportingService();
```

### 2. Performance Monitoring
```typescript
// Performance Monitoring
class PerformanceMonitor {
  trackPageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      analytics.track('page_performance', {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
      });
    });
  }

  trackApiCall(url: string, duration: number, success: boolean) {
    analytics.track('api_performance', {
      url,
      duration,
      success,
    });
  }

  private getFirstPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint?.startTime;
  }

  private getFirstContentfulPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint?.startTime;
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

This system integration guide provides the foundation for building robust, scalable integrations within the Material-UI SaaS application ecosystem.