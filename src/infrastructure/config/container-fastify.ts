import { MongoUserRepository } from '../persistence/mongoose/repositories/user.repository';
import { BcryptPasswordService } from '../security/bcrypt.password.service';
import { RegisterUserUseCase } from '../../application/usecases/register-user.usecase';
import { GetUsersUseCase } from '../../application/usecases/get-users.usecase';
import { RegisterController } from '../http/fastify/controllers/register.controller';
import { UsersController } from "../http/fastify/controllers/user.controller";

export class ContainerFastify {
    // Repositorios
    private readonly userRepository: MongoUserRepository;

    // Servicios
    private readonly passwordService: BcryptPasswordService;

    // Casos de uso Fastify
    private readonly registerUserUseCase: RegisterUserUseCase;
    private readonly getUsersUseCase: GetUsersUseCase;

    // Controladores
    private readonly registerController: RegisterController;
    private readonly usersController: UsersController;

    constructor() {
        // Inicializar repositorios
        this.userRepository = new MongoUserRepository();

        // Inicializar servicios
        this.passwordService = new BcryptPasswordService();

        // Inicializar casos de uso
        this.registerUserUseCase = new RegisterUserUseCase(
            this.userRepository,
            this.passwordService
        );
        this.getUsersUseCase = new GetUsersUseCase(this.userRepository);

        // Inicializar controladores
        this.registerController = new RegisterController(this.registerUserUseCase);
        this.usersController = new UsersController(this.getUsersUseCase);
    }

    // Getters para los controladores
    getRegisterController(): RegisterController {
        return this.registerController;
    }

    getListUsersController(): UsersController{
        return this.usersController;
    }
}
