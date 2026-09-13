# Amberstone Frontend Web — Airbnb-Grade Real Estate Discovery & Property Intelligence Operating System

Amberstone is India's Property Intelligence Operating System, anchored to 14-digit **ULPIN** (Unique Land Parcel Identification Number) cadastral records and mandatory **80-point physical civil engineer audits**. This frontend matches the 1:1 design and UX patterns of **Airbnb** (`airbnb.co.in`), transforming the broken broker lead-generation model into an editorial, visual-first discovery experience.

---

## 1. Core Architecture & UX Alignment (1:1 Airbnb Parity)

| Airbnb UX Pattern | Amberstone Implementation | Component |
| :--- | :--- | :--- |
| **Floating Expandable Pill Search Bar** | Where (Locality / ULPIN) · Timeline · Config & Budget (BHK / Max ₹) | [`ExpandablePillSearch.tsx`](src/components/navigation/ExpandablePillSearch.tsx) |
| **Horizontal Category Rail with Paddles** | Direct Owner, 3D Twins, Top AVM Deals, Trust Pass Elite, Gated Societies, RERA Approved | [`CategoryRail.tsx`](src/components/navigation/CategoryRail.tsx) |
| **14-Point Filter Modal** | 14 parameters including Civil Trust Score, Water Supply (Cauvery/Borewell), Facing/Vastu, etc. | [`FilterModal.tsx`](src/components/navigation/FilterModal.tsx) |
| **Edge-Rounded 4:3 Photo Carousel Cards** | Dot indicators, next/prev chevrons, favorite heart with pop animation, 3D badges, AVM tags | [`PropertyCard.tsx`](src/components/listings/PropertyCard.tsx) |
| **Synchronized List-to-Map Split View** | Interactive vector cartography with price pills (`₹1.85 Cr`), card hover highlighting & popup preview | [`MapSplitView.tsx`](src/components/listings/MapSplitView.tsx) & [`PriceMarker.tsx`](src/components/listings/PriceMarker.tsx) |
| **5-Photo Bento Grid & Lightbox** | 1 large primary + 4 supporting room photos + "Show all photos" lightbox gallery | [`BentoGallery.tsx`](src/components/pdp/BentoGallery.tsx) |
| **80-Point Inspection Radar** | Review-style breakdown across 5 dimensions: Structural RCC, Moisture, Electrical, Finishes, Cadastral | [`InspectionRadar.tsx`](src/components/pdp/InspectionRadar.tsx) |
| **Interactive 3D Spatial Digital Twin** | Three.js WebGL spatial container with room switcher (Living, Master, Kitchen, Balcony) & LiDAR measuring tools | [`ThreeTwinViewer.tsx`](src/components/pdp/ThreeTwinViewer.tsx) |
| **Kaveri 2.0 Encumbrance Deed Chain** | 30-year sub-registrar deed timeline, clean EC Form 15 verification, and ULPIN copy capsule | [`EncumbranceDeedChain.tsx`](src/components/pdp/EncumbranceDeedChain.tsx) |
| **Sticky Booking & Escrow Widget** | Price breakdown (stamp duty, registration, maintenance) + ₹299 Single PIP / ₹999 Trust Pass unlock CTAs | [`StickyEscrowWidget.tsx`](src/components/pdp/StickyEscrowWidget.tsx) |
| **"Airbnb your home" Owner Onboarding** | Real-time LightGBM valuation & rental yield estimator, 3-step onboarding visualizer & portal comparison table | [`list-property/page.tsx`](src/app/list-property/page.tsx) |
| **Trust Pass Entitlements Dashboard** | ₹299 single PIP vs ₹999 monthly Trust Pass paywall with instant escrow simulation and unmasking | [`trust-pass/page.tsx`](src/app/trust-pass/page.tsx) |

---

## 2. Page Directory

- **`/` — Discovery & Explore Homepage:**
  - Sticky glassmorphic header with `Buy` / `Rent (0% Brokerage)` / `3D Twins` switcher.
  - Signature floating 3-segment pill search bar.
  - Horizontal scrolling category rail with active indicators and Lucide SVG icons.
  - 4-column responsive listing grid of verified properties.
  - Floating bottom pill: `"Show map 🗺️"` / `"Show list 📋"` toggling between full grid and 50/50 side-by-side split view.

- **`/property/[slug]` — Property Detail Page (PIP Landing):**
  - High-resolution 5-photo bento grid with fullscreen lightbox.
  - Owner & DigiLocker verification snapshot with response time guarantee.
  - 80-Point civil audit scorecard and key NDT findings (rebound hammer compressive strength, FLIR thermal moisture levels).
  - Embedded Three.js 3D spatial room walkthrough with dimensions and wireframe toggles.
  - Kaveri 2.0 30-year deed chain and cadastral ULPIN mapping.
  - PostGIS neighbourhood radius metrics (Metro distance, schools, hospitals, water security).
  - Sticky reservation/escrow card with instant Trust Pass unlock modal simulation.

- **`/list-property` — Owner Onboarding Landing ("Amberstone Your Property"):**
  - Interactive AVM fair market valuation & rental yield calculator.
  - 3-step guided visualizer (DigiLocker deed match -> 24h civil engineer dispatch -> verified buyer token escrow).
  - Comprehensive comparison matrix (Amberstone vs 99acres/Magicbricks vs Local Street Brokers).

- **`/trust-pass` — Trust Pass Pricing & Entitlements Dashboard:**
  - Single PIP Pass (₹299) vs Monthly All-Access Pass (₹999/mo).
  - 100% money-back civil inspection accuracy guarantee.

- **`/search` — Live Filtered Discovery & Split Map View:**
  - Query parameters synchronization (`locality`, `mode`, `bhk`, `category`).
  - Side-by-side synchronized map and listings layout.

---

## 3. Technology Stack

- **Framework:** Next.js 16.3.5 (App Router, Turbopack)
- **Language:** TypeScript 7
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4.3 with custom Airbnb tokens (`--brand-coral`, `--trust-navy`, `--verify-emerald`)
- **Spatial 3D:** Three.js (WebGL renderer for spatial digital twin room visualization)
- **Icons:** Lucide React
- **Package Manager & Runtime:** Bun 1.4.2 / Node.js 24

---

## 4. Getting Started

### Development
```bash
cd C:\Freelance\namasethu-frontend-web
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build
```bash
bun run build
bun run start
```
