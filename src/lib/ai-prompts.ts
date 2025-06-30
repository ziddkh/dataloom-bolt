export interface SchemaGenerationInput {
  userDescription: string;
  uploadedSql?: string;
  context?: {
    isImprovement?: boolean;
    fileSize?: number;
    fileName?: string;
  };
}

export interface AIPromptConfig {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * System prompt that defines the AI's role and capabilities
 */
const SYSTEM_PROMPT = `You are an expert database architect and SQL specialist. Your role is to generate optimized, production-ready database schemas based on user requirements.

Core Responsibilities:
- Generate clean, normalized database schemas (typically 3NF unless specified otherwise)
- Create proper relationships with foreign keys and constraints
- Add appropriate indexes for performance optimization
- Include data types that match the requirements
- Provide cost-effective solutions
- Follow database best practices and naming conventions

Output Requirements:
- Always respond with valid SQL DDL statements
- Include CREATE TABLE statements with proper constraints
- Add indexes where beneficial for performance
- Use consistent naming conventions (snake_case for tables/columns)
- Include comments explaining complex relationships
- Provide a brief explanation of design decisions

Schema Optimization:
- Automatically determine the best normalization level based on use case
- Add indexes on foreign keys and frequently queried columns
- Use appropriate data types to minimize storage costs
- Consider query patterns when designing relationships
- Include created_at/updated_at timestamps where relevant

Cost Considerations:
- Optimize for storage efficiency
- Consider read vs write patterns
- Minimize redundant data
- Use appropriate column sizes

RESPONSE FORMAT EXAMPLE:

When generating a new schema, structure your response like this:

\`\`\`sql
-- Blog System Database Schema

-- Users table for authentication and profiles
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table for blog content
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(1000),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table for user interactions
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status_published ON posts(status, published_at) WHERE status = 'published';
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;
\`\`\`

## Design Explanation

**Schema Overview:**
This blog schema follows 3NF normalization principles while optimizing for read-heavy workloads typical of blog platforms.

**Key Design Decisions:**
1. **User Management**: Separate authentication fields from profile data for security
2. **Content Structure**: Posts include slug for SEO-friendly URLs and status for workflow management
3. **Hierarchical Comments**: Self-referencing foreign key allows nested comment threads
4. **Audit Trail**: All tables include created_at/updated_at for change tracking

**Performance Optimizations:**
1. **Composite Index**: (status, published_at) optimizes the common "published posts" query
2. **Partial Indexes**: Comments parent_id index only for nested comments to save space
3. **Appropriate Data Types**: VARCHAR sizes optimized for typical content lengths

**Suggestions:**
- Consider adding full-text search indexes for post content if search functionality is needed
- Implement soft deletes for posts if content recovery is important
- Add caching layer (Redis) for frequently accessed posts
- Consider partitioning if expecting high volume (>1M posts)

**Estimated Cost:**
~$8-20/month for small to medium blog (assuming cloud PostgreSQL hosting)

Always follow this structure: SQL code block, then explanations, then suggestions, then cost estimate.`;

/**
 * Generate AI prompt for creating a new schema from scratch
 */
export function generateNewSchemaPrompt(input: SchemaGenerationInput): AIPromptConfig {
  const userPrompt = `Create a database schema based on this description:

"${input.userDescription}"

Requirements:
1. Generate complete SQL DDL statements with proper constraints
2. Add strategic indexes for performance optimization
3. Follow 3NF normalization unless use case requires otherwise
4. Include audit timestamps (created_at, updated_at)
5. Use appropriate data types and sizes
6. Add meaningful comments for complex relationships

Please structure your response exactly like the example format in your system prompt:
- Start with SQL code block containing all CREATE TABLE and CREATE INDEX statements
- Follow with "## Design Explanation" section explaining your decisions
- Include "**Suggestions:**" section with actionable recommendations
- End with "**Estimated Cost:**" for cloud hosting

Focus on creating a production-ready schema that balances performance, maintainability, and cost efficiency.`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.3, // Lower temperature for more consistent technical output
    maxTokens: 2500,
  };
}

/**
 * Generate AI prompt for improving existing SQL
 */
export function generateSqlImprovementPrompt(input: SchemaGenerationInput): AIPromptConfig {
  const userPrompt = `Analyze and improve this existing SQL schema:

\`\`\`sql
${input.uploadedSql}
\`\`\`

Improvement requirements:
"${input.userDescription}"

Please analyze the existing schema and provide improvements. Structure your response as follows:

\`\`\`sql
-- IMPROVED SCHEMA
-- [Add comments highlighting your changes]

-- Example improvements you might make:
-- 1. Add missing indexes for performance
-- 2. Improve data types and constraints
-- 3. Fix normalization issues
-- 4. Add proper foreign key relationships
-- 5. Include audit timestamps if missing

[Your improved SQL DDL here]
\`\`\`

## Analysis & Improvements

**Issues Found in Original Schema:**
- List specific problems you identified
- Explain why each issue impacts performance or maintainability

**Key Improvements Made:**
1. **Performance**: Detail indexes and optimizations added
2. **Data Integrity**: Describe constraint and relationship improvements
3. **Normalization**: Explain any structural changes
4. **Best Practices**: Note adherence to conventions

**Suggestions:**
- Additional recommendations for further optimization
- Considerations for scaling and maintenance

**Estimated Cost Impact:**
Compare original vs improved schema costs

Focus on maintaining data integrity while significantly improving performance and maintainability.`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.2, // Even lower temperature for SQL analysis
    maxTokens: 3000,
  };
}

/**
 * Generate AI prompt for schema analysis (when user uploads SQL without description)
 */
export function generateSchemaAnalysisPrompt(input: SchemaGenerationInput): AIPromptConfig {
  const userPrompt = `Analyze this database schema and provide comprehensive improvement recommendations:

\`\`\`sql
${input.uploadedSql}
\`\`\`

Please provide a thorough analysis structured as follows:

## Schema Analysis

**Current Schema Overview:**
- Describe what this schema appears to be designed for
- Identify the main entities and relationships
- Note the current normalization level

**Issues & Opportunities:**
- Performance bottlenecks (missing indexes, inefficient queries)
- Data integrity concerns (missing constraints, weak relationships)
- Normalization problems (redundancy, update anomalies)
- Naming convention inconsistencies
- Missing best practices

\`\`\`sql
-- OPTIMIZED SCHEMA
-- Comments explaining each improvement

[Provide the improved SQL DDL with all your enhancements]
\`\`\`

## Improvements Made

**Performance Enhancements:**
1. **Indexes Added**: List each index and why it improves query performance
2. **Data Type Optimizations**: Explain any column type improvements
3. **Query Optimization**: Note structural changes that improve common queries

**Data Integrity Improvements:**
1. **Constraints Added**: Detail foreign keys, checks, and unique constraints
2. **Relationship Fixes**: Explain proper relationship implementations
3. **Validation Rules**: Note any data validation improvements

**Best Practices Applied:**
- Naming convention standardization
- Audit timestamp additions
- Proper default values
- Comment additions for clarity

**Suggestions for Further Enhancement:**
- Scaling considerations
- Monitoring recommendations
- Maintenance best practices
- Technology-specific optimizations

**Cost Analysis:**
Estimate hosting costs and performance impact of improvements.`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.3,
    maxTokens: 3500,
  };
}

/**
 * Main function to generate appropriate prompt based on input
 */
export function generateAIPrompt(input: SchemaGenerationInput): AIPromptConfig {
  // If user uploaded SQL and provided description - improvement mode
  if (input.uploadedSql && input.userDescription) {
    return generateSqlImprovementPrompt(input);
  }

  // If user only uploaded SQL without description - analysis mode
  if (input.uploadedSql && !input.userDescription) {
    return generateSchemaAnalysisPrompt(input);
  }

  // If user only provided description - new schema mode
  return generateNewSchemaPrompt(input);
}

/**
 * Example prompts for different use cases - these guide users to provide detailed requirements
 */
export const EXAMPLE_PROMPTS = {
  blog: "I need a modern blog platform with users, posts, and comments. Requirements: Users can write multiple posts with rich content (title, body, excerpt). Each post can have many threaded comments. Include post categories and tagging system. Users should have profiles with bio and avatar. Support for draft/published post statuses. Need SEO-friendly URLs. Optimize for read-heavy workloads with fast page loads.",

  ecommerce: "Create an e-commerce platform database with comprehensive product management. Requirements: Products with variants (size, color), categories and subcategories, inventory tracking with low-stock alerts. Customer accounts with multiple shipping addresses. Shopping cart and wishlist functionality. Order management with status tracking (pending, shipped, delivered). Payment processing with transaction history. Product reviews and ratings. Coupon/discount system. Optimize for high transaction volume.",

  social: "Design a social media platform similar to Twitter/Instagram. Requirements: User profiles with followers/following relationships. Posts with text, images, and videos. Like, comment, and share functionality. Real-time messaging between users. Notification system for user interactions. Content feed algorithm support. Hashtag and mention functionality. User privacy settings. Content moderation capabilities. Optimize for real-time updates and high engagement.",

  saas: "Build a multi-tenant SaaS application database for project management. Requirements: Organizations with multiple users and role-based permissions (admin, member, viewer). Projects with tasks, milestones, and deadlines. Time tracking and reporting. File attachments and comments. Subscription management with different plans and billing cycles. Usage analytics and feature tracking. API access logs. Data isolation between organizations. Support for scaling to thousands of organizations.",

  analytics: "Create a data warehouse for web analytics and business intelligence. Requirements: Event tracking for user actions (page views, clicks, conversions). User sessions with device and location data. Custom event properties and dimensions. Real-time and batch data ingestion. Fast aggregation queries for dashboards. User cohort analysis. Funnel and retention reports. A/B testing experiment tracking. Data retention policies. Optimize for analytical queries and large data volumes.",

  taskManagement: "Design a team task management system like Asana or Trello. Requirements: Teams with multiple projects and boards. Tasks with priorities, due dates, and assignees. Task dependencies and subtasks. File attachments and comments. Time tracking and progress reporting. Custom fields and labels. Activity feeds and notifications. Workload balancing and capacity planning. Integration capabilities with external tools.",

  marketplace: "Create a marketplace platform like Etsy or eBay. Requirements: Seller accounts with shop management. Product listings with multiple images and variants. Buyer accounts with purchase history. Order fulfillment and shipping tracking. Rating and review system for both buyers and sellers. Search and filtering capabilities. Payment processing with escrow. Dispute resolution system. Commission tracking. Fraud detection support."
};

/**
 * Validate user input before sending to AI
 */
export function validateSchemaInput(input: SchemaGenerationInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if we have either description or SQL
  if (!input.userDescription && !input.uploadedSql) {
    errors.push("Please provide either a description or upload an SQL file");
  }

  // Validate description length
  if (input.userDescription && input.userDescription.length < 10) {
    errors.push("Description is too short. Please provide more details");
  }

  if (input.userDescription && input.userDescription.length > 2000) {
    errors.push("Description is too long. Please keep it under 2000 characters");
  }

  // Validate SQL if provided
  if (input.uploadedSql) {
    if (input.uploadedSql.length < 20) {
      errors.push("SQL file seems too short to be a valid schema");
    }

    if (input.uploadedSql.length > 50000) {
      errors.push("SQL file is too large. Please use files under 50KB");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
