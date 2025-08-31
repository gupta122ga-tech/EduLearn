# Fusion Starter

A production-ready full-stack React application template with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

While the starter comes with a express server, only create endpoint when strictly neccesary, for example to encapsulate logic that must leave in the server, such as private keys handling, or certain DB operations, db...

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

#### Example API Routes
- `GET /api/ping` - Simple ping api
- `GET /api/demo` - Demo endpoint  

### Shared Types
Import consistent types in both client and server:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test          # Run Vitest tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `server/routes/my-route.ts`:
```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
```

3. Register the route in `server/index.ts`:
```typescript
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `pnpm build`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces

## Supabase Authentication (Local Setup)

1. Create a project at https://supabase.com and get your Project URL and anon public key.
2. Create a `.env` file in the project root with:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
3. Restart the dev server to load env vars.
4. Use the Register and Login pages to sign up/sign in with email + password.

Notes:
- The app reads these via `import.meta.env.*` in `client/lib/supabase.ts`.
- Profile updates (name/email/avatar) write to Supabase user metadata.

### OAuth Providers (Google, GitHub)

Enable providers in Supabase Dashboard → Authentication → Providers.
- For local dev, set Redirect URLs to:
  - `http://localhost:8080` (and any other environments you use)
- For Google: supply Client ID and Client Secret from Google Cloud Console.
- For GitHub: supply Client ID and Client Secret from GitHub OAuth Apps.

After enabling, use the Login page buttons to start the OAuth flow.

## Contact Form Email (SMTP)

Set these in `.env` to enable email notifications for contact form submissions:
```
SMTP_HOST=smtp.yourhost.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_SECURE=false
FROM_EMAIL=no-reply@yourdomain.com
TO_EMAIL=you@yourdomain.com
```

Notes:
- For Gmail, you may need an App Password and `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true`.
- Messages are still stored in `server/data/contacts.json`.
