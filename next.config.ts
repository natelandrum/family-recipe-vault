import 'dotenv/config';

const nextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

export default nextConfig;
