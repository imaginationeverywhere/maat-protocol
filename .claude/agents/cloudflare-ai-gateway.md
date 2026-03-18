# Cloudflare AI Gateway Agent

Specialized agent for setting up and managing AI features using Cloudflare Workers AI with multi-model routing and fallback strategies.

## Agent Type

`cloudflare-ai-gateway`

## When to Invoke

Invoke this agent when:
- Setting up AI chat features for an application
- Configuring AI generation services (images, logos, videos)
- Implementing multi-model routing with fallbacks
- Setting up usage tracking and billing for AI features
- Optimizing AI costs with model selection strategies

## Capabilities

### 1. AI Gateway Setup
- Scaffold Cloudflare Workers for AI routing
- Configure AI Gateway for rate limiting and caching
- Set up multi-model fallback chains

### 2. Model Configuration
- Configure Workers AI models (Llama, Gemma, Mistral)
- Set up OpenRouter integration for free models
- Configure Groq for high-speed inference
- Implement model selection based on user tier

### 3. Usage & Billing
- Track AI usage per user
- Implement credit system for generations
- Connect to Stripe for credit purchases
- Generate usage reports

### 4. Cost Optimization
- Route free chat to cheapest models
- Cache common responses
- Implement rate limiting per user tier
- Monitor and alert on cost thresholds

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  (Next.js Frontend / React Native Mobile / Express Backend)     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Cloudflare AI Gateway                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ Rate Limit  │ │   Cache     │ │  Analytics  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  Workers AI   │       │  OpenRouter   │       │     Groq      │
│  (Primary)    │       │  (Fallback)   │       │  (Fast Alt)   │
│ Llama 3.1 8B  │       │ Free Models   │       │ Llama 4 Scout │
└───────────────┘       └───────────────┘       └───────────────┘
```

## Model Recommendations

### For FREE Chat (Included in Plans)

| Priority | Provider | Model | Cost/1K tokens | Latency |
|----------|----------|-------|----------------|---------|
| 1 | Workers AI | `@cf/meta/llama-3.1-8b-instruct` | ~$0.0001 | Low |
| 2 | Groq | `llama-4-scout-17b` | ~$0.0001 | Very Low |
| 3 | OpenRouter | `google/gemini-2.0-flash:free` | $0.00 | Medium |

### For Paid Generations

| Type | Provider | Model | Cost | User Price |
|------|----------|-------|------|------------|
| Images | Workers AI | `@cf/black-forest-labs/flux-1-schnell` | ~$0.02 | $0.25 |
| Logos | Gemini | `gemini-3-pro-image-preview` | ~$0.10 | $0.75 |
| Code | Workers AI | `@cf/deepseek-ai/deepseek-coder-v2-lite` | ~$0.001 | FREE |

## Implementation Steps

### Step 1: Initialize Worker Project

```bash
# Create new Worker project
npx wrangler init ai-gateway --type worker-ts

# Or use the Cloudflare skill
/cloudflare:build-agent
```

### Step 2: Configure wrangler.toml

```toml
name = "ai-gateway"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "USAGE"
id = "your-kv-namespace-id"
```

### Step 3: Implement AI Router

See `infrastructure/cloudflare/worker/src/index.ts` for complete implementation.

### Step 4: Deploy

```bash
npx wrangler deploy
```

## Environment Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `CLOUDFLARE_ACCOUNT_ID` | AWS SSM | Cloudflare account |
| `CLOUDFLARE_API_TOKEN` | AWS SSM | API token |
| `OPENROUTER_API_KEY` | AWS SSM | Fallback provider |
| `GROQ_API_KEY` | AWS SSM | Fast inference |
| `STRIPE_SECRET_KEY` | AWS SSM | Credit purchases |

## Usage Tracking Schema

```typescript
interface UsageRecord {
  userId: string;
  timestamp: number;
  type: 'chat' | 'image' | 'logo' | 'video';
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  cached: boolean;
}
```

## Cost Projections

### Per User Tier (Monthly)

| Tier | Chat Convos | Your Cost | Margin |
|------|-------------|-----------|--------|
| Starter ($29) | ~500 | ~$0.50-2 | 93-98% |
| Pro ($79) | ~2,000 | ~$2-8 | 90-97% |
| Business ($199) | ~10,000 | ~$10-40 | 80-95% |

### Generation Credits

| Type | Your Cost | User Price | Margin |
|------|-----------|------------|--------|
| Image | $0.02-0.05 | $0.25 | 5-12x |
| Logo | $0.05-0.15 | $0.75 | 5-15x |
| Video (30s) | $0.10-0.50 | $2.00 | 4-20x |

## Related Agents

- `image-processor` - Handles image generation with Nano Banana Pro
- `remotion-video-generator` - Programmatic video creation
- `stripe` - Payment processing for credits

## Version

- **Version:** 1.0.0
- **Last Updated:** 2026-02-02
