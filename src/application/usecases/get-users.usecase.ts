import { UserRepository } from '../../domain/ports/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

export class GetUsersUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}
