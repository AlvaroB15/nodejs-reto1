import jwt from 'jsonwebtoken';
import { TokenService } from '../../domain/ports/services/token.service';

export class JwtTokenService implements TokenService {
    constructor(private readonly secretKey: string) {}

    generate(payload: Record<string, any>): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: '1d' });
    }

    verify(token: string): Record<string, any> {
        return jwt.verify(token, this.secretKey) as Record<string, any>;
    }
}
