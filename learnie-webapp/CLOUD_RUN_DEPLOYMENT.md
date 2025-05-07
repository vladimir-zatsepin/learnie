# Deploying to Google Cloud Run

This guide explains how to deploy the Learnie web application to Google Cloud Run.

## Prerequisites

1. [Google Cloud Account](https://cloud.google.com/)
2. [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured
3. [Docker](https://www.docker.com/get-started) installed (for local testing)
4. Enable the following Google Cloud APIs:
   - Cloud Run API
   - Cloud Build API
   - Container Registry API

## Configuration Files

The repository includes the following configuration files for Cloud Run deployment:

- **Dockerfile**: Defines how to build the container image
- **nginx.conf**: Configures the Nginx server that serves the application
- **cloudbuild.yaml**: Configures the automated build and deployment process

## Deployment Options

### Option 1: Manual Deployment

1. Build the Docker image locally:
   ```bash
   docker build -t learnie-webapp .
   ```

2. Test the image locally:
   ```bash
   docker run -p 8080:8080 learnie-webapp
   ```

3. Tag and push the image to Google Container Registry:
   ```bash
   docker tag learnie-webapp gcr.io/[YOUR_PROJECT_ID]/learnie-webapp
   docker push gcr.io/[YOUR_PROJECT_ID]/learnie-webapp
   ```

4. Deploy to Cloud Run:
   ```bash
   gcloud run deploy learnie-webapp \
     --image gcr.io/[YOUR_PROJECT_ID]/learnie-webapp \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars=VITE_OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   ```

### Option 2: Automated Deployment with Cloud Build

1. Connect your GitHub repository to Cloud Build:
   - Go to Cloud Build > Triggers
   - Click "Connect Repository"
   - Select your repository and follow the instructions

2. Create a Cloud Build trigger:
   - Name: `learnie-webapp-deploy`
   - Event: Push to a branch
   - Source: `^main$` (or your preferred branch)
   - Configuration: Repository (cloudbuild.yaml)
   - Substitution variables:
     - `_VITE_OPENAI_API_KEY`: Your OpenAI API key

3. Push to your repository to trigger the build and deployment.

## Backend Configuration

The application requires a backend API. Update the `nginx.conf` file to point to your backend service:

```
location /api/ {
    proxy_pass https://YOUR_BACKEND_SERVICE_URL/;
    # ...
}
```

Replace `YOUR_BACKEND_SERVICE_URL` with the URL of your backend service.

## Environment Variables

The application uses the following environment variables:

- `VITE_OPENAI_API_KEY`: Your OpenAI API key

These can be set in the Cloud Run deployment command or in the Cloud Build trigger.

## Continuous Deployment

For continuous deployment:

1. Set up a Cloud Build trigger as described above
2. Configure your CI/CD pipeline to push to the branch that triggers the build

## Troubleshooting

- **Build Failures**: Check the Cloud Build logs for details
- **Runtime Errors**: Check the Cloud Run logs
- **API Connection Issues**: Verify that the backend URL in nginx.conf is correct
- **Environment Variables**: Ensure all required environment variables are set

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Container Registry Documentation](https://cloud.google.com/container-registry/docs)
