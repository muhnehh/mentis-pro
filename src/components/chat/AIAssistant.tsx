import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Loader, Key } from 'lucide-react';
import { openAIService } from '../../services/openai';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  userData: any;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ userData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_OPENAI_API_KEY || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!process.env.REACT_APP_OPENAI_API_KEY);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) {
      if (!apiKey) {
        setShowApiKeyInput(true);
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await openAIService.chat([
        {
          role: 'system',
          content: `You are a helpful assistant for a cognitive support app. The user's name is ${userData.profile.name}.`
        },
        ...messages.map(msg => ({
          role: msg.type as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user', content: input }
      ], apiKey);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble connecting to the AI service. Please check your API key and try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowApiKeyInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !apiKey) {
      if (!apiKey) {
        setShowApiKeyInput(true);
      }
      return;
    }

    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `[Uploaded image: ${file.name}]`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Convert image to base64 and generate a description
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        const aiResponse = await openAIService.chat([
          {
            role: 'system',
            content: 'You are analyzing an uploaded image.'
          },
          {
            role: 'user',
            content: `Please analyze this image (encoded in base64): ${base64Image.substring(0, 100)}... [truncated]`
          }
        ], apiKey);

        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!input.trim() || !apiKey) {
      if (!apiKey) {
        setShowApiKeyInput(true);
      }
      return;
    }

    setIsLoading(true);
    try {
      const imageUrl = await openAIService.generateImage(input, apiKey);
      setImageUrl(imageUrl);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Generated image for: ${input}`,
        timestamp: new Date()
      };
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Here's the generated image based on your description: ${input}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {showApiKeyInput && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center space-x-2 mb-2">
            <Key className="w-4 h-4 text-blue-500" />
            <label className="text-sm font-medium">OpenAI API Key:</label>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenAI API key"
            className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <p className="mt-2 text-xs text-gray-600">
            Your API key is required to use the AI features. Get one from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenAI's website
            </a>
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          </div>
        )}
        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="Generated" className="max-w-[300px] rounded-lg shadow-md" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-blue-500"
            title="Upload Image"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={handleGenerateImage}
            className="p-2 text-gray-500 hover:text-blue-500"
            title="Generate Image"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}; 