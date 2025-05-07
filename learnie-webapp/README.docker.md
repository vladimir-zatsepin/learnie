# Docker Deployment for Learnie Web App

This document provides instructions for building and deploying the Learnie web application using Docker and Google Cloud Run.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed locally
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured
- Access to a Google Cloud project with Cloud Run API enabled

## Files

- `Dockerfile`: Multi-stage build file that builds the React application and serves it with Nginx
- `nginx.conf`: Nginx configuration optimized for serving a single-page application
- `.dockerignore`: Specifies files to exclude from the Docker build context

## Building the Docker Image Locally

```bash
# Build the Docker image
docker build -t learnie-webapp .

# Run the container locally (simulating Cloud Run's PORT environment variable)
docker run -p 8080:8080 -e PORT=8080 learnie-webapp
```

Visit `http://localhost:8080` to verify the application is running correctly.

## Deploying to Google Cloud Run

```bash
# Set your Google Cloud project ID
PROJECT_ID=your-project-id

# Build and push the image to Google Container Registry
docker build -t gcr.io/$PROJECT_ID/learnie-webapp .
docker push gcr.io/$PROJECT_ID/learnie-webapp

# Deploy to Cloud Run
gcloud run deploy learnie-webapp \
  --image gcr.io/$PROJECT_ID/learnie-webapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Alternatively, you can use Cloud Build to build and deploy in one step:

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/learnie-webapp
gcloud run deploy learnie-webapp \
  --image gcr.io/$PROJECT_ID/learnie-webapp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Configuration

### Environment Variables

- `PORT`: Automatically set by Cloud Run, the container will listen on this port
- `VITE_OPENAI_API_KEY`: OpenAI API key for AI functionality

#### OpenAI API Key

The application uses OpenAI's API for generating learning content. The Docker image includes a default API key from the `.env.local` file, which is not excluded in `.dockerignore`.

If you want to use a different API key in your deployment:

1. You can override it during deployment to Cloud Run:

   ```bash
   gcloud run deploy learnie-webapp \
     --image gcr.io/$PROJECT_ID/learnie-webapp \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars VITE_OPENAI_API_KEY=your-openai-api-key
   ```

2. Or, update the `.env.local` file before building the Docker image:

   ```bash
   # Edit .env.local with your API key
   docker build -t gcr.io/$PROJECT_ID/learnie-webapp .
   docker push gcr.io/$PROJECT_ID/learnie-webapp
   ```

### Custom Domains

To set up a custom domain for your Cloud Run service, follow the [official documentation](https://cloud.google.com/run/docs/mapping-custom-domains).

### Firebase Hosting Configuration

The application is configured to be deployed to Firebase Hosting. The `firebase.json` file includes the following configuration:

```json
{
  "hosting": {
    "site": "ai-learnie",
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "destination": "https://api.learnie.example.com/api/:splat"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Important**: Before deploying to Firebase, update the API rewrite rule in `firebase.json` to point to your actual API endpoint:

1. Replace `https://api.learnie.example.com` with your actual API domain
2. The `:splat` parameter will be replaced with the rest of the path after `/api/`
3. This configuration ensures that API requests from the frontend are properly forwarded to your backend service

## Troubleshooting

- If the application doesn't load properly, check the Cloud Run logs for errors
- Verify that the Nginx configuration correctly handles your application's routing needs
- Ensure that any API endpoints your application depends on are properly configured and accessible
- If API calls fail when deployed to Firebase, check that the rewrite rule in `firebase.json` points to the correct API endpoint
