import {onRequest} from "firebase-functions/v2/https";
import fetch from "node-fetch";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
export const proxyApi = onRequest({
  region: "europe-west1" // Deploy function to EU region
}, async (request, response) => {
  const path = request.url.replace('/api/', '');
  const url = `https://11f7-178-220-173-118.ngrok-free.app/${path}`;

  const headers: Record<string, string> = {};
  Object.entries(request.headers).forEach(([key, value]) => {
    if (value !== undefined) {
      headers[key] = Array.isArray(value) ? value.join(', ') : value;
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
});
