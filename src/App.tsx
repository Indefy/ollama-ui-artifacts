import React, { useState } from 'react';
import { CodePayload } from './components/LiveUIPreview';
import LiveUIPreview from './components/LiveUIPreview';
import ChatInterface from './components/ChatInterface';
import CodeExport from './components/CodeExport';
import ComponentLibrary from './components/ComponentLibrary';

function App() {
  const [currentCode, setCurrentCode] = useState<CodePayload>({
    html: '<div class="welcome-message"><h1>Interactive UI Preview</h1><p>Start by asking the AI to create a UI component in the chat!</p></div>',
    css: `.welcome-message {
  text-align: center;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

h1 {
  color: #3b82f6;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

p {
  color: #4b5563;
  font-size: 1.1rem;
  line-height: 1.5;
}`,
    js: ''
  });
  const [componentName, setComponentName] = useState<string>('MyComponent');

  const handleGenerateCode = (html: string, css: string, js: string) => {
    setCurrentCode({ html, css, js });
    setComponentName('GeneratedComponent');
  };

  const handleTemplateSelect = (code: CodePayload) => {
    setCurrentCode(code);
    setComponentName('TemplateComponent');
  };

  return (
    <div className="min-h-screen animated-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            PocketAI Canvas
          </h1>
          <p className="text-blue-100 text-lg opacity-90">
            Generate • Preview • Export Beautiful UI Components
          </p>
        </header>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-[700px]">
            <ChatInterface onGenerateCode={handleGenerateCode} />
          </div>
          
          <div className="h-[700px]">
            <LiveUIPreview
              initialHtml={currentCode.html}
              initialCss={currentCode.css}
              initialJs={currentCode.js}
              onCodeChange={setCurrentCode}
            />
          </div>
        </div>

        {/* Component Library */}
        <div className="mb-8">
          <ComponentLibrary onSelectTemplate={handleTemplateSelect} />
        </div>

        {/* Code Export Section */}
        <div className="mb-8">
          <CodeExport code={currentCode} componentName={componentName} />
        </div>
        
        {/* Enhanced Footer */}
        <footer className="text-center py-6">
          <div className="glass-card inline-block px-6 py-3">
            <p className="text-white text-sm opacity-80">
              Interactive Component Canvas for PocketAI Chat © 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;