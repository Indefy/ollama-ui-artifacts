
import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Grid, Move, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Breakpoint {
  name: string;
  width: number;
  icon: React.ReactNode;
}

interface ResponsiveDesignerProps {
  onResponsiveChange: (breakpoints: Record<string, string>) => void;
  currentCode: { html: string; css: string; js: string };
}

const breakpoints: Breakpoint[] = [
  { name: 'mobile', width: 375, icon: <Smartphone size={16} /> },
  { name: 'tablet', width: 768, icon: <Tablet size={16} /> },
  { name: 'desktop', width: 1024, icon: <Monitor size={16} /> }
];

const ResponsiveDesigner: React.FC<ResponsiveDesignerProps> = ({
  onResponsiveChange,
  currentCode
}) => {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState('desktop');
  const [layoutType, setLayoutType] = useState<'flexbox' | 'grid'>('flexbox');
  const [gridColumns, setGridColumns] = useState(3);
  const [flexDirection, setFlexDirection] = useState<'row' | 'column'>('row');
  const [responsiveRules, setResponsiveRules] = useState<Record<string, string>>({
    mobile: '',
    tablet: '',
    desktop: ''
  });

  const generateResponsiveCSS = () => {
    let css = currentCode.css;
    
    // Add base layout styles
    if (layoutType === 'grid') {
      css += `\n\n.responsive-container {
  display: grid;
  grid-template-columns: repeat(${gridColumns}, 1fr);
  gap: 1rem;
  padding: 1rem;
}`;
    } else {
      css += `\n\n.responsive-container {
  display: flex;
  flex-direction: ${flexDirection};
  gap: 1rem;
  padding: 1rem;
  flex-wrap: wrap;
}`;
    }

    // Add responsive breakpoints
    breakpoints.forEach(breakpoint => {
      if (responsiveRules[breakpoint.name]) {
        css += `\n\n@media (max-width: ${breakpoint.width}px) {
  ${responsiveRules[breakpoint.name]}
}`;
      }
    });

    return css;
  };

  const updateResponsiveRule = (breakpoint: string, rule: string) => {
    const newRules = { ...responsiveRules, [breakpoint]: rule };
    setResponsiveRules(newRules);
    onResponsiveChange(newRules);
  };

  const generateMobileFirstRules = () => {
    const rules = {
      mobile: `
  .responsive-container {
    flex-direction: column;
    grid-template-columns: 1fr;
  }
  
  .responsive-item {
    width: 100%;
    margin-bottom: 1rem;
  }`,
      tablet: `
  .responsive-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .responsive-item {
    width: calc(50% - 0.5rem);
  }`,
      desktop: `
  .responsive-container {
    grid-template-columns: repeat(${gridColumns}, 1fr);
  }
  
  .responsive-item {
    width: auto;
  }`
    };
    
    setResponsiveRules(rules);
    onResponsiveChange(rules);
  };

  const wrapWithResponsiveContainer = () => {
    const wrappedHtml = `<div class="responsive-container">
  ${currentCode.html.replace(/<div/g, '<div class="responsive-item"')}
</div>`;
    
    return {
      html: wrappedHtml,
      css: generateResponsiveCSS(),
      js: currentCode.js
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Grid className="mr-2" size={20} />
          Responsive Design Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Breakpoint Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Active Breakpoint:</label>
          <div className="flex space-x-2">
            {breakpoints.map(bp => (
              <Button
                key={bp.name}
                variant={selectedBreakpoint === bp.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBreakpoint(bp.name)}
                className="flex items-center space-x-1"
              >
                {bp.icon}
                <span>{bp.name}</span>
                <span className="text-xs">({bp.width}px)</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Layout Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Layout System:</label>
          <div className="flex space-x-2">
            <Button
              variant={layoutType === 'flexbox' ? "default" : "outline"}
              size="sm"
              onClick={() => setLayoutType('flexbox')}
            >
              <Move className="mr-1" size={14} />
              Flexbox
            </Button>
            <Button
              variant={layoutType === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setLayoutType('grid')}
            >
              <Grid className="mr-1" size={14} />
              CSS Grid
            </Button>
          </div>
        </div>

        {/* Layout Options */}
        {layoutType === 'grid' ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Grid Columns:</label>
            <input
              type="range"
              min="1"
              max="12"
              value={gridColumns}
              onChange={(e) => setGridColumns(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600">{gridColumns} columns</div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">Flex Direction:</label>
            <div className="flex space-x-2">
              <Button
                variant={flexDirection === 'row' ? "default" : "outline"}
                size="sm"
                onClick={() => setFlexDirection('row')}
              >
                Row
              </Button>
              <Button
                variant={flexDirection === 'column' ? "default" : "outline"}
                size="sm"
                onClick={() => setFlexDirection('column')}
              >
                Column
              </Button>
            </div>
          </div>
        )}

        {/* Responsive Rules Editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            CSS Rules for {selectedBreakpoint}:
          </label>
          <textarea
            value={responsiveRules[selectedBreakpoint] || ''}
            onChange={(e) => updateResponsiveRule(selectedBreakpoint, e.target.value)}
            placeholder={`Add CSS rules for ${selectedBreakpoint} devices...`}
            className="w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={generateMobileFirstRules}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Smartphone className="mr-1" size={14} />
            Mobile First
          </Button>
          <Button
            onClick={() => onResponsiveChange(wrapWithResponsiveContainer())}
            className="flex items-center"
          >
            <Grid className="mr-1" size={14} />
            Apply Layout
          </Button>
        </div>

        {/* Preview Grid */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="text-sm font-medium mb-2">Layout Preview:</div>
          <div 
            className={`border-2 border-dashed border-gray-300 p-4 ${
              layoutType === 'grid' 
                ? `grid grid-cols-${gridColumns} gap-2` 
                : `flex ${flexDirection === 'column' ? 'flex-col' : 'flex-row'} gap-2`
            }`}
            style={{
              width: breakpoints.find(bp => bp.name === selectedBreakpoint)?.width || '100%'
            }}
          >
            {Array.from({ length: layoutType === 'grid' ? gridColumns : 3 }).map((_, i) => (
              <div key={i} className="bg-blue-200 p-2 rounded text-xs text-center">
                Item {i + 1}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveDesigner;
