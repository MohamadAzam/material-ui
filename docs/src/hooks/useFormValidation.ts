import * as React from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

export interface FormValidationState {
  values: Record<string, string>;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface FormValidationActions {
  setValue: (field: string, value: string) => void;
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  setTouched: (field: string, touched?: boolean) => void;
  validateField: (field: string) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  setSubmitting: (submitting: boolean) => void;
  handleSubmit: (onSubmit: (values: Record<string, string>) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>;
}

export type UseFormValidationReturn = FormValidationState & FormValidationActions;

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s]+$/,
};

// Common validation rules
export const CommonValidationRules = {
  required: { required: true },
  email: { 
    required: true, 
    pattern: ValidationPatterns.email,
    custom: (value: string) => {
      if (!ValidationPatterns.email.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  prompt: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    custom: (value: string) => {
      if (value.trim().length < 10) {
        return 'Prompt must be at least 10 characters long';
      }
      if (value.trim().length > 1000) {
        return 'Prompt must be less than 1000 characters';
      }
      // Check for meaningful content (not just spaces or repeated characters)
      const trimmed = value.trim();
      const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, '')).size;
      if (uniqueChars < 3) {
        return 'Please provide a more descriptive prompt';
      }
      return null;
    }
  },
  contentType: {
    required: true,
    custom: (value: string) => {
      const validTypes = [
        'Blog Post',
        'Marketing Copy',
        'Product Description',
        'Email Campaign',
        'Social Media Post',
        'Press Release',
        'Technical Docs',
        'Creative Writing',
      ];
      if (!validTypes.includes(value)) {
        return 'Please select a valid content type';
      }
      return null;
    }
  },
  filename: {
    minLength: 1,
    maxLength: 255,
    pattern: /^[^<>:"/\\|?*]+$/,
    custom: (value: string) => {
      if (value && !/^[^<>:"/\\|?*]+$/.test(value)) {
        return 'Filename contains invalid characters';
      }
      return null;
    }
  }
};

function validateValue(value: string, rule: ValidationRule): string | null {
  // Required validation
  if (rule.required && (!value || value.trim().length === 0)) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!value || value.trim().length === 0) {
    return null;
  }

  // Min length validation
  if (rule.minLength && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters long`;
  }

  // Max length validation
  if (rule.maxLength && value.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters long`;
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

export function useFormValidation(
  initialValues: Record<string, string> = {},
  validationRules: ValidationRules = {}
): UseFormValidationReturn {
  const [state, setState] = React.useState<FormValidationState>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: false,
    isSubmitting: false,
  });

  // Validate a single field
  const validateField = React.useCallback((field: string): boolean => {
    const value = state.values[field] || '';
    const rule = validationRules[field];
    
    if (!rule) return true;

    const error = validateValue(value, rule);
    
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error || '',
      },
    }));

    return !error;
  }, [state.values, validationRules]);

  // Validate entire form
  const validateForm = React.useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach(field => {
      const value = state.values[field] || '';
      const rule = validationRules[field];
      const error = validateValue(value, rule);
      
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    setState(prev => ({
      ...prev,
      errors: newErrors,
    }));

    return isFormValid;
  }, [state.values, validationRules]);

  // Calculate form validity dynamically
  const isValid = React.useMemo(() => {
    const hasErrors = Object.values(state.errors).some(error => error);
    const hasRequiredFields = Object.keys(validationRules).some(field => {
      const rule = validationRules[field];
      const value = state.values[field] || '';
      return rule.required && !value.trim();
    });

    return !hasErrors && !hasRequiredFields;
  }, [state.errors, state.values, validationRules]);

  const setValue = React.useCallback((field: string, value: string) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (state.errors[field]) {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: '',
        },
      }));
    }
  }, [state.errors]);

  const setError = React.useCallback((field: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }));
  }, []);

  const clearError = React.useCallback((field: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: '',
      },
    }));
  }, []);

  const clearAllErrors = React.useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: {},
    }));
  }, []);

  const setTouched = React.useCallback((field: string, touched = true) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: touched,
      },
    }));
  }, []);

  const resetForm = React.useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: false,
      isSubmitting: false,
    });
  }, [initialValues]);

  const setSubmitting = React.useCallback((submitting: boolean) => {
    setState(prev => ({
      ...prev,
      isSubmitting: submitting,
    }));
  }, []);

  const handleSubmit = React.useCallback((
    onSubmit: (values: Record<string, string>) => void | Promise<void>
  ) => {
    return async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(validationRules).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Record<string, boolean>);

      setState(prev => ({
        ...prev,
        touched: allTouched,
      }));

      // Validate form
      const isValid = validateForm();
      
      if (!isValid) {
        return;
      }

      setSubmitting(true);
      
      try {
        await onSubmit(state.values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setSubmitting(false);
      }
    };
  }, [state.values, validationRules, validateForm, setSubmitting]);

  return {
    ...state,
    isValid,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    setTouched,
    validateField,
    validateForm,
    resetForm,
    setSubmitting,
    handleSubmit,
  };
}

// Helper hook for AI content generation form specifically
export function useAIContentForm() {
  return useFormValidation(
    {
      prompt: '',
      contentType: 'Blog Post',
      tone: 'Professional',
      length: 'Medium',
    },
    {
      prompt: CommonValidationRules.prompt,
      contentType: CommonValidationRules.contentType,
    }
  );
}