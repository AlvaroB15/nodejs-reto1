import { FastifyRequest, FastifyReply } from 'fastify';
import {GetUsersUseCase} from '../../../../application/usecases/get-users.usecase';

export class UsersController {
    constructor(private readonly listUsersUseCase: GetUsersUseCase) {}

    async handle(_request: FastifyRequest, reply: FastifyReply) {
        try {
            const listUsers = await this.listUsersUseCase.execute();

            reply.code(201).send({
                message: 'Lista de usuarios correctamente',
                user: listUsers,
                success: true
            });
        } catch (error) {
            if (error instanceof Error) {
                reply.code(400).send({ error: error.message,  success: false });
            } else {
                reply.code(500).send({ error: 'Error interno del servidor',  success: false });
            }
        }
    }
}
