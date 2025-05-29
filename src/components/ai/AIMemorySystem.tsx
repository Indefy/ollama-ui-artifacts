
import React, { useState, useEffect } from 'react';
import { Brain, ThumbsUp, ThumbsDown, RotateCcw, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CodePayload } from '../LiveUIPreview';
import { generateUICode } from '@/lib/codeGenerator';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  componentId?: string;
}

interface ComponentFeedback {
  componentId: string;
  rating: 'positive' | 'negative' | null;
  feedback?: string;
  iterations: number;
}

interface AIMemorySystemProps {
  currentCode: CodePayload;
  onCodeUpdate: (code: CodePayload) => void;
  selectedModel: string;
}

export const AIMemorySystem: React.FC<AIMemorySystemProps> = ({
  currentCode,
  onCodeUpdate,
  selectedModel
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [feedback, setFeedback] = useState<ComponentFeedback | null>(null);
  const [improvementPrompt, setImprovementPrompt] = useState('');
  const [isImproving, setIsImproving] = useState(false);

  const currentComponentId = React.useMemo(() => 
    `component-${Date.now()}`, []
  );

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('ai_chat_history');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveChatHistory = (history: ChatMessage[]) => {
    setChatHistory(history);
    localStorage.setItem('ai_chat_history', JSON.stringify(history));
  };

  const addChatMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      componentId: currentComponentId
    };

    saveChatHistory([...chatHistory, newMessage]);
  };

  const provideFeedback = (rating: 'positive' | 'negative') => {
    const newFeedback: ComponentFeedback = {
      componentId: currentComponentId,
      rating,
      iterations: feedback?.iterations || 0
    };

    setFeedback(newFeedback);

    // Store feedback for learning
    const allFeedback = JSON.parse(localStorage.getItem('component_feedback') || '[]');
    allFeedback.push(newFeedback);
    localStorage.setItem('component_feedback', JSON.stringify(allFeedback));

    addChatMessage('user', `Feedback: ${rating === 'positive' ? 'Liked' : 'Disliked'} this component`);
  };

  const improveComponent = async () => {
    if (!improvementPrompt.trim()) return;

    setIsImproving(true);
    addChatMessage('user', `Improve request: ${improvementPrompt}`);

    try {
      // Build context from chat history
      const recentContext = chatHistory
        .filter(msg => msg.componentId === currentComponentId)
        .slice(-5) // Last 5 messages
        .map(msg => `${msg.type}: ${msg.content}`)
        .join('\n');

      const contextualPrompt = `
        Based on the current component and previous conversation:
        
        Previous context:
        ${recentContext}
        
        Current HTML: ${currentCode.html}
        Current CSS: ${currentCode.css}
        Current JavaScript: ${currentCode.js}
        
        User improvement request: ${improvementPrompt}
        
        Please improve the component according to the user's feedback while maintaining existing functionality.
      `;

      const result = await generateUICode(contextualPrompt, selectedModel);

      if (result.success && result.data) {
        const parsedCode = JSON.parse(result.data);
        
        const newCode: CodePayload = {
          html: parsedCode.html || currentCode.html,
          css: parsedCode.css || currentCode.css,
          js: parsedCode.js || currentCode.js
        };

        onCodeUpdate(newCode);
        addChatMessage('assistant', 'Component improved based on your feedback');

        // Update feedback iteration count
        if (feedback) {
          setFeedback({
            ...feedback,
            iterations: feedback.iterations + 1
          });
        }
      } else {
        throw new Error('Improvement generation failed');
      }
    } catch (error) {
      addChatMessage('assistant', 'Sorry, I had trouble improving the component. Please try again.');
    } finally {
      setIsImproving(false);
      setImprovementPrompt('');
    }
  };

  const regenerateComponent = async () => {
    setIsImproving(true);
    addChatMessage('user', 'Regenerate component request');

    try {
      // Use negative feedback to avoid similar patterns
      const negativePatterns = JSON.parse(localStorage.getItem('component_feedback') || '[]')
        .filter((f: ComponentFeedback) => f.rating === 'negative')
        .map((f: ComponentFeedback) => f.componentId);

      const regeneratePrompt = `
        Regenerate a similar component with a different approach. 
        Current component:
        HTML: ${currentCode.html}
        CSS: ${currentCode.css}
        JavaScript: ${currentCode.js}
        
        Please create a variation that serves the same purpose but with different styling and structure.
      `;

      const result = await generateUICode(regeneratePrompt, selectedModel);

      if (result.success && result.data) {
        const parsedCode = JSON.parse(result.data);
        
        const newCode: CodePayload = {
          html: parsedCode.html || currentCode.html,
          css: parsedCode.css || currentCode.css,
          js: parsedCode.js || currentCode.js
        };

        onCodeUpdate(newCode);
        addChatMessage('assistant', 'Component regenerated with a fresh approach');
      }
    } catch (error) {
      addChatMessage('assistant', 'Sorry, I had trouble regenerating the component. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 text-purple-500" size={20} />
          AI Memory & Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Feedback Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Rate this component:</span>
          <Button
            size="sm"
            variant={feedback?.rating === 'positive' ? 'default' : 'outline'}
            onClick={() => provideFeedback('positive')}
          >
            <ThumbsUp size={16} className="mr-1" />
            Good
          </Button>
          <Button
            size="sm"
            variant={feedback?.rating === 'negative' ? 'default' : 'outline'}
            onClick={() => provideFeedback('negative')}
          >
            <ThumbsDown size={16} className="mr-1" />
            Needs Work
          </Button>
        </div>

        {/* Improvement Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Request improvements:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={improvementPrompt}
              onChange={(e) => setImprovementPrompt(e.target.value)}
              placeholder="e.g., Make it more colorful, add animations..."
              className="flex-1 p-2 border rounded-md text-sm"
              disabled={isImproving}
            />
            <Button
              size="sm"
              onClick={improveComponent}
              disabled={!improvementPrompt.trim() || isImproving}
            >
              {isImproving ? 'Improving...' : 'Improve'}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={regenerateComponent}
            disabled={isImproving}
          >
            <RotateCcw size={16} className="mr-1" />
            Regenerate
          </Button>
        </div>

        {/* Chat History */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <MessageSquare size={16} className="mr-1" />
            Recent Conversation
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2 bg-gray-50 p-3 rounded-md">
            {chatHistory
              .filter(msg => msg.componentId === currentComponentId)
              .slice(-6)
              .map(message => (
                <div key={message.id} className="text-sm">
                  <span className={`font-medium ${
                    message.type === 'user' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {message.type === 'user' ? 'You' : 'AI'}:
                  </span>
                  <span className="ml-2">{message.content}</span>
                </div>
              ))}
            {chatHistory.filter(msg => msg.componentId === currentComponentId).length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4">
                No conversation history for this component yet.
              </div>
            )}
          </div>
        </div>

        {/* Iteration Counter */}
        {feedback && feedback.iterations > 0 && (
          <div className="text-xs text-gray-500">
            Component iterations: {feedback.iterations}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
