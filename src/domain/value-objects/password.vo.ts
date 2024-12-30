export class Password {
    private constructor(private readonly value: string) {
        this.validate();
    }

    static create(value: string): Password {
        return new Password(value);
    }

    private validate(): void {
        if (this.value.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }
        if (!/[A-Z]/.test(this.value)) {
            throw new Error('La contraseña debe contener al menos una mayúscula');
        }
        if (!/[0-9]/.test(this.value)) {
            throw new Error('La contraseña debe contener al menos un número');
        }
    }

    getValue(): string {
        return this.value;
    }
}
