# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

This is a Next.js 15 marketing platform with the following architecture:

### Frontend Framework
- **Next.js 15** with App Router (not Pages Router)
- **React 19** for components
- **Tailwind CSS 4** for styling with shadcn/ui components
- **Turbopack** enabled for both dev and build

### Key Directories
- `app/` - Next.js App Router pages and layouts
  - `app/auth/userDashboard/[id]/` - Protected dashboard routes
  - `app/login/` and `app/signup/` - Authentication pages
- `components/` - React components organized by feature
  - `components/ui/` - shadcn/ui components
  - `components/dashboard/` - Dashboard-specific components
  - `components/campaigns/` - Campaign management components
  - `components/analytics/` - Analytics components
- `lib/` - Utility functions and configurations
- `appwrite/` - Appwrite backend integration functions

### Authentication & Security
- Uses **Appwrite** as the backend service
- Custom authentication flow with encrypted session management
- Middleware handles route protection and session validation (`middleware.js`)
- Two-cookie system: `localSession` (encrypted user data) and `appSession` (Appwrite session)
- Session encryption/decryption utilities in `lib/encrypt.js` and `lib/decrypt.js`

### UI Components
- Built with **shadcn/ui** and **Radix UI** components
- **React Hook Form** with **Yup** validation for forms
- **Recharts** for data visualization
- **next-themes** for theme management
- **Sonner** for notifications

### Marketing Platform Features
- Multi-platform campaign management (Facebook, Instagram, Reddit, Hacker News)
- Analytics dashboard with data visualization
- User dashboard with campaign stats and quick actions
- Campaign wizard for creating new marketing campaigns

### Route Structure
- `/` - Landing page
- `/login` - User authentication
- `/signup` - User registration
- `/auth/userDashboard/[id]` - Main dashboard (protected)
- `/auth/userDashboard/[id]/campaigns` - Campaign management
- `/auth/userDashboard/[id]/analytics` - Analytics view
- `/auth/userDashboard/[id]/new-campaign` - Campaign creation

### Development Notes
- Uses `.jsx` extensions for React components
- Middleware automatically handles authentication and session management
- All dashboard routes are protected and require authentication
- The app uses server-side encryption for sensitive session data
- Dont run "npm run dev" on port 3000, after changes, because its already probably runing
- Dont run "npm run build"