# Site 962 Mobile App — React Native (Expo)

**Priority:** CRITICAL — Mo's directive March 27, 2026
**Central Feature:** Digital pass scanning at the door
**Platform:** React Native + Expo (same as all Herus)
**Build:** EAS local builds on QCS1 (QuikSession LLC Apple account)

---

## What Site 962 IS (and is NOT)

**IS:** A single venue app for Site 962 in Atlanta. ONE venue. Events, food, barber, tickets.
**IS NOT:** A venue finder. NOT a multi-venue platform. NOT QuikEvents.

---

## Two User Types, Two Experiences

### Customer (event-goer)
Opens the app to: buy tickets, show passes at the door, order food, book barber

### Staff (Quik + door staff + vendors)
Opens the app to: scan passes, approve events, manage POS, check orders

Role detected from Clerk auth. Same app, different views.

---

## Screens

### Tab Navigation (Customer)

| Tab | Screen | What It Does |
|-----|--------|-------------|
| **Home** | Upcoming events at Site 962 | Event cards with date, price, buy button |
| **Tickets** | My purchased tickets | List of passes with QR codes. Tap to show full-screen pass. Add to Apple Wallet / Google Wallet |
| **Food** | Food court vendors + menus | Browse, add to cart, order, track status |
| **Barber** | Barber profiles + booking | See barbers, ratings, available slots, book appointment |
| **Profile** | Account, payment methods, settings | Clerk auth, saved cards, notification prefs |

### Tab Navigation (Staff — role-based)

| Tab | Screen | What It Does |
|-----|--------|-------------|
| **Scanner** | QR code scanner | Camera opens → scan pass → validate → green/red result. THE #1 feature. |
| **Events** | Event management | Quik: approve/reject pending events. Staff: see tonight's event details |
| **Orders** | Food orders queue | Vendors see incoming orders, mark preparing/ready |
| **Check-in** | Attendance tracker | Live count of scanned passes. Who's checked in. |
| **Settings** | Staff settings | Device POS config, printer, shift management |

---

## Digital Pass Scanning (THE Core Feature)

### How It Works

1. **Customer arrives at venue**
2. Customer opens app → Tickets tab → taps their ticket → full-screen QR code
   - OR customer opens Apple Wallet → shows the .pkpass
   - OR customer shows SMS link on any browser
3. **Staff opens app → Scanner tab**
4. Camera activates → points at QR code
5. App sends QR data to backend: `POST /api/tickets/{ticketId}/validate`
6. Backend checks: Is this ticket valid? Has it been used? Is it for tonight's event?
7. Result displays on staff phone:
   - **GREEN checkmark + chime** = Valid. "Welcome! General Admission" or "VIP — Section B"
   - **RED X + buzz** = Invalid. Shows reason: "Already scanned", "Wrong event", "Expired"
8. Backend marks ticket as `used` with timestamp

### Offline Mode
- Before event starts, staff app downloads all valid ticket IDs for tonight's event
- Scanner works WITHOUT internet (validates against local cache)
- Syncs results when connection returns
- Critical for venues with poor cell reception

### Scanner Tech
- `expo-camera` for QR scanning
- `expo-barcode-scanner` as fallback
- Support: QR codes (our passes) AND barcodes (legacy PassKit passes during transition)

---

## Apple Wallet + Google Wallet Integration

### Customer Flow
1. Buy ticket → receive SMS with pass link
2. Open link → see ticket with "Add to Apple Wallet" button
3. Tap → .pkpass installs in Apple Wallet
4. At venue → open Wallet app → show pass to staff
5. Staff scans the barcode ON the Wallet pass (same scanner)

### Mobile App Integration
- `expo-passkit` or deep link to .pkpass URL for Apple Wallet
- Google Wallet: `expo-linking` to wallet.google.com save URL
- Tickets tab shows "Added to Wallet" badge when pass is installed

---

## Voice Agent (Clara)

- Floating microphone button on Home screen
- Tap → connects to LiveKit room → Clara answers
- "I want 2 VIP tickets for Saturday" → Clara handles purchase
- "Book me a fade at 3pm" → Clara books barber
- "What's on the menu?" → Clara reads food options

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React Native + Expo SDK 52+ |
| UI | Tamagui (already used in existing mobile/) |
| Navigation | Expo Router (file-based) |
| State | Apollo Client (GraphQL) |
| Auth | Clerk React Native SDK |
| Scanner | expo-camera + expo-barcode-scanner |
| Wallet | expo-passkit (Apple) + expo-linking (Google) |
| Voice | @livekit/react-native |
| Push | expo-notifications |
| Maps | Apple Maps (iOS) via react-native-maps |

---

## Build + Deploy

- EAS local builds on QCS1 (QuikSession LLC account)
- TestFlight for iOS beta
- Internal distribution for Android
- App name: "Site 962"
- Bundle ID: com.quiknation.site962

---

## Implementation Stories

### Story 1: Scaffold + Navigation (2 hours)
- Expo Router tab layout (customer tabs + staff tabs)
- Clerk auth integration
- Role detection (customer vs staff)
- Apollo Client pointing to backend GraphQL

### Story 2: Home + Event Detail (2 hours)
- Upcoming events list (GraphQL query)
- Event detail page with Buy Ticket button
- Stripe checkout for ticket purchase

### Story 3: Tickets + Pass Display (3 hours) — THE CRITICAL ONE
- My Tickets list from GraphQL
- Full-screen QR code display
- Add to Apple Wallet button (.pkpass download)
- Add to Google Wallet button (save link)
- Pass details: event name, date, time, seat/section

### Story 4: Scanner (3 hours) — THE OTHER CRITICAL ONE
- Camera-based QR scanner (staff only)
- Validate against backend API
- Green/red result with sound
- Offline mode with pre-cached ticket IDs
- Scan history log

### Story 5: Food Court (2 hours)
- Vendor list + menus
- Cart + order placement
- Order status tracking (real-time)

### Story 6: Barber Booking (2 hours)
- Barber profiles with photos + ratings
- Available time slots
- Appointment booking + confirmation

### Story 7: Voice Agent (1 hour)
- LiveKit button on home screen
- Voice connection to Clara
- Same functionality as web voice agent

### Story 8: Push Notifications (1 hour)
- Event reminders (day before, 1 hour before)
- Order ready notifications
- Appointment reminders
- Ticket purchase confirmation

### Story 9: Build + TestFlight (1 hour)
- EAS config for Site 962
- Build on QCS1
- Submit to TestFlight
- Internal Android distribution

**Total: ~17 hours of agent work**

---

## What This Replaces

No more "show me your email confirmation." No more paper lists at the door. No more "I can't find my ticket." Customer opens their phone. Staff scans. Done.
