# New Arrival - Full Stack Application

A full-stack application with a React client and JSON server backend, organized as an npm workspace.

## Project Structure

```
new-arrival/
├── client/          # React + Vite + TypeScript frontend
├── server/          # JSON Server backend
├── package.json     # Root workspace configuration
└── README.md        # This file
```

## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
# Install all dependencies for both client and server
npm run install:all
```

### Development

**🚀 Start both client and server with one command:**
```bash
npm start
```
This will run both the frontend (usually on http://localhost:5173) and backend server concurrently.

### Individual Commands

```bash
# Run only the client (React app)
npm run dev:client

# Run only the server (JSON server)
npm run dev:server

# Run dev script in all workspaces
npm run dev

# Build the client for production
npm run build

# Run tests (client only)
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests coverage report
npm run test:coverage

# Run linting
npm run lint
```

### Workspace Commands

You can also run commands directly in specific workspaces:

```bash
# Install dependencies in a specific workspace
npm install <package> --workspace=client
npm install <package> --workspace=server

# Run scripts in specific workspaces
npm run <script> --workspace=client
npm run <script> --workspace=server
```

## Available Scripts Summary

| Command | Description |
|---------|-------------|
| `npm start` | 🚀 **Main command** - Runs both client and server |
| `npm run dev` | Runs dev scripts in all workspaces |
| `npm run dev:client` | Runs only the React client |
| `npm run dev:server` | Runs only the JSON server |
| `npm run build` | Builds the client for production |
| `npm run test` | Runs client tests |
| `npm run test:watch` | Runs client tests in watch mode |
| `npm run test:coverage` | Runs client tests coverage |
| `npm run lint` | Runs ESLint on client code |
| `npm run install:all` | Installs dependencies for all workspaces |

## Technology Stack

### Client
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Query
- Jest for testing

### Server
- Node.js
- JSON Server

## Development Workflow

1. **Initial Setup**: Run `npm run install:all` to install all dependencies
2. **Development**: Use `npm start` to run both client and server
3. **Testing**: Use `npm run test` or `npm run test:watch` for client tests
4. **Building**: Use `npm run build` to create production build for client
5. **Individual Development**: Use `npm run dev:client` or `npm run dev:server` to run them separately

## Notes

- The workspace is configured to run both client and server simultaneously using `concurrently`
- Client typically runs on http://localhost:5173
- Server typically runs on http://localhost:5005
- All workspace dependencies are managed from the root level

## Code Formatting

The project uses Prettier for code formatting. Code will be automatically formatted on save if you have the Prettier VS Code extension installed.

## License

SEE LICENSE IN LICENSE 