# vapi-voice-agent — AI Voice Agent Builder

**Type:** Default Ausar Engine Module (Platform Standard)
**Subagent:** `vapi-voice-agent`
**Ausar Module:** `voice-agent`
**Status:** DEFAULT-ON — every Heru gets voice agent capability automatically
**Dependencies:** Vapi MCP Server, Clerk Auth, Stripe Subscriptions
**Brand Identity:** "Quik Nation — just talk to it."

## Purpose

**Platform-standard** AI voice agent module powered by Vapi. Every Heru born from the Auset Platform includes voice agent capability by default — like Clerk auth and Stripe payments, it's not optional, it's infrastructure. After a customer's first transaction on ANY Heru, voice is unlocked for repeat transactions.

Supports three operational modes: **booking** (service appointments), **ordering** (food/product orders), and **dispatch** (driver/courier assignment).

**Access:** In-App VoIP (WebRTC) ONLY — no phone numbers except QuikCarry corporate clients.
**Revenue:** Platform fee on EVERY transaction covers voice — customers pay whether they use it or not. ~98% margin.
**UX:** App proactively greets repeat customers by voice on open. One-time opt-out if declined.

## When to Use

- Setting up a new voice agent for a Heru project
- Configuring Vapi assistant with business-specific system prompts
- Integrating voice booking into mobile apps (WebRTC/VoIP)
- Setting up phone number access for corporate clients
- Adding voice ordering to delivery/restaurant platforms
- Building dispatch services for logistics Herus
- Managing end-of-call webhooks and reporting
- Debugging voice agent issues

## Operational Modes

### Mode: Booking (Service Appointments)
**Herus:** FMO, QuikBarber, Site962 Barbershop, Site962 Music Studio, Site962 Photo Shoots
- Customer calls → AI checks availability → books appointment → confirms
- Access: In-app VoIP ($1/mo membership perk) or phone number
- Tools: check_membership, check_availability, book_appointment, send_confirmation

### Mode: Ordering (Food/Product Orders)
**Herus:** QuikDelivers (restaurants), Site962 Food, Empress Eats
- Customer calls → AI takes order → sends to kitchen → assigns driver
- Access: Phone number (automatic for restaurants) + in-app VoIP
- Tools: get_menu, create_order, estimate_delivery, assign_driver, send_confirmation
- **QuikDelivers restaurants get this FREE** — platform differentiator vs DoorDash/UberEats

### Mode: Dispatch (Driver/Courier Assignment)
**Herus:** QuikCarry (corporate clients), QuikDelivers (driver routing)
- Corporate client calls → AI books rides for groups → assigns drivers → confirms
- Access: Dedicated phone number (invoiced) + in-app for internal dispatch
- Tools: check_availability, create_ride, dispatch_driver, send_confirmations, log_dispatch

### Mode: Hybrid (Multiple Modes Combined)
- QuikCarry = dispatch + corporate booking
- QuikDelivers = ordering + dispatch
- Site962 = booking + ordering (barbershop + food court)

## Capabilities

### Voice Agent Setup
- Install and configure Vapi MCP server
- Create Vapi assistants with custom system prompts
- Configure voice models (OpenAI, ElevenLabs, Deepgram)
- Set up first message, end-of-call reports, transfer numbers

### Integration Patterns
- **In-App VoIP (WebRTC)** — For mobile app members (cheaper, auth guaranteed)
- **Phone Number** — For corporate clients or restaurant customers calling in
- **Hybrid** — Both options based on client tier or business type

### Membership Verification (Booking Mode)
- Clerk auth token passed as call metadata
- Backend validates active subscription before connecting
- Stripe subscription check: has `voice_booking` line item
- Reject non-members with friendly upgrade prompt

### Tools by Mode

**Booking Mode:**
1. **check_membership** — Verify caller's active subscription via Clerk + Stripe
2. **check_availability** — Query business calendar for open slots
3. **book_appointment** — Create booking in business database
4. **send_confirmation** — Push notification + SMS via Twilio
5. **log_call** — End-of-call data to admin dashboard

**Ordering Mode:**
1. **get_menu** — Retrieve restaurant/venue menu items + prices
2. **create_order** — Place order in restaurant system
3. **estimate_delivery** — Calculate delivery time + cost
4. **assign_driver** — Route order to available QuikDelivers driver
5. **send_confirmation** — Order confirmation to customer + restaurant + driver

**Dispatch Mode:**
1. **check_driver_availability** — Query available drivers by location/time
2. **create_ride** — Book ride(s) in system
3. **dispatch_driver** — Assign specific driver(s) to ride(s)
4. **send_confirmations** — Notify corporate client + all assigned drivers
5. **log_dispatch** — Record in admin dashboard with corporate billing

### Per-Heru Customization
- Business-specific system prompts (grooming, rides, food, events)
- Custom calendar/menu/fleet integration per business
- Role-based access (member vs. corporate client vs. staff vs. restaurant)
- Pricing: $1/mo membership, invoiced corporate, or free (platform perk)

## Ausar Engine Registration

```typescript
// backend/src/features/voice-agent/voice-agent.module.ts
export const VoiceAgentModule: AusarModule = {
  name: 'voice-agent',
  version: '1.0.0',
  modes: ['booking', 'ordering', 'dispatch', 'hybrid'],
  dependencies: ['clerk-auth', 'stripe-subscriptions', 'twilio-sms'],
  optionalDependencies: ['push-notifications'],
  activate: (config: VoiceAgentConfig) => { /* register routes, tools, webhooks */ },
};
```

## Architecture

```
Mobile App (Authenticated Member) — BOOKING MODE
  └── "Book by Phone" button
      └── Vapi Web SDK (WebRTC)
          └── Vapi Assistant (booking mode)
              ├── check_membership (Clerk + Stripe)
              ├── check_availability (Business Calendar)
              ├── book_appointment (Database)
              ├── send_confirmation (Twilio + Push)
              └── end-of-call webhook → Admin Dashboard

Restaurant Phone (QuikDelivers) — ORDERING MODE
  └── Dedicated Vapi Phone Number (per restaurant)
      └── Vapi Assistant (ordering mode)
          ├── get_menu (Restaurant catalog)
          ├── create_order (Order system)
          ├── estimate_delivery (Routing engine)
          ├── assign_driver (QuikDelivers dispatch)
          └── send_confirmation → Customer + Restaurant + Driver

Corporate Client (QuikCarry) — DISPATCH MODE
  └── Dedicated Vapi Phone Number
      └── Vapi Assistant (dispatch mode)
          ├── check_driver_availability (Fleet system)
          ├── create_ride (Booking system)
          ├── dispatch_driver (Assignment engine)
          └── send_confirmations → Corporate + All Drivers
```

## Cost Model

| Component | Cost | Who Pays |
|-----------|------|----------|
| Vapi per-minute | ~$0.06/min | Platform |
| Average call (~4 min) | ~$0.24 | Platform |

### Billing Models (per Heru type)

| Model | Herus | How It Works |
|-------|-------|-------------|
| Membership add-on | FMO, QuikBarber | $1/mo added to subscription |
| Customer membership | QuikDelivers | Membership includes voice across all restaurants + grocery |
| Technology fee credits | QuikCarRental | Tech fee covers next 4 voice bookings per rental |
| Transaction-included | QuikCarry riders, QuikEvents, QuikDollars | After first transaction, voice unlocked (cost in fees) |
| Prepaid wallet | QuikDelivers restaurants (new) | Restaurant loads credits, $0.24/call deducted |
| Graduated/included | QuikDelivers restaurants (volume) | High-volume restaurants get it free |
| Free credits | QuikDelivers restaurants (onboarding) | X dollars free to prove value |
| Platform-owned free | Site962 (all verticals) | Quik absorbs cost |
| Invoiced | QuikCarry corporate (Integral, Sonesta) | Billed monthly, phone number access |
| Checkout pass-through | QuikDelivers grocery | Baked into delivery/service fee |

## Heru Deployment Status

**Platform Standard:** Every Heru gets voice after customer's first transaction. Cost baked into existing fees.

| Heru | Status | Mode | Access | Billing |
|------|--------|------|--------|---------|
| FMO | Planned (MVP) | booking | In-app VoIP | $1/mo membership add-on |
| QuikCarRental | Planned | booking | In-app VoIP | Tech fee covers next 4 voice bookings |
| QuikCarry (riders) | Planned | booking | In-app VoIP | After first ride, fee covers voice |
| QuikCarry (corporate) | Planned | dispatch | **Phone number** (only exception) | Invoiced to corporate |
| QuikDelivers (customers) | Planned | ordering | In-app VoIP | Customer membership includes voice |
| QuikDelivers (restaurants) | Planned | ordering | In-app VoIP | Free credits → prepaid wallet → graduated |
| QuikDelivers (grocery) | Planned | ordering | In-app VoIP | Cost passed through at checkout |
| QuikBarber | Template from FMO | booking | In-app VoIP | $1/mo membership add-on |
| Site962 Barbershop | Template from FMO | booking | In-app VoIP | Free (Quik-owned) |
| Site962 Food | Priority | ordering | In-app VoIP | Free (Quik-owned, already making money) |
| Site962 Music Studio | Future | booking | In-app VoIP | Free (Quik-owned) |
| Site962 Photo Shoots | Future | booking | In-app VoIP | Free (Quik-owned) |
| QuikEvents | Future | booking | In-app VoIP | Baked into ticket/service fee |
| QuikDollars | Future | transactions | In-app VoIP | Baked into transaction fee |
| QuikSign | Future | actions | In-app VoIP | Baked into service fee |
| Empress Eats | Future | ordering | In-app VoIP | TBD |
| World Cup Ready | Consult client | TBD | In-app VoIP | TBD |

## Required Environment Variables

```bash
VAPI_API_KEY=           # Vapi platform API key
VAPI_ASSISTANT_ID=      # Created by this agent
VAPI_PHONE_NUMBER_ID=   # For corporate phone access (optional)
```

## Related

- **Command:** `/setup-voice-agent` — Interactive voice agent setup
- **Skill:** `voice-booking` — Reusable voice booking patterns
- **MCP:** Vapi MCP Server (`github.com/VapiAI/mcp-server`)
- **Standard:** Agent Skills Open Standard (`agentskills.io`)
