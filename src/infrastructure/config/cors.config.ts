export const corsOptions = {
    origin: ['http://localhost:4200'], // Ajusta esto según tus necesidades (URL de tu frontend Angular)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};
