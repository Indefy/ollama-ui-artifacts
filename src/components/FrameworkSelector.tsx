
import React, { useState } from 'react';
import { Palette, Code, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface FrameworkSelectorProps {
  onFrameworkChange: (framework: string, variant: string) => void;
  currentCode: { html: string; css: string; js: string };
}

const frameworks = {
  tailwind: {
    name: 'Tailwind CSS',
    variants: ['default', 'dark', 'minimal', 'colorful'],
    classMap: {
      'btn': 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
      'card': 'bg-white shadow-md rounded-lg p-6',
      'input': 'border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
    }
  },
  bootstrap: {
    name: 'Bootstrap',
    variants: ['default', 'primary', 'secondary', 'success'],
    classMap: {
      'btn': 'btn btn-primary',
      'card': 'card',
      'input': 'form-control'
    }
  },
  materialui: {
    name: 'Material-UI',
    variants: ['default', 'outlined', 'contained', 'text'],
    classMap: {
      'btn': 'MuiButton-root MuiButton-contained',
      'card': 'MuiCard-root',
      'input': 'MuiTextField-root'
    }
  }
};

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  onFrameworkChange,
  currentCode
}) => {
  const [selectedFramework, setSelectedFramework] = useState('tailwind');
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [customTheme, setCustomTheme] = useState({
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#1f2937'
  });

  const convertToFramework = (framework: string, variant: string) => {
    const fw = frameworks[framework as keyof typeof frameworks];
    if (!fw) return currentCode;

    let convertedHtml = currentCode.html;
    let convertedCss = currentCode.css;

    // Basic class conversion (simplified)
    Object.entries(fw.classMap).forEach(([generic, specific]) => {
      convertedHtml = convertedHtml.replace(
        new RegExp(`class="([^"]*\\s)?${generic}(\\s[^"]*)?"`),
        `class="$1${specific}$2"`
      );
    });

    // Framework-specific CSS
    if (framework === 'tailwind') {
      convertedCss = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${convertedCss}`;
    } else if (framework === 'bootstrap') {
      convertedCss = `@import 'bootstrap/dist/css/bootstrap.min.css';\n\n${convertedCss}`;
    }

    return {
      html: convertedHtml,
      css: convertedCss,
      js: currentCode.js
    };
  };

  const generateThemeCSS = () => {
    return `
:root {
  --color-primary: ${customTheme.primary};
  --color-secondary: ${customTheme.secondary};
  --color-accent: ${customTheme.accent};
  --color-background: ${customTheme.background};
  --color-text: ${customTheme.text};
}

.theme-primary { color: var(--color-primary); }
.theme-bg-primary { background-color: var(--color-primary); }
.theme-border-primary { border-color: var(--color-primary); }

.theme-secondary { color: var(--color-secondary); }
.theme-bg-secondary { background-color: var(--color-secondary); }
.theme-border-secondary { border-color: var(--color-secondary); }

.theme-accent { color: var(--color-accent); }
.theme-bg-accent { background-color: var(--color-accent); }
.theme-border-accent { border-color: var(--color-accent); }
`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="mr-2" size={20} />
          Framework & Theme Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="framework">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="theme">Custom Theme</TabsTrigger>
          </TabsList>
          
          <TabsContent value="framework" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(frameworks).map(([key, framework]) => (
                <Button
                  key={key}
                  variant={selectedFramework === key ? "default" : "outline"}
                  onClick={() => setSelectedFramework(key)}
                  className="h-20 flex flex-col"
                >
                  <Code size={20} className="mb-1" />
                  <span className="text-xs">{framework.name}</span>
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Variant:</label>
              <div className="flex space-x-2">
                {frameworks[selectedFramework as keyof typeof frameworks].variants.map(variant => (
                  <Button
                    key={variant}
                    variant={selectedVariant === variant ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              onClick={() => onFrameworkChange(selectedFramework, selectedVariant)}
              className="w-full"
            >
              Apply Framework
            </Button>
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(customTheme).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm font-medium capitalize">{key}:</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setCustomTheme(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))}
                      className="w-12 h-8 rounded border"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setCustomTheme(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Generated CSS:</label>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                {generateThemeCSS()}
              </pre>
            </div>
            
            <Button
              onClick={() => {
                const themeCSS = generateThemeCSS();
                onFrameworkChange('custom', themeCSS);
              }}
              className="w-full"
            >
              Apply Custom Theme
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FrameworkSelector;
