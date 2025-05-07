import React, { useState, useEffect, ReactNode } from 'react';
import { config } from '../config';
import { SettingsContext, Settings } from './SettingsContextObject';


// Props for the SettingsProvider component
interface SettingsProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and provides the settings context
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Initialize settings from localStorage or default config
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('learnieSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      ai: {
        apiKey: config.ai.apiKey,
        model: config.ai.model,
        provider: config.ai.provider,
      },
    };
  });

  // Update localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('learnieSettings', JSON.stringify(settings));

    // Also update the config object so it's immediately available to new components
    config.ai.apiKey = settings.ai.apiKey;
    config.ai.model = settings.ai.model;
    config.ai.provider = settings.ai.provider;
  }, [settings]);

  // Function to update the API key
  const updateApiKey = (apiKey: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ai: {
        ...prevSettings.ai,
        apiKey,
      },
    }));
  };

  // Function to update the model
  const updateModel = (model: Settings['ai']['model']) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ai: {
        ...prevSettings.ai,
        model,
      },
    }));
  };

  // Function to update the provider
  const updateProvider = (provider: Settings['ai']['provider']) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ai: {
        ...prevSettings.ai,
        provider,
      },
    }));
  };

  // Provide the settings and update functions to the context
  const value = {
    settings,
    updateApiKey,
    updateModel,
    updateProvider,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
