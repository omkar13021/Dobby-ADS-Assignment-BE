import * as authService from '../service/authService.js';
import { COOKIE_OPTIONS } from '../utils/jwt.js';

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.registerUser(name, email, password);
        res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
        if (error.message === 'Email already registered') {
            return res.status(409).json({ error: error.message });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await authService.loginUser(email, password);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken, user });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ error: error.message });
        }
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const { accessToken, user } = await authService.refreshAccessToken(refreshToken);
        res.json({ accessToken, user });
    } catch (error) {
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};

const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        await authService.logoutUser(refreshToken);
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        next(error);
    }
};

export { register, login, refresh, logout, getMe };