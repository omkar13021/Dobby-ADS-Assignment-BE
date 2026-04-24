import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { register, login, logout } from '../controller/authController.js';

const router = express.Router();

router.post('/register', checkSchema({
    name: {
        in: ['body'],
        notEmpty: { errorMessage: 'Name is required' },
        isString: { errorMessage: 'Name must be a string' },
        trim: true,
        isLength: { options: { min: 2, max: 50 }, errorMessage: 'Name must be 2-50 characters' }
    },
    email: {
        in: ['body'],
        notEmpty: { errorMessage: 'Email is required' },
        isEmail: { errorMessage: 'Invalid email format' },
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        notEmpty: { errorMessage: 'Password is required' },
        isLength: { options: { min: 6 }, errorMessage: 'Password must be at least 6 characters' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, register);

router.post('/login', checkSchema({
    email: {
        in: ['body'],
        notEmpty: { errorMessage: 'Email is required' },
        isEmail: { errorMessage: 'Invalid email format' },
        normalizeEmail: true
    },
    password: {
        in: ['body'],
        notEmpty: { errorMessage: 'Password is required' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, login);

router.post('/logout', logout);

export default router;
