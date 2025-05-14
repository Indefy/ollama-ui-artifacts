import React, { useState } from 'react';
import { Download, Copy, Check, Code, Archive, FileCode2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CodePayload } from './LiveUIPreview';

interface CodeExportProps {
  code: CodePayload;
  componentName?: string;
}

type ExportFormat = 'standalone' | 'react' | 'vue' | 'angular';

const CodeExport: React.FC<CodeExportProps> = ({ 
  code, 
  componentName = 'UIComponent' 
}) => {
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('standalone');
  
  const formatComponentName = (name: string): string => {
    // Convert to PascalCase for component naming
    return name
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
        index === 0 ? letter.toUpperCase() : letter.toUpperCase()
      )
      .replace(/\s+/g, '');
  };
  
  const formattedComponentName = formatComponentName(componentName);
  
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ ...copyStatus, [key]: true });
      
      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [key]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const generateStandaloneHTML = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName}</title>
  <style>
${code.css}
  </style>
</head>
<body>
${code.html}

<script>
${code.js}
</script>
</body>
</html>`;
  };
  
  const generateReactComponent = (): string => {
    // Convert inline event handlers to React format if they exist
    const reactHtml = code.html
      .replace(/on(\w+)="([^"]*)"/g, (match, event, handler) => {
        const reactEvent = `on${event.charAt(0).toUpperCase() + event.slice(1)}`;
        return `${reactEvent}={() => { ${handler} }}`;
      });
      
    return `import React, { useEffect } from 'react';

// ${formattedComponentName} Component
const ${formattedComponentName} = () => {
  useEffect(() => {
    // Component mount effect for JS initialization
    const initComponent = () => {
      ${code.js}
    };
    
    initComponent();
    
    // Cleanup function
    return () => {
      // Add any cleanup code here if needed
    };
  }, []);

  return (
    <div className="${formattedComponentName.toLowerCase()}-container">
      ${reactHtml}
    </div>
  );
};

// Scoped styles using CSS-in-JS pattern
const styles = \`
${code.css}
\`;

export default function ${formattedComponentName}WithStyles() {
  return (
    <>
      <style>{styles}</style>
      <${formattedComponentName} />
    </>
  );
}`;
  };

  const generateVueComponent = (): string => {
    return `<template>
${code.html}
</template>

<script>
export default {
  name: '${formattedComponentName}',
  mounted() {
    // Component initialization code
${code.js.split('\n').map(line => `    ${line}`).join('\n')}
  }
}
</script>

<style scoped>
${code.css}
</style>`;
  };

  const generateAngularComponent = (): string => {
    // Generate component file
    const componentTs = `import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-${componentName.toLowerCase().replace(/\s+/g, '-')}',
  templateUrl: './${componentName.toLowerCase().replace(/\s+/g, '-')}.component.html',
  styleUrls: ['./${componentName.toLowerCase().replace(/\s+/g, '-')}.component.css']
})
export class ${formattedComponentName}Component implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    // Component initialization code
${code.js.split('\n').map(line => `    ${line}`).join('\n')}
  }
}`;

    return componentTs;
  };
  
  const downloadCode = (format: ExportFormat) => {
    let content = '';
    let filename = '';
    let type = 'text/plain';
    
    switch (format) {
      case 'standalone':
        content = generateStandaloneHTML();
        filename = `${componentName.toLowerCase().replace(/\s+/g, '-')}.html`;
        type = 'text/html';
        break;
        
      case 'react':
        content = generateReactComponent();
        filename = `${formattedComponentName}.jsx`;
        break;
        
      case 'vue':
        content = generateVueComponent();
        filename = `${formattedComponentName}.vue`;
        break;
        
      case 'angular':
        content = generateAngularComponent();
        filename = `${componentName.toLowerCase().replace(/\s+/g, '-')}.component.ts`;
        break;
    }
    
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };
  
  const getCodeForSelectedFormat = () => {
    switch (selectedFormat) {
      case 'standalone': return generateStandaloneHTML();
      case 'react': return generateReactComponent();
      case 'vue': return generateVueComponent();
      case 'angular': return generateAngularComponent();
      default: return generateStandaloneHTML();
    }
  };

  // Get the description based on the selected format
  const getFormatDescription = () => {
    switch (selectedFormat) {
      case 'standalone':
        return 'Single HTML file with embedded CSS and JavaScript. Ready to use in any web browser.';
      case 'react':
        return 'React functional component with embedded styles. Can be imported directly into your React application.';
      case 'vue':
        return 'Vue single-file component (.vue) with scoped styles. Ready for use in Vue applications.';
      case 'angular':
        return 'Angular component TypeScript file. HTML and CSS will be downloaded separately.';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full shadow-md border-gray-200">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg font-medium flex items-center">
          <FileCode2 size={18} className="mr-2 text-blue-500" />
          Export UI Component
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <label htmlFor="componentName" className="block text-sm font-medium text-gray-700 mb-1">
            Component Name
          </label>
          <input
            type="text"
            id="componentName"
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            defaultValue={componentName}
            placeholder="Enter component name..."
          />
        </div>
        
        <Tabs 
          defaultValue="standalone" 
          className="w-full"
          onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="standalone">HTML</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="vue">Vue</TabsTrigger>
            <TabsTrigger value="angular">Angular</TabsTrigger>
          </TabsList>
          
          <div className="bg-gray-50 p-3 my-4 rounded-md text-sm text-gray-600">
            {getFormatDescription()}
          </div>
          
          <div className="flex justify-between mb-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(getCodeForSelectedFormat(), selectedFormat)}
              className="flex items-center"
            >
              {copyStatus[selectedFormat] ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
              {copyStatus[selectedFormat] ? 'Copied!' : 'Copy Code'}
            </Button>
            
            <Button
              onClick={() => downloadCode(selectedFormat)}
              className="flex items-center"
            >
              <Download size={16} className="mr-1" />
              Download
            </Button>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-2">
                <Code size={16} className="mr-1" />
                Preview Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{formattedComponentName} Code Preview</DialogTitle>
                <DialogDescription>
                  {selectedFormat.charAt(0).toUpperCase() + selectedFormat.slice(1)} format
                </DialogDescription>
              </DialogHeader>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[60vh]">
                <pre className="whitespace-pre-wrap text-sm">
                  <code>{getCodeForSelectedFormat()}</code>
                </pre>
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => copyToClipboard(getCodeForSelectedFormat(), 'preview')}
                  className="flex items-center mr-2"
                >
                  {copyStatus['preview'] ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                  {copyStatus['preview'] ? 'Copied!' : 'Copy Code'}
                </Button>
                <Button
                  onClick={() => downloadCode(selectedFormat)}
                  className="flex items-center"
                >
                  <Download size={16} className="mr-1" />
                  Download
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Export Options</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="flex items-center justify-center">
                <Archive size={16} className="mr-1" />
                Export as ZIP
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center justify-center">
                    <Code size={16} className="mr-1" />
                    Advanced Options
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Export Options</DialogTitle>
                    <DialogDescription>
                      Configure additional export settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="minify" />
                      <label htmlFor="minify" className="text-sm">Minify code</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="addComments" />
                      <label htmlFor="addComments" className="text-sm">Add documentation comments</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="addTypeScript" />
                      <label htmlFor="addTypeScript" className="text-sm">Generate TypeScript definitions</label>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeExport;
