import mongoose from 'mongoose';

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dance_studio';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    const host = conn.connection.host;
    console.log(`[Database] MongoDB connected successfully: ${host}`);
    return host;
  } catch (error: any) {
    console.warn(`[Database] Connection to ${uri} failed: ${error.message}`);
    
    // In-memory MongoDB fallback for testing environments where mongod is not installed
    try {
      console.log('[Database] Initializing in-memory MongoDB fallback for testing...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const memoryConn = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB: ${memoryUri}`);
      return memoryConn.connection.host;
    } catch (fallbackError: any) {
      console.error('[Database] Failed to connect to primary or in-memory MongoDB:', fallbackError.message);
      throw error;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
