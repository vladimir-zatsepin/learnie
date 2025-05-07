import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import fetch from "node-fetch";

const AGENT_URL = 'https://learnie-ur3ctcxsqa-uc.a.run.app'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
export const proxyApi = onRequest({
  timeoutSeconds: 300,
  region: "europe-west1",
  // Deploy function to EU region
}, async (request, response) => {
  try {
    const path = request.url.replace('/api/', '');
    const url = `${AGENT_URL}/${path}`;

    // Filter out unnecessary headers and limit header sizes to prevent 431 errors
    const headers: Record<string, string> = {};
    const essentialHeaders = [
      'content-type',
      'content-length',
      'accept',
      'accept-encoding',
      'accept-language',
      'user-agent',
      'authorization'
    ];

    Object.entries(request.headers).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      if (value !== undefined && essentialHeaders.includes(lowerKey)) {
        // Limit header size if needed
        let headerValue = Array.isArray(value) ? value.join(', ') : value;
        // Truncate extremely large headers if necessary
        if (headerValue.length > 1024) {
          console.warn(`Truncating large header: ${key}`);
          headerValue = headerValue.substring(0, 1024);
        }
        headers[key] = headerValue;
      }
    });

    const proxyResponse = await fetch(url, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? request.rawBody : undefined,
    });

    const data = await proxyResponse.buffer();
    response.status(proxyResponse.status);
    proxyResponse.headers.forEach((value, name) => response.setHeader(name, value));
    response.send(data);
  } catch (error) {
    logger.error("Proxy error:", error);
    response.status(500).send({
      error: "An error occurred while processing your request",
      message: error instanceof Error ? error.message : String(error)
    });
  }
});
