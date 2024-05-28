import mongoose from 'mongoose';

const localUri =
  'mongodb+srv://antaraarifa:Antifa906@cluster0.girbauh.mongodb.net/mern-burger';
const connection: { isConnected?: number } = {};

export async function connectDB() {
  if (connection.isConnected) {
    console.log('DB is already connected');
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0]?.readyState;
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }

  if (!localUri) {
    console.error('MongoDB URI is not set');
    return;
  }

  try {
    const db = await mongoose.connect(localUri);
    console.log('✔ MongoDB Database Connected Successfully');
    connection.isConnected = db.connections[0]?.readyState;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export async function disconnectDB() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = 0;
    } else {
      console.log('not disconnected');
    }
  }
}
