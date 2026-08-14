# GTC (Garg Trading Company) - Corrugated Box Manufacturer

A modern, high-performance web platform for **Garg Trading Company (GTC)**, founded by **Sonu Garg** — direct manufacturer of custom corrugated boxes, shipping cartons, die-cut packaging, and custom printed brand boxes.

---

## 📍 Contact & Factory Information

* **Founder / Owner**: Sonu Garg (6+ Years Manufacturing Experience)
* **Factory Address**: 689/4 Madhavpuram, Delhi Road, Meerut, Uttar Pradesh - 250002
* **Phone / WhatsApp**: [+91 7060443193](tel:+917060443193)
* **Direct Email**: [garg00445@gmail.com](mailto:garg00445@gmail.com)
* **Google Maps Location**: [Open in Google Maps](https://maps.google.com/maps?q=28.954666137695312%2C77.69539642333984&z=17&hl=en)
* **Working Hours**: Monday – Saturday: 9:00 AM – 7:00 PM

---

## 🚀 Key Features & Updates

| # | Feature / Update | Implementation Details | Status |
|---|-------------------|------------------------|:------:|
| **1** | **Client Base & Metrics** | Updated to **250+ Happy Business Clients**, **6+ Years of Direct Manufacturing Experience**, **10 Lakh+ Boxes Shipped**, and **99% On-Time Delivery**. | **Completed ✅** |
| **2** | **Enhanced Video Visibility** | Background factory video (`/media/factory.mp4`) in Dark Mode enhanced with higher opacity (`0.88`), richer contrast/saturation, and softened shadow gradients for clear visibility. | **Completed ✅** |
| **3** | **Full Mobile Responsiveness** | Added animated mobile navigation drawer, hamburger menu toggle, minimum 44px touch targets, mobile-optimized 3D canvas, and iOS zoom prevention on inputs. | **Completed ✅** |
| **4** | **Branded Favicon & Logo** | Configured official GTC logo (`/images/logo/png-01.png`) across metadata and HTML `<head>`, replacing default Next.js tab icons. | **Completed ✅** |
| **5** | **Accurate Factory Contact** | Address: **689/4 Madhavpuram Delhi Road Meerut 250002**, Phone & WhatsApp: **7060443193**, Email: **garg00445@gmail.com**, plus interactive Google Maps embed. | **Completed ✅** |
| **6** | **Simple, Trustworthy Copy** | Honest manufacturer assurances focusing on strong paper, accurate box sizes, safe stacking, and prompt delivery without buzzwords. | **Completed ✅** |
| **7** | **Founder's Trust Quote** | *"Our promise is simple: strong boxes, fair factory prices, and on-time delivery. We treat every customer's order with personal care so your goods reach safely every time."* | **Completed ✅** |
| **8** | **Dark / Light Mode Toggle** | Interactive Sun/Moon theme switcher in navigation header. Full CSS design tokens for Dark Mode (`#0a0a09`) and Light Mode (`#f8f6f0`), persisted in `localStorage` and `html[data-theme]`. | **Completed ✅** |
| **9** | **Product Media Integration** | Mapped all genuine product images from `/images/product_img/` to the 8 product categories (Master Shippers, Printed Boxes, Die-Cut Boxes, E-commerce, Food Safe, Universal Slotters, Partitions). | **Completed ✅** |
| **10** | **Factory Floor Showcase** | Integrated all 5 high-resolution manufacturing photos from `/images/factory_img/` into an interactive gallery with full-screen Lightbox Modal and simple descriptions. | **Completed ✅** |
| **11** | **Interactive 3D Box Customizer** | Embedded real-time WebGL 3D Box Visualizer with 360° mouse drag rotation, Length/Width/Height sliders (Inches/CM/MM), volume metrics (Liters & in³), and 1-click sync to Quotation Form. | **Completed ✅** |
| **12** | **Direct Factory Quotation Engine** | Pre-populated specs from 3D studio, client-side validation, file upload support, direct Formspree / Email dispatch, and instant WhatsApp chat CTA. | **Completed ✅** |

---

## 📁 Media Asset Architecture & Organization

```
public/
├── images/
│   ├── logo/
│   │   └── png-01.png                          # Official GTC Brand Logo & Favicon
│   ├── owner_img/
│   │   └── WhatsApp Image 2026-08-13 at 10.55.51 PM.jpeg  # Sonu Garg (Founder)
│   ├── factory_img/
│   │   ├── WhatsApp Image 2026-08-13 at 10.39.31 PM.jpeg  # Corrugation Line
│   │   ├── WhatsApp Image 2026-08-13 at 10.51.27 PM.jpeg  # Die-Cutting Bed
│   │   ├── WhatsApp Image 2026-08-13 at 10.51.28 PM.jpeg  # Box Printing Press
│   │   ├── WhatsApp Image 2026-08-13 at 10.51.38 PM.jpeg  # Bundling & Stacking
│   │   └── WhatsApp Image 2026-08-13 at 10.51.40 PM (1).jpeg # Ready Dispatch Dock
│   └── product_img/
│       ├── Die cut box.png                     # Die-Cut Boxes
│       ├── printed box.png                     # Custom Printed Boxes
│       ├── img 33.png                          # Standard Cartons (RSC)
│       ├── Gemini_Generated_Image_2eekw32eekw32eek.png # Internal Partitions
│       ├── WhatsApp Image 2026-08-13 at 10.39.35 PM (1).jpeg # Master Shippers
│       ├── WhatsApp Image 2026-08-13 at 10.45.39 PM.jpeg     # E-Commerce Boxes
│       ├── WhatsApp Image 2026-08-13 at 10.47.09 PM.jpeg     # Food Outer Boxes
│       └── WhatsApp Image 2026-08-13 at 10.51.38 PM (4).jpeg # Heavy-Duty Boxes
└── media/
    └── factory.mp4                             # Ambient factory video (Dark mode)
```

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 15.1.6](https://nextjs.org/) (App Router)
* **UI & Core**: [React 19](https://react.dev/), [TypeScript 5.7](https://www.typescriptlang.org/)
* **3D Visuals**: [Three.js](https://threejs.org/) (`Box3DPreview.tsx`, `Atmosphere.tsx`)
* **Motion**: [GSAP 3.12](https://greensock.com/gsap/) with `ScrollTrigger`, [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll), [Framer Motion 11](https://www.framer.com/motion/)
* **Styling**: Vanilla CSS Modules with Dual-Theme Variables (`[data-theme="dark"]`, `[data-theme="light"]`)
* **Typography**: Google Fonts ([Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk))
* **Icons**: [React Icons (`react-icons/fa6`)](https://react-icons.github.io/react-icons/)

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Start production server**:
   ```bash
   npm run start
   ```

---

© 2026 Garg Trading Company (GTC). All Rights Reserved.
