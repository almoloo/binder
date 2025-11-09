import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
	transpilePackages: ['viem', 'wagmi'],
	turbopack: {
		root: path.resolve(__dirname),
	},
	webpack: (config) => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding');
		return config;
	},
};

export default nextConfig;
