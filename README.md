# Rae — Personal Portfolio

A modern, responsive personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Features an interactive introduction gate, smooth animations, and a clean, professional design.

## ✨ Features

- **🎨 Modern UI/UX** - Clean, minimal design with smooth animations
- **🌓 Dark Mode** - System-aware dark mode with manual toggle
- **📱 Fully Responsive** - Optimized for all screen sizes
- **🎭 Interactive Intro Gate** - Long-press avatar to unlock portfolio (with haptic feedback)
- **🎬 Smooth Animations** - Scroll-triggered animations using Animate.css and Intersection Observer
- **🖼️ Photo Positioning** - Config-driven defaults for production; in dev, drag/zoom to adjust, then sync via `src/config/photoPosition.ts`
- **⚡ Fast & Optimized** - Built with Next.js 14 App Router for optimal performance

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Animate.css](https://animate.style/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## 📋 Sections

- **Hero** - Name, title, introduction, and primary CTAs
- **About Me** - Background and professional focus
- **Skills** - Programming languages and technical tools
- **Projects** - Showcase of technical projects with descriptions
- **Research & Experience** - Academic and professional experience
- **Contact** - Email, phone, LinkedIn, and GitHub links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (install via [Homebrew](https://brew.sh/) on macOS: `brew install node`)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RaeC0717/Portfolio-template.git
cd Portfolio-template
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Portfolio/
├── public/
│   ├── photo.png          # Profile photo
│   └── resume.pdf         # Resume PDF
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout with theme script
│   │   ├── page.tsx       # Main page component
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   ├── About.tsx
│   │   ├── AnimateInView.tsx  # Scroll animation wrapper
│   │   ├── Contact.tsx
│   │   ├── Hero.tsx
│   │   ├── IntroGate.tsx  # Interactive intro gate
│   │   ├── Nav.tsx        # Navigation with mobile menu
│   │   ├── Projects.tsx
│   │   ├── Research.tsx
│   │   ├── Skills.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   ├── config/
│   │   └── photoPosition.ts    # Default photo position/scale (synced to production)
│   └── hooks/
│       └── usePhotoPosition.ts  # Photo position/scale hook
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🎨 Customization

### Update Personal Information

1. **Profile Photo**: Replace `public/photo.png` with your photo
2. **Resume**: Place your resume PDF at `public/resume.pdf`
3. **Content**: Edit component files in `src/components/` to update:
   - Personal info (Hero.tsx)
   - About section (About.tsx)
   - Skills list (Skills.tsx)
   - Projects (Projects.tsx)
   - Research/Experience (Research.tsx)
   - Contact links (Contact.tsx)

### Theme Customization

Edit `tailwind.config.ts` to customize colors, fonts, and other design tokens.

### Photo Positioning

- **Production**: All users see the same photo position and scale. The values come from `src/config/photoPosition.ts`. Users cannot change them.
- **Development**: You can **drag** to pan and **scroll wheel** to zoom. Changes are saved to localStorage (dev only) and apply to both Hero and IntroGate locally.
- **Syncing to production**: When you’re happy with the position in dev, copy the values (e.g. from `localStorage.getItem('portfolio-hero-photo-position')` in the console) into `src/config/photoPosition.ts`, then commit and deploy. That config is the single source of truth for production.

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and deploy

### Deploy to Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Connect your GitHub repository on [Netlify](https://netlify.com)

### Other Platforms

This project can be deployed to any platform that supports Node.js:
- Railway
- Render
- AWS Amplify
- Cloudflare Pages (with static export)

## 🎯 Key Features Explained

### Interactive Intro Gate

The portfolio starts with an interactive gate where users long-press the avatar for 2 seconds to unlock. Features:
- Circular progress indicator
- Haptic feedback (on supported devices)
- Skip button option
- Smooth fade-in animation

### Dark Mode

- Automatically detects system preference
- Manual toggle in navigation
- Persists preference in localStorage
- Smooth transitions between themes

### Animations

- Scroll-triggered fade-in animations for sections
- Animate.css for entrance effects
- Intersection Observer for performance

## 📝 License

This project is private and personal. Feel free to fork and customize for your own portfolio.

## 👤 Author

**Feiyang Chen**

- Email: raechen0717@gmail.com
- LinkedIn: [feiyang-chen](https://www.linkedin.com/in/feiyang-chen)
- GitHub: [@RaeChen0717](https://github.com/RaeChen0717)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations from [Animate.css](https://animate.style/)

---

⭐ If you find this project helpful, consider giving it a star!
