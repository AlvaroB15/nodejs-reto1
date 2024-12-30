// import isEmail from 'validator/lib/isEmail';
import validator from 'validator';

export class User {
    private constructor(
        private _id: string | null,
        private _fullName: string,
        private _email: string,
        private _password: string,
        private _phone?: string
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this._fullName || this._fullName.trim().length === 0) {
            throw new Error('El nombre es requerido');
        }
        if (!this.isValidEmail(this._email)) {
            throw new Error('Email inválido');
        }
    }

    private isValidEmail(email: string): boolean {
        // return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
        return validator.isEmail(email);
    }

    static create(props: {
        id?: string;
        fullName: string;
        email: string;
        password: string;
        phone?: string;
    }): User {
        return new User(
            props.id || null,
            props.fullName,
            props.email,
            props.password,
            props.phone
        );
    }

    // Getters
    get id(): string | null { return this._id; }
    get fullName(): string { return this._fullName; }
    get email(): string { return this._email; }
    get password(): string { return this._password; }
    get phone(): string | undefined { return this._phone; }

    // Métodos de dominio
    setPassword(hashedPassword: string): void {
        this._password = hashedPassword;
    }

    toJSON() {
        return {
            id: this._id,
            fullName: this._fullName,
            email: this._email,
            phone: this._phone
        };
    }
}
