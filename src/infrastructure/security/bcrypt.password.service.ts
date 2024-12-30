import bcrypt from 'bcrypt';
import { PasswordService } from '../../domain/ports/services/password.service';

export class BcryptPasswordService implements PasswordService {
    private readonly SALT_ROUNDS = 10;

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.SALT_ROUNDS);
    }

    async compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

