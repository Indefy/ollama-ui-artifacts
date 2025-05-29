The code replaces the FrameworkSelector component implementation with a new version that includes framework and variant selection, a conversion process, and UI updates.
```

```replit_final_file
import React, { useState } from 'react';
import { Palette, Code2, Layers } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CodePayload } from './LiveUIPreview';

interface FrameworkSelectorProps {
  onFrameworkChange: (framework: string, variant: string) => void;
  currentCode: CodePayload;
}

type Framework = 'tailwind' | 'bootstrap' | 'material' | 'vanilla';
type Variant = 'modern' | 'classic' | 'minimal' | 'bold';

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({ onFrameworkChange, currentCode }) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('vanilla');
  const [selectedVariant, setSelectedVariant] = useState<Variant>('modern');
  const [isConverting, setIsConverting] = useState(false);

  const frameworks = [
    { id: 'vanilla' as Framework, name: 'Vanilla CSS', icon: Code2 },
    { id: 'tailwind' as Framework, name: 'Tailwind CSS', icon: Palette },
    { id: 'bootstrap' as Framework, name: 'Bootstrap', icon: Layers },
    { id: 'material' as Framework, name: 'Material UI', icon: Palette }
  ];

  const variants = [
    { id: 'modern' as Variant, name: 'Modern', description: 'Clean, contemporary design' },
    { id: 'classic' as Variant, name: 'Classic', description: 'Traditional, timeless style' },
    { id: 'minimal' as Variant, name: 'Minimal', description: 'Simple, essential elements' },
    { id: 'bold' as Variant, name: 'Bold', description: 'Strong, impactful design' }
  ];

  const convertFramework = async () => {
    setIsConverting(true);
    try {
      // Simulate framework conversion
      await new Promise(resolve => setTimeout(resolve, 1500));
      onFrameworkChange(selectedFramework, selectedVariant);
    } catch (error) {
      console.error('Error converting framework:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center">
          <Code2 className="mr-2" size={20} />
          Framework Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Framework Selection */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">CSS Framework</label>
          <div className="grid grid-cols-2 gap-2">
            {frameworks.map((framework) => {
              const Icon = framework.icon;
              return (
                <Button
                  key={framework.id}
                  onClick={() => setSelectedFramework(framework.id)}
                  className={`glass-button text-white p-3 ${
                    selectedFramework === framework.id ? 'bg-white/20' : ''
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  <span className="text-xs">{framework.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Variant Selection */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Design Variant</label>
          <div className="space-y-2">
            {variants.map((variant) => (
              <Button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                className={`glass-button text-white w-full text-left p-3 ${
                  selectedVariant === variant.id ? 'bg-white/20' : ''
                }`}
              >
                <div>
                  <div className="font-medium">{variant.name}</div>
                  <div className="text-xs text-gray-300">{variant.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Convert Button */}
        <Button
          onClick={convertFramework}
          disabled={isConverting || !currentCode.html}
          className="glass-button text-white w-full"
        >
          <Palette size={16} className="mr-2" />
          {isConverting ? 'Converting...' : 'Apply Framework'}
        </Button>

        {/* Preview Info */}
        {selectedFramework !== 'vanilla' && (
          <div className="text-xs text-gray-300 p-3 bg-black/20 rounded-lg">
            Will convert to {frameworks.find(f => f.id === selectedFramework)?.name} with {selectedVariant} variant
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FrameworkSelector;