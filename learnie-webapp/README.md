# Learnie Web Application

A web application for interactive learning experiences powered by AI.

## Configuration

### OpenAI API Key

The application uses OpenAI's API for generating learning content. You need to provide an OpenAI API key to use this functionality.

#### Development

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace `your-openai-api-key-here` with your actual OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your-actual-api-key
   ```

3. The application will use this key when running in development mode.

#### Production

For production deployment, you can:

1. Set the `VITE_OPENAI_API_KEY` environment variable in your deployment environment.
2. Or, use the default API key included in the `.env.local` file (which is ignored by Git).

## Development

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Docker

For Docker-specific instructions, see [README.docker.md](README.docker.md).
