import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

// Icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SparklesIcon from '@mui/icons-material/AutoFixHigh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TuneIcon from '@mui/icons-material/Tune';

import { useFormValidation, CommonValidationRules } from '../../hooks/useFormValidation';

const FormCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  borderRadius: theme.spacing(2),
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const ContentTypeChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const AdvancedSection = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.grey[50], 0.5),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

interface ContentGenerationFormProps {
  onGenerate: (prompt: string, contentType: string, options?: GenerationOptions) => Promise<void>;
  isGenerating?: boolean;
  error?: string | null;
  onClearError?: () => void;
  initialValues?: Partial<{
    prompt: string;
    contentType: string;
    tone: string;
    length: string;
    creativity: string;
    includeKeywords: string;
    targetAudience: string;
    language: string;
  }>;
}

export interface GenerationOptions {
  tone: string;
  length: string;
  creativity: number;
  includeKeywords: boolean;
  keywords: string[];
  targetAudience: string;
  language: string;
}

const contentTypes = [
  { value: 'Blog Post', label: 'Blog Post', description: 'Long-form articles and blog content' },
  { value: 'Marketing Copy', label: 'Marketing Copy', description: 'Sales and promotional content' },
  { value: 'Product Description', label: 'Product Description', description: 'E-commerce product details' },
  { value: 'Email Campaign', label: 'Email Campaign', description: 'Email marketing content' },
  { value: 'Social Media Post', label: 'Social Media Post', description: 'Social platform content' },
  { value: 'Press Release', label: 'Press Release', description: 'Official announcements' },
  { value: 'Technical Documentation', label: 'Technical Docs', description: 'Technical guides and documentation' },
  { value: 'Creative Writing', label: 'Creative Writing', description: 'Stories and creative content' },
];

const toneOptions = [
  'Professional', 'Casual', 'Friendly', 'Formal', 'Conversational', 
  'Authoritative', 'Enthusiastic', 'Humorous', 'Persuasive', 'Educational'
];

const lengthOptions = [
  { value: 'Short', label: 'Short (100-300 words)' },
  { value: 'Medium', label: 'Medium (300-800 words)' },
  { value: 'Long', label: 'Long (800-1500 words)' },
  { value: 'Very Long', label: 'Very Long (1500+ words)' },
];

const targetAudienceOptions = [
  'General Public', 'Business Professionals', 'Technical Experts', 'Students',
  'Consumers', 'Industry Specialists', 'Decision Makers', 'Young Adults'
];

export default function ContentGenerationForm({
  onGenerate,
  isGenerating = false,
  error,
  onClearError,
  initialValues,
}: ContentGenerationFormProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [keywordInput, setKeywordInput] = React.useState('');

  const {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouched,
    handleSubmit,
  } = useFormValidation(
    {
      prompt: '',
      contentType: 'Blog Post',
      tone: 'Professional',
      length: 'Medium',
      creativity: '50',
      includeKeywords: 'false',
      targetAudience: 'General Public',
      language: 'English',
      ...(initialValues || {}),
    },
    {
      prompt: CommonValidationRules.prompt,
      contentType: CommonValidationRules.contentType,
    }
  );

  const handleContentTypeSelect = (type: string) => {
    setValue('contentType', type);
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const onSubmit = handleSubmit(async (formValues) => {
    const options: GenerationOptions = {
      tone: formValues.tone,
      length: formValues.length,
      creativity: parseInt(formValues.creativity),
      includeKeywords: formValues.includeKeywords === 'true',
      keywords,
      targetAudience: formValues.targetAudience,
      language: formValues.language,
    };

    await onGenerate(formValues.prompt, formValues.contentType, options);
  });

  React.useEffect(() => {
    if (error && onClearError) {
      const timer = setTimeout(onClearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onClearError]);

  return (
    <FormCard>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SparklesIcon color="primary" />
          AI Content Generator
        </Typography>

        <form onSubmit={onSubmit}>
          <Stack spacing={3}>
            {/* Error Alert */}
            {error && (
              <Alert severity="error" onClose={onClearError}>
                {error}
              </Alert>
            )}

            {/* Content Type Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Content Type
                <Tooltip title="Choose the type of content you want to generate">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {contentTypes.map((type) => (
                  <Tooltip key={type.value} title={type.description}>
                    <ContentTypeChip
                      label={type.label}
                      variant={values.contentType === type.value ? 'filled' : 'outlined'}
                      color={values.contentType === type.value ? 'primary' : 'default'}
                      onClick={() => handleContentTypeSelect(type.value)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>

            {/* Prompt Input */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Describe what you want to create"
              placeholder="e.g., Write a comprehensive blog post about sustainable technology trends in 2024, focusing on renewable energy innovations and their impact on businesses..."
              value={values.prompt}
              onChange={(e) => setValue('prompt', e.target.value)}
              onBlur={() => setTouched('prompt')}
              error={touched.prompt && !!errors.prompt}
              helperText={touched.prompt && errors.prompt}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Basic Options */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={values.tone}
                  label="Tone"
                  onChange={(e) => setValue('tone', e.target.value)}
                >
                  {toneOptions.map((tone) => (
                    <MenuItem key={tone} value={tone}>
                      {tone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Length</InputLabel>
                <Select
                  value={values.length}
                  label="Length"
                  onChange={(e) => setValue('length', e.target.value)}
                >
                  {lengthOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Advanced Options Toggle */}
            <Button
              variant="text"
              startIcon={<TuneIcon />}
              endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ alignSelf: 'flex-start' }}
            >
              Advanced Options
            </Button>

            {/* Advanced Options */}
            <Collapse in={showAdvanced}>
              <AdvancedSection>
                <Stack spacing={3}>
                  {/* Creativity Slider */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Creativity Level: {values.creativity}%
                    </Typography>
                    <Slider
                      value={parseInt(values.creativity)}
                      onChange={(_, value) => setValue('creativity', value.toString())}
                      min={0}
                      max={100}
                      step={10}
                      marks={[
                        { value: 0, label: 'Conservative' },
                        { value: 50, label: 'Balanced' },
                        { value: 100, label: 'Creative' },
                      ]}
                    />
                  </Box>

                  {/* Target Audience */}
                  <FormControl fullWidth>
                    <InputLabel>Target Audience</InputLabel>
                    <Select
                      value={values.targetAudience}
                      label="Target Audience"
                      onChange={(e) => setValue('targetAudience', e.target.value)}
                    >
                      {targetAudienceOptions.map((audience) => (
                        <MenuItem key={audience} value={audience}>
                          {audience}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Keywords */}
                  <Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={values.includeKeywords === 'true'}
                          onChange={(e) => setValue('includeKeywords', e.target.checked.toString())}
                        />
                      }
                      label="Include specific keywords"
                    />
                    
                    {values.includeKeywords === 'true' && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Add keyword"
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyPress={handleKeywordKeyPress}
                          InputProps={{
                            endAdornment: (
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleAddKeyword}
                                sx={{ borderRadius: 2 }}
                              >
                                Add
                              </Button>
                            ),
                          }}
                        />
                        {keywords.length > 0 && (
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {keywords.map((keyword) => (
                              <Chip
                                key={keyword}
                                label={keyword}
                                size="small"
                                onDelete={() => handleRemoveKeyword(keyword)}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Language */}
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={values.language}
                      label="Language"
                      onChange={(e) => setValue('language', e.target.value)}
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                      <MenuItem value="French">French</MenuItem>
                      <MenuItem value="German">German</MenuItem>
                      <MenuItem value="Italian">Italian</MenuItem>
                      <MenuItem value="Portuguese">Portuguese</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </AdvancedSection>
            </Collapse>

            <Divider />

            {/* Generate Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isGenerating || !isValid}
              startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              {isGenerating ? 'Generating Amazing Content...' : 'Generate Content'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </FormCard>
  );
}