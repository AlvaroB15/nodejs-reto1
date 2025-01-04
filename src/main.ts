import { fastifyCors } from "@fastify/cors";
import morgan from 'morgan';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import express, { Express, Request, Response } from 'express';
import cors  from 'cors';
import 'dotenv/config';
import { connectDatabase } from './infrastructure/config/database';
import { ContainerExpress } from "./infrastructure/config/container-express";
import { ContainerFastify } from "./infrastructure/config/container-fastify";
import { RegisterController } from "./infrastructure/http/fastify/controllers/register.controller";
import { UsersController } from "./infrastructure/http/fastify/controllers/user.controller";
import { LoginController } from "./infrastructure/http/express/controllers/login.controller";
import { corsOptions } from "./infrastructure/config/cors.config";
import {loginValidationRules, validateLogin} from "./infrastructure/http/express/middlewares/validate-login";

export const startFastifyServices = async (): Promise<void> => {
    const app: FastifyInstance = fastify(
        {
            logger: true
        }
    );

    // Registrar CORS en Fastify
    await app.register(fastifyCors, corsOptions);

    const container = new ContainerFastify();
    const registerController: RegisterController = container.getRegisterController();
    const listUsersController: UsersController = container.getListUsersController();
    const port = Number(process.env.PORT) || 3000; // Un solo puerto para ambos servicios

    app.post('/api/register', {
        schema: registerController.schema,
        handler: (request:FastifyRequest, reply: FastifyReply) : Promise<void> =>
            registerController.handle(request, reply)
    });


    app.get('/api/users', (request:FastifyRequest, reply: FastifyReply) : Promise<void> =>
        listUsersController.handle(request, reply)
    );

    try {
        await app.listen({ port, host: '0.0.0.0'  });
        console.log('Servidor de Fastify en el puerto 3000');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export const startExpressServices = async (): Promise<void> => {
    const app: Express = express();
    const container = new ContainerExpress();
    const loginController: LoginController = container.getLoginController();
    // const port = Number(process.env.PORT) || 3000; // Un solo puerto para ambos servicios

    app.use(express.json());
    app.use(morgan('dev'));
    // Configurar CORS en Express
    app.use(cors(corsOptions));
    app.post('/api/login', );

    app.post(
        '/api/login',
        loginValidationRules,
        // validateLogin,
        (req: Request, res: Response): Promise<void> => loginController.handle(req, res)
    );

    app.listen(3001, '0.0.0.0', () => {
        console.log('Servidor de Express en el puerto 3001');
    });
};

const bootstrap = async (): Promise<void> => {
    try {
        await connectDatabase();
        await Promise.all([
            startFastifyServices(),
            startExpressServices()
        ]);
    } catch (error) {
        console.error('Error al iniciar los servicios:', error);
        process.exit(1);
    }
};

bootstrap().catch(console.error);
