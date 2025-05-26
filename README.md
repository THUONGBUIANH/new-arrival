# New Arrival Project

This is a full-stack application with a React frontend and Node.js backend.

## Project Structure

```
new-arrival/
├── client/          # React frontend application
└── server/          # Node.js backend server
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd new-arrival
```

### 2. Frontend Setup (Client)

```bash
cd client
npm install
```

### 3. Backend Setup (Server)

```bash
cd server
npm install
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd server
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use)

### Building for Production

1. Build the frontend:
```bash
cd client
npm run build
```

## Available Scripts

### Frontend (Client)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend (Server)
- `npm start` - Start the server

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- React Query
- ESLint
- Prettier

### Backend
- Node.js
- JSON Server

## Code Formatting

The project uses Prettier for code formatting. Code will be automatically formatted on save if you have the Prettier VS Code extension installed.

## License

SEE LICENSE IN LICENSE 