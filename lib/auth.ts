import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { siwe } from 'better-auth/plugins';
import Database from './db';

export const createAuth = () => {
	return betterAuth({
		database: mongodbAdapter(Database.getInstance().getDb()),
		plugins: [
			siwe({
				domain:
					process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
				getNonce: async () => {
					return Math.random().toString(36).substring(2);
				},
				verifyMessage: async ({ message, signature }) => {
					// This will be handled by the SIWE library internally
					return true;
				},
			}),
		],
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 5 * 60, // 5 minutes
			},
		},
		trustedOrigins: [
			process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
		],
	});
};
