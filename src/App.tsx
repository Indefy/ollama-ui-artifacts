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
import NaturalLanguageBuilder, { ProjectComponent } from './components/NaturalLanguageBuilder';
import AIMemorySystem from './components/AIMemorySystem';

type TabId = 'chat' | 'preview' | 'editor' | 'export' | 'settings' | 'library' | 'tools' | 'projects' | 'visual' | 'ai-builder';

// Type definitions for component props
interface ResponsiveBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
}

interface SidebarTab {
  id: TabId;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  component: React.ReactNode;
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [currentCode, setCurrentCode] = useState<CodePayload>({
    html: '<div class="welcome">Welcome to Live UI Builder</div>',
    css: '.welcome { padding: 40px; text-align: center; font-family: system-ui; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }',
    js: ''
  });
  const [responsiveBreakpoints, setResponsiveBreakpoints] = useState<ResponsiveBreakpoints>({
    mobile: '375px',
    tablet: '768px', 
    desktop: '1200px'
  });
  const [selectedFramework, setSelectedFramework] = useState<'html' | 'react' | 'vue' | 'angular'>('html');
  const [selectedModel, setSelectedModel] = useState('deepseek-r1:latest');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleGenerateCode = (html: string, css: string, js: string) => {
    setCurrentCode({ html, css, js });
  };

  const handleCodeFromChat = (code: CodePayload) => {
    setCurrentCode(code);
  };

  const sidebarTabs: SidebarTab[] = [
    {
      id: 'chat',
      label: 'AI Chat',
      icon: MessageSquare as ComponentType<{ size?: number; className?: string }>,
      component: (
        <ChatInterface 
          onCodeGenerate={handleCodeFromChat}
          selectedModel={selectedModel}
        />
      )
    },
    {
      id: 'preview',
      label: 'Live Preview',
      icon: Eye as ComponentType<{ size?: number; className?: string }>,
      component: (
        <LiveUIPreview 
          code={currentCode} 
          breakpoints={responsiveBreakpoints}
        />
      )
    },
    {
      id: 'editor',
      label: 'Code Editor',
      icon: Code2 as ComponentType<{ size?: number; className?: string }>,
      component: (
        <div className="p-4 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">HTML</label>
            <textarea
              value={currentCode.html}
              onChange={(e) => setCurrentCode(prev => ({ ...prev, html: e.target.value }))}
              className="w-full h-32 p-3 border rounded-md font-mono text-sm"
              placeholder="HTML code..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CSS</label>
            <textarea
              value={currentCode.css}
              onChange={(e) => setCurrentCode(prev => ({ ...prev, css: e.target.value }))}
              className="w-full h-32 p-3 border rounded-md font-mono text-sm"
              placeholder="CSS code..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">JavaScript</label>
            <textarea
              value={currentCode.js}
              onChange={(e) => setCurrentCode(prev => ({ ...prev, js: e.target.value }))}
              className="w-full h-32 p-3 border rounded-md font-mono text-sm"
              placeholder="JavaScript code..."
            />
          </div>
        </div>
      )
    },
    {
      id: 'export',
      label: 'Export',
      icon: Download as ComponentType<{ size?: number; className?: string }>,
      component: (
        <CodeExport 
          code={currentCode}
          framework={selectedFramework}
        />
      )
    },
    {
      id: 'library',
      label: 'Components',
      icon: Palette as ComponentType<{ size?: number; className?: string }>,
      component: (
        <ComponentLibrary 
          onSelectComponent={(code: CodePayload) => handleGenerateCode(code.html, code.css, code.js)}
        />
      )
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Sparkles as ComponentType<{ size?: number; className?: string }>,
      component: (
        <div className="h-full p-4 space-y-6 overflow-y-auto">
          <MultiStepGenerator 
            onGenerateCode={handleGenerateCode}
            selectedModel={selectedModel}
          />
          <FrameworkSelector 
            selectedFramework={selectedFramework}
            onFrameworkChange={setSelectedFramework}
            currentCode={currentCode}
            onCodeUpdate={setCurrentCode}
          />
          <ResponsiveDesigner 
            breakpoints={responsiveBreakpoints}
            onBreakpointsChange={setResponsiveBreakpoints}
          />
          <ComponentVariations 
            currentCode={currentCode}
            onVariationSelect={setCurrentCode}
            selectedModel={selectedModel}
          />
          <ThemeBuilder 
            onThemeApply={(theme) => {
              setCurrentCode(prev => ({
                ...prev,
                css: prev.css + '\n' + theme.css
              }));
            }}
          />
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Responsive',
      icon: Monitor as ComponentType<{ size?: number; className?: string }>,
      component: (
        <ResponsiveDesigner 
          breakpoints={responsiveBreakpoints}
          onBreakpointsChange={setResponsiveBreakpoints}
        />
      )
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
              // Use the first completed component if available
              const firstCompleted = components.find(c => c.status === 'completed');
              if (firstCompleted) {
                handleGenerateCode(firstCompleted.code.html, firstCompleted.code.css, firstCompleted.code.js);
              }
            }}
            selectedModel={selectedModel}
          />
          <AIMemorySystem 
            currentCode={currentCode}
            onCodeUpdate={(code: CodePayload) => handleGenerateCode(code.html, code.css, code.js)}
            selectedModel={selectedModel}
          />
        </div>
      )
    }
  ];

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm sticky top-0 z-50">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="lg:hidden"
              >
                <Menu size={18} />
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Live UI Builder
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1 text-sm border rounded-md bg-white/80"
              >
                <option value="deepseek-r1:latest">DeepSeek R1</option>
                <option value="llama3.2:latest">Llama 3.2</option>
                <option value="qwen2.5:latest">Qwen 2.5</option>
              </select>
              <LoginButton />
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <div className={`${isSidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 bg-white/60 backdrop-blur-md border-r border-white/20 shadow-lg`}>
            <div className="h-full flex flex-col">
              {/* Tab Navigation */}
              <div className="flex-shrink-0 p-4 border-b border-white/20">
                <div className={`grid ${isSidebarCollapsed ? 'grid-cols-1' : 'grid-cols-3'} gap-1`}>
                  {sidebarTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`p-2 rounded-lg transition-all duration-200 text-xs font-medium ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-white/80 hover:text-blue-600'
                        } ${isSidebarCollapsed ? 'flex flex-col items-center' : ''}`}
                        title={isSidebarCollapsed ? tab.label : undefined}
                      >
                        <IconComponent size={16} className={isSidebarCollapsed ? 'mb-1' : 'mr-1 inline'} />
                        {!isSidebarCollapsed && tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              {!isSidebarCollapsed && (
                <div className="flex-1 overflow-hidden">
                  {sidebarTabs.find(tab => tab.id === activeTab)?.component}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white/40 backdrop-blur-sm">
            <LiveUIPreview 
              code={currentCode} 
              breakpoints={responsiveBreakpoints}
            />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;