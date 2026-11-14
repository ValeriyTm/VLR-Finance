import type { NextConfig } from 'next';
import { withModuleFederation } from '@module-federation/nextjs-mf';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@vlr-finance/schemas'],
};

const mfConfig = {
  name: 'ai_copilot_mf',
  filename: 'static/chunks/remoteEntry.js',
  exposes: {
    './aiCopilot': './app/ai-copilot/page.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
    '@vlr-finance/schemas': { singleton: true },
  },
};

export default withModuleFederation(mfConfig)(nextConfig);
