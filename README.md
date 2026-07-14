# Apex Performance Gear

A premium, high-contrast, e-commerce web application built with **Next.js**, **TypeScript**, **Tailwind CSS v4**, and raw **MySQL** queries. This project is created exactly from the provided "Mock-Up Stitch" designs.

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js (App Router, Turbopack enabled)
- **Language:** TypeScript (.ts & .tsx)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` configuration, no CDN dependencies, local font loading)
- **Database:** Raw MySQL (`mysql2` connection pool, no ORM, raw transactional SQL queries)
- **Iconography:** Local self-hosted Google Material Symbols Outlined
- **State Management:** React Context (Cart State synchronized to `localStorage`)

---

## 🚀 Getting Started

### 1. Install Dependencies
Run the following command at the root workspace:
```bash
npm install
```

### 2. Configure Database & Environment
By default, the application is designed to be **instantly runnable out-of-the-box**. 
- If MySQL is **not** running or not configured, the database client gracefully falls back to an **internal mock database**.
- Checkouts and order submissions completed during mock mode are recorded inside a local `.orders_fallback.json` file in your workspace directory.

To connect to a live MySQL instance:
1. Start your local MySQL server.
2. Execute the seeding script `db-seed.sql` to create the `apex_pitch` database and populate the listings:
   ```bash
   mysql -u root -p < db-seed.sql
   ```
3. Update the `.env.local` file at the root with your credentials:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=apex_pitch
   ```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🎨 Design System & Aesthetic Details

The app replicates the **"Sporty Premium / High-Contrast"** grid feel:
- **Palette:** Rooted in "Midnight Pitch" (deep charcoals and blacks) highlighted with "Electric Lime" (`#c3f400` / `#ccff00`) and "Neon Crimson" (`#FF003D`) status highlights.
- **Typography:**
  - **Barlow Condensed:** Used in uppercase italics for bold headers mimicking stadium lines.
  - **Inter:** For readable technical descriptions.
  - **JetBrains Mono:** For spec tables (grams, studs, materials) conveying precision lab-tested engineering.
- **Micro-Interactions & Assets:**
  - **All assets (images and fonts) are self-hosted locally** in `public/` to ensure offline capability and absolute privacy compliance.
  - **Interactive Size Selection Grid:** Direct hover selectors inside shop cards.
  - **Hotspot Breakdowns:** Multi-stud, cushioning, and lockdown heel diagram overlays on Women's fit charts.
  - **Synchronizing overlay:** Full screen animations tracking transaction commits during checkout orders.
  - **Database Status Badge:** Live connection state (MySQL Connected / Mock Fallback) displayed directly in the header navbar.
