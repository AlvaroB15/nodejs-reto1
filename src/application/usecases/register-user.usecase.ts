import { User } from '../../domain/entities/user.entity';
import { Password } from '../../domain/value-objects/password.vo';
import { UserRepository } from '../../domain/ports/repositories/user.repository';
import { PasswordService } from '../../domain/ports/services/password.service';
import { RegisterUserDto } from '../dtos/register-user.dto';

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService
    ) {}

    async execute(dto: RegisterUserDto): Promise<User> {
        // Validar contraseña usando Value Object
        const password = Password.create(dto.password);

        // Crear usuario
        const user = User.create({
            fullName: dto.fullName,
            email: dto.email,
            password: password.getValue(),
            phone: dto.phone
        });

        // Validar reglas de aplicación
        await this.validateUserDoesNotExist(dto.email);

        // Hashear contraseña
        const hashedPassword = await this.passwordService.hash(password.getValue());
        user.setPassword(hashedPassword);

        // Persistir
        return this.userRepository.save(user);
    }

    private async validateUserDoesNotExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
    }
}
