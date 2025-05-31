import React, { useState } from 'react';
import { Shuffle, Copy, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CodePayload } from './LiveUIPreview';
import { generateUICode } from '@/lib/codeGenerator';

interface ComponentVariationsProps {
  onSelectVariation: (code: CodePayload) => void;
  basePrompt: string;
  selectedModel: string;
}

interface Variation {
  id: string;
  name: string;
  description: string;
  code: CodePayload;
  isLoading: boolean;
}

const ComponentVariations: React.FC<ComponentVariationsProps> = ({ 
  onSelectVariation, 
  basePrompt, 
  selectedModel 
}) => {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const variationStyles = [
    { name: 'Modern', description: 'Clean, contemporary design with subtle shadows' },
    { name: 'Glassmorphism', description: 'Frosted glass effect with transparency' },
    { name: 'Neumorphism', description: 'Soft, extruded appearance with inner shadows' },
    { name: 'Material Design', description: 'Google\'s material design principles' },
    { name: 'Minimalist', description: 'Simple, clean design with minimal elements' },
    { name: 'Retro', description: 'Vintage-inspired design with bold colors' }
  ];
  const generateVariations = async () => {
    if (!basePrompt || basePrompt.trim() === '') return;

    setIsGenerating(true);
    const newVariations: Variation[] = variationStyles.map((style, index) => ({
      id: `var-${index}`,
      name: style.name,
      description: style.description,
      code: { html: '', css: '', js: '' },
      isLoading: true
    }));

    setVariations(newVariations);

    // Generate each variation
    for (let i = 0; i < variationStyles.length; i++) {
      const style = variationStyles[i];
      const enhancedPrompt = `${basePrompt}. Style: ${style.name} - ${style.description}`;

      try {
        const code = await generateUICode(enhancedPrompt, selectedModel);
        setVariations(prev => prev.map((variation, index) => 
          index === i 
            ? { ...variation, code, isLoading: false }
            : variation
        ));
      } catch (error) {
        console.error(`Error generating ${style.name} variation:`, error);
        setVariations(prev => prev.map((variation, index) => 
          index === i 
            ? { ...variation, isLoading: false }
            : variation
        ));
      }
    }

    setIsGenerating(false);
  };

  const copyToClipboard = (code: CodePayload) => {
    const combinedCode = `HTML:\n${code.html}\n\nCSS:\n${code.css}\n\nJS:\n${code.js}`;
    navigator.clipboard.writeText(combinedCode);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center">
          <Shuffle className="mr-2" size={20} />
          Component Variations
        </CardTitle>
        <p className="text-gray-300 text-sm">
          Generate multiple design variations of your component
        </p>
      </CardHeader>
      <CardContent className="space-y-4">        <Button
          onClick={generateVariations}
          disabled={isGenerating || !basePrompt || basePrompt.trim() === ''}
          className="glass-button text-white w-full"
        >
          <Shuffle size={16} className="mr-2" />
          {isGenerating ? 'Generating Variations...' : 'Generate Variations'}
        </Button>

        {variations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {variations.map((variation) => (
              <Card key={variation.id} className="glass-card border border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium text-sm">{variation.name}</h3>
                      <p className="text-gray-400 text-xs">{variation.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {variation.isLoading ? (
                    <div className="flex items-center justify-center h-24 bg-black/20 rounded">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      <div className="h-24 bg-black/20 rounded overflow-hidden">
                        <iframe
                          srcDoc={`
                            <html>
                              <head><style>body{margin:0;padding:10px;font-family:system-ui,sans-serif;transform:scale(0.6);transform-origin:top left;width:166%;height:166%;} ${variation.code.css}</style></head>
                              <body>${variation.code.html}<script>${variation.code.js}</script></body>
                            </html>
                          `}
                          className="w-full h-full border-0 pointer-events-none"
                        />
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => onSelectVariation(variation.code)}
                          className="glass-button text-white flex-1 text-xs"
                        >
                          <Eye size={12} className="mr-1" />
                          Use
                        </Button>
                        <Button
                          onClick={() => copyToClipboard(variation.code)}
                          className="glass-button text-white p-2"
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComponentVariations;