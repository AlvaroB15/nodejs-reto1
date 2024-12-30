export class LoginUserDto {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {}

    static create(data: unknown): LoginUserDto {
        if (!this.isValid(data)) {
            throw new Error('Credenciales inválidas');
        }

        return new LoginUserDto(data.email, data.password);
    }

    private static isValid(data: any): data is {
        email: string;
        password: string;
    } {
        return (
            typeof data === 'object' &&
            data !== null &&
            typeof data.email === 'string' &&
            typeof data.password === 'string'
        );
    }
}
