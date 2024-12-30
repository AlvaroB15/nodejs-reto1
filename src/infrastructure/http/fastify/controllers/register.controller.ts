import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserUseCase } from '../../../../application/usecases/register-user.usecase';
import { RegisterUserDto } from '../../../../application/dtos/register-user.dto';
import {registerSchema} from "../schemas/register.schema";

export class RegisterController {
    constructor(private readonly registerUseCase: RegisterUserUseCase) {}

    get schema() {
        return registerSchema;
    }

    async handle(request: FastifyRequest, reply: FastifyReply) {
        try {
            const dto = RegisterUserDto.create(request.body);
            const user = await this.registerUseCase.execute(dto);

            reply.code(201).send({
                message: 'Usuario registrado exitosamente',
                user: user.toJSON(),
                success: true
            });
        } catch (error) {
            if (error instanceof Error) {
                reply.code(400).send({ message: `Error - ${error.message}`, success: false });
            } else {
                reply.code(500).send({ message: 'Error interno del servidor' , success: false });
            }
        }
    }
}
