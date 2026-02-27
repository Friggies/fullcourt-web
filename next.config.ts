import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  deploymentId: process.env.DEPLOY_ID, //for Netlify skew protection
  serverExternalPackages: ['sharp'],
  images: { domains: ['crbswbfgtbkjinzagblg.supabase.co'] },
};

export default nextConfig;
