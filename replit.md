# Medical Equipment E-commerce Platform

## Overview

This is a full-stack web application for a medical equipment company called "Sreemeditec" that provides hospitals with reliable and high-quality medical equipment. The platform features an e-commerce store, admin dashboard, user authentication, and quote request system for high-value items.

## System Architecture

The application follows a modern full-stack architecture:

**Frontend**: React-based single-page application with TypeScript
- Built with Vite for fast development and optimized builds
- Uses React Router for client-side routing
- Styled with Tailwind CSS and shadcn/ui components
- State management through React Context (cart, authentication)

**Backend**: Express.js server with TypeScript
- RESTful API architecture (routes prefixed with `/api`)
- In-memory storage implementation with interface for easy database migration
- Session-based architecture preparation with PostgreSQL session store

**Database**: PostgreSQL with Drizzle ORM
- Schema defined in shared directory for type safety
- Configured for Neon Database serverless PostgreSQL
- Migration system ready with Drizzle Kit

## Key Components

### Frontend Architecture
- **Component Structure**: Organized into UI components (shadcn/ui), layout components, and page components
- **Routing**: Multi-page application with protected routes for admin and user areas
- **State Management**: Context providers for cart functionality and authentication
- **Authentication**: Clerk integration for user management
- **Styling**: Tailwind CSS with custom design system and dark mode support

### Backend Architecture
- **API Layer**: Express.js with TypeScript for type safety
- **Storage Interface**: Abstracted storage layer (`IStorage`) currently implemented with in-memory storage (`MemStorage`)
- **Middleware**: Request logging, JSON parsing, error handling
- **Development Setup**: Vite integration for hot module replacement in development

### Authentication & Authorization
- **Frontend Authentication**: Clerk for user authentication and session management
- **Backend Preparation**: Session storage configured for PostgreSQL with connect-pg-simple
- **Route Protection**: `RequireAuth` component for protecting sensitive pages

## Data Flow

1. **User Interactions**: Users browse products, add items to cart, and manage their account
2. **Cart Management**: Local storage persistence with context-based state management
3. **Quote System**: High-value items (≥$20,000) require quote requests instead of direct purchase
4. **Admin Operations**: Product management, analytics dashboard, and transaction monitoring
5. **Database Operations**: Currently in-memory, ready for PostgreSQL migration via storage interface

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React Router, React Query for data fetching
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Authentication**: Clerk for user management
- **Database**: Drizzle ORM with Neon Database adapter
- **Styling**: Tailwind CSS with class-variance-authority for component variants

### Development Tools
- **Build Tool**: Vite with React plugin
- **TypeScript**: Full TypeScript setup with strict mode
- **Code Quality**: ESLint integration through Vite
- **Development**: Hot module replacement and error overlay

### Third-party Integrations
- **Charts**: Recharts for admin dashboard analytics
- **Forms**: React Hook Form with Zod validation
- **UI Enhancements**: Embla Carousel, Command palette (cmdk)
- **Date Handling**: date-fns for date formatting

## Deployment Strategy

**Platform**: Replit with autoscale deployment
- **Development**: `npm run dev` - Runs Express server with Vite middleware
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Production**: `npm run start` - Serves built application
- **Database**: PostgreSQL 16 module configured in Replit environment

**Environment Configuration**:
- Port 5000 for local development, maps to port 80 externally
- Database URL required via environment variables
- Clerk publishable key configured for authentication

**Build Optimization**:
- Frontend: Vite optimized build with code splitting
- Backend: esbuild bundle with external packages for Node.js
- Assets: Static file serving in production mode

## Changelog

- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.