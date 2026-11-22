# Sanjay — Personal Portfolio

A pixel-perfect personal developer portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **shadcn/ui**. Personalized from an open-source portfolio template to represent me — a third-year Computer Science Engineering student at MSAJCE, Chennai.

---

## 🌐 Live Site

> Run locally at **http://localhost:3000** after setup.

---

## 👤 About Me

Hi, I'm **Sanjay**, a third-year B.E. Computer Science and Engineering student at **Mohamed Sathak A.J. College of Engineering (MSAJCE)**, Chennai, Tamil Nadu, India.

I'm passionate about modern web development and currently learning **React** while exploring **Next.js**, **Vite**, and AI-powered development tools like Claude, Cursor, and Kiro.

---

## 📄 Portfolio Sections

| Section | Description |
|---|---|
| **Hero** | Name, animated rotating taglines, avatar |
| **Overview** | Location (Chennai), local IST time |
| **Social Links** | GitHub, LinkedIn, X |
| **About** | Personal bio — who I am and what I'm learning |
| **Skills** | Tech stack grouped by category |
| **Education** | MSAJCE B.E. CSE — third year |
| **Contact** | Social links + animated signature card |

---

## 🛠️ Tech Stack

### Programming Languages
- Python
- Java

### Frontend
- HTML · CSS
- React *(current learning focus)*
- Next.js · Vite
- shadcn/ui · Tailwind CSS

### Backend & Database
- Node.js
- MongoDB

### AI & Dev Tools
- Claude · Cursor · Kiro
- Gemini · ChatGPT

### Workflow & Version Control
- Git · GitHub

### UI/UX Design
- Figma

---

## ✨ Features

- **Clean minimal design** — dark/light theme support
- **Animated signature card** — interactive `<ApprovedBySanjay />` component with:
  - Calligraphic SVG signature animation with glowing pen tip
  - Auto-play on mount with replay
  - Freehand drawing mode (mouse, touch, stylus)
  - Canvas-based overlay with pressure sensitivity
- **Animated taglines** — rotating hero subtitles
- **Responsive layout** — mobile, tablet, and desktop
- **SEO optimized** — metadata, Open Graph, JSON-LD structured data
- **Smooth scroll navigation** — anchor-based nav links
- **TypeScript** throughout
- **Dark & light themes** — system preference aware

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 22 (managed via [fnm](https://github.com/Schniz/fnm))
- pnpm 12.4.2
- Git

### Setup

**1. Open PowerShell** (not CMD) and activate fnm:

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

**2. Navigate to the project:**

```powershell
cd "e:\500054\Downloads\chanhdai.com-main\chanhdai.com-main"
```

**3. Install dependencies:**

```powershell
pnpm install
```

**4. Create environment file:**

```powershell
Copy-Item .env.example .env.local
```

**5. Start the development server:**

```powershell
pnpm dev
```

Open **http://localhost:3000** in your browser.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm check-types` | Run TypeScript type check |
| `pnpm lint` | Run ESLint |
| `pnpm format:check` | Check Prettier formatting |
| `pnpm format:write` | Auto-fix Prettier formatting |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/
│   │   ├── page.tsx              # Home page — all portfolio sections
│   │   └── layout.tsx            # App shell — header, footer, bottom nav
│   └── layout.tsx                # Root layout — metadata, fonts, providers
├── components/
│   ├── approved-by-sanjay.tsx    # ✨ Animated signature card component
│   ├── site-header.tsx           # Top navigation bar
│   ├── site-footer-cad.tsx       # Footer with build info and links
│   └── site-bottom-nav.tsx       # Mobile floating bottom nav
├── config/
│   ├── site.ts                   # Nav items, site info, constants
│   └── json-ld.ts                # JSON-LD structured data config
├── features/portfolio/
│   ├── components/
│   │   ├── profile-header.tsx    # Hero — name, avatar, taglines
│   │   ├── hello.tsx             # About section
│   │   ├── tech-stack.tsx        # Skills grid
│   │   ├── education/            # Education timeline
│   │   ├── contact.tsx           # ✨ Contact section with signature card
│   │   └── overview/             # Location, time, social items
│   └── data/
│       ├── user.ts               # ✏️ All personal info — edit here
│       ├── education.ts          # ✏️ Education entries
│       ├── tech-stack.tsx        # ✏️ Tech stack items
│       └── social-links.ts       # ✏️ Social profile links
└── styles/
    └── globals.css               # Tailwind CSS v4 global styles
```

> **✏️ marks files you'll edit** to update your personal content.

---

## ✏️ Personalizing the Content

All personal data lives in a few files — no need to touch components:

**Update your info** → `src/features/portfolio/data/user.ts`
```ts
displayName: "Sanjay"
bio: "CS student learning to build for the web."
address: "Chennai, Tamil Nadu, India"
taglines: [ ... ]
about: `...`
```

**Update education** → `src/features/portfolio/data/education.ts`

**Update tech stack** → `src/features/portfolio/data/tech-stack.tsx`

**Update social links** → `src/features/portfolio/data/social-links.ts`
```ts
github: { handle: "your-username", href: "https://github.com/your-username" }
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` and fill in as needed:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional — GitHub API token for star counts
GITHUB_API_TOKEN=

# Optional — OpenPanel analytics
NEXT_PUBLIC_OPENPANEL_CLIENT_ID=

# Optional — Discord feedback webhook
DISCORD_FEEDBACK_WEBHOOK_URL=
```

Most variables are optional. The site runs fully without any API keys.

---

## 🏗️ Built With

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.4.6 | React framework |
| [React](https://react.dev) | 19.3.1 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 6.0.3 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Styling |
| [shadcn/ui](https://ui.shadcn.com) | — | UI components |
| [Lucide React](https://lucide.dev) | ^1.66.0 | Icons |
| [Geist](https://vercel.com/font) | ^1.9.0 | Typography |
| [Motion](https://motion.dev) | ^13.4.0 | Animations |
| [pnpm](https://pnpm.io) | 12.4.2 | Package manager |

---

## 🙏 Credits

This portfolio was built by personalizing the open-source portfolio by [Nguyen Chanh Dai](https://github.com/ncdai/chanhdai.com), which is licensed under the MIT License.

The `<ApprovedBySanjay />` animated signature card is a custom component built for this portfolio.

---

## 📄 License

MIT License — feel free to fork and adapt for your own portfolio.
If you use this as a base, please swap out all personal information before publishing.

---

<p align="center">Made with ❤️ by Sanjay · Chennai, Tamil Nadu, India</p>
