import { createAuth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import Database from '@/lib/db';

let auth: ReturnType<typeof createAuth> | null = null;

// Only initialize auth if environment variables are set
if (process.env.MONGODB_URI) {
	try {
		await Database.getInstance().connect();
		auth = createAuth();
	} catch (error) {
		console.warn('Failed to initialize auth during build:', error);
		// Create a minimal auth instance for build time
		auth = createAuth();
	}
} else {
	// Create auth instance without database for build time
	auth = createAuth();
}

export const { GET, POST } = toNextJsHandler(auth!);
