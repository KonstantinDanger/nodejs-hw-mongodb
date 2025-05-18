import mongoose from 'mongoose';
import getEnvVar from '../utils/getEnvVar.js';

export default async function initMongoConnection() {
  try {
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    const connectionString = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(connectionString);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    throw new Error(error.message);
  }
}
