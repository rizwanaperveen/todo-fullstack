# Quickstart Guide: Todo Frontend Application

## Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### Initial Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update environment variables in `.env.local`:
   - `NEXT_PUBLIC_API_URL`: Backend API base URL (e.g., http://localhost:8000)

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser to `http://localhost:3000`

## Key Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start production server (after build)
- `npm run lint` - Run ESLint to check for code issues

### Testing
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Project Structure Overview

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── dashboard/      # Protected dashboard
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   ├── ui/            # Generic UI components
│   ├── auth/          # Authentication components
│   └── todo/          # Todo-specific components
├── lib/               # Utilities and services
│   ├── auth/          # Auth utilities
│   └── api/           # API client
├── types/             # TypeScript definitions
└── public/            # Static assets
```

## Key Features Walkthrough

### 1. Authentication Flow
1. Visit `/login` to log in or `/signup` to create an account
2. After successful authentication, you'll be redirected to `/dashboard`
3. The session is managed automatically with Better Auth

### 2. Todo Management
1. On the dashboard, you can see your existing todos
2. Use the "Add Todo" form to create new todos
3. Click the checkbox to mark todos as complete/incomplete
4. Use edit/delete buttons to manage existing todos

### 3. Protected Routes
- All routes under `/dashboard` require authentication
- Unauthenticated users will be redirected to login
- The Navbar shows user information and logout option

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL` - Better Auth configuration (if needed)

## Troubleshooting

### Common Issues
- **API calls failing**: Verify `NEXT_PUBLIC_API_URL` is set correctly
- **Authentication not working**: Ensure backend auth service is running
- **Styles not loading**: Check Tailwind CSS configuration in `globals.css`

### Development Tips
- Use Server Components by default for initial rendering
- Only use Client Components when you need interactivity (useState, useEffect, etc.)
- All API calls should go through the centralized API client in `lib/api/client.ts`