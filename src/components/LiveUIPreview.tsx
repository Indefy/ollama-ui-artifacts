import React, { useState, useEffect, useRef } from 'react';
import { Eye, Code, Smartphone, Monitor, Tablet, RefreshCw, Download } from 'lucide-react';
import { Button } from './ui/button';

export interface CodePayload {
  html: string;
  css: string;
  js: string;
}

interface LiveUIPreviewProps {
  initialHtml: string;
  initialCss: string;
  initialJs: string;
  onCodeChange: (code: CodePayload) => void;
}

type ViewMode = 'preview' | 'code';
type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const LiveUIPreview: React.FC<LiveUIPreviewProps> = ({
  initialHtml,
  initialCss,
  initialJs,
  onCodeChange
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);
  const [jsCode, setJsCode] = useState(initialJs);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setHtmlCode(initialHtml);
    setCssCode(initialCss);
    setJsCode(initialJs);
  }, [initialHtml, initialCss, initialJs]);

  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode]);

  const updatePreview = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        const combinedCode = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
                ${cssCode}
              </style>
            </head>
            <body>
              ${htmlCode}
              <script>
                try {
                  ${jsCode}
                } catch (error) {
                  console.error('JavaScript error:', error);
                }
              </script>
            </body>
          </html>
        `;
        doc.open();
        doc.write(combinedCode);
        doc.close();
      }
    }
  };

  const handleCodeChange = (type: 'html' | 'css' | 'js', value: string) => {
    if (type === 'html') setHtmlCode(value);
    if (type === 'css') setCssCode(value);
    if (type === 'js') setJsCode(value);

    onCodeChange({
      html: type === 'html' ? value : htmlCode,
      css: type === 'css' ? value : cssCode,
      js: type === 'js' ? value : jsCode
    });
  };

  const refreshPreview = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      updatePreview();
      setIsRefreshing(false);
    }, 500);
  };

  const getDeviceWidth = () => {
    switch (deviceSize) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
    }
  };

  const downloadHTML = () => {
    const combinedCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Component</title>
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    ${jsCode}
  </script>
</body>
</html>`;

    const blob = new Blob([combinedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full glass-card flex flex-col overflow-hidden">
      {/* Header with Controls */}
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-white flex items-center">
            <Eye size={18} className="mr-2 text-purple-300" />
            Live Preview
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={refreshPreview}
              disabled={isRefreshing}
              className="glass-button text-white p-2"
              title="Refresh Preview"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </Button>
            <Button
              onClick={downloadHTML}
              className="glass-button text-white p-2"
              title="Download HTML"
            >
              <Download size={16} />
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex space-x-2">
          <Button
            onClick={() => setViewMode('preview')}
            className={`glass-button text-white ${viewMode === 'preview' ? 'bg-white/20' : ''}`}
          >
            <Eye size={16} className="mr-1" />
            Preview
          </Button>
          <Button
            onClick={() => setViewMode('code')}
            className={`glass-button text-white ${viewMode === 'code' ? 'bg-white/20' : ''}`}
          >
            <Code size={16} className="mr-1" />
            Code
          </Button>
        </div>

        {/* Device Size Controls (Preview Mode) */}
        {viewMode === 'preview' && (
          <div className="flex space-x-2 mt-2">
            <Button
              onClick={() => setDeviceSize('mobile')}
              className={`glass-button text-white p-2 ${deviceSize === 'mobile' ? 'bg-white/20' : ''}`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </Button>
            <Button
              onClick={() => setDeviceSize('tablet')}
              className={`glass-button text-white p-2 ${deviceSize === 'tablet' ? 'bg-white/20' : ''}`}
              title="Tablet View"
            >
              <Tablet size={16} />
            </Button>
            <Button
              onClick={() => setDeviceSize('desktop')}
              className={`glass-button text-white p-2 ${deviceSize === 'desktop' ? 'bg-white/20' : ''}`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="h-full flex justify-center items-start p-4 bg-white/5">
            <div 
              className="border border-white/20 rounded-lg overflow-hidden bg-white shadow-lg transition-all duration-300"
              style={{ width: getDeviceWidth(), maxWidth: '100%', height: 'fit-content', minHeight: '400px' }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                style={{ minHeight: '400px' }}
                title="Component Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Code Editor Tabs */}
            <div className="flex border-b border-white/20 bg-black/20">
              {(['html', 'css', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                    activeTab === tab 
                      ? 'text-white bg-white/10 border-b-2 border-blue-400' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-4 bg-black/30">
              <textarea
                value={
                  activeTab === 'html' ? htmlCode :
                  activeTab === 'css' ? cssCode : jsCode
                }
                onChange={(e) => handleCodeChange(activeTab, e.target.value)}
                className="w-full h-full code-editor resize-none border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder={`Enter ${activeTab.toUpperCase()} code here...`}
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveUIPreview;