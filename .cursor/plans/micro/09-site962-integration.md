# Epic 09: Site962 Multi-Product Integration

**Priority:** HIGH
**Platform:** QuikNation (Auset)
**Description:** Expand Site962 from a QuikEvents venue into the ultimate Auset Platform proving ground — every Heru product running at one physical location, capturing all revenue streams.

---

## Story 09.1: Site962 Unified App Architecture

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Auset Platform features activated

### Description
Design the unified Site962 app that integrates multiple QuikNation products into one experience for visitors and vendors.

### Acceptance Criteria
- [ ] Create `frontend/src/app/site962/` directory in Auset boilerplate
- [ ] Unified dashboard: all Site962 services in one view
- [ ] Service tabs: Events, Barber, Food Court, Car Rental, Payments
- [ ] Shared auth: one login accesses all services
- [ ] Shared payment profile: one Stripe customer ID across all services
- [ ] Dual payment profile: Stripe customer ID + Yapit account for visitors
- [ ] Deep links from site962.com to each service section
- [ ] Mobile-responsive (visitors will use phones on-site)
- [ ] Product config: `site962.auset.ts` defining which features are active

### Files to Create
```
backend/src/features/products/site962.auset.ts
frontend/src/app/site962/
  page.tsx
  layout.tsx
  events/page.tsx
  barber/page.tsx
  food-court/page.tsx
  car-rental/page.tsx
  payments/page.tsx
```

---

## Story 09.2: Site962 QuikBarber Integration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 09.1, Auset `booking` feature

### Description
Collect revenue from barbers working at Site962. Appointment booking, barber profiles, payment processing through the platform.

### Acceptance Criteria
- [ ] Barber profiles: name, specialties, availability, photos, rating
- [ ] Online appointment booking with time slot selection
- [ ] Walk-in queue management (check in on arrival)
- [ ] Payment processing: customer pays through app, platform fee collected
- [ ] Barber payout: Stripe Connect — barber receives payment minus platform fee
- [ ] Service menu: haircuts, beard trims, etc. with pricing
- [ ] Revenue dashboard for Site962 management
- [ ] Customer reviews per barber
- [ ] Yapit Quick Pay as alternative payment method for barber services
- [ ] Push notification: "Your barber is ready"

### Files to Create
```
frontend/src/app/site962/barber/
  page.tsx
  [barberId]/page.tsx
  book/page.tsx
frontend/src/components/site962/barber/
  BarberGrid.tsx
  BarberProfile.tsx
  BookingCalendar.tsx
  WalkInQueue.tsx
  BarberPayoutDashboard.tsx
```

---

## Story 09.3: Site962 Food Court Integration

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 09.1, Auset `checkout` feature

### Description
Food court ordering — browse vendors, order food, pay through the app. On-site pickup or delivery within the venue.

### Acceptance Criteria
- [ ] Vendor profiles: name, menu, hours, location within Site962
- [ ] Menu browsing with photos, descriptions, prices
- [ ] Cart system: order from multiple vendors in one checkout
- [ ] Payment: Stripe Connect — each vendor is a connected account
- [ ] Order status: placed → preparing → ready for pickup
- [ ] Push notification: "Your order is ready at [vendor]"
- [ ] QuikDelivers integration: delivery within the venue
- [ ] Yapit payment acceptance alongside Stripe for food court vendors
- [ ] Revenue dashboard per vendor and for Site962 management

### Files to Create
```
frontend/src/app/site962/food-court/
  page.tsx
  [vendorId]/page.tsx
  cart/page.tsx
  orders/page.tsx
frontend/src/components/site962/food-court/
  VendorGrid.tsx
  MenuBrowser.tsx
  FoodCart.tsx
  OrderStatus.tsx
```

---

## Story 09.4: Site962 QuikCarRental Pickup/Dropoff

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 09.1

### Description
Site962 as a QuikCarRental pickup and dropoff location. Car owners drop off vehicles, renters pick up vehicles — all managed through the platform.

### Acceptance Criteria
- [ ] Site962 listed as a QuikCarRental location
- [ ] Available vehicles at Site962 with photos and pricing
- [ ] Booking flow: select vehicle, dates, pickup at Site962
- [ ] Owner portal: list vehicle for rental at Site962
- [ ] Check-in/check-out flow: vehicle inspection, key handoff
- [ ] Integration with QuikCarRental vehicle-management feature
- [ ] Parking spot management: which spots are for rental vehicles
- [ ] Revenue tracking for Site962 location

### Files to Create
```
frontend/src/app/site962/car-rental/
  page.tsx
  vehicles/page.tsx
  book/[vehicleId]/page.tsx
frontend/src/components/site962/car-rental/
  AvailableVehicles.tsx
  VehicleBooking.tsx
  CheckInOut.tsx
  OwnerPortal.tsx
```

---

## Story 09.5: Site962 QuikCarry Driver Onboarding

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 09.1

### Description
Site962 as a QuikCarry driver onboarding and vehicle inspection center.

### Acceptance Criteria
- [ ] Driver application flow: apply to become a QuikCarry driver
- [ ] Vehicle inspection appointment booking at Site962
- [ ] Inspection checklist: digital form for inspector to complete
- [ ] Document upload: driver's license, insurance, registration
- [ ] Background check integration
- [ ] Onboarding status tracking: applied → documents submitted → inspection scheduled → inspection passed → active
- [ ] Notification: "Your inspection appointment is tomorrow at Site962"

### Files to Create
```
frontend/src/app/site962/driver-onboarding/
  page.tsx
  apply/page.tsx
  inspection/page.tsx
  status/page.tsx
frontend/src/components/site962/driver-onboarding/
  DriverApplication.tsx
  InspectionScheduler.tsx
  InspectionChecklist.tsx
  OnboardingStatus.tsx
```

---

## Story 09.6: Site962 QuikDollars NFC/QR Payments

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 09.1, Auset `nfc` and `qr-codes` features

### Description
QuikDollars NFC and QR payment processing across all Site962 services. One wallet, works everywhere on-site.

### Acceptance Criteria
- [ ] QuikDollars wallet setup for Site962 visitors
- [ ] NFC tap-to-pay at barber, food court, events
- [ ] QR code payment: scan vendor QR to pay
- [ ] Transaction history: see all Site962 purchases in one place
- [ ] Balance/top-up: add funds to QuikDollars wallet
- [ ] Yapit top-up option for QuikDollars wallet (alongside Stripe)
- [ ] Yapit Cards integration for physical card payments on-site
- [ ] Vendor payout: Stripe Connect for each vendor
- [ ] Platform fee collection on every transaction
- [ ] Daily/weekly revenue reports for Site962 management

### Files to Create
```
frontend/src/app/site962/payments/
  page.tsx
  wallet/page.tsx
  history/page.tsx
frontend/src/components/site962/payments/
  QuikDollarsWallet.tsx
  NFCPayment.tsx
  QRPayment.tsx
  TransactionHistory.tsx
  TopUp.tsx
```
