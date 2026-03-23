/**
 * Environment Variable Configuration
 * Centralized access to environment variables
 */

function getEnvVar(key, required = false) {
  const value = import.meta.env[key];

  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env = {
  // API Configuration
  apiBaseUrl: getEnvVar("VITE_API_BASE_URL") || "/api",

  // Supabase Configuration
  supabase: {
    url: getEnvVar("VITE_SUPABASE_URL"),
    anonKey: getEnvVar("VITE_SUPABASE_ANON_KEY"),
  },

  // Blockchain Configuration
  blockchain: {
    network: getEnvVar("VITE_BLOCKCHAIN_NETWORK") || "polkadot",
    rpcUrl: getEnvVar("VITE_BLOCKCHAIN_RPC_URL"),
  },

  // IPFS Configuration
  ipfs: {
    gateway: getEnvVar("VITE_IPFS_GATEWAY") || "https://ipfs.io",
    apiUrl: getEnvVar("VITE_IPFS_API_URL"),
  },

  // Application Configuration
  app: {
    env: getEnvVar("VITE_APP_ENV") || "development",
    version: getEnvVar("VITE_APP_VERSION") || "0.0.1",
  },

  // Utility functions
  isDevelopment: () => env.app.env === "development",
  isProduction: () => env.app.env === "production",
  isStaging: () => env.app.env === "staging",
};