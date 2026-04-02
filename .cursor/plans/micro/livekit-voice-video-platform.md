# LiveKit — Auset Platform Voice + Video + Real-Time Architecture

**Decision:** March 27, 2026 — Mo's directive (told Granville twice, don't be lazy)
**Priority:** CRITICAL — powers conversational AI across ALL 53 Herus
**Type:** Auset Standard Module (core infrastructure)
**Replaces:** Vapi, custom ElevenLabs/Groq/Deepgram HTTP pipeline

---

## Why LiveKit

Mo asked why we weren't considering LiveKit. Granville defaulted to what was already hacked together. Mo corrected him. Twice.

LiveKit is open-source (Apache 2.0), WebRTC-native, has a purpose-built AI Agents Framework, supports voice + video + data channels, self-hostable, and costs $0.02/min on their cloud. We own it forever.

**The old way:** Promoter fills out a 30-field form, gets confused, calls Quik, Quik does it himself.
**The LiveKit way:** Promoter calls Site 962. Clara answers. Two minutes later, event is created.

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│              CLIENTS                         │
│  Web (Next.js)  │  Mobile (RN)  │  Phone    │
│  LiveKit JS SDK │  LiveKit RN   │  SIP/PSTN │
└────────┬────────┴───────┬───────┴─────┬─────┘
         │                │             │
         ▼                ▼             ▼
┌─────────────────────────────────────────────┐
│         LIVEKIT SERVER (WebRTC SFU)          │
│                                              │
│  Development: Self-hosted on QCS1 (M4 Pro)   │
│  Production:  LiveKit Cloud ($0.02/min)      │
│                                              │
│  Rooms → Participants → Audio/Video Tracks   │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│         CLARA AGENT (LiveKit Agents SDK)     │
│                                              │
│  Language: Python (LiveKit Agents Framework)  │
│  Hosted:   QCS1 (dev) / EC2 (prod)          │
│                                              │
│  Pipeline:                                   │
│  ┌─────────┐  ┌──────┐  ┌────────┐          │
│  │Deepgram │→ │Claude │→ │Eleven  │          │
│  │  STT    │  │ LLM   │  │Labs TTS│          │
│  └─────────┘  └──┬───┘  └────────┘          │
│                  │                            │
│           Function Calling                    │
│                  │                            │
│    ┌─────────────┴──────────────┐            │
│    │   GraphQL Backend API      │            │
│    │   createEvent, bookAppt,   │            │
│    │   placeOrder, purchaseTicket│            │
│    └────────────────────────────┘            │
└─────────────────────────────────────────────┘
```

---

## Provider Stack

### Speech-to-Text (STT)
| Provider | Cost | Latency | When to Use |
|----------|------|---------|-------------|
| **Deepgram Nova-2** | $0.0043/min | ~300ms | PRIMARY — best price/quality |
| Groq Whisper | Free tier | ~500ms | FALLBACK |

### Large Language Model (LLM)
| Provider | Cost | Latency | When to Use |
|----------|------|---------|-------------|
| **Groq (Llama 3.1 70B)** | $0.0006/1K tokens | ~200ms | PRIMARY — fastest for voice |
| Claude Sonnet 4.6 | $0.003/1K tokens | ~800ms | COMPLEX tasks (multi-step reasoning) |
| Cloudflare Workers AI | ~$0.0001/conv | ~400ms | FALLBACK |

### Text-to-Speech (TTS)
| Provider | Cost | Latency | When to Use |
|----------|------|---------|-------------|
| **ElevenLabs** | $0.03/min | ~200ms | PRIMARY — we have 16 cloned agent voices |
| Cartesia Sonic | $0.015/min | ~150ms | COST OPTIMIZATION — 50% cheaper |
| Deepgram Aura | $0.0085/min | ~250ms | BUDGET option |

### LiveKit Infrastructure
| Environment | How | Cost |
|-------------|-----|------|
| **Development** | Self-hosted on QCS1 (Docker) | $0 (just compute) |
| **Staging** | LiveKit Cloud (free tier) | $0 up to limits |
| **Production** | LiveKit Cloud | $0.02/min per participant |

---

## Heru Use Cases — What LiveKit Unlocks

### Site 962 (Quik's Venue)
| Feature | Voice | Video | Data |
|---------|-------|-------|------|
| **Event creation** | Promoter calls → Clara creates event | — | — |
| **Ticket purchase** | "Get me 2 VIP tickets for Saturday" | — | QR pass delivery |
| **Food ordering** | "I want a burger and fries from Station 3" | — | Order status |
| **Barber booking** | "Book me a fade at 2pm" | — | Confirmation |
| **Event check-in** | Staff voice commands | — | Pass scanning |

### FMO (Salon)
| Feature | Voice | Video | Data |
|---------|-------|-------|------|
| **Appointment booking** | Client calls → Clara books | — | SMS confirmation |
| **Consultations** | — | Video call with stylist | Photo sharing |
| **Walk-in queue** | "How long is the wait?" | — | Queue position |

### QuikCarry (Delivery)
| Feature | Voice | Video | Data |
|---------|-------|-------|------|
| **Order delivery** | "I need a pickup at 123 Main" | — | Driver tracking |
| **Driver dispatch** | Voice alerts to available drivers | — | Route data |
| **Support** | Customer calls about delivery | Video of package | Location |

### Seeking Talent (Kinah)
| Feature | Voice | Video | Data |
|---------|-------|-------|------|
| **Audition scheduling** | Talent calls → Clara schedules | — | Calendar sync |
| **Video auditions** | — | Remote video auditions | Recording |
| **Casting calls** | Voice blast to matched talent | — | Application |

### QCR (Car Rental)
| Feature | Voice | Video | Data |
|---------|-------|-------|------|
| **Vehicle booking** | "I need an SUV for the weekend" | — | Availability |
| **Vehicle inspection** | — | Video walkthrough with customer | Damage photos |
| **Check-in/out** | Voice confirmation | — | Digital pass |

### WCR (World Cup Ready)
| Feature | Voice | Video | Data |
|---------|-------|-------|------|
| **Registration** | Voice registration for teams | — | Confirmation |
| **Match updates** | Voice score updates | Live stream | Stats |

---

## Rollout Strategy — BUILD, TEST, THEN ROLL OUT (Mo's directive)

**Phase 1: Build as platform component** — `backend/src/features/core/voice/`
**Phase 2: Test in Site 962 (web)** — Conversational event creation
**Phase 3: Test in FMO (mobile)** — Voice appointment booking
**Phase 4: Prove it works** — Real users, real calls, real feedback via Heru Feedback
**Phase 5: THEN roll out** — `/sync-herus` to remaining Herus ONLY after Phase 4 proves it

Do NOT skip to Phase 5. Do NOT build all Heru tools at once. Site 962 + FMO first.

---

## Implementation Plan

### Story 1: LiveKit Infrastructure Setup (3 hours)

**QCS1 (Development):**
```bash
# Docker compose for LiveKit server
docker run -d \
  --name livekit \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 7882:7882/udp \
  livekit/livekit-server \
  --dev
```

**What to do:**
1. Install LiveKit server on QCS1 via Docker
2. Generate API key + secret for development
3. Store keys in `~/.agent-creds/livekit-api-key` and `~/.agent-creds/livekit-api-secret`
4. Add to AWS SSM: `/quik-nation/shared/LIVEKIT_API_KEY`, `/quik-nation/shared/LIVEKIT_API_SECRET`
5. Production: Create LiveKit Cloud project at cloud.livekit.io
6. Test: Create a room, join from browser, verify audio/video works

**Env vars for all Herus:**
```
LIVEKIT_URL=ws://100.113.53.80:7880       # dev (QCS1 Tailscale)
LIVEKIT_URL=wss://your-project.livekit.cloud  # prod
LIVEKIT_API_KEY=<from SSM>
LIVEKIT_API_SECRET=<from SSM>
```

### Story 2: Clara Voice Agent — LiveKit Agents SDK (4 hours)

**Location:** `infrastructure/voice/livekit-agent/`

**What to build:**
1. Python agent using `livekit-agents` SDK
2. Pipeline: Deepgram STT → Groq LLM → ElevenLabs TTS
3. Clara's personality prompt (warm, professional, knows the Heru she's serving)
4. Function calling interface to GraphQL backend:
   - `createEvent(name, date, venue, pricing)` — Site 962
   - `bookAppointment(service, stylist, date, time)` — FMO
   - `placeOrder(items, deliveryAddress)` — QuikCarry
   - `scheduleAudition(talent, role, date, time)` — Seeking Talent
   - `bookVehicle(type, dates)` — QCR
5. Multi-Heru awareness: Clara knows which Heru she's serving based on the room name or SIP number
6. Voice selection: Use the cloned ElevenLabs voices per agent personality

```python
# infrastructure/voice/livekit-agent/agent.py
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import deepgram, openai, elevenlabs

async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(model="nova-2"),
        llm=openai.LLM(
            base_url="https://api.groq.com/openai/v1",
            model="llama-3.1-70b-versatile",
        ),
        tts=elevenlabs.TTS(voice_id="clara_voice_id"),
        fnc_ctx=create_function_context(ctx),  # GraphQL function calling
    )

    agent.start(ctx.room)
    await agent.say("Hey! Welcome to Site 962. How can I help you?")
```

### Story 3: Web Integration — LiveKit JS SDK (2 hours)

**What to build:**
1. Add `@livekit/components-react` to frontend
2. Create `components/voice/VoiceAgentButton.tsx` — floating button to start voice conversation
3. Create `components/voice/VoiceAgentModal.tsx` — full-screen voice UI with:
   - Animated waveform while Clara speaks
   - Real-time transcript
   - Action confirmations ("I'm creating your event now...")
   - End call button
4. Add to every Heru's layout — one button, available everywhere
5. Create `components/video/VideoCallWidget.tsx` for video consultations (FMO, Seeking Talent)

### Story 4: Mobile Integration — LiveKit React Native SDK (2 hours)

**What to build:**
1. Add `@livekit/react-native` to mobile
2. Create voice agent screen with push-to-talk or always-listening mode
3. Create video call screen for consultations
4. Integrate with Expo push notifications for incoming calls
5. Background audio support for voice conversations while using other app features

### Story 5: SIP/PSTN Gateway — Phone Number Access (1 hour)

**What to build:**
1. Configure LiveKit SIP gateway (built-in feature)
2. Purchase phone number via Twilio SIP trunk (voice only — this is the ONE thing we keep Twilio for)
3. Route incoming calls: phone → SIP → LiveKit room → Clara agent
4. Per-Heru phone numbers:
   - Site 962: (404) XXX-XXXX
   - FMO: (954) XXX-XXXX
   - QuikCarry: (305) XXX-XXXX
5. Promoters can CALL a phone number. No app required. No login required.

**Alternative:** LiveKit Cloud has built-in PSTN via Twilio partnership — $0.015/min inbound.

### Story 6: Function Calling — GraphQL Bridge (2 hours)

**What to build:**
1. Create `infrastructure/voice/livekit-agent/tools/` directory
2. Each Heru gets a tools file:
   - `site962_tools.py` — createEvent, purchaseTicket, bookBarber, orderFood
   - `fmo_tools.py` — bookAppointment, checkAvailability, cancelAppointment
   - `quikcarry_tools.py` — requestDelivery, trackOrder, estimateFare
   - `seekingtalent_tools.py` — scheduleAudition, postOpportunity, checkApplications
   - `qcr_tools.py` — bookVehicle, checkAvailability, startRental
3. Each tool calls the Heru's GraphQL backend via HTTP
4. Clara confirms actions before executing: "I'm about to book you for a fade at 2pm with Marcus. Sound good?"
5. Error handling: If the backend is down, Clara says "Let me try that again" and retries

### Story 7: Conversational Event Creation — Site 962 MVP (3 hours)

**The demo that matters. This is what Mo described.**

**Flow:**
1. Promoter opens Site 962 app or calls the phone number
2. Clara: "Hey! Welcome to Site 962. Are you looking to host an event?"
3. Promoter: "Yeah, I want to do an R&B night on March 29th"
4. Clara: "Nice! What time are you thinking?"
5. Promoter: "8PM to 2AM"
6. Clara: "And what do you want to charge for tickets?"
7. Promoter: "25 general, 50 VIP"
8. Clara: "Got it. R&B Night at Site 962, March 29th, 8PM to 2AM. $25 general admission, $50 VIP. Want me to set a ticket cap?"
9. Promoter: "300 max"
10. Clara: "Perfect. I've submitted your event for Quik's approval. You'll get a text within 72 hours. Want to add a promo code for early birds?"
11. Promoter: "Nah, we're good"
12. Clara: "All set! Good luck with the event. Call me anytime if you need to make changes."

**Behind the scenes:**
- Clara extracts: name, date, time, venue (Site 962), pricing tiers, ticket cap
- Calls `createEvent` mutation on GraphQL backend
- Event created with status: `pending`
- SMS sent to promoter: confirmation + event ID
- Notification sent to Quik: new event pending approval
- Quik opens admin, sees event, approves with one tap

### Story 8: WAIT — Prove It Works First (Phase 4)

**DO NOT proceed to rollout until:**
1. Site 962 event creation works end-to-end (voice → event created → Quik approves)
2. FMO appointment booking works end-to-end (voice → appointment booked → SMS confirmation)
3. Real users have used it (not just us testing)
4. Heru Feedback has captured any bugs
5. Mo and Quik sign off

### Story 9: Roll Out to Other Herus (Phase 5 — AFTER proof)

ONLY after Phase 4 is proven:
1. Add `core/voice/` to Auset Standard Module Registry
2. LiveKit client components → shared package
3. Per-Heru configuration (tools, voice, phone number, greeting)
4. Run `/sync-herus` to push to remaining Herus
5. Each Heru activates with `/auset-activate voice`

---

## Cost Model

### Per-Minute Breakdown
| Component | Cost/min |
|-----------|----------|
| LiveKit Cloud | $0.020 |
| Deepgram STT | $0.004 |
| Groq LLM | ~$0.001 |
| ElevenLabs TTS | $0.030 |
| **Total** | **~$0.055/min** |

### With Cartesia TTS (cost optimization)
| Component | Cost/min |
|-----------|----------|
| LiveKit Cloud | $0.020 |
| Deepgram STT | $0.004 |
| Groq LLM | ~$0.001 |
| Cartesia Sonic TTS | $0.015 |
| **Total** | **~$0.040/min** |

### Revenue
- Average voice call: 2-3 minutes
- Cost per call: $0.08-0.17
- Technology fee charged to customer: $1.00
- **Margin: 83-92%**

### Self-Hosted (QCS1 Development)
- LiveKit server: $0 (Docker)
- STT/TTS/LLM: Same API costs
- No LiveKit Cloud fee
- **Save $0.02/min during development**

---

## Timeline

| Story | Effort | Who | Depends On |
|-------|--------|-----|------------|
| 1. Infrastructure setup | 3h | Granville (QCS1) | Nothing |
| 2. Clara agent (Python) | 4h | Cursor agent | Story 1 |
| 3. Web integration | 2h | Cursor agent | Story 1 |
| 4. Mobile integration | 2h | Cursor agent | Story 1 |
| 5. SIP/PSTN gateway | 1h | Granville | Story 1 |
| 6. Function calling bridge | 2h | Cursor agent | Story 2 + backend APIs |
| 7. Site 962 event creation | 3h | Cursor agent | Stories 2, 6 |
| 8. Deploy to all Herus | 1h | /sync-herus | Stories 1-7 |

**Total: ~18 hours of work**
**Critical path: Stories 1 → 2 → 6 → 7 (12 hours)**

---

## What Gets Removed

| Remove | Replace With |
|--------|-------------|
| Vapi assistant configs in site962 | LiveKit + Clara agent |
| Custom voice pipeline (infrastructure/voice/server/) | LiveKit Agents SDK |
| HTTP polling for voice responses | WebRTC native real-time |
| ElevenLabs WebSocket hack | LiveKit TTS plugin |
| Groq HTTP streaming hack | LiveKit LLM plugin |

**Keep:** ElevenLabs cloned voices (just access them through LiveKit's ElevenLabs plugin instead of our custom WebSocket code)

---

## Security

- LiveKit rooms are authenticated via JWT tokens (signed with API secret)
- Each voice session gets its own room with auto-cleanup
- Function calling requires Clerk auth token passed through room metadata
- No direct database access from the agent — everything goes through GraphQL
- Call recordings (optional) stored in S3, encrypted at rest
- HIPAA-eligible for FMO health-related conversations (LiveKit Cloud supports this)

---

## The Vision (Mo's Words)

> "Why have just a form? What I wanted was the ability for Quik and Promoters to create events with AI agents, voice agents."

Every Heru gets a voice. Every customer gets a conversation. Every form becomes optional. LiveKit is the foundation. Clara is the soul.
