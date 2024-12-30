import { body, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const loginValidationRules: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail()
        .trim(),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isString()
        .withMessage('La contraseña debe ser texto')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener entre minimo 8 caracteres')
        .matches(/[A-Z]/)
        .withMessage('La contraseña debe contener al menos una mayúscula')
        .matches(/[0-9]/)
        .withMessage('La contraseña debe contener al menos un número')
];

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map(err => ({
                // field: err,
                message: err.msg
            }))
        });
    }
    next();
};
