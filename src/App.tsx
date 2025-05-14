import React, { useState } from 'react';
import { CodePayload } from './components/LiveUIPreview';
import LiveUIPreview from './components/LiveUIPreview';
import ChatInterface from './components/ChatInterface';
import CodeExport from './components/CodeExport';

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

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        PocketAI Chat - Interactive Component Canvas
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <div className="h-[600px]">
          <ChatInterface onGenerateCode={handleGenerateCode} />
        </div>
        
        <div className="h-[600px]">
          <LiveUIPreview
            initialHtml={currentCode.html}
            initialCss={currentCode.css}
            initialJs={currentCode.js}
            onCodeChange={setCurrentCode}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6">
        <CodeExport code={currentCode} componentName={componentName} />
      </div>
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Interactive Component Canvas for PocketAI Chat © 2025</p>
      </footer>
    </div>
  );
}

export default App;