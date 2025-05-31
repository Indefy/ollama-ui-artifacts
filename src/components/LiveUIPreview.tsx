import React, { useState, useEffect, useRef } from 'react';
import { Eye, Code, Smartphone, Monitor, Tablet, RefreshCw, Download } from 'lucide-react';
import { Button } from './ui/button';

export interface CodePayload {
  html: string;
  css: string;
  js: string;
  success?: boolean;
  data?: {
    html?: string;
    css?: string;
    js?: string;
  };
}

interface LiveUIPreviewProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  onCodeChange?: (code: CodePayload) => void;
  code?: CodePayload;
  breakpoints?: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

type ViewMode = 'preview' | 'code';
type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const LiveUIPreview: React.FC<LiveUIPreviewProps> = ({
  initialHtml = '',
  initialCss = '',
  initialJs = '',
  onCodeChange,
  code,
  breakpoints
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Handle both prop systems (direct code object or individual props)
  const [htmlCode, setHtmlCode] = useState(code?.html || initialHtml || '');
  const [cssCode, setCssCode] = useState(code?.css || initialCss || '');
  const [jsCode, setJsCode] = useState(code?.js || initialJs || '');
  
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update code when props change
  useEffect(() => {
    console.log('LiveUIPreview props updated:', { 
      codeProvided: !!code,
      initialHtmlLength: initialHtml?.length || 0, 
      initialCssLength: initialCss?.length || 0,
      initialJsLength: initialJs?.length || 0 
    });
    
    if (code) {
      setHtmlCode(code.html || '');
      setCssCode(code.css || '');
      setJsCode(code.js || '');
      console.log('Updated from code prop', { 
        htmlLength: code.html?.length || 0,
        cssLength: code.css?.length || 0,
        jsLength: code.js?.length || 0
      });
    } else if (initialHtml || initialCss || initialJs) {
      setHtmlCode(initialHtml || '');
      setCssCode(initialCss || '');
      setJsCode(initialJs || '');
      console.log('Updated from initial props');
    }
  }, [initialHtml, initialCss, initialJs, code]);

  // Helper function to validate and clean JavaScript code
  const validateJavaScript = (jsCode: string): string => {
    if (!jsCode || !jsCode.trim()) return '';
    
    try {
      console.log('Validating JS code:', jsCode.substring(0, 100) + '...');
      
      // Enhanced validation - check for and fix common syntax issues
      // Less aggressive replacements to preserve more functionality
      let cleanedCode = jsCode
        .replace(/<script/gi, '&lt;script')  // Escape script tags
        .replace(/<\/script>/gi, '&lt;/script>')
        .replace(/document\.write\(/g, 'console.log(') // Prevent document.write calls that could break iframe
        // Keep most JavaScript functionality intact
        .trim();
      
      // Lighter safety wrapper that preserves more functionality
      cleanedCode = `
        try {
          ${cleanedCode}
        } catch (error) {
          console.error('JavaScript runtime error:', error.message);
        }
      `.trim();
        
      return cleanedCode;
    } catch (error) {
      console.warn('JavaScript validation failed:', error);
      return '// JavaScript validation failed - code was cleaned for safety';
    }
  };
  
  // Enhanced helper function to validate CSS
  const validateCSS = (cssCode: string): string => {
    if (!cssCode || !cssCode.trim()) return '';
    
    try {
      console.log('Validating CSS code:', cssCode.substring(0, 100) + '...');
      
      // Focused CSS cleaning that maintains most functionality
      // Only filter out potentially harmful script injections
      const cleanedCode = cssCode
        .replace(/<script/gi, '/* script')
        .replace(/<\/script>/gi, 'script */')
        .replace(/javascript:/gi, 'invalid:')
        // Keep most CSS functionality intact
        .trim();
        
      return cleanedCode;
    } catch (error) {
      console.warn('CSS validation failed:', error);
      return '/* CSS validation failed */';
    }
  };

  const generateSrcDoc = () => {
    // Debug the content to be included
    console.log('Current content state:', {
      html: htmlCode?.substring(0, 50) + (htmlCode && htmlCode.length > 50 ? '...' : ''),
      css: cssCode?.substring(0, 50) + (cssCode && cssCode.length > 50 ? '...' : ''),
      js: jsCode?.substring(0, 50) + (jsCode && jsCode.length > 50 ? '...' : '')
    });
    
    // Validate and clean the code content to prevent syntax errors
    const safeHtmlCode = (htmlCode || '')
      .replace(/<script/gi, '&lt;script')  // Disable inline scripts
      .replace(/<\/script>/gi, '&lt;/script>')
      .replace(/onerror=/gi, 'data-onerror=')
      .replace(/onclick=/gi, 'data-onclick=');
      
    const safeCssCode = validateCSS(cssCode || '');
    const safeJsCode = validateJavaScript(jsCode || '');
    
    // Add a placeholder if no content
    const defaultHtml = !safeHtmlCode.trim() ? 
      '<div style="text-align:center;padding:20px;color:#666;">No HTML content available</div>' : 
      safeHtmlCode;
    
    const srcDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';">
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
    ${safeCssCode}
  </style>
</head>
<body>
  ${defaultHtml}
  <script>
    (function() {
      try {
        // Console logging wrapper for debugging
        const originalConsoleLog = console.log;
        console.log = function() {
          originalConsoleLog.apply(console, arguments);
        };
        
        ${safeJsCode}
      } catch (error) {
        console.error('JavaScript error in preview:', error);
        console.log('Error details:', error.message);
      }
    })();
  </script>
</body>
</html>`;

    return srcDoc;
  };

  const handleCodeChange = (type: 'html' | 'css' | 'js', value: string) => {
    if (type === 'html') setHtmlCode(value);
    if (type === 'css') setCssCode(value);
    if (type === 'js') setJsCode(value);

    if (onCodeChange) {
      onCodeChange({
        html: type === 'html' ? value : htmlCode,
        css: type === 'css' ? value : cssCode,
        js: type === 'js' ? value : jsCode
      });
    }
  };

  const refreshPreview = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const getDeviceWidth = () => {
    switch (deviceSize) {
      case 'mobile': return breakpoints?.mobile || '375px';
      case 'tablet': return breakpoints?.tablet || '768px';
      case 'desktop': return '100%';
    }
  };

  const downloadHTML = () => {
    // Use the validated code to prevent security issues in the downloaded file
    const safeCssCode = validateCSS(cssCode);
    const safeJsCode = validateJavaScript(jsCode);
    const safeHtmlCode = (htmlCode || '')
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '<!-- script removed -->');
      
    const combinedCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Component</title>
  <style>
    ${safeCssCode}
  </style>
</head>
<body>
  ${safeHtmlCode}
  <script>
    // Code generated with Live UI Builder
    (function() {
      try {
        ${safeJsCode}
      } catch (error) {
        console.error('JavaScript error:', error);
      }
    })();
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

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully');
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
                onLoad={handleIframeLoad}
                srcDoc={generateSrcDoc()}
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