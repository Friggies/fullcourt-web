import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  deploymentId: process.env.NEXT_DEPLOYMENT_ID, //for Netlify skew protection
  serverExternalPackages: ['sharp'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crbswbfgtbkjinzagblg.supabase.co',
      },
    ],
  },
};

export default nextConfig;
