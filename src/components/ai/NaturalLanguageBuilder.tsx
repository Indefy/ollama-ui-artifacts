
import React, { useState } from 'react';
import { Wand2, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { generateUICode } from '@/lib/codeGenerator';
import { CodePayload } from '../LiveUIPreview';

interface ProjectComponent {
  id: string;
  name: string;
  description: string;
  code: CodePayload;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

interface NaturalLanguageBuilderProps {
  onProjectGenerated: (components: ProjectComponent[]) => void;
  selectedModel: string;
}

export const NaturalLanguageBuilder: React.FC<NaturalLanguageBuilderProps> = ({
  onProjectGenerated,
  selectedModel
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [components, setComponents] = useState<ProjectComponent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const projectTemplates = [
    "Build a SaaS dashboard with user profile, analytics charts, and settings page",
    "Create an e-commerce product page with cart, reviews, and related products",
    "Design a social media feed with posts, comments, and user interactions",
    "Build a task management app with kanban board, calendars, and team collaboration",
    "Create a landing page with hero section, features, testimonials, and contact form"
  ];

  const parseProjectPrompt = (prompt: string): string[] => {
    // Simple parsing logic - in production, use more sophisticated NLP
    const components = [];
    
    if (prompt.toLowerCase().includes('dashboard')) {
      components.push('Navigation Header', 'Analytics Chart', 'User Profile Widget', 'Settings Panel');
    }
    if (prompt.toLowerCase().includes('ecommerce') || prompt.toLowerCase().includes('product')) {
      components.push('Product Gallery', 'Add to Cart', 'Product Reviews', 'Related Products');
    }
    if (prompt.toLowerCase().includes('social') || prompt.toLowerCase().includes('feed')) {
      components.push('Post Card', 'Comment Section', 'User Profile', 'Navigation Menu');
    }
    if (prompt.toLowerCase().includes('task') || prompt.toLowerCase().includes('kanban')) {
      components.push('Task Card', 'Kanban Board', 'Calendar View', 'Team Members');
    }
    if (prompt.toLowerCase().includes('landing')) {
      components.push('Hero Section', 'Features Grid', 'Testimonials', 'Contact Form');
    }

    // Fallback for custom prompts
    if (components.length === 0) {
      components.push('Main Component', 'Navigation', 'Content Section', 'Footer');
    }

    return components;
  };

  const generateProject = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setCurrentStep(0);

    const componentNames = parseProjectPrompt(prompt);
    const projectComponents: ProjectComponent[] = componentNames.map((name, index) => ({
      id: `component-${index}`,
      name,
      description: `Generated ${name.toLowerCase()} component`,
      code: { html: '', css: '', js: '' },
      status: 'pending'
    }));

    setComponents(projectComponents);

    // Generate each component sequentially
    for (let i = 0; i < projectComponents.length; i++) {
      setCurrentStep(i);
      const component = projectComponents[i];
      
      // Update status to generating
      setComponents(prev => prev.map(c => 
        c.id === component.id ? { ...c, status: 'generating' } : c
      ));

      try {
        const componentPrompt = `Create a ${component.name} component for: ${prompt}. Make it modern, responsive, and interactive.`;
        
        const result = await generateUICode(componentPrompt, selectedModel);
        
        if (result.success && result.data) {
          const parsedCode = JSON.parse(result.data);
          
          setComponents(prev => prev.map(c => 
            c.id === component.id 
              ? { 
                  ...c, 
                  code: {
                    html: parsedCode.html || '',
                    css: parsedCode.css || '',
                    js: parsedCode.js || ''
                  },
                  status: 'completed' 
                }
              : c
          ));
        } else {
          throw new Error('Generation failed');
        }
      } catch (error) {
        setComponents(prev => prev.map(c => 
          c.id === component.id ? { ...c, status: 'error' } : c
        ));
      }

      // Small delay between generations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsGenerating(false);
    onProjectGenerated(components);
  };

  const getStatusIcon = (status: ProjectComponent['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
      case 'generating':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <div className="w-4 h-4 rounded-full bg-red-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 text-purple-500" size={20} />
          Natural Language Project Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Describe your project:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Build a SaaS dashboard with user profile and analytics..."
            className="w-full p-3 border rounded-md h-24 resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Template Suggestions */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Or try these examples:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {projectTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-2"
                onClick={() => setPrompt(template)}
                disabled={isGenerating}
              >
                {template}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateProject} 
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Generating Project...
            </>
          ) : (
            <>
              <Wand2 className="mr-2" size={16} />
              Generate Project
            </>
          )}
        </Button>

        {/* Generation Progress */}
        {components.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Generation Progress:</h3>
            {components.map((component, index) => (
              <div key={component.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                {getStatusIcon(component.status)}
                <div className="flex-1">
                  <div className="font-medium text-sm">{component.name}</div>
                  <div className="text-xs text-gray-500">{component.description}</div>
                </div>
                {index === currentStep && isGenerating && (
                  <ArrowRight className="text-blue-500" size={16} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {components.length > 0 && !isGenerating && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="font-medium text-green-800">
              Project Generated Successfully!
            </div>
            <div className="text-sm text-green-600">
              {components.filter(c => c.status === 'completed').length} components created
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
