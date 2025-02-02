import axios from 'axios';

const LOCAL_AI_URL = 'http://localhost:8080/v1';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: ChatMessage;
    finish_reason: string;
  }>;
}

export const localAIService = {
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post<ChatResponse>(`${LOCAL_AI_URL}/chat/completions`, {
        model: 'gpt-3.5-turbo', // or your local model name
        messages,
        temperature: 0.7,
        max_tokens: 800
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('LocalAI Error:', error);
      throw new Error('Failed to get response from LocalAI');
    }
  },

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${LOCAL_AI_URL}/images/generations`, {
        prompt,
        n: 1,
        size: '512x512'
      });

      return response.data.data[0].url;
    } catch (error) {
      console.error('LocalAI Image Generation Error:', error);
      throw new Error('Failed to generate image');
    }
  }
}; 