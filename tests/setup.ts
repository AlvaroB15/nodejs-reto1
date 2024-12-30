import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno de prueba
dotenv.config({
    path: path.resolve(__dirname, '../.env.test')
});

// Configuración global para tests
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
process.env.JWT_SECRET = 'test-secret';
