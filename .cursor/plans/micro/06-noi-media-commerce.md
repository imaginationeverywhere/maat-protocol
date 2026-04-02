# Epic 06: NOI Media & Commerce Platform

**Priority:** HIGH
**Platform:** NOI (Sovereign)
**Description:** Unify The Final Call, store.finalcall.com, media.noi.org, and Nation At Work into one commerce and media ecosystem. Self-hosted streaming immune to deplatforming.

---

## Story 06.1: The Final Call Digital News Platform

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03 (NOI Platform Core)

### Description
Rebuild The Final Call news platform — currently fragmented across finalcall.com, new.finalcall.com, and finalcalldigital.com. Unify into one modern news platform.

### Acceptance Criteria
- [ ] News article CMS: create, edit, publish, schedule articles
- [ ] Article categories: national, international, health, education, economic, opinion, columns
- [ ] Author profiles for journalists and columnists
- [ ] Featured articles and editor's picks
- [ ] Search across all articles (full-text search)
- [ ] Related articles recommendations
- [ ] Social sharing (to platforms that haven't banned NOI)
- [ ] Print edition digital archive (PDF viewer)
- [ ] RSS feed for syndication
- [ ] SEO optimized: Open Graph, Twitter Cards, JSON-LD
- [ ] Integration with Ali AI: "Summarize this week's Final Call" or "What has The Final Call reported about [topic]?"

### Files to Create
```
ali-platform/backend/src/modules/final-call/
  index.ts
  article.service.ts
  article.types.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
ali-platform/frontend/src/app/news/
  page.tsx
  [slug]/page.tsx
  categories/[category]/page.tsx
ali-platform/frontend/src/components/news/
  ArticleCard.tsx
  ArticleDetail.tsx
  ArticleSearch.tsx
  FeaturedArticles.tsx
  CategoryNav.tsx
  AuthorProfile.tsx
```

---

## Story 06.2: Final Call Subscription System

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 06.1

### Description
Subscription management for The Final Call — print and digital. Currently at subscribe.finalcall.com — bring into the unified platform.

### Acceptance Criteria
- [ ] Subscription tiers: digital-only, print-only, digital+print, gift subscription
- [ ] Stripe subscription integration (NOI's own Stripe account)
- [ ] Subscription management: upgrade, downgrade, cancel, pause
- [ ] Digital access: read current and archived editions online
- [ ] Print delivery address management
- [ ] Gift subscription flow with personalized message
- [ ] Renewal reminders via email/push
- [ ] Subscriber dashboard: manage subscription, payment history, delivery status
- [ ] Admin: subscriber analytics, churn tracking, revenue reports
- [ ] Yapit payment option alongside Stripe for international subscribers
- [ ] International subscribers (Caribbean, Africa, etc.) routed through Yapit

### Files to Create
```
ali-platform/backend/src/modules/final-call/subscriptions/
  index.ts
  subscription.service.ts
  stripe-integration.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/components/subscriptions/
  SubscriptionPlans.tsx
  SubscriptionCheckout.tsx
  SubscriptionManagement.tsx
  GiftSubscription.tsx
```

---

## Story 06.3: NOI Commerce Store (Final Call Store Unified)

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03

### Description
Rebuild store.finalcall.com as an integrated commerce platform. Books, MP3s, CDs, DVDs, Study Guides, bean pies, Clean N Fresh, Fashahnn.

### Acceptance Criteria
- [ ] Product catalog: books, audio, video, clothing, food, skincare
- [ ] Product categories matching existing store: Books (78+ titles), Literature, Audio, Video
- [ ] Product detail pages with images, description, pricing
- [ ] Shopping cart and checkout (Stripe — NOI's account)
- [ ] Digital product delivery (MP3, PDF downloads after purchase)
- [ ] Physical product shipping (Shippo integration)
- [ ] Featured products: Message to the Blackman, How to Eat to Live, Study Guides
- [ ] Search and filter by category, author, format
- [ ] Reviews and ratings
- [ ] Inventory management
- [ ] Order tracking
- [ ] Dual payment processing: Stripe (domestic) + Yapit (international)
- [ ] Yapit enables global commerce — ship books and products worldwide with payment support Stripe can't offer in some regions

### Files to Create
```
ali-platform/backend/src/modules/store/
  index.ts
  product.service.ts
  order.service.ts
  store.types.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
ali-platform/frontend/src/app/store/
  page.tsx
  [productSlug]/page.tsx
  cart/page.tsx
  checkout/page.tsx
  orders/page.tsx
ali-platform/frontend/src/components/store/
  ProductGrid.tsx
  ProductCard.tsx
  ProductDetail.tsx
  ShoppingCart.tsx
  Checkout.tsx
  OrderTracking.tsx
```

---

## Story 06.4: Nation At Work Business Directory

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03

### Description
Expand nationatwork.org into a full business directory and marketplace for Black Muslim-owned businesses and community businesses.

### Acceptance Criteria
- [ ] Business listing: name, description, category, location, contact, website
- [ ] Business categories: food, clothing, health, education, professional services, etc.
- [ ] Search by category, location, keyword
- [ ] Map view: find businesses near you
- [ ] Business owner portal: claim and manage listing
- [ ] Reviews and ratings from community
- [ ] Featured businesses
- [ ] "Support Black Business" badges for verified businesses
- [ ] Integration with Three-Year Economic Program tracking
- [ ] Business-to-business connections (supply chain)
- [ ] Open to ALL Black businesses, not just NOI-owned (community layer)

### Files to Create
```
ali-platform/backend/src/modules/nation-at-work/
  index.ts
  business.service.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
ali-platform/frontend/src/app/businesses/
  page.tsx
  [businessSlug]/page.tsx
ali-platform/frontend/src/components/businesses/
  BusinessDirectory.tsx
  BusinessCard.tsx
  BusinessDetail.tsx
  BusinessMap.tsx
  BusinessOwnerPortal.tsx
```

---

## Story 06.5: Self-Hosted Video & Streaming Platform

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Epic 03

### Description
Build self-hosted video/audio streaming to replace dependency on YouTube/Facebook. Currently at media.noi.org — enhance and fully own. This is CRITICAL for deplatforming resilience.

### Acceptance Criteria
- [ ] Video hosting: upload, transcode, store, stream (AWS S3 + CloudFront or Cloudflare Stream)
- [ ] Audio hosting: lectures, sermons, podcasts
- [ ] Live streaming capability: RTMP ingest, HLS output
- [ ] Video player: adaptive bitrate, quality selection, playback speed
- [ ] Content categories: lectures, Saviours' Day, study groups, historical
- [ ] Search across all video/audio content
- [ ] Playlists and series (e.g., "The Time and What Must Be Done" 58-part series)
- [ ] Download for offline viewing (member benefit)
- [ ] Transcript generation (automatic) for searchability
- [ ] Integration with Ali AI: "Find the lecture where the Honorable Minister Farrakhan spoke about [topic]"
- [ ] NO dependency on YouTube, Facebook, or any platform that could deplatform

### Files to Create
```
ali-platform/backend/src/modules/media/
  index.ts
  media.service.ts
  streaming.service.ts
  transcoding.service.ts
  media.types.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
ali-platform/frontend/src/app/media/
  page.tsx
  [mediaId]/page.tsx
  live/page.tsx
ali-platform/frontend/src/components/media/
  VideoPlayer.tsx
  AudioPlayer.tsx
  MediaLibrary.tsx
  MediaSearch.tsx
  LiveStream.tsx
  PlaylistView.tsx
  SeriesView.tsx
```

---

## Story 06.6: Muhammad Farms Supply Chain

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 06.4

### Description
Digital supply chain management for Muhammad Farms — tracking produce from farm to mosques across 35+ cities.

### Acceptance Criteria
- [ ] Farm production tracking: crops, quantities, harvest dates
- [ ] Distribution routes: farm → regional hubs → mosques → communities
- [ ] Order system: mosques can order produce for their community
- [ ] Delivery tracking with status updates
- [ ] Inventory at each distribution point
- [ ] Seasonal availability calendar
- [ ] Revenue reporting for Muhammad Farms
- [ ] Products: whole wheat flour, watermelons, vegetables, wheat, field corn, peanuts
- [ ] Integration with Nation At Work for community sales

### Files to Create
```
ali-platform/backend/src/modules/muhammad-farms/
  index.ts
  farm.service.ts
  supply-chain.service.ts
  schema.graphql
  resolvers.ts
  feature.config.ts
ali-platform/frontend/src/components/farms/
  FarmDashboard.tsx
  ProductionTracker.tsx
  DistributionMap.tsx
  OrderSystem.tsx
  DeliveryTracking.tsx
```

---

## Story 06.7: Saviours' Day Event Platform

**Agent-Executable:** YES
**Estimated Scope:** Single agent session
**Dependencies:** Story 04.4

### Description
Dedicated event management for Saviours' Day — the annual multi-day convention celebrating the birth of Master Fard Muhammad (February 26).

### Acceptance Criteria
- [ ] Multi-day event schedule: plenary sessions, workshops, keynote, drill competition
- [ ] Registration and ticketing (Stripe — NOI account)
- [ ] Salaam Expo vendor management (marketplace/bazaar)
- [ ] Hotel/travel coordination links
- [ ] Live streaming integration for remote attendees
- [ ] FOI Drill Competition bracket and scoring
- [ ] Children's Village coordination (Mother Khadijah Farrakhan's)
- [ ] Historical archive: past Saviours' Day keynotes and events
- [ ] Push notifications during event: "Keynote starting in 15 minutes"
- [ ] Photo/video gallery from event
- [ ] International attendee registration via Yapit (for those traveling from Caribbean/Africa/global)
- [ ] Vendor payment via Yapit for international Salaam Expo vendors

### Files to Create
```
ali-platform/backend/src/modules/saviours-day/
  index.ts
  saviours-day.service.ts
  schema.graphql
  resolvers.ts
ali-platform/frontend/src/app/saviours-day/
  page.tsx
  schedule/page.tsx
  register/page.tsx
  expo/page.tsx
  live/page.tsx
ali-platform/frontend/src/components/saviours-day/
  SavioursDaySchedule.tsx
  SavioursDayRegistration.tsx
  SalaamExpo.tsx
  DrillCompetitionBracket.tsx
  SavioursDayArchive.tsx
```
