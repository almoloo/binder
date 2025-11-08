import { MongoClient, Db, MongoClientOptions } from 'mongodb';

class Database {
	private static instance: Database;
	private client: MongoClient | null = null;
	private db: Db | null = null;
	private uri: string;
	private dbName: string;

	private constructor() {
		this.uri = process.env.MONGODB_URI || '';
		this.dbName = process.env.MONGODB_DB || 'binder';
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	public async connect(): Promise<void> {
		if (this.client && this.db) {
			return;
		}

		if (!this.uri) {
			throw new Error('MONGODB_URI environment variable is not defined');
		}

		try {
			const options: MongoClientOptions = {
				maxPoolSize: 10,
				minPoolSize: 5,
			};

			this.client = new MongoClient(this.uri, options);
			await this.client.connect();
			this.db = this.client.db(this.dbName);

			console.log('Successfully connected to MongoDB');
		} catch (error) {
			console.error('Failed to connect to MongoDB:', error);
			throw error;
		}
	}

	public async disconnect(): Promise<void> {
		if (this.client) {
			await this.client.close();
			this.client = null;
			this.db = null;
			console.log('Disconnected from MongoDB');
		}
	}

	public getDb(): Db {
		if (!this.db) {
			throw new Error('Database not connected. Call connect() first.');
		}
		return this.db;
	}

	public getClient(): MongoClient {
		if (!this.client) {
			throw new Error('Database not connected. Call connect() first.');
		}
		return this.client;
	}

	public async healthCheck(): Promise<boolean> {
		try {
			if (!this.db) {
				return false;
			}
			await this.db.admin().ping();
			return true;
		} catch (error) {
			console.error('Health check failed:', error);
			return false;
		}
	}
}

// Export singleton instance
export const db = Database.getInstance();

// Export the class for testing purposes
export default Database;
