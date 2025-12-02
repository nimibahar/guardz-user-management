# Frontend - React Client

Frontend client application for the Guardz User Management System built with React, TypeScript, and modern web technologies.

## 🏗️ Architecture

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query (TanStack Query)
- **Form Management**: React Hook Form with Zod validation
- **Data Tables**: React Table (TanStack Table)
- **Testing**: Playwright for E2E testing
- **UI Components**: Custom components with Tailwind

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm
- **Backend running** on http://localhost:8080 (see [backend README](../backend/README.md))

### Local Development Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Application runs on http://localhost:5173 with hot reload
```

### Development Features
- ⚡ **Vite Dev Server**: Ultra-fast hot module replacement
- 🔄 **Hot Reload**: Instant updates on file changes
- 🎨 **Tailwind CSS**: Live CSS compilation and reload
- 🔍 **TypeScript**: Real-time type checking
- 🌐 **API Integration**: Automatically connects to backend at localhost:8080

### Development Commands
```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Development Workflow
1. **Start Backend**: First ensure backend is running (`cd ../backend && npm run start:dev`)
2. **Start Frontend**: Run `npm run dev` in frontend directory
3. **Access App**: Open http://localhost:5173 in your browser
4. **Live Development**: Make changes to React components and see instant updates

### Environment Configuration
```bash
# Override API URL if needed (optional)
VITE_API_URL=http://localhost:8080 npm run dev

# For connecting to remote backend during development
VITE_API_URL=http://192.168.1.100:8080 npm run dev
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── UserForm.tsx     # User submission form
│   └── UserTable.tsx    # Users data table
├── lib/                 # Utility libraries
│   ├── api.ts          # API client configuration
│   └── schemas.ts      # Zod validation schemas
├── types/              # TypeScript type definitions
│   └── user.ts         # User-related types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles (Tailwind)
```

## 🎨 Components

### UserForm
- Form for submitting user information
- Real-time validation with Zod
- Loading states and error handling
- Automatic form reset on successful submission

### UserTable  
- Responsive data table with React Table
- Sorting and filtering capabilities
- Loading and error states
- Search functionality across all columns
- Empty state handling

## 📋 Features

- ✅ **Responsive Design** - Works on all device sizes
- ✅ **Real-time Validation** - Client-side validation with Zod schemas
- ✅ **Data Fetching** - Optimized with React Query caching
- ✅ **Interactive Tables** - Sorting, filtering, and search
- ✅ **Loading States** - Smooth user experience
- ✅ **Error Handling** - Comprehensive error display
- ✅ **Form Management** - React Hook Form for optimal performance
- ✅ **Type Safety** - Full TypeScript coverage

## 🌐 API Integration

### Configuration
```typescript
// Default API URL (can be overridden with VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

### API Methods
```typescript
// Get all users
userApi.getUsers(): Promise<User[]>

// Create new user
userApi.createUser(user: CreateUserDto): Promise<User>
```

## 🧪 Testing

### End-to-End Tests (Playwright)
```bash
# Run E2E tests
npm run test

# Run tests in headed mode
npm run test:headed

# Run tests with UI
npm run test:ui
```

### Test Coverage
- ✅ Page loading and display
- ✅ Form validation (client-side)
- ✅ User submission workflow
- ✅ Data table functionality
- ✅ Search and filtering
- ✅ Error state handling
- ✅ Loading state behavior

## ⚙️ Configuration

### Environment Variables
```bash
VITE_API_URL=http://localhost:8080  # Backend API URL
```

### Tailwind CSS
Custom Tailwind configuration optimized for the application:
```javascript
// Scans all TypeScript/JSX files for classes
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

### React Query Configuration
```typescript
const queryClient = new QueryClient({
  // Default configuration for caching and refetching
});
```

## 🐳 Docker

### Development
```bash
# Build development image (uses Vite dev server)
docker build -t guardz-frontend --target development .

# Run development container
docker run -p 5173:5173 guardz-frontend
```

### Production
```bash
# Build production image (uses Nginx)
docker build -t guardz-frontend --target production .

# Run production container
docker run -p 80:80 guardz-frontend
```

## 🌐 Why Nginx? Understanding Our Production Architecture

### **The Problem Nginx Solves:**

**React/Vite** creates a **Single Page Application (SPA)** - all routing happens in the browser via JavaScript. But web servers need to know how to handle requests properly.

### **Without Nginx (Problems):**
```bash
# ❌ These requests would fail with "404 Not Found"
http://yoursite.com/users        # No physical file at /users
http://yoursite.com/dashboard    # No physical file at /dashboard
```

### **With Nginx (Solutions):**

#### 1. **🔀 SPA Routing Support**
```nginx
# Handle client-side routing - THE KEY FEATURE
location / {
  try_files $uri $uri/ /index.html;
}
```
**What this does:**
- `http://yoursite.com/users` → serves `index.html` 
- React Router takes over and shows the correct component
- **Result**: Deep links work perfectly! ✅

#### 2. **⚡ Performance Optimizations**
```nginx
# Gzip compression - reduces file sizes by ~70%
gzip on;
gzip_types text/css application/javascript;

# Asset caching - browsers cache JS/CSS for 1 year
location ~* \.(js|css|png|jpg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

#### 3. **🛡️ Security Headers**
```nginx
# Prevent clickjacking attacks
add_header X-Frame-Options "SAMEORIGIN";

# Prevent MIME type attacks  
add_header X-Content-Type-Options "nosniff";

# Block XSS attacks
add_header X-XSS-Protection "1; mode=block";
```

#### 4. **🏥 Health Checks**
```nginx
# Docker health check endpoint
location /health {
  return 200 "OK\n";
}
```

### **Alternative Approaches (And Why We Don't Use Them):**

| Approach | Pros | Cons | Why Not? |
|----------|------|------|----------|
| **Node.js server** | Simple | Heavyweight, memory usage | Unnecessary overhead for static files |
| **Apache** | Full-featured | Large image, complex config | Overkill for SPA |
| **No server** | Minimal | No routing, no headers, no compression | Breaks on refresh |

### **Nginx Benefits Summary:**
- ✅ **Tiny footprint**: ~2MB Alpine image
- ✅ **Battle-tested**: Used by 30%+ of all websites  
- ✅ **Perfect for SPAs**: Built-in fallback routing
- ✅ **Production-ready**: Compression, caching, security
- ✅ **Zero JavaScript**: Pure static file serving

## 🔧 Available Scripts

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Lint code with ESLint

npm run test           # Run E2E tests
npm run test:headed    # Run E2E tests in headed mode
npm run test:ui        # Run E2E tests with UI
```

## 📦 Dependencies

### Production Dependencies
- `react` & `react-dom` - React framework
- `@tanstack/react-query` - Data fetching and caching
- `@tanstack/react-table` - Table functionality
- `axios` - HTTP client
- `react-hook-form` - Form management
- `@hookform/resolvers` - Form validation resolvers
- `zod` - Schema validation

### Development Dependencies
- `vite` - Build tool and dev server
- `typescript` - TypeScript compiler
- `@vitejs/plugin-react` - Vite React plugin
- `tailwindcss` - CSS framework
- `autoprefixer` & `postcss` - CSS processing
- `@playwright/test` - E2E testing
- `eslint` - Code linting

## 🎨 Styling

### Tailwind CSS
The application uses Tailwind CSS for styling with:
- **Responsive Design**: Mobile-first approach
- **Component Classes**: Utility-first styling
- **Custom Colors**: Professional color scheme
- **Consistent Spacing**: Standardized spacing scale

### Key Design Elements
- Clean, professional interface
- Consistent spacing and typography
- Responsive grid layouts
- Interactive hover states
- Loading and error state styling

## 🚀 Performance Optimizations

- **React Query Caching**: Automatic background refetching
- **Form Optimization**: React Hook Form reduces re-renders
- **Code Splitting**: Vite automatic code splitting
- **Tree Shaking**: Unused code elimination
- **Optimized Assets**: Minified CSS and JavaScript
- **Efficient Re-renders**: Optimized component updates

## 🔒 Security

- **Input Validation**: Client-side validation with Zod
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Stateless API communication
- **Content Security Policy**: Nginx configuration in production

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers