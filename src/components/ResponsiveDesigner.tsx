import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CodePayload } from './LiveUIPreview';

interface ResponsiveDesignerProps {
  onResponsiveChange: (breakpoints: ResponsiveBreakpoints) => void;
  currentCode: CodePayload;
}

interface ResponsiveBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
}

type Device = 'mobile' | 'tablet' | 'desktop';

const ResponsiveDesigner: React.FC<ResponsiveDesignerProps> = ({ onResponsiveChange, currentCode }) => {
  const [activeDevice, setActiveDevice] = useState<Device>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [breakpoints, setBreakpoints] = useState<ResponsiveBreakpoints>({
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px'
  });

  const devices = [
    { id: 'mobile' as Device, name: 'Mobile', icon: Smartphone, width: '375px' },
    { id: 'tablet' as Device, name: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'desktop' as Device, name: 'Desktop', icon: Monitor, width: '1024px' }
  ];

  const handleBreakpointChange = (device: Device, value: string) => {
    const newBreakpoints = { ...breakpoints, [device]: value };
    setBreakpoints(newBreakpoints);
  };

  const generateResponsiveCSS = async () => {
    setIsGenerating(true);
    try {
      // Simulate responsive CSS generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      onResponsiveChange(breakpoints);
    } catch (error) {
      console.error('Error generating responsive CSS:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center">
          <Settings className="mr-2" size={20} />
          Responsive Designer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Selection */}
        <div className="flex space-x-2">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <Button
                key={device.id}
                onClick={() => setActiveDevice(device.id)}
                className={`glass-button text-white flex-1 p-3 ${
                  activeDevice === device.id ? 'bg-white/20' : ''
                }`}
              >
                <Icon size={16} className="mr-1" />
                <span className="text-xs">{device.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Breakpoint Configuration */}
        <div className="space-y-3">
          <label className="text-white text-sm font-medium">Breakpoints</label>
          {devices.map((device) => (
            <div key={device.id} className="space-y-1">
              <label className="text-gray-300 text-xs">{device.name} ({device.icon.name})</label>
              <input
                type="text"
                value={breakpoints[device.id]}
                onChange={(e) => handleBreakpointChange(device.id, e.target.value)}
                className="w-full glass-input text-white placeholder-gray-400"
                placeholder={`${device.width}`}
              />
            </div>
          ))}
        </div>

        {/* Current Device Info */}
        <div className="bg-black/20 p-3 rounded-lg">
          <div className="text-white text-sm font-medium">
            Active: {devices.find(d => d.id === activeDevice)?.name}
          </div>
          <div className="text-gray-300 text-xs">
            Breakpoint: {breakpoints[activeDevice]}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateResponsiveCSS}
          disabled={isGenerating || !currentCode.html}
          className="glass-button text-white w-full"
        >
          <Settings size={16} className="mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Responsive CSS'}
        </Button>

        {/* Tips */}
        <div className="text-xs text-gray-400 p-3 bg-black/10 rounded-lg">
          <div className="font-medium mb-1">Tips:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Use mobile-first approach</li>
            <li>Test across different screen sizes</li>
            <li>Consider touch interactions for mobile</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsiveDesigner;