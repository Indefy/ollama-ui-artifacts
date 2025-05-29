import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Cpu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Message, MessageType } from '../types/chatTypes';
import MessageItem from '../components/MessageItem';
import { generateUICode } from '../lib/codeGenerator';

interface ChatInterfaceProps {
  onGenerateCode: (html: string, css: string, js: string) => void;
}

// Lets creat sleek - glass like theme and designed login screen - with dark greenish color scheme with glowing effect

const AVAILABLE_MODELS = [
  'deepseek-r1:latest',
  'qwen3:30b',
  'llama2:latest',
  'phi4-reasoning:14b',
  'mistral:latest',
  'llava:latest',
  'llava:13b',
  'qwen3:14b',
  'gemma3:12b',
  'cogito:14b',
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    type: MessageType.SYSTEM,
    content: 'Hello! I can help you design UI components. Try asking for something like "Create a login form" or "Make a product card".',
    timestamp: new Date(),
  },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onGenerateCode }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === '' || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: MessageType.USER,
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(async () => {
      try {
        const { html, css, js } = await generateUICode(userMessage.content, selectedModel);
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: MessageType.ASSISTANT,
          content: `I've created a UI component based on your request using ${selectedModel}. You can see the preview and edit the code in the live editor panel.`,
          timestamp: new Date(),
          hasUIPreview: true,
          uiPreviewCode: { html, css, js },
        };

        setMessages((prev) => [...prev, responseMessage]);
        onGenerateCode(html, css, js);
      } catch (error) {
        console.error('Error generating UI code:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: MessageType.SYSTEM,
          content: 'Sorry, I encountered an error while generating the UI component. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full glass-card overflow-hidden">
      <div className="p-4 border-b border-white/20 flex justify-between items-center bg-gradient-to-r from-blue-500/20 to-purple-500/20">
        <h2 className="text-lg font-medium flex items-center text-white">
          <Sparkles size={18} className="mr-2 text-blue-300 animate-pulse" />
          PocketAI Chat
        </h2>
        <div className="flex items-center space-x-2">
          <Cpu size={16} className="text-blue-200" />
          <select 
            value={selectedModel} 
            onChange={handleModelChange}
            disabled={isProcessing}
            className="p-2 glass-button text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            aria-label="Select AI Model"
          >
            {AVAILABLE_MODELS.map(model => (
              <option key={model} value={model} className="bg-gray-800 text-white">{model}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            onCodeSelect={(code) => {
              if (code) {
                onGenerateCode(code.html, code.css, code.js);
              }
            }}
          />
        ))}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-blue-200">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full pulse-dots"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full pulse-dots" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full pulse-dots" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-sm">AI is generating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/20">
        <div className="flex items-start space-x-3">
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the UI component you want to create..."
            className="resize-none min-h-[60px] glass-button text-white placeholder-blue-200 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={inputValue.trim() === '' || isProcessing}
            className="h-full glass-button hover:bg-blue-500/30 text-white border-white/20 glow-effect"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-blue-200 mt-2 opacity-70">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;