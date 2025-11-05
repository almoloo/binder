import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
	transpilePackages: ['viem', 'wagmi'],
	turbopack: {
		// Turbopack expects an absolute path for the project root.
		// This points to the directory containing this config file.
		root: path.resolve(__dirname),
	},
};

export default nextConfig;
