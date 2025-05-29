import React, { useState } from 'react';
import { Palette, Type, Layers, Download, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface ThemeBuilderProps {
  onThemeChange: (theme: Theme) => void;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

interface Typography {
  headingFont: string;
  bodyFont: string;
  headingSize: string;
  bodySize: string;
  lineHeight: string;
}

interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface Theme {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: string;
  shadows: boolean;
}

const ThemeBuilder: React.FC<ThemeBuilderProps> = ({ onThemeChange }) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing'>('colors');
  const [theme, setTheme] = useState<Theme>({
    name: 'Custom Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingSize: '1.5rem',
      bodySize: '1rem',
      lineHeight: '1.6'
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: '0.5rem',
    shadows: true
  });

  const presetThemes: Partial<Theme>[] = [
    {
      name: 'Modern Blue',
      colors: {
        primary: '#2563eb',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b'
      }
    },
    {
      name: 'Dark Professional',
      colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#c4b5fd',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8'
      }
    },
    {
      name: 'Warm Sunset',
      colors: {
        primary: '#f59e0b',
        secondary: '#f97316',
        accent: '#ef4444',
        background: '#fffbeb',
        surface: '#fef3c7',
        text: '#92400e',
        textSecondary: '#d97706'
      }
    }
  ];

  const updateTheme = (updates: Partial<Theme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const updateColors = (colorUpdates: Partial<ColorPalette>) => {
    updateTheme({ colors: { ...theme.colors, ...colorUpdates } });
  };

  const updateTypography = (typographyUpdates: Partial<Typography>) => {
    updateTheme({ typography: { ...theme.typography, ...typographyUpdates } });
  };

  const updateSpacing = (spacingUpdates: Partial<Spacing>) => {
    updateTheme({ spacing: { ...theme.spacing, ...spacingUpdates } });
  };

  const applyPresetTheme = (preset: Partial<Theme>) => {
    updateTheme(preset);
  };

  const exportTheme = () => {
    const css = generateThemeCSS(theme);
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyThemeCSS = () => {
    const css = generateThemeCSS(theme);
    navigator.clipboard.writeText(css);
  };

  const generateThemeCSS = (theme: Theme): string => {
    return `:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-background: ${theme.colors.background};
  --color-surface: ${theme.colors.surface};
  --color-text: ${theme.colors.text};
  --color-text-secondary: ${theme.colors.textSecondary};

  /* Typography */
  --font-heading: ${theme.typography.headingFont};
  --font-body: ${theme.typography.bodyFont};
  --size-heading: ${theme.typography.headingSize};
  --size-body: ${theme.typography.bodySize};
  --line-height: ${theme.typography.lineHeight};

  /* Spacing */
  --space-xs: ${theme.spacing.xs};
  --space-sm: ${theme.spacing.sm};
  --space-md: ${theme.spacing.md};
  --space-lg: ${theme.spacing.lg};
  --space-xl: ${theme.spacing.xl};

  /* Layout */
  --border-radius: ${theme.borderRadius};
  --box-shadow: ${theme.shadows ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'};
}

/* Base styles */
body {
  font-family: var(--font-body);
  font-size: var(--size-body);
  line-height: var(--line-height);
  color: var(--color-text);
  background-color: var(--color-background);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-size: var(--size-heading);
  color: var(--color-text);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

.card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius);
  padding: var(--space-lg);
  box-shadow: var(--box-shadow);
}`;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center">
          <Palette className="mr-2" size={20} />
          Theme Builder
        </CardTitle>
        <p className="text-gray-300 text-sm">
          Create and customize design systems
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Theme Name */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Theme Name</label>
          <input
            type="text"
            value={theme.name}
            onChange={(e) => updateTheme({ name: e.target.value })}
            className="w-full glass-input text-white placeholder-gray-400"
          />
        </div>

        {/* Preset Themes */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">Quick Start</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presetThemes.map((preset, index) => (
              <Button
                key={index}
                onClick={() => applyPresetTheme(preset)}
                className="glass-button text-white text-xs p-2"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-black/20">
            <TabsTrigger value="colors" className="text-white">
              <Palette size={16} className="mr-1" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="text-white">
              <Type size={16} className="mr-1" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="text-white">
              <Layers size={16} className="mr-1" />
              Spacing
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-3 mt-4">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <label className="text-white text-sm w-24 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => updateColors({ [key]: e.target.value } as any)}
                    className="w-12 h-8 rounded border border-white/20"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateColors({ [key]: e.target.value } as any)}
                    className="flex-1 glass-input text-white text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="space-y-3 mt-4">
              <div>
                <label className="text-white text-sm">Heading Font</label>
                <input
                  type="text"
                  value={theme.typography.headingFont}
                  onChange={(e) => updateTypography({ headingFont: e.target.value })}
                  className="w-full glass-input text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm">Body Font</label>
                <input
                  type="text"
                  value={theme.typography.bodyFont}
                  onChange={(e) => updateTypography({ bodyFont: e.target.value })}
                  className="w-full glass-input text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white text-sm">Heading Size</label>
                  <input
                    type="text"
                    value={theme.typography.headingSize}
                    onChange={(e) => updateTypography({ headingSize: e.target.value })}
                    className="w-full glass-input text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm">Body Size</label>
                  <input
                    type="text"
                    value={theme.typography.bodySize}
                    onChange={(e) => updateTypography({ bodySize: e.target.value })}
                    className="w-full glass-input text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Spacing Tab */}
          {activeTab === 'spacing' && (
            <div className="space-y-3 mt-4">
              {Object.entries(theme.spacing).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <label className="text-white text-sm w-12 uppercase">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateSpacing({ [key]: e.target.value } as any)}
                    className="flex-1 glass-input text-white"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-white text-sm">Border Radius</label>
                  <input
                    type="text"
                    value={theme.borderRadius}
                    onChange={(e) => updateTheme({ borderRadius: e.target.value })}
                    className="w-full glass-input text-white"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    checked={theme.shadows}
                    onChange={(e) => updateTheme({ shadows: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-white text-sm">Enable Shadows</label>
                </div>
              </div>
            </div>
          )}
        </Tabs>

        {/* Export Options */}
        <div className="flex space-x-2 pt-4">
          <Button onClick={exportTheme} className="glass-button text-white flex-1">
            <Download size={16} className="mr-2" />
            Export CSS
          </Button>
          <Button onClick={copyThemeCSS} className="glass-button text-white flex-1">
            <Copy size={16} className="mr-2" />
            Copy CSS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { ThemeBuilder as default } from './theme/ThemeBuilder';