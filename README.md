# Waypoint

An AI agent console built with Next.js, powered by Groq for fast LLM inference.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4, Framer Motion
- **State:** Zustand
- **Validation:** Zod
- **LLM Provider:** Groq SDK
- **Language:** TypeScript

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root (see `.env.example` for reference):

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Get a key from [console.groq.com/keys](https://console.groq.com/keys).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command         | Description                     |
|-----------------|----------------------------------|
| `npm run dev`   | Start the local development server |
| `npm run build` | Build the app for production     |
| `npm run start` | Run the production build locally |
| `npm run lint`  | Run ESLint checks                |

## Project Structure

```
Waypoint/
├── app/              # App Router pages, layouts, and API routes
├── public/           # Static assets
├── .env.local        # Local environment variables (not committed)
├── .env.example       # Reference for required env vars
├── next.config.ts    # Next.js configuration
├── tsconfig.json     # TypeScript configuration
└── package.json
```

## Environment Variables

| Variable        | Required | Description                          |
|-----------------|----------|---------------------------------------|
| `GROQ_API_KEY`  | Yes      | API key for Groq's inference endpoint |

## License

This project is licensed under the [MIT License](LICENSE).