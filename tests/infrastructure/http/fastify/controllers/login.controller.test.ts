import {LoginUserUseCase} from "../../../../../src/application/usecases/login-user.usecase";
import {LoginController} from "../../../../../src/infrastructure/http/express/controllers/login.controller";

describe('LoginController', () => {
    let controller: LoginController;
    let mockLoginUseCase: jest.Mocked<LoginUserUseCase>;
    let mockRequest: any;
    let mockResponse: any;

    beforeEach(() => {
        mockLoginUseCase = {
            execute: jest.fn()
        } as any;

        controller = new LoginController(mockLoginUseCase);

        mockRequest = {
            body: {
                email: 'test@test.com',
                password: 'password123'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis() || 'asd',
            json: jest.fn()
        };
    });

    it('debería hacer login exitosamente', async () => {
        const mockResult = {
            user: {
                id: '1',
                fullName: 'Test User',
                email: 'test@test.com'
            },
            token: 'mock-token'
        };

        mockLoginUseCase.execute.mockResolvedValue(mockResult);

        await controller.handle(mockRequest as any, mockResponse as any);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Usuario registrado exitosamente',
            user: mockResult,
            success: true
        });
    });

    it('debería manejar error de credenciales', async () => {
        mockLoginUseCase.execute.mockRejectedValue(new Error('Credenciales inválidas'));

        await controller.handle(mockRequest as any, mockResponse as any);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Credenciales inválidas',
            success: false
        });
    });
});
