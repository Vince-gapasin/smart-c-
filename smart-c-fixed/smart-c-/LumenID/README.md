# LumenID - Decentralized Identity Platform

## 🚀 Overview

LumenID is a modern, role-based decentralized identity management platform built with React and Vite. It provides secure credential issuance, verification, and management for multiple user roles:

- **Admin**: Dashboard and portals for issuers and verifiers
- **Customer**: Profile creation, dashboard, and credential vault
- **Issuer**: Credential issuance interface
- **Verifier**: Credential verification tools
- **Relying Party**: Integration for third-party verification

Key features:
- Role-based authentication and authorization
- Modern UI with shadcn/ui components
- Responsive design with Tailwind CSS
- Protected routes and page transitions
- Cosmic-themed background and smooth animations
- Profile management and credential vault

## 🛠️ Tech Stack

**Frontend**: React 18+, Vite, react-hook-form, Zod
- **Styling**: Tailwind CSS, shadcn/ui
- **Routing**: React Router
- **State**: React Context (AuthContext)
- **Icons**: Custom LumenIcons
- **UI Components**: Comprehensive shadcn/ui library (accordion, dialog, table, etc.)
- **Other**: Sonner (toasts), Lucide icons

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # All UI components by role
│   │   ├── admin/           # Admin dashboard & portals
│   │   ├── auth/            # Login/signup flows
│   │   ├── customer/        # Customer features
│   │   ├── issuer/          # Issuer tools
│   │   ├── ui/              # shadcn/ui components
│   │   └── vault/           # Credential storage
│   ├── contexts/            # AuthContext
│   ├── styles/              # Tailwind, fonts, themes
│   └── App.jsx              # Main app
├── public/                  # Static assets
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

1. **Clone/Navigate to project**
   ```bash
   cd c:/Users/Admin/Documents/Code/Hackathon/LumenID
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Local: http://localhost:5173 (default Vite port)
   - The app will auto-open or navigate manually

### Build for Production
```bash
npm run build
npm run preview
```

## 🔐 Authentication Flow
1. Landing page → Role selection
2. Login/Signup based on role
3. Role-specific dashboard
4. Protected routes handle access control

## 📚 Components Overview
- **Navigation**: Role-specific sidebars and menus
- **UI Primitives**: Full shadcn/ui suite for consistent design
- **Pages**: Landing, dashboards, profiles, privacy/terms
- **Auth**: Customer/Verifier login, role selection
- **Special**: CosmicBackground, PageTransition, ThemeProvider

## ⚙️ Environment Variables
No backend in this repo. Configure API endpoints in components/services as needed:
- API base URL
- Auth endpoints
- Mock data available in `src/data/mockData.js`

## 🤝 Contributing
1. Fork the repo
2. Install dependencies
3. Create feature branch
4. Submit PR

## 📄 License
This project is open source. See LICENSE for details.

## 🙌 Acknowledgments
Built with love using Vite, React, Tailwind CSS, and shadcn/ui.

---

**Ready to dive into decentralized identity? Launch with `npm run dev`!**
