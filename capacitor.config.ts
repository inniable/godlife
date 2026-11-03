import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goalmate.app',
  appName: '갓생살기',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    // Optional native plugins configuration
  },
};

export default config;
