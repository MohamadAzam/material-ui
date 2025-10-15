import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/GridLegacy';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';

// Icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SparklesIcon from '@mui/icons-material/AutoFixHigh';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import AppHeader from 'docs/src/layouts/AppHeader';
import GradientText from 'docs/src/components/typography/GradientText';
import BrandingCssVarsProvider from 'docs/src/BrandingCssVarsProvider';

// Custom Components
import { useAIContentGeneration } from 'docs/src/hooks/useAIContentGeneration';
import ContentGenerationForm, { GenerationOptions } from 'docs/src/components/saas/ContentGenerationForm';
import GeneratedContentDisplay from 'docs/src/components/saas/GeneratedContentDisplay';
import FeatureShowcase from 'docs/src/components/saas/FeatureShowcase';
import { useRouter } from 'next/router';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  ...theme.applyStyles('dark', {
    backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
  }),
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  position: 'relative',
  zIndex: 1,
}));

const CTASection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.primary.main, 0.05)} 0%, 
    ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
  textAlign: 'center',
}));

function SaaSFrontpageContent() {
  const theme = useTheme();
  const router = useRouter();
  const { contentType, prompt } = router.query as { contentType?: string; prompt?: string };
  
  const {
    generatedContent,
    isGenerating,
    error,
    generateContent,
    regenerateContent,
    copyContent,
    downloadContent,
    shareContent,
    clearError,
  } = useAIContentGeneration();

  const handleGenerate = async (prompt: string, contentType: string, options?: GenerationOptions) => {
    await generateContent(prompt, contentType);
  };

  return (
    <Box>
      <AppHeader />
      
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SparklesIcon color="primary" />
                      <Typography variant="overline" color="primary" fontWeight="bold">
                        AI-Powered Content Creation
                      </Typography>
                    </Stack>
                    
                    <Typography 
                      variant="h1" 
                      component="h1"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                        lineHeight: 1.1,
                      }}
                    >
                      Create Amazing Content with{' '}
                      <GradientText>AI Magic</GradientText>
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ maxWidth: 500, lineHeight: 1.6 }}
                    >
                      Transform your ideas into compelling content in seconds. From blog posts to marketing copy, 
                      our AI-powered platform helps you create professional content that engages your audience.
                    </Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<RocketLaunchIcon />}
                        sx={{ 
                          py: 1.5, 
                          px: 4,
                          borderRadius: 2,
                        }}
                      >
                        Start Creating Now
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{ 
                          py: 1.5, 
                          px: 4, 
                          borderRadius: 2 
                        }}
                      >
                        Watch Demo
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Box>
                  <ContentGenerationForm
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    error={error}
                    onClearError={clearError}
                    initialValues={{
                      contentType: typeof contentType === 'string' ? contentType : undefined,
                      prompt: typeof prompt === 'string' ? prompt : undefined,
                    }}
                  />
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Generated Content Display */}
      {generatedContent && (
        <ContentSection>
          <Container maxWidth="lg">
            <GeneratedContentDisplay
              content={generatedContent}
              contentType="AI Generated Content"
              prompt="User generated content"
              timestamp={new Date()}
              wordCount={generatedContent.split(' ').length}
              isRegenerating={isGenerating}
              onRegenerate={regenerateContent}
              onCopy={copyContent}
              onDownload={downloadContent}
              onShare={shareContent}
            />
          </Container>
        </ContentSection>
      )}

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Call to Action */}
      <CTASection>
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="center">
            <Typography variant="h3" component="h2" fontWeight="bold" textAlign="center">
              Ready to Transform Your Content Strategy?
            </Typography>
            
            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ maxWidth: 600 }}>
              Join thousands of content creators, marketers, and businesses who are already using our 
              AI-powered platform to create amazing content faster than ever before.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon />}
                sx={{ 
                  py: 2, 
                  px: 6,
                  borderRadius: 2,
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  py: 2, 
                  px: 6, 
                  borderRadius: 2 
                }}
              >
                Schedule Demo
              </Button>
            </Stack>
            
            <Typography variant="body2" color="text.secondary">
              No credit card required • 14-day free trial • Cancel anytime
            </Typography>
          </Stack>
        </Container>
      </CTASection>
    </Box>
  );
}

export default function SaaSFrontpage() {
  return (
    <BrandingCssVarsProvider>
      <SaaSFrontpageContent />
    </BrandingCssVarsProvider>
  );
}