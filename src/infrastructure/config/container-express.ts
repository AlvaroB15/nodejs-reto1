import { MongoUserRepository } from '../persistence/mongoose/repositories/user.repository';
import { BcryptPasswordService } from '../security/bcrypt.password.service';
import { JwtTokenService } from '../security/jwt.token.service';
import { LoginUserUseCase } from '../../application/usecases/login-user.usecase';
import { LoginController } from '../http/express/controllers/login.controller';

export class ContainerExpress {
    // Repositorios
    private readonly userRepository: MongoUserRepository;

    // Servicios
    private readonly passwordService: BcryptPasswordService;
    private readonly tokenService: JwtTokenService;

    // Casos de uso ExpressJS
    private readonly loginUserUseCase: LoginUserUseCase;

    // Controladores
    private readonly loginController: LoginController;

    constructor() {
        // Inicializar repositorios
        this.userRepository = new MongoUserRepository();

        // Inicializar servicios
        this.passwordService = new BcryptPasswordService();
        this.tokenService = new JwtTokenService(process.env.JWT_SECRET!);

        // Inicializar casos de uso
        this.loginUserUseCase = new LoginUserUseCase(
            this.userRepository,
            this.passwordService,
            this.tokenService
        );

        // Inicializar controladores
        this.loginController = new LoginController(this.loginUserUseCase);
    }

    // Getters para los controladores

    getLoginController(): LoginController {
        return this.loginController;
    }
}
