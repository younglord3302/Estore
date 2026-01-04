# E-commerce Full-Stack Application

A modern full-stack e-commerce application built with React, TypeScript, Node.js, Express, Prisma, and PostgreSQL.

## Features

- User authentication and authorization
- Product catalog with categories
- Shopping cart functionality
- Order management
- Payment processing with Stripe
- Admin dashboard with analytics
- Image upload with Cloudinary
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Query
- React Router

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe for payments
- Cloudinary for image uploads
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ai-agent
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Copy the example env files and fill in your values:

**Server (.env)**

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Client (.env)**

```env
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

4. Set up the database

```bash
cd server
pnpm run db:migrate
pnpm run db:generate
pnpm run seed
```

5. Start the development servers

```bash
# Backend
cd server
pnpm run dev

# Frontend (in another terminal)
cd client
pnpm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

## 🚀 Deployment Guide

This project is structured as a monorepo. Follow these instructions for a smooth deployment.

### 🌐 Frontend (Vercel)

1. **Connect Repository**: Link your GitHub repository to Vercel.
2. **Framework Preset**: select `Vite`.
3. **Root Directory**: Set to `client`.
4. **Environment Variables**:
   - `VITE_API_BASE`: Your deployed backend URL (e.g., `https://your-api.render.com`).
5. **Vercel.json**: A `vercel.json` has been provided in the `client/` directory to handle SPA routing.

### ⚙️ Backend (Render / Railway / Fly.io)

1. **Root Directory**: Set to `server`.
2. **Build Command**: `pnpm install && pnpm run build`.
3. **Start Command**: `pnpm run start`.
4. **Environment Variables**:
   - `DATABASE_URL`: Connection string for your managed PostgreSQL (Supabase/Neon).
   - `JWT_SECRET`: A secure random string.
   - `JWT_REFRESH_SECRET`: Another secure random string.
   - `CLOUDINARY_*`: Your Cloudinary credentials for asset storage.

### 🗄️ Database

- **Neon / Supabase**: Highly recommended for a free-tier PostgreSQL that works perfectly with Prisma.
- Run migrations during build: `npx prisma migrate deploy`.

## 📁 Version Control (GitHub)

The project includes `.gitignore` files at the root, `client/`, and `server/` levels to ensure:
- `node_modules` are not tracked.
- Sensitive credentials (`.env`) are kept local.
- Build artifacts (`dist/`) are generated only during deployment.

## API Documentation

The API is documented with Swagger. Visit `/api-docs` when the server is running.

A Postman collection is available in `postman_collection.json`.

## Scripts

### Root

- `pnpm install` - Install all dependencies
- `pnpm run dev` - Start both frontend and backend in development

### Server

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run test` - Run tests
- `pnpm run lint` - Run TypeScript type checking
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run seed` - Seed database with sample data

### Client

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint
- `pnpm run preview` - Preview production build

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── store/          # Redux store
│   │   └── api/            # API client functions
│   ├── public/             # Static assets
│   └── Dockerfile          # Docker configuration
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   ├── config/         # Configuration files
│   │   └── __tests__/      # Test files
│   ├── prisma/             # Database schema and migrations
│   └── Dockerfile          # Docker configuration
├── .github/workflows/      # GitHub Actions CI/CD
├── docker-compose.yml      # Local development with Docker
└── postman_collection.json # API testing collection
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Estore
