import { RegisterController } from '../../../../../src/infrastructure/http/fastify/controllers/register.controller';
import { RegisterUserUseCase } from '../../../../../src/application/usecases/register-user.usecase';
import { User } from '../../../../../src/domain/entities/user.entity';
import { FastifyRequest, FastifyReply } from 'fastify';

describe('RegisterController', () => {
    let controller: RegisterController;
    let mockRegisterUseCase: jest.Mocked<RegisterUserUseCase>;
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    beforeEach(() => {
        mockRegisterUseCase = {
            execute: jest.fn()
        } as any;

        controller = new RegisterController(mockRegisterUseCase);

        mockRequest = {
            body: {
                fullName: 'Test User',
                email: 'test@example.com',
                password: 'Test123456',
                // phone: '+1234567890'
            }
        };

        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    it('debería manejar el registro exitoso', async () => {
        // Arrange
        const mockUser = User.create({
            id: '1',
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
        });

        mockRegisterUseCase.execute.mockResolvedValue(mockUser);

        // Act
        await controller.handle(mockRequest as FastifyRequest, mockReply as FastifyReply);

        // Assert
        expect(mockReply.code).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Usuario registrado exitosamente',
            user: {
                id: "1",
                fullName: "Test User",
                email: "test@example.com",
            },
            "success": true
        });
    });

    it('debería manejar errores de validación', async () => {
        // Arrange
        mockRegisterUseCase.execute.mockRejectedValue(new Error('Error - Error de validación'));

        // Act
        await controller.handle(mockRequest as FastifyRequest, mockReply as FastifyReply);

        // Assert
        expect(mockReply.code).toHaveBeenCalledWith(400);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Error - Error - Error de validación',
            success: false
        });
    });
});
