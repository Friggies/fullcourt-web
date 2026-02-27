import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp'],
  images: { domains: ['crbswbfgtbkjinzagblg.supabase.co'] },
};

export default nextConfig;
