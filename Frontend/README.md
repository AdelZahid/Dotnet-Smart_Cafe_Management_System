# Cafe Management System - Frontend (JavaScript/JSX)

This is the React frontend for the Cafe Management System using JavaScript and JSX (not TypeScript).

## Project Structure

```
Frontend-JS/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/              # UI components (Button, Card, Dialog, etc.)
│   │   ├── Layout.jsx       # Main layout with sidebar
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Menu.jsx
│   │   ├── Orders.jsx
│   │   ├── Tables.jsx
│   │   ├── Reservations.jsx
│   │   ├── Staff.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── api.js           # API calls
│   ├── store/
│   │   └── authStore.js     # Zustand auth store
│   ├── hooks/
│   │   └── use-toast.js     # Toast hook
│   ├── lib/
│   │   └── utils.js         # Utility functions
│   ├── main.jsx
│   ├── App.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
└── .gitignore
```

## Terminal Commands to Create Project Structure

Open Command Prompt or PowerShell and run these commands:

```bash
# Navigate to your project directory
cd D:\CafeManagementSystem

# Create the Frontend-JS folder and all subdirectories
mkdir Frontend-JS
cd Frontend-JS

# Create folder structure
mkdir src
mkdir src\components
mkdir src\components\ui
mkdir src\pages
mkdir src\services
mkdir src\store
mkdir src\hooks
mkdir src\lib
mkdir public

# Verify structure
dir /s /b
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd D:\CafeManagementSystem\Frontend-JS
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Browser

Navigate to: `http://localhost:5173`

## Demo Credentials

- **Owner:** username: `owner`, password: `password`
- **Manager:** username: `manager`, password: `password`
- **Waiter:** username: `waiter`, password: `password`

## Key Changes from TypeScript to JavaScript

| TypeScript | JavaScript |
|------------|------------|
| `.tsx` files | `.jsx` files |
| `.ts` files | `.js` files |
| `interface` types | Removed (use JSDoc comments if needed) |
| Type annotations | Removed |
| `tsconfig.json` | Not needed |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Technologies Used

- React 19
- JavaScript (ES6+)
- Vite
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- TanStack Query (React Query)
- Zustand
- React Router
- Recharts
- Axios
