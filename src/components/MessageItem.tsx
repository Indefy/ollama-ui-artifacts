import React from 'react';
import { User, Bot, AlertCircle, Code } from 'lucide-react';
import { Button } from '../components/ui/button';
// import { Card } from '../components/ui/card';
import { CodePayload } from './LiveUIPreview';
import { Message, MessageType } from '../types/chatTypes';

interface MessageItemProps {
  message: Message;
  onCodeSelect?: (code: CodePayload | null) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onCodeSelect }) => {
  const isUser = message.type === MessageType.USER;
  const isSystem = message.type === MessageType.SYSTEM;
  
  // Format the timestamp
  const formattedTime = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`flex space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
      >
        <div className={`rounded-full p-2 flex items-center justify-center h-8 w-8 ${
          isUser ? 'bg-blue-100 text-blue-600' : 
          isSystem ? 'bg-gray-100 text-gray-600' : 
          'bg-purple-100 text-purple-600'
        }`}>
          {isUser ? <User size={16} /> : isSystem ? <AlertCircle size={16} /> : <Bot size={16} />}
        </div>
        
        <div>
          <div className={`px-4 py-3 rounded-2xl mb-1 ${
            isUser ? 'bg-blue-500 text-white' : 
            isSystem ? 'bg-gray-100 text-gray-800' : 
            'bg-white border shadow-sm'
          }`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {message.hasUIPreview && message.uiPreviewCode && onCodeSelect && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => onCodeSelect(message.uiPreviewCode || null)}
              >
                <Code size={14} className="mr-1" />
                View in Editor
              </Button>
            )}
          </div>
          
          <div className={`text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem