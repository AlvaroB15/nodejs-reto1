import { LoginUserDto } from '../dtos/login-user.dto';
import { UserRepository } from '../../domain/ports/repositories/user.repository';
import { PasswordService } from '../../domain/ports/services/password.service';
import { TokenService } from '../../domain/ports/services/token.service';

interface LoginResponse {
    user: {
        id: string;
        fullName: string;
        email: string;
    };
    token: string;
}

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService
    ) {}

    async execute(dto: LoginUserDto): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isValidPassword = await this.passwordService.compare(
            dto.password,
            user.password
        );

        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }

        const token = this.tokenService.generate({
            id: user.id,
            email: user.email
        });

        return {
            user: {
                id: user.id!,
                fullName: user.fullName,
                email: user.email
            },
            token
        };
    }
}
