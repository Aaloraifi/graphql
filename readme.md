# 🚀 GraphQL Student Dashboard
<<you can access the project from this link!>>
[🌐 Live Demo](https://graphql-aaloraif-two.vercel.app/)

A modern, motivational dashboard for students, visualizing your learning journey and project progress from a GraphQL API. Features beautiful SVG animations, glassmorphism UI, and a focus on progress and encouragement.

## ✨ Features

### 🎯 **Motivational Learning Progress**
- Animated card with motivational messages
- Last 3 completed projects shown in stylish, scrollable cards
- XP earned and completion date for each project

### 📊 **Data Visualizations**
- Level progress, XP, skills, audits, and technology stack
- SVG-based charts and progress indicators
- Responsive, animated UI for all dashboard cards

### 🎨 **Modern UI/UX**
- Glassmorphism and gradient backgrounds
- Smooth fade-in and hover animations
- Responsive design for all devices
- Accessible color contrast and reduced motion support

## 🛠️ **Tech Stack**
- **Frontend:** TypeScript, HTML5, CSS3
- **Build Tool:** Vite
- **Graphics:** Native SVG
- **Authentication:** JWT token-based
- **API:** GraphQL endpoint

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd graphql
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start development server**
   ```bash
   npm run dev
   ```
4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 **Project Structure**
```
src/
├── components/           # Dashboard card components
│   ├── userInfo.ts      # User info section
│   ├── levelCard.ts     # Level progress
│   ├── skillsCard.ts    # Skills radar chart
│   ├── xpCard.ts        # XP visualization
│   ├── auditRatioCard.ts # Audit stats
│   ├── techCard.ts      # Technology stack
│   ├── learningProgressCard.ts # motivational message + last 3 projects
│   └── auditGroupsCard.ts # Audit groups
├── auth.ts              # Authentication logic
├── graphql.ts           # GraphQL API calls
├── queries.ts           # GraphQL queries
├── types.d.ts           # TypeScript types
├── tools.ts             # Utility functions
├── style.css            # Global styles
└── main.ts              # App entry point
```

## 🎨 **Design Highlights**
- Primary gradient: `#667eea` → `#e10098`
- Accent: `#e10098` (GraphQL Pink)
- Glassmorphism, blur, and shadow effects
- Animated SVG charts and cards
- Horizontal scroll for project cards

## 🔧 **API Configuration**
- GraphQL endpoint: `https://learn.reboot01.com/api/graphql-engine/v1/graphql`
- JWT authentication for all API requests

## 📱 **Browser Support**
- Chrome, Firefox, Safari, Edge (latest)

## 🔒 **Security**
- JWT stored in localStorage
- Automatic logout on error/expired token
- Input validation and error handling

## 📄 **Project By:**
Aysha Aloraifi (aaloraif)

**Built with ❤️ for student motivation and progress!**








