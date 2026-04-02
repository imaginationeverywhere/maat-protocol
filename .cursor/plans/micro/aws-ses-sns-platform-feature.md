# AWS SES + SNS — Reusable Platform Communication Feature

**Decision:** March 27, 2026 — Mo's directive
**Priority:** HIGH — QuikCarry and FMO need SMS immediately
**Type:** Auset Standard Module (deploys to ALL 53 Herus)
**Guided by:** Mary McLeod Bethune (Product) + Granville T. Woods (Architecture)

---

## The Services

| AWS Service | What It Does | Cost |
|-------------|-------------|------|
| **SES** (Simple Email Service) | Transactional + marketing email | $0.10 per 1,000 emails |
| **SNS** (Simple Notification Service) | SMS text messages | $0.00645 per US text |

Both are already imported in `backend/src/services/AWSCommunicationService.ts`.

## Two Categories — Two Business Models

### Transactional (FREE — included in every Heru plan)
Automated messages triggered by events. No opt-in required (except SMS best practice).
- OTP verification codes (REPLACES Twilio for QuikCarry)
- Delivery/driver alerts (QuikCarry)
- Appointment reminders (FMO, DreamiHairCare)
- PassKit electronic ticket links (Site 962)
- Payment receipts, booking confirmations
- Application status updates (Seeking Talent)

### Marketing (PAID — revenue feature for platform)
Campaigns and blasts that site owners pay for. Requires opt-in consent.
- Promotional campaigns ("20% off this weekend")
- Event announcements (Site 962)
- Re-engagement ("We miss you!")
- Newsletter/updates
- Bulk talent outreach (Seeking Talent)

### Pricing Model — NOTHING IS FREE (Mo's directive)

Every message has a cost. That cost gets passed to the customer as a SEPARATE line item. Platform fees stay clean — never mix them.

**The Technology Fee (SEPARATE from platform fee):**

The communication cost is a standalone fee on every transaction — NOT bundled into the platform percentage. The customer sees it as a transparent line item.

| Heru | Technology Fee | What It Covers |
|------|---------------|----------------|
| Empress Eats | $1.50 fixed | SMS delivery confirmations + email receipt |
| Site 962 | Dynamic (msg length + 20% markup) | SMS ticket links + email confirmations |
| QuikCarry | ~$1.00 fixed | SMS driver/rider alerts + email receipt |
| FMO | ~$1.00 fixed | SMS appointment reminder + email confirmation |
| All other Herus | $1.00 default | Transactional email + SMS per order/booking |

**Fee structure per transaction (customer sees all 3 lines):**
1. **Platform/Website Fee** — percentage (5-15%) → platform revenue (STAYS CLEAN)
2. **Technology Fee** — flat fee (~$1-$1.50) → covers email + SMS + infrastructure
3. **Card Processing Fee** — Stripe pass-through (2.9% + $0.30)

**Proven in production:** Empress Eats charges $1.50 technology fee. Site 962 charges dynamic SMS fee with 20% markup. Customers pay it without complaint.

**Marketing messages** — paid tiers for blasts:

| Tier | Monthly | Marketing Blasts | Overage |
|------|---------|-----------------|---------|
| Growth | $29/mo | 500 email + 200 SMS | $0.01/email, $0.02/SMS |
| Pro | $79/mo | 2,500 email + 1,000 SMS | $0.008/email, $0.015/SMS |
| Enterprise | $199/mo | 10,000 email + 5,000 SMS | $0.005/email, $0.01/SMS |

**Our margins:**
- Technology fee collects ~$1.00 per transaction. Our actual cost per SMS+email = ~$0.01. That's 100x margin.
- AWS credits cover our costs NOW → every technology fee dollar is pure revenue while credits last
- Marketing tiers are additional monthly recurring revenue on top

### Compliance (NON-NEGOTIABLE)
- Marketing emails: CAN-SPAM — unsubscribe link required
- Marketing SMS: TCPA — opt-in consent + "STOP to unsubscribe"
- Track per-user: `email_marketing_opt_in`, `sms_marketing_opt_in`
- Transactional exempt from most rules but still need sender ID

## What Gets Replaced

| Old | New | Heru |
|-----|-----|------|
| Twilio OTP | SNS OTP | QuikCarry (driver/rider verification) |
| Twilio SMS reminders | SNS transactional | FMO (appointment reminders) |
| SendGrid emails | SES transactional | All Herus |
| Manual ticket links | SNS + PassKit URL | Site 962 (electronic ticket delivery) |

**Keep Twilio for VOICE only** (phone calls, Vapi integration).

---

## Plan: Make This a Reusable Auset Feature

### Story 1: Standardize AWSCommunicationService (2 hours)

**What exists:** `backend/src/services/AWSCommunicationService.ts` — has SES + SNS clients, email + SMS methods

**What to do:**
1. Move to `backend/src/features/core/communications/` as an Auset standard feature
2. Add feature activation via Ausar engine (`/auset-activate communications`)
3. Ensure the service handles:
   - **Email (SES):** Single send, bulk send, HTML templates, text fallback
   - **SMS (SNS):** Single send, bulk send, sender ID, opt-out handling
4. Add environment variable validation via Maat:
   - `AWS_SES_FROM_EMAIL` — verified sender email
   - `AWS_SES_FROM_NAME` — display name
   - `AWS_REGION` — region (us-east-1)
   - `SNS_SMS_SENDER_ID` — optional sender ID for SMS
5. Remove all SendGrid and Twilio SMS dependencies from the platform

### Story 2: SMS Templates for Common Use Cases (1 hour)

Pre-built SMS templates that any Heru can use:

| Template | Use Case | Example |
|----------|----------|---------|
| `appointment_reminder` | FMO, DreamiHairCare | "Reminder: Your appointment with [stylist] is tomorrow at [time]" |
| `order_status` | QuikCarry, Site962 | "Your delivery is on the way! Driver: [name], ETA: [time]" |
| `driver_alert` | QuikCarry | "New delivery request near you. Pickup: [address]" |
| `booking_confirmation` | QCR, FMO | "Booking confirmed: [service] on [date] at [time]" |
| `application_update` | Seeking Talent | "Your application to [role] was updated: [status]" |
| `payment_received` | All Herus | "Payment of $[amount] received. Thank you!" |
| `welcome` | All Herus | "Welcome to [heru_name]! Your account is ready." |
| `otp_verification` | All Herus | "Your verification code is [code]. Expires in 10 minutes." |

### Story 3: Wire SMS into QuikCarry (2 hours)

**Critical SMS flows for QuikCarry:**
1. **Driver gets new delivery request** → SMS to driver with pickup address
2. **Rider books delivery** → SMS confirmation with driver name + ETA
3. **Driver arrives at pickup** → SMS to rider "Your driver has arrived"
4. **Delivery complete** → SMS to rider with receipt link
5. **Driver payout processed** → SMS to driver with amount

### Story 4: Wire SMS into FMO (2 hours)

**Critical SMS flows for FMO:**
1. **Appointment reminder** → SMS 24h + 1h before (dedup — don't send both if <24h)
2. **Appointment booked** → SMS confirmation to client
3. **Appointment cancelled** → SMS to client + staff
4. **Walk-in queue update** → SMS "You're next!" when position = 1
5. **Payment receipt** → SMS with receipt link after checkout

### Story 5: SES Domain Verification (30 min)

For each Heru that sends email, verify the sending domain in SES:
- `noreply@quiknation.com` — platform-wide sender
- `noreply@seekingtalent.quiknation.com` — Seeking Talent
- `noreply@quikcarry.com` — QuikCarry
- `noreply@fmo.quiknation.com` — FMO

Steps:
1. Add DKIM records to Cloudflare DNS (3 CNAME records per domain)
2. Add SPF record (`v=spf1 include:amazonses.com ~all`)
3. Request production SES access (out of sandbox)

### Story 6: SNS Production Access (30 min)

Default SNS sandbox limits: $1/month spend, phone number verification required.

Steps:
1. Open AWS Support case: "Request SNS SMS production access"
2. Provide use case description (transactional notifications for staffing/delivery/salon platforms)
3. Request spend limit increase ($50/month initially)
4. Set default SMS type to "Transactional" (higher delivery priority)

### Story 7: Deploy to All Herus via /sync-herus (1 hour)

Once the feature is standardized:
1. Add `communications` to Auset Standard Module Registry
2. Run `/sync-herus` to push the feature to all 53 projects
3. Each Heru activates with `/auset-activate communications`
4. Per-Heru configuration: which templates to use, sender email/SMS ID

---

## Heru-Specific SMS Needs

| Heru | SMS Priority | Key Use Cases |
|------|-------------|---------------|
| **QuikCarry** | CRITICAL | Driver alerts, rider updates, delivery tracking |
| **FMO** | CRITICAL | Appointment reminders, walk-in queue |
| **QCR** | HIGH | Booking confirmation, check-in/out alerts |
| **WCR** | HIGH | Registration confirmation, match updates |
| **Site962** | MEDIUM | Event reminders, ticket confirmations |
| **Seeking Talent** | MEDIUM | Application updates, opportunity alerts |
| **QuikNation** | LOW | Platform notifications |
| **DreamiHairCare** | HIGH | Appointment reminders, stylist alerts |

---

## What Gets Removed

| Remove | From | Replace With |
|--------|------|-------------|
| `TwilioSendGridCommunicationService` | All Herus | `AWSCommunicationService` |
| `@sendgrid/mail` dependency | All package.json | `@aws-sdk/client-ses` (already there) |
| `twilio` SMS dependency | All package.json | `@aws-sdk/client-sns` (already there) |
| `SENDGRID_API_KEY` env var | All .env files | `AWS_SES_FROM_EMAIL` |
| `TWILIO_ACCOUNT_SID` (for SMS only) | All .env files | AWS IAM credentials |

**Note:** Keep Twilio for VOICE (phone calls, Vapi integration). Only SMS moves to SNS.

---

## Timeline

| Story | Effort | Who |
|-------|--------|-----|
| 1. Standardize service | 2h | Cursor agent |
| 2. SMS templates | 1h | Cursor agent |
| 3. QuikCarry SMS | 2h | Cursor agent |
| 4. FMO SMS | 2h | Cursor agent |
| 5. SES domain verification | 30m | Granville (AWS console) |
| 6. SNS production access | 30m | Granville (AWS support) |
| 7. Sync to all Herus | 1h | `/sync-herus` |

**Total: ~9 hours of work across multiple agents**
