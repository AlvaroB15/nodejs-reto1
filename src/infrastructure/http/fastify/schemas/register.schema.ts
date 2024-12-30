export const registerSchema = {
    body: {
        type: 'object',
        required: ['fullName', 'email', 'password'],
        properties: {
            fullName: {
                type: 'string',
            },
            email: {
                type: 'string',
                format: 'email',
            },
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[A-Z])(?=.*\\d).*$'
            },
            phone: {
                type: 'string',
                pattern: '^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$',
                nullable: true,
                maxLength: 20
            }
        },
        additionalProperties: false
    },
    response: {
        201: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        fullName: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string', nullable: true }
                    }
                },
                success: { type: 'boolean' },
            }
        },
        400: {
            type: 'object',
            properties: {
                error: { type: 'string' }
            }
        }
    }
};
