/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import fetch from "node-fetch";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
export const proxyApi = onRequest(async (request, response) => {
  const url = `https://3172-178-220-173-118.ngrok-free.app${request.url}`;
  try {
    // Convert IncomingHttpHeaders to HeadersInit compatible format
    const headers: Record<string, string> = {};
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        headers[key] = Array.isArray(value) ? value.join(', ') : value;
      }
    });

    const proxyResponse = await fetch(url, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? request.rawBody : undefined
    });

    const data = await proxyResponse.buffer();
    response.status(proxyResponse.status);
    proxyResponse.headers.forEach((value, name) => response.setHeader(name, value));
    response.send(data);
  } catch (error) {
    console.error("Proxy error:", error);
    response.status(500).send("Proxy failed");
  }
});
