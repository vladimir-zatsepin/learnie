// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import OpenAI from "openai";
import ChatModel = OpenAI.ChatModel;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNUMscEXy96oOcTEj50AMz5oPmK2mfA6c",
  authDomain: "learnie-d13dc.firebaseapp.com",
  projectId: "learnie-d13dc",
  storageBucket: "learnie-d13dc.firebasestorage.app",
  messagingSenderId: "509049636051",
  appId: "1:509049636051:web:b92abaa8c9038027a08026",
  measurementId: "G-GTHHCR0XTF"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);

/**
 * Application configuration
 */
export const config = {
  ai: {
    provider: 'remote' as 'openai' | 'remote',
    apiKey: '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', // Replace with your actual OpenAI API key
    model: 'gpt-4.1-mini' as ChatModel,
  },
  firebase: firebaseConfig
};
