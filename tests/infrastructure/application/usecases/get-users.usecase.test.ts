import {GetUsersUseCase} from "../../../../src/application/usecases/get-users.usecase";
import {UserRepository} from "../../../../src/domain/ports/repositories/user.repository";
import {User} from "../../../../src/domain/entities/user.entity";

describe('GetUsersUseCase', () => {
    let useCase: GetUsersUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            findAll: jest.fn(),
            save: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn()
        };
        useCase = new GetUsersUseCase(mockUserRepository);
    });

    it('debería obtener lista de usuarios', async () => {
        const mockUsers = [
            User.create({ id: '1', fullName: 'User 1', email: 'user1@test.com', password: 'hash1' }),
            User.create({ id: '2', fullName: 'User 2', email: 'user2@test.com', password: 'hash2' })
        ];

        mockUserRepository.findAll.mockResolvedValue(mockUsers);

        const result = await useCase.execute();

        expect(result).toHaveLength(2);
        expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
});
