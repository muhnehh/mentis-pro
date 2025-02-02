import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ImageResponse {
  data: Array<{
    url: string;
  }>;
}

// Pre-generated prompts for different scenarios
const DIAGNOSIS_PROMPTS = {
  memory: "I'm having trouble remembering daily tasks and appointments. Can you help me create a structured routine?",
  attention: "I find it difficult to focus on tasks and get easily distracted. What strategies can help me stay focused?",
  navigation: "I feel anxious when navigating new places. How can I make this easier?",
  communication: "I sometimes struggle to express my needs clearly. What techniques can help me communicate better?",
  planning: "I need help organizing my daily activities. How can I break down complex tasks?"
};

const SUPPORT_PROMPTS = {
  cognitive_load: "I'm feeling overwhelmed with my current tasks. Can you help me prioritize?",
  emotional_support: "I'm feeling anxious about my daily challenges. Can you provide some coping strategies?",
  task_breakdown: "This task seems too complex. Can you help me break it down into smaller steps?",
  routine_building: "I need help establishing a daily routine. What's a good way to start?",
  social_interaction: "I want to improve my social interactions. What are some practical tips?"
};

export const openAIService = {
  async chat(messages: ChatMessage[], apiKey: string): Promise<string> {
    try {
      // Add context-aware system message
      const systemMessage = {
        role: 'system',
        content: `You are a supportive AI assistant for individuals with cognitive challenges. 
                 Provide clear, step-by-step guidance. Use simple language and be patient. 
                 Break down complex tasks into manageable steps. 
                 Always validate the user's feelings and offer practical solutions.`
      };

      const response = await axios.post<ChatResponse>(
        `${OPENAI_API_URL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Chat Error:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  },

  async generateImage(prompt: string, apiKey: string): Promise<string> {
    try {
      const response = await axios.post<ImageResponse>(
        `${OPENAI_API_URL}/images/generations`,
        {
          prompt,
          n: 1,
          size: '512x512',
          response_format: 'url',
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0].url;
    } catch (error) {
      console.error('OpenAI Image Generation Error:', error);
      throw new Error('Failed to generate image with OpenAI');
    }
  },

  getDiagnosisPrompt(category: keyof typeof DIAGNOSIS_PROMPTS): string {
    return DIAGNOSIS_PROMPTS[category] || DIAGNOSIS_PROMPTS.memory;
  },

  getSupportPrompt(type: keyof typeof SUPPORT_PROMPTS): string {
    return SUPPORT_PROMPTS[type] || SUPPORT_PROMPTS.cognitive_load;
  }
}; 