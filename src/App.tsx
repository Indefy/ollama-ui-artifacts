import React, { useState, ComponentType } from 'react';
import { 
  MessageSquare, 
  Eye, 
  Code2,
  Download,
  Menu,
  Sparkles,
  Monitor,
  Palette,
  FolderOpen,
  MousePointer,
  Brain
} from 'lucide-react';
import { CodePayload } from './components/LiveUIPreview';
import LiveUIPreview from './components/LiveUIPreview';
import ChatInterface from './components/ChatInterface';
import CodeExport from './components/CodeExport';
import ComponentLibrary from './components/ComponentLibrary';
import MultiStepGenerator from './components/MultiStepGenerator';
import FrameworkSelector from './components/FrameworkSelector';
import ResponsiveDesigner from './components/ResponsiveDesigner';
import ComponentVariations from './components/ComponentVariations';
import ThemeBuilder from './components/ThemeBuilder';
import { Button } from './components/ui/button';
import { AuthProvider, LoginButton } from './components/Auth';
import ProjectSystem from "./components/ProjectSystem";
import DragDropEditor from "./components/DragDropEditor";
import NaturalLanguageBuilder from './components/NaturalLanguageBuilder';
import AIMemorySystem from './components/AIMemorySystem';

type TabId = 'chat' | 'preview' | 'editor' | 'export' | 'settings' | 'library' | 'tools' | 'projects' | 'visual' | 'ai-builder';

// Type definitions for component props
interface ResponsiveBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
}

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    headingSize: string;
    bodySize: string;
    lineHeight: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  shadows: boolean;
}

interface ProjectComponent {
  id: string;
  name: string;
  description: string;
  code: CodePayload;
  status: 'pending' | 'generating' | 'completed' | 'error';
}

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  component: React.ReactNode;
}

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
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [codeEditorTab, setCodeEditorTab] = useState<'html' | 'css' | 'js'>('html');

  const handleGenerateCode = (html: string, css: string, js: string, prompt?: string) => {
    setCurrentCode({ html, css, js });
    setComponentName('GeneratedComponent');
    if (prompt) setLastPrompt(prompt);
    // Auto-switch to preview tab when code is generated
    setActiveTab('preview');
  };

  const handleTemplateSelect = (code: CodePayload) => {
    setCurrentCode(code);
    setComponentName('TemplateComponent');
    setActiveTab('preview');
  };

  const handleCodeChange = (code: CodePayload) => {
    setCurrentCode(code);
  };

  // Code Editor Component
  const CodeEditor = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-green-500/20 to-blue-500/20">
        <h2 className="text-lg font-medium text-white flex items-center mb-3">
          <Code2 size={18} className="mr-2 text-green-300" />
          Code Editor
        </h2>
        <div className="flex space-x-2">
          {(['html', 'css', 'js'] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setCodeEditorTab(tab)}
              className={`glass-button text-white text-sm ${
                codeEditorTab === tab ? 'bg-white/20' : ''
              }`}
            >
              {tab.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 bg-black/30">
        <textarea
          value={
            codeEditorTab === 'html' ? currentCode.html :
            codeEditorTab === 'css' ? currentCode.css : currentCode.js
          }
          onChange={(e) => {
            const newCode = {
              ...currentCode,
              [codeEditorTab]: e.target.value
            };
            setCurrentCode(newCode);
            handleCodeChange(newCode);
          }}
          className="w-full h-full code-editor resize-none border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          placeholder={`Enter ${codeEditorTab.toUpperCase()} code here...`}
          spellCheck={false}
        />
      </div>
    </div>
  );

  // Advanced Tools Component
  const AdvancedTools = () => (
    <div className="h-full p-4 space-y-6 overflow-y-auto">
      <div className="glass-card">
        <div className="p-4 border-b border-white/20">
          <h2 className="text-lg font-medium text-white flex items-center">
            <Sparkles size={18} className="mr-2 text-purple-300" />
            AI Tools
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <MultiStepGenerator 
            onGenerateCode={(html, css, js) => handleGenerateCode(html, css, js)}
            selectedModel="deepseek-r1:latest"
          />
        </div>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-white/20">
          <h2 className="text-lg font-medium text-white flex items-center">
            <Monitor size={18} className="mr-2 text-blue-300" />
            Framework & Responsive
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <FrameworkSelector 
            onFrameworkChange={(framework: string, variant: string) => {
              console.log('Framework change:', framework, variant);
            }}
            currentCode={currentCode}
          />
          <ResponsiveDesigner 
            onResponsiveChange={(breakpoints: ResponsiveBreakpoints) => {
              console.log('Responsive changes:', breakpoints);
            }}
            currentCode={currentCode}
          />
        </div>
      </div>

      <div className="glass-card">
        <div className="p-4 border-b border-white/20">
          <h2 className="text-lg font-medium text-white flex items-center">
            <Palette size={18} className="mr-2 text-pink-300" />
            Theme Builder
          </h2>
        </div>
        <div className="p-4">
          <ThemeBuilder
            onThemeChange={(theme: Theme) => {
              console.log('Theme changed:', theme);
            }}
          />
        </div>
      </div>

      {lastPrompt && (
        <div className="glass-card">
          <div className="p-4 border-b border-white/20">
            <h2 className="text-lg font-medium text-white">Component Variations</h2>
          </div>
          <div className="p-4">
            <ComponentVariations
              onSelectVariation={(code: CodePayload) => setCurrentCode(code)}
              basePrompt={lastPrompt}
              selectedModel="deepseek-r1:latest"
            />
          </div>
        </div>
      )}
    </div>
  );

  const tabs: Tab[] = [
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare as ComponentType<{ size?: number; className?: string }>,
      component: <ChatInterface onGenerateCode={handleGenerateCode} />
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: Eye as ComponentType<{ size?: number; className?: string }>,
      component: (
        <LiveUIPreview
          key={`${currentCode.html.length}-${currentCode.css.length}-${currentCode.js.length}`}
          initialHtml={currentCode.html}
          initialCss={currentCode.css}
          initialJs={currentCode.js}
          onCodeChange={handleCodeChange}
        />
      )
    },
    {
      id: 'editor',
      label: 'Editor',
      icon: Code2 as ComponentType<{ size?: number; className?: string }>,
      component: <CodeEditor />
    },
    {
      id: 'library',
      label: 'Library',
      icon: Monitor as ComponentType<{ size?: number; className?: string }>,
      component: <ComponentLibrary onSelectTemplate={handleTemplateSelect} />
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Sparkles as ComponentType<{ size?: number; className?: string }>,
      component: <AdvancedTools />
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download as ComponentType<{ size?: number; className?: string }>,
      component: <CodeExport code={currentCode} componentName={componentName} />
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen as ComponentType<{ size?: number; className?: string }>,
      component: (
        <ProjectSystem 
          onCodeGenerate={(code: CodePayload) => handleGenerateCode(code.html, code.css, code.js)}
        />
      )
    },
    {
      id: 'visual',
      label: 'Visual Editor',
      icon: MousePointer as ComponentType<{ size?: number; className?: string }>,
      component: (
        <DragDropEditor 
          onCodeGenerate={(code: CodePayload) => handleGenerateCode(code.html, code.css, code.js)}
        />
      )
    },
    {
      id: 'ai-builder',
      label: 'AI Builder',
      icon: Brain as ComponentType<{ size?: number; className?: string }>,
      component: (
        <div className="h-full p-4 space-y-6 overflow-y-auto">
          <NaturalLanguageBuilder 
            onProjectGenerated={(components: ProjectComponent[]) => {
              console.log('Generated project components:', components);
            }}
            selectedModel="deepseek-r1:latest"
          />
          <AIMemorySystem 
            currentCode={currentCode}
            onCodeUpdate={(code: CodePayload) => handleGenerateCode(code.html, code.css, code.js)}
            selectedModel="deepseek-r1:latest"
          />
        </div>
      )
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <AuthProvider>
      <div className="h-screen animated-bg flex overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/20
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header */}
          <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/10 to-blue-200/10">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                PocketAI Canvas
              </h1>
              <LoginButton />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
                      transition-all duration-200 group
                      ${activeTab === tab.id 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon size={18} className={`mr-3 ${
                      activeTab === tab.id ? 'text-blue-300' : 'text-white/50 group-hover:text-white/70'
                    }`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="text-xs text-white/50 text-center">
              Interactive Component Canvas © 2025
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden p-4 border-b border-white/20 bg-gradient-to-r from-white/10 to-blue-200/10">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setSidebarOpen(true)}
                className="glass-button text-white p-2"
              >
                <Menu size={16} />
              </Button>
              <h2 className="text-lg font-medium text-white">
                {activeTabData?.label}
              </h2>
              <div className="w-8" /> {/* Spacer */}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTabData?.component}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;