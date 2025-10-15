import * as React from 'react';

export interface AIContentGenerationState {
  content: string;
  isGenerating: boolean;
  error: string | null;
  generatedContent: string | null;
  generationHistory: GeneratedContent[];
}

export interface GeneratedContent {
  id: string;
  prompt: string;
  contentType: string;
  content: string;
  timestamp: Date;
  wordCount: number;
}

export interface AIContentGenerationActions {
  setContent: (content: string) => void;
  generateContent: (prompt: string, contentType: string) => Promise<void>;
  copyContent: () => Promise<boolean>;
  downloadContent: (filename?: string) => void;
  shareContent: () => Promise<boolean>;
  clearError: () => void;
  clearGeneratedContent: () => void;
  regenerateContent: () => Promise<void>;
  saveToHistory: (content: GeneratedContent) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export type UseAIContentGenerationReturn = AIContentGenerationState & AIContentGenerationActions;

// Simulated AI API call
async function callAIAPI(prompt: string, contentType: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Simulate occasional errors
  if (Math.random() < 0.1) {
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
  
  const templates = {
    'Blog Post': `# ${prompt.split(' ').slice(0, 3).join(' ')} - A Comprehensive Guide

## Introduction

${prompt} is a topic that has gained significant attention in recent years. This comprehensive guide will explore the key aspects, benefits, and practical applications.

## Key Points

• **Understanding the Fundamentals**: The core concepts that drive this topic
• **Practical Applications**: Real-world scenarios where this applies
• **Best Practices**: Proven strategies for success
• **Future Trends**: What to expect in the coming years

## Detailed Analysis

The landscape of ${prompt.toLowerCase()} continues to evolve rapidly. Industry experts suggest that understanding these fundamentals is crucial for anyone looking to stay competitive in today's market.

### Benefits and Advantages

1. **Efficiency Improvements**: Streamlined processes and better outcomes
2. **Cost Effectiveness**: Reduced overhead and improved ROI
3. **Scalability**: Solutions that grow with your needs
4. **Innovation**: Cutting-edge approaches to traditional challenges

## Conclusion

In conclusion, ${prompt.toLowerCase()} represents a significant opportunity for growth and improvement. By implementing the strategies outlined in this guide, you can achieve better results and stay ahead of the competition.

*This content was generated using advanced AI technology and can be customized to meet your specific requirements.*`,

    'Marketing Copy': `🚀 **Transform Your Business with ${prompt}**

**Headline**: Discover the Power of ${prompt} - Your Gateway to Success!

**Subheadline**: Join thousands of satisfied customers who have revolutionized their approach with our innovative solutions.

**Key Benefits**:
✅ Increase efficiency by up to 300%
✅ Reduce costs while improving quality
✅ Scale your operations seamlessly
✅ Stay ahead of the competition

**Call to Action**: Don't wait - start your transformation today!

**Social Proof**: "Since implementing this solution, our productivity has skyrocketed!" - Happy Customer

**Limited Time Offer**: Get started with a 30-day free trial - no credit card required!

*Ready to take the next step? Contact us now and see the difference for yourself.*`,

    'Product Description': `**${prompt} - Premium Quality Solution**

**Product Overview**:
Experience the perfect blend of innovation and reliability with our ${prompt.toLowerCase()} solution. Designed for professionals who demand excellence.

**Key Features**:
• Advanced technology integration
• User-friendly interface
• Robust security measures
• 24/7 customer support
• Scalable architecture

**Technical Specifications**:
- Compatible with all major platforms
- Cloud-based infrastructure
- Real-time synchronization
- Advanced analytics dashboard
- Mobile-responsive design

**What's Included**:
✓ Complete setup and configuration
✓ Comprehensive training materials
✓ Ongoing technical support
✓ Regular updates and improvements
✓ 99.9% uptime guarantee

**Perfect For**:
- Small to enterprise businesses
- Teams of any size
- Remote and hybrid workforces
- Organizations seeking digital transformation

**Pricing**: Starting at $29/month with flexible plans to suit your needs.`,

    'Email Campaign': `Subject: 🎯 Unlock the Power of ${prompt} - Exclusive Offer Inside!

Hi [Name],

I hope this email finds you well! I wanted to reach out personally because I believe ${prompt.toLowerCase()} could be a game-changer for your business.

**Here's what caught my attention about your company**:
You're always looking for innovative ways to improve efficiency and drive growth. That's exactly what our ${prompt.toLowerCase()} solution delivers.

**What makes this special**:
• Proven results with 500+ successful implementations
• Average ROI of 250% within the first 6 months
• Seamless integration with your existing systems
• Dedicated support team to ensure your success

**Exclusive Offer for You**:
As a valued prospect, I'm offering you a complimentary consultation and 30-day trial - completely free, no strings attached.

**Next Steps**:
Would you be available for a brief 15-minute call this week? I'd love to show you exactly how this could work for your specific situation.

You can book a time that works for you here: [Calendar Link]

Looking forward to connecting!

Best regards,
[Your Name]
[Your Title]
[Company Name]

P.S. This offer is only available until [Date], so don't miss out!`,

    'Social Media Post': `🔥 TRENDING NOW: ${prompt} 🔥

💡 Did you know that 87% of successful businesses are already leveraging this strategy?

Here's what you need to know:

👉 Key insight #1: It's not just a trend, it's the future
👉 Key insight #2: Early adopters see 3x better results
👉 Key insight #3: Implementation is easier than you think

🎯 **Ready to get started?**

Drop a 💪 in the comments if you're ready to level up!

📱 DM us for a free consultation
🔗 Link in bio for more resources

#Innovation #BusinessGrowth #Success #Trending #GameChanger #BusinessTips #Productivity #Growth

---

**Engagement Hooks**:
• "Tag someone who needs to see this!"
• "Save this post for later reference"
• "Share your experience in the comments"

**Call-to-Action Options**:
• "Click the link in our bio to learn more"
• "DM us 'INFO' for exclusive details"
• "Comment 'YES' if you want our free guide"`
  };

  const template = templates[contentType as keyof typeof templates] || templates['Blog Post'];
  return template;
}

export function useAIContentGeneration(): UseAIContentGenerationReturn {
  const [state, setState] = React.useState<AIContentGenerationState>({
    content: '',
    isGenerating: false,
    error: null,
    generatedContent: null,
    generationHistory: [],
  });

  const [lastGeneration, setLastGeneration] = React.useState<{
    prompt: string;
    contentType: string;
  } | null>(null);

  const generateContent = React.useCallback(async (prompt: string, contentType: string) => {
    if (!prompt.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter a prompt to generate content' }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    setLastGeneration({ prompt, contentType });
    
    try {
      const generatedText = await callAIAPI(prompt, contentType);
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        prompt,
        contentType,
        content: generatedText,
        timestamp: new Date(),
        wordCount: generatedText.split(' ').length,
      };

      setState(prev => ({
        ...prev,
        generatedContent: generatedText,
        generationHistory: [newContent, ...prev.generationHistory.slice(0, 9)], // Keep last 10
        isGenerating: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to generate content. Please try again.',
        isGenerating: false,
      }));
    }
  }, []);

  const regenerateContent = React.useCallback(async () => {
    if (lastGeneration) {
      await generateContent(lastGeneration.prompt, lastGeneration.contentType);
    }
  }, [lastGeneration, generateContent]);

  const copyContent = React.useCallback(async (): Promise<boolean> => {
    if (state.generatedContent) {
      try {
        await navigator.clipboard.writeText(state.generatedContent);
        return true;
      } catch (err) {
        setState(prev => ({ ...prev, error: 'Failed to copy content to clipboard' }));
        return false;
      }
    }
    return false;
  }, [state.generatedContent]);

  const downloadContent = React.useCallback((filename = 'generated-content.txt') => {
    if (state.generatedContent) {
      const blob = new Blob([state.generatedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [state.generatedContent]);

  const shareContent = React.useCallback(async (): Promise<boolean> => {
    if (state.generatedContent && navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Content',
          text: state.generatedContent,
        });
        return true;
      } catch (err) {
        setState(prev => ({ ...prev, error: 'Failed to share content' }));
        return false;
      }
    }
    return false;
  }, [state.generatedContent]);

  const setContent = React.useCallback((content: string) => {
    setState(prev => ({ ...prev, content }));
  }, []);

  const clearError = React.useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearGeneratedContent = React.useCallback(() => {
    setState(prev => ({ ...prev, generatedContent: null }));
  }, []);

  const saveToHistory = React.useCallback((content: GeneratedContent) => {
    setState(prev => ({
      ...prev,
      generationHistory: [content, ...prev.generationHistory.slice(0, 9)],
    }));
  }, []);

  const removeFromHistory = React.useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      generationHistory: prev.generationHistory.filter(item => item.id !== id),
    }));
  }, []);

  const clearHistory = React.useCallback(() => {
    setState(prev => ({ ...prev, generationHistory: [] }));
  }, []);

  return {
    ...state,
    setContent,
    generateContent,
    copyContent,
    downloadContent,
    shareContent,
    clearError,
    clearGeneratedContent,
    regenerateContent,
    saveToHistory,
    removeFromHistory,
    clearHistory,
  };
}