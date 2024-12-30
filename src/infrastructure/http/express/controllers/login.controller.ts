import { Request, Response } from 'express';
import { LoginUserUseCase } from '../../../../application/usecases/login-user.usecase';
import { LoginUserDto } from '../../../../application/dtos/login-user.dto';

export class LoginController {
    constructor(private readonly loginUseCase: LoginUserUseCase) {}

    async handle(req: Request, res: Response) {
        try {
            const dto = LoginUserDto.create(req.body);
            const result = await this.loginUseCase.execute(dto);

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: result,
                success: true
            });

        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message, success: false });
            } else {
                res.status(500).json({ error: 'Error interno del servidor', success: false });
            }
        }
    }
}
