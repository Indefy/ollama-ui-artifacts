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
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[3]);
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
    <div className="flex flex-col h-full border rounded-lg bg-white shadow-sm">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center">
          <Sparkles size={18} className="mr-2 text-blue-500" />
          PocketAI Chat
        </h2>
        <div className="flex items-center space-x-2">
          <Cpu size={16} className="text-gray-600" />
          <select 
            value={selectedModel} 
            onChange={handleModelChange}
            disabled={isProcessing}
            className="p-1.5 border border-gray-300 rounded-md text-sm bg-white focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select AI Model"
          >
            {AVAILABLE_MODELS.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
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
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-start space-x-2">
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to create a UI component..."
            className="resize-none min-h-[60px]"
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSubmit} 
            disabled={inputValue.trim() === '' || isProcessing}
            className="h-full"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send. Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;