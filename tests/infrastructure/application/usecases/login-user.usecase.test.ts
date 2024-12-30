import {LoginUserUseCase} from "../../../../src/application/usecases/login-user.usecase";
import {UserRepository} from "../../../../src/domain/ports/repositories/user.repository";
import {PasswordService} from "../../../../src/domain/ports/services/password.service";
import {TokenService} from "../../../../src/domain/ports/services/token.service";
import {LoginUserDto} from "../../../../src/application/dtos/login-user.dto";
import {User} from "../../../../src/domain/entities/user.entity";

describe('LoginUserUseCase', () => {
    let useCase: LoginUserUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockPasswordService: jest.Mocked<PasswordService>;
    let mockTokenService: jest.Mocked<TokenService>;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: jest.fn(),
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn()
        };

        mockPasswordService = {
            compare: jest.fn(),
            hash: jest.fn()
        };

        mockTokenService = {
            generate: jest.fn(),
            verify: jest.fn()
        };

        useCase = new LoginUserUseCase(
            mockUserRepository,
            mockPasswordService,
            mockTokenService
        );
    });

    it('debería hacer login exitosamente', async () => {
        const dto = new LoginUserDto('test@test.com', 'password123');
        const mockUser = User.create({
            id: '1',
            fullName: 'Test User',
            email: 'test@test.com',
            password: 'hashedPassword'
        });

        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        mockPasswordService.compare.mockResolvedValue(true);
        mockTokenService.generate.mockReturnValue('mock-token');

        const result = await useCase.execute(dto);

        expect(result.token).toBe('mock-token');
        expect(result.user.email).toBe(dto.email);
    });

    it('debería fallar con email no existente', async () => {
        const dto = new LoginUserDto('nonexistent@test.com', 'password123');
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(useCase.execute(dto)).rejects.toThrow('Credenciales inválidas');
    });
});
