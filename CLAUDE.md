# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.3 marketing campaign management application built with React 19, using the App Router pattern. The project is configured to use Turbopack for faster development builds.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture & Stack

### Core Technologies
- **Next.js 15.5.3** with App Router
- **React 19.1.0** with React DOM 19.1.0
- **TypeScript**: No (JSX files, not TSX)
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui with Radix UI primitives

### Key Libraries
- **Form Handling**: React Hook Form with Zod validation
- **Tables**: TanStack React Table
- **Charts**: Recharts
- **Date Handling**: date-fns and React Day Picker
- **Theming**: next-themes with system preference support
- **Notifications**: Sonner
- **Icons**: Lucide React

### Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
  - `ui/` - shadcn/ui components (styled with Tailwind)
  - `dashboard/` - Dashboard-specific components
  - `campaigns/` - Campaign management components
  - `analytics/` - Analytics and reporting components
  - `layout/` - Layout components (sidebar, header)
  - `theming/` - Theme provider components
- `lib/` - Utility functions and shared logic
- `hooks/` - Custom React hooks

### Component Architecture

The application follows a marketing campaign management structure:

- **Dashboard**: Overview with stats, quick actions, and campaign summaries
- **Campaigns**: Multi-platform campaign management (Facebook, Instagram, Reddit, Hacker News)
- **Analytics**: Data visualization and reporting
- **Layout**: Sidebar navigation with header

### Styling & Theme System

- Uses shadcn/ui "new-york" style variant
- Tailwind CSS v4 with CSS variables for theming
- Dark/light mode support via next-themes
- Geist font family (Sans and Mono variants)

### Path Aliases

Configure imports using these aliases (from components.json):
- `@/components` → `components/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`
- `@/utils` → `lib/utils`
- `@/ui` → `components/ui`

### Development Notes

- Uses JSX files, not TypeScript
- ESLint configured with Next.js core web vitals
- Theme provider handles system preference and persistence
- Campaign forms support multiple social media platforms
- Date handling utilities available in `lib/dateUtils.js`
- Dont run 'npm run dev' on port 3000, since its probably already runing