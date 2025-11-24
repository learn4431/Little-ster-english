import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // Fix: process.cwd() type definition might be missing in some environments, casting to any resolves it.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Vital: Replace 'process.env.API_KEY' in the code with the actual value from environment variables during build.
      // This prevents "ReferenceError: process is not defined" in the browser.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});