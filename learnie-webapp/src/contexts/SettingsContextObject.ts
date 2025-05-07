import { createContext } from 'react';
import OpenAI from 'openai';
import ChatModel = OpenAI.ChatModel;

// Define the shape of our settings
export interface Settings {
  ai: {
    apiKey: string;
    model: ChatModel;
    provider: 'openai' | 'remote';
  };
}

// Define the shape of our context
export interface SettingsContextType {
  settings: Settings;
  updateApiKey: (apiKey: string) => void;
  updateModel: (model: Settings['ai']['model']) => void;
  updateProvider: (provider: Settings['ai']['provider']) => void;
}

// Create the context with a default value
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
