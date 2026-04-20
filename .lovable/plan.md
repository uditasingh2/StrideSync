
# StrideSync — Phase 1 Implementation Plan

## Brand & Theme
**Name:** StrideSync — AI-Powered Smart Shoe Sole  
**Tagline:** "Walk Smarter. Move Better. Live Healthier."  
**Color System:**  
- 🌙 **Dark mode:** Deep navy/black background, indigo/electric blue/purple accents, glowing active elements  
- ☀️ **Light mode:** Soft pastels — lavender, mint, peach, light blue — with white backgrounds and subtle shadows  
- Theme toggle (dark/light) in the header/sidebar

---

## Pages in Phase 1

### 1. Landing Page
- Hero section with tagline, animated background, CTA buttons ("Get Started", "View Dashboard")
- Product benefits overview (3–4 cards: gait analysis, health alerts, doctor monitoring, personalized tips)
- Animated stats counter (steps analyzed, posture accuracy %, active users)
- Footer with newsletter signup, quick links (About, Blog, Help, Contact), legal links, clean minimal design

### 2. Features Page
- Alternating left/right layout sections (image + text)
- Three feature blocks:
  - **Smart Gait Analysis** — imbalance detection, AI pattern recognition, pressure mapping
  - **Health Notifications** — real-time alerts, daily goals, injury prevention
  - **Doctor Monitoring Dashboard** — remote monitoring, downloadable reports, secure access
- Each with bullet points, "Learn More" button, smooth hover animations

### 3. User Dashboard
- Collapsible sidebar navigation with icons and badges:
  - Dashboard, Step Analysis, Gait Patterns, Health Alerts, Doctor Consultation, Reports, Settings
- Dashboard content with vertical tabs (Overview, Daily Stats, Weekly Trends, Alerts, Recommendations)
- Cards: daily step count, gait health score, posture status (Normal/Warning/Critical), activity timeline
- Rich charts: weekly & monthly step trends (line/bar charts using Recharts)
- Dots loader animation for loading states

### 4. Analytics & Monitoring Page
- Foot sole pressure heatmap visualization (SVG-based)
- Walking symmetry charts (left vs right comparison)
- Trend analysis line charts
- AI-generated insight cards

---

## Phase 1 — NOT included (for later phases)
- Doctor/Physio Consultation page (booking, reports upload, role-based access)
- Supabase backend integration (auth, profiles, roles, real data)
- Device connection status & battery UI
- Real-time data from IoT devices

## Phase 1 Approach
All data will be **realistic mock data** with the UI fully built out. This lets us nail the design and UX first, then wire up Supabase (auth, database, roles) in Phase 2.

---

## Key UI Details
- **Sidebar:** Collapsible with mini icon mode, active route highlighting, badge counts on alerts
- **Charts:** Recharts with animated transitions, interactive tooltips, gradient fills
- **Loading:** 3 bouncing dots animation for all async states
- **Responsiveness:** Mobile-first, responsive sidebar (drawer on mobile)
- **Accessibility:** Proper ARIA labels, keyboard navigation, color contrast compliance
