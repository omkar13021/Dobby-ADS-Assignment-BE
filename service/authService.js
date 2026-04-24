import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

const SALT_ROUNDS = 10;

export const registerUser = async (name, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return { id: user._id, name: user.name, email: user.email };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const payload = { userId: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: { id: user._id, name: user.name, email: user.email }
    };
};

export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error('Refresh token required');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
    }

    const payload = { userId: user._id, email: user.email };
    const newAccessToken = generateAccessToken(payload);

    return {
        accessToken: newAccessToken,
        user: { id: user._id, name: user.name, email: user.email }
    };
};

export const logoutUser = async (refreshToken) => {
    if (!refreshToken) return;

    try {
        const decoded = verifyRefreshToken(refreshToken);
        await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
    } catch (error) {
        // Token invalid or expired, ignore
    }
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password -refreshToken');
    return user;
};
