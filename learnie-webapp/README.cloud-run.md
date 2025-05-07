# Learnie Web App - Google Cloud Run Deployment

This document provides a quick overview of deploying the Learnie web application to Google Cloud Run.

## Files Added for Cloud Run Deployment

- **Dockerfile**: Multi-stage build process for creating a production-ready container
- **nginx.conf**: Nginx configuration for serving the React application
- **cloudbuild.yaml**: Configuration for automated builds with Google Cloud Build
- **CLOUD_RUN_DEPLOYMENT.md**: Detailed deployment guide

## Quick Start

1. **Prerequisites**:
   - Google Cloud account
   - Google Cloud SDK installed
   - Required APIs enabled (Cloud Run, Cloud Build, Container Registry)

2. **Manual Deployment**:
   ```bash
   # Build the Docker image
   docker build -t learnie-webapp .
   
   # Deploy to Cloud Run
   gcloud run deploy learnie-webapp \
     --image gcr.io/YOUR_PROJECT_ID/learnie-webapp \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. **Automated Deployment**:
   - Set up a Cloud Build trigger using the provided cloudbuild.yaml
   - Push to your repository to trigger the build and deployment

## Important Configuration

Before deploying, make sure to:

1. Update the backend API URL in `nginx.conf`
2. Set the required environment variables (VITE_OPENAI_API_KEY)
3. Choose the appropriate region in cloudbuild.yaml

## Detailed Instructions

For detailed deployment instructions, see [CLOUD_RUN_DEPLOYMENT.md](./CLOUD_RUN_DEPLOYMENT.md).
