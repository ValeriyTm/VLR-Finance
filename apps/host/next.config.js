import type { NextConfig } from 'next';
import { withModuleFederation } from '@module-federation/nextjs-mf';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@vlr-finance/schemas', '@vlr-finance/types'],
};

const mfConfig = {
  name: 'host',
  remotes: {
    authProfile: 'auth_profile_mf@http://localhost:3002/_next/static/chunks/remoteEntry.js',
    terminal: 'terminal_mf@http://localhost:3004/_next/static/chunks/remoteEntry.js',
    portfolio: 'portfolio_mf@http://localhost:3006/_next/static/chunks/remoteEntry.js',
    aiCopilot: 'ai_copilot_mf@http://localhost:3008/_next/static/chunks/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
  },
};

export default withModuleFederation(mfConfig)(nextConfig);
