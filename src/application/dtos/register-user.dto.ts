export class RegisterUserDto {
    constructor(
        public readonly fullName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly phone?: string
    ) {}

    static create(data: unknown): RegisterUserDto {
        if (!this.isValid(data)) {
            throw new Error('Datos de registro inválidos');
        }

        return new RegisterUserDto(
            data.fullName,
            data.email,
            data.password,
            data.phone
        );
    }

    private static isValid(data: any): data is {
        fullName: string;
        email: string;
        password: string;
        phone?: string;
    } {
        return (
            typeof data === 'object' &&
            data !== null &&
            typeof data.fullName === 'string' &&
            typeof data.email === 'string' &&
            typeof data.password === 'string' &&
            (data.phone === undefined || typeof data.phone === 'string')
        );
    }
}
