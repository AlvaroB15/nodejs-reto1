import {UsersController} from "../../../../../src/infrastructure/http/fastify/controllers/user.controller";
import {GetUsersUseCase} from "../../../../../src/application/usecases/get-users.usecase";
import {FastifyReply, FastifyRequest} from "fastify";
import {User} from "../../../../../src/domain/entities/user.entity";

describe('UsersController', () => {
    let controller: UsersController;
    let mockGetUsersUseCase: jest.Mocked<GetUsersUseCase>;
    let mockRequest: Partial<FastifyRequest>;
    let mockReply: Partial<FastifyReply>;

    beforeEach(() => {
        mockGetUsersUseCase = {
            execute: jest.fn()
        } as any;

        controller = new UsersController(mockGetUsersUseCase);

        mockRequest = {};
        mockReply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    it('debería listar usuarios exitosamente', async () => {
        const mockUsers = [
            User.create({ id: '1', fullName: 'User 1', email: 'user1@test.com', password: 'hash1' }),
            User.create({ id: '2', fullName: 'User 2', email: 'user2@test.com', password: 'hash2' })
        ];

        mockGetUsersUseCase.execute.mockResolvedValue(mockUsers);

        await controller.handle(mockRequest as FastifyRequest, mockReply as FastifyReply);

        expect(mockReply.code).toHaveBeenCalledWith(201);
        expect(mockReply.send).toHaveBeenCalledWith({
            message: 'Lista de usuarios correctamente',
            user: mockUsers,
            success: true
        });
    });
});
