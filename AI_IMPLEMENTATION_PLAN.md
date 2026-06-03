# AI Chatbot Integration for ZPPSU-CARES-AI

This plan outlines the steps for integrating an AI chat model (using OpenRouter) to provide real-time supportive responses to students and faculty.

## Backend Architecture

### 1. External API Integration
- **Provider:** [OpenRouter](https://openrouter.ai/)
- **Reason:** Provides access to multiple open-source models (Llama 3, Mistral, etc.) via a single OpenAI-compatible API.
- **Service:** Create an `AIService` to handle direct communication with OpenRouter.

### 2. New Backend Routes
- **Endpoint:** `POST /api/ai/chat`
- **Controller:** `aiController.ts`
- **Logic:**
  - Receive `messages` from the frontend.
  - Prepend a strict system prompt to define the AI's persona.
  - Return the model's response.
  - Implement basic rate limiting for AI requests.

### 3. Environment Variables
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL_NAME=meta-llama/llama-3-8b-instruct:free
```

## Frontend Architecture

### 1. UI Component: `AICompanion.tsx`
- **Features:**
  - Floating action button (FAB) toggle.
  - Glassmorphic chat interface.
  - Message bubble animations (Framer Motion).
  - Typing indicator and auto-scrolling header.
  - Integration with university actions (e.g., "Request Counseling" button).

### 2. API Hook: `useAIChat.ts`
- **Logic:**
  - Standardized state for chat history.
  - Error handling for API timeouts or missing keys.
  - Persistent chat history across local session (optional).

## Implementation Steps

### Phase 1: Backend Setup
1. Create `backend/src/controllers/aiController.ts`.
2. Create `backend/src/routes/aiRoutes.ts`.
3. Register the route in `backend/src/routes/index.ts`.
4. Update `.env.example` with new keys.

### Phase 2: Frontend Implementation
1. Develop the `AICompanion` component in `frontend/src/components/shared/AICompanion.tsx`.
2. Add necessary animations and styling for a "premium" feel.
3. Integrate the chat with a backend call.

### Phase 3: Personality Tuning
1. Refine the system prompt to align with ZPPSU-CARES university values.
2. Test the response for edge cases (distress signals, general inquiries).
