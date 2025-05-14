import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PanelRightClose, PanelRightOpen, Code, Play } from 'lucide-react';

export interface CodePayload {
  html: string;
  css: string;
  js: string;
}

interface LiveUIPreviewProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  onCodeChange?: (code: CodePayload) => void;
}

const LiveUIPreview: React.FC<LiveUIPreviewProps> = ({
  initialHtml = '',
  initialCss = '',
  initialJs = '',
  onCodeChange,
}) => {
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);
  const [jsCode, setJsCode] = useState(initialJs);
  const [showCodePanel, setShowCodePanel] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const constructFullHtml = (html: string, css: string, js: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 16px;
              background-color: var(--preview-bg, #ffffff);
              color: var(--preview-text, #000000);
              line-height: 1.5;
            }
            * {
              box-sizing: border-box;
            }
            ${css}
          </style>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>
            try {
              ${js}
            } catch (error) {
              console.error('Error in user script:', error);
            }
          </script>
        </body>
      </html>
    `;
  };

  const updatePreview = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = constructFullHtml(htmlCode, cssCode, jsCode);
    }
  };

  useEffect(() => {
    setHtmlCode(initialHtml);
  }, [initialHtml]);

  useEffect(() => {
    setCssCode(initialCss);
  }, [initialCss]);

  useEffect(() => {
    setJsCode(initialJs);
  }, [initialJs]);

  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode]);

  const handleApplyChanges = () => {
    updatePreview();
    if (onCodeChange) {
      onCodeChange({ html: htmlCode, css: cssCode, js: jsCode });
    }
  };

  const toggleCodePanel = () => {
    setShowCodePanel(!showCodePanel);
  };

  return (
    <Card className="w-full h-full flex flex-col shadow-md border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="text-lg font-medium">Live UI Preview</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleCodePanel}
            className="transition-all duration-200 hover:bg-gray-100"
          >
            {showCodePanel ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            <span className="sr-only">Toggle Code Panel</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-row p-0 overflow-hidden">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            showCodePanel ? 'w-1/2' : 'w-full'
          } p-4 h-full`}
        >
          <div className="w-full h-full border rounded-md overflow-hidden bg-gray-50 shadow-inner">
            <iframe
              ref={iframeRef}
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full bg-white"
            />
          </div>
        </div>
        {showCodePanel && (
          <div className="w-1/2 border-l p-4 flex flex-col h-full">
            <Tabs defaultValue="html" className="flex-grow flex flex-col h-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="flex-grow overflow-hidden">
                <Textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="Enter HTML code..."
                  className="h-full resize-none font-mono text-sm p-3"
                />
              </TabsContent>
              <TabsContent value="css" className="flex-grow overflow-hidden">
                <Textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  placeholder="Enter CSS code..."
                  className="h-full resize-none font-mono text-sm p-3"
                />
              </TabsContent>
              <TabsContent value="js" className="flex-grow overflow-hidden">
                <Textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  placeholder="Enter JavaScript code..."
                  className="h-full resize-none font-mono text-sm p-3"
                />
              </TabsContent>
            </Tabs>
            <Button 
              onClick={handleApplyChanges} 
              className="mt-4 w-full transition-all duration-200 ease-in-out transform hover:translate-y-[-1px]"
            >
              <Play size={16} className="mr-2" /> 
              Run Preview
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveUIPreview