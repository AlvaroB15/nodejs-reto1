import { RegisterUserUseCase } from '../../../../src/application/usecases/register-user.usecase';
import { RegisterUserDto } from '../../../../src/application/dtos/register-user.dto';
import { UserRepository } from '../../../../src/domain/ports/repositories/user.repository';
import { PasswordService } from '../../../../src/domain/ports/services/password.service';
import { User } from '../../../../src/domain/entities/user.entity';

describe('RegisterUserUseCase', () => {
    let useCase: RegisterUserUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockPasswordService: jest.Mocked<PasswordService>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn()
        };

        mockPasswordService = {
            hash: jest.fn(),
            compare: jest.fn()
        };

        useCase = new RegisterUserUseCase(
            mockUserRepository,
            mockPasswordService
        );
    });

    it('debería registrar un usuario exitosamente', async () => {
        // Arrange
        const dto = new RegisterUserDto(
            'Test User',
            'test@example.com',
            'Test123456',
            '+1234567890'
        );

        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockPasswordService.hash.mockResolvedValue('hashedPassword');
        mockUserRepository.save.mockImplementation(user =>
            Promise.resolve(User.create({
                id: '1',
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                phone: user.phone
            }))
        );

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result).toBeDefined();
        expect(result.email).toBe(dto.email);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(dto.email);
        expect(mockPasswordService.hash).toHaveBeenCalled();
        expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('debería fallar si el email ya existe', async () => {
        // Arrange
        const dto = new RegisterUserDto(
            'Test User',
            'existing@example.com',
            'Test123456'
        );

        mockUserRepository.findByEmail.mockResolvedValue(
            User.create({
                id: '1',
                fullName: 'Existing User',
                email: 'existing@example.com',
                password: 'hashedPassword'
            })
        );

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow('El email ya está registrado');
        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('debería hashear la contraseña antes de guardar', async () => {
        // Arrange
        const dto = new RegisterUserDto(
            'Test User',
            'test@example.com',
            'Test123456'
        );

        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockPasswordService.hash.mockResolvedValue('hashedPassword');
        mockUserRepository.save.mockImplementation(user =>
            Promise.resolve(User.create({
                // id: '1',
                ...user.toJSON(),
                password: user.password,
                id: '1'
            }))
        );

        // Act
        await useCase.execute(dto);

        // Assert
        expect(mockPasswordService.hash).toHaveBeenCalledWith('Test123456');
        const saveCall = mockUserRepository.save.mock.calls[0][0];
        expect(saveCall.password).toBe('hashedPassword');
    });

    it('debería fallar con contraseña débil', async () => {
        // Arrange
        const dto = new RegisterUserDto(
            'Test User',
            'test@example.com',
            'weak'
        );

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow();
        expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
});
