import mongoose from 'mongoose';

interface CachedMongoose {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Adiciona 'mongoose' ao globalThis
declare global {
  var mongoose: CachedMongoose | undefined;
}

// Garante que o 'cached' está inicializado
const cached: CachedMongoose = globalThis.mongoose || { conn: null, promise: null };
globalThis.mongoose = cached; // Atribui ao globalThis para reutilização

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn; // Retorna a conexão existente
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Cria a promessa de conexão
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  cached.conn = await cached.promise; // Aguarda a promessa ser resolvida
  return cached.conn; // Retorna a conexão estabelecida
}

export default dbConnect;
