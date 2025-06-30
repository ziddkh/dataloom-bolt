import {
  generateAIPrompt,
  validateSchemaInput,
  type SchemaGenerationInput,
  type AIPromptConfig
} from './ai-prompts';

export interface SchemaGenerationResult {
  success: boolean;
  data?: {
    sql: string;
    explanation: string;
    suggestions: string[];
    estimatedCost?: string;
  };
  error?: string;
}

export interface GenerationProgress {
  step: string;
  progress: number; // 0-100
  message: string;
}

/**
 * Main function to generate database schema using AI
 */
export async function generateDatabaseSchema(
  input: SchemaGenerationInput,
  onProgress?: (progress: GenerationProgress) => void
): Promise<SchemaGenerationResult> {
  try {
    // Step 1: Validate input
    onProgress?.({
      step: 'validation',
      progress: 10,
      message: 'Validating your input...'
    });

    const validation = validateSchemaInput(input);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }

    // Step 2: Generate prompt
    onProgress?.({
      step: 'prompt',
      progress: 20,
      message: 'Preparing AI prompt...'
    });

    const promptConfig = generateAIPrompt(input);

    // Step 3: Call AI API
    onProgress?.({
      step: 'ai_call',
      progress: 30,
      message: 'Analyzing your requirements...'
    });

    const aiResponse = await callAIAPI(promptConfig, (progress) => {
      onProgress?.({
        step: 'ai_processing',
        progress: 30 + (progress * 0.6), // 30% to 90%
        message: 'AI is generating your schema...'
      });
    });

    // Step 4: Parse and validate response
    onProgress?.({
      step: 'parsing',
      progress: 95,
      message: 'Processing results...'
    });

    const parsedResult = parseAIResponse(aiResponse);

    onProgress?.({
      step: 'complete',
      progress: 100,
      message: 'Schema generation complete!'
    });

    return {
      success: true,
      data: parsedResult
    };

  } catch (error) {
    console.error('Schema generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

/**
 * Call the AI API (OpenAI GPT-4)
 */
async function callAIAPI(
  config: AIPromptConfig,
  onProgress?: (progress: number) => void
): Promise<string> {
  // TODO: Replace with actual OpenAI API call
  // For now, simulate the API call with a timeout

  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Please set OPENAI_API_KEY environment variable.');
  }

  // Simulate progress updates
  const progressInterval = setInterval(() => {
    const randomProgress = Math.random() * 10;
    onProgress?.(Math.min(95, randomProgress));
  }, 500);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: config.systemPrompt
          },
          {
            role: 'user',
            content: config.userPrompt
          }
        ],
        temperature: config.temperature || 0.3,
        max_tokens: config.maxTokens || 2000,
      }),
    });

    clearInterval(progressInterval);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';

  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(aiResponse: string): {
  sql: string;
  explanation: string;
  suggestions: string[];
  estimatedCost?: string;
} {
  // Extract SQL from response (looking for code blocks)
  const sqlMatch = aiResponse.match(/```sql\n([\s\S]*?)\n```/);
  const sql = sqlMatch ? sqlMatch[1].trim() : '';

  // Extract explanation (everything before suggestions)
  const explanationMatch = aiResponse.match(/explanation[:\-]?\s*([\s\S]*?)(?=suggestions?[:\-]|$)/i);
  const explanation = explanationMatch ? explanationMatch[1].trim() : '';

  // Extract suggestions (looking for numbered or bulleted lists)
  const suggestionsMatch = aiResponse.match(/suggestions?[:\-]?\s*([\s\S]*)/i);
  let suggestions: string[] = [];

  if (suggestionsMatch) {
    suggestions = suggestionsMatch[1]
      .split(/\n\d+\.|\n[-*•]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  // Extract cost estimation if present
  const costMatch = aiResponse.match(/cost[:\-]?\s*([^\n]+)/i);
  const estimatedCost = costMatch ? costMatch[1].trim() : undefined;

  return {
    sql: sql || aiResponse, // Fallback to full response if no SQL block found
    explanation: explanation || 'Schema generated successfully',
    suggestions: suggestions.length > 0 ? suggestions : ['Schema is optimized for your requirements'],
    estimatedCost
  };
}

/**
 * Test function for development (uses mock data)
 */
export async function generateDatabaseSchemaMock(
  input: SchemaGenerationInput,
  onProgress?: (progress: GenerationProgress) => void
): Promise<SchemaGenerationResult> {
  // Simulate the generation process with mock data
  const steps = [
    { step: 'validation', progress: 10, message: 'Validating your input...' },
    { step: 'prompt', progress: 25, message: 'Preparing AI prompt...' },
    { step: 'ai_call', progress: 40, message: 'Analyzing your requirements...' },
    { step: 'ai_processing', progress: 70, message: 'AI is generating your schema...' },
    { step: 'parsing', progress: 90, message: 'Processing results...' },
    { step: 'complete', progress: 100, message: 'Schema generation complete!' },
  ];

  for (const step of steps) {
    onProgress?.(step);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Mock response based on input
  const mockResponse = generateMockSchema(input);

  return {
    success: true,
    data: mockResponse
  };
}

/**
 * Generate mock schema for development/testing
 */
function generateMockSchema(input: SchemaGenerationInput) {
  const isImprovement = !!input.uploadedSql;

  if (isImprovement) {
    return {
      sql: `-- Improved Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published_at ON posts(published_at);`,
      explanation: "Improved your existing schema by adding proper indexes, foreign key constraints, and optimized data types for better performance.",
      suggestions: [
        "Added indexes on frequently queried columns",
        "Implemented proper foreign key relationships",
        "Optimized VARCHAR sizes based on typical usage",
        "Added timestamps for audit trails"
      ],
      estimatedCost: "~$10-25/month for moderate usage"
    };
  }

  return {
    sql: `-- Generated Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(1000),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published_at ON posts(published_at);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);`,
    explanation: "Created a normalized blog schema with proper relationships, indexes for performance, and audit timestamps. The design follows 3NF principles while optimizing for common query patterns.",
    suggestions: [
      "Added indexes on foreign keys for faster joins",
      "Used appropriate VARCHAR sizes to minimize storage costs",
      "Included excerpt field for efficient list queries",
      "Added proper CASCADE deletes for data integrity"
    ],
    estimatedCost: "~$5-15/month for small to medium blog"
  };
}
