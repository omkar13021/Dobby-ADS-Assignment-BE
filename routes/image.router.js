import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { uploadImage, getImages, deleteImage, getImage } from '../controller/imageController.js';
import upload from '../service/multerService.js';

const router = express.Router();

router.post('/upload', upload.single('image'), checkSchema({
    folderId: {
        in: ['body'],
        notEmpty: { errorMessage: 'Folder ID is required' },
        isMongoId: { errorMessage: 'Invalid folder ID' }
    },
    userId: {
        in: ['body'],
        notEmpty: { errorMessage: 'User ID is required' },
        isMongoId: { errorMessage: 'Invalid user ID' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, uploadImage);

router.get('/folder/:folderId', checkSchema({
    folderId: {
        in: ['params'],
        notEmpty: { errorMessage: 'Folder ID is required' },
        isMongoId: { errorMessage: 'Invalid folder ID' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, getImages);

router.get('/:id', checkSchema({
    id: {
        in: ['params'],
        notEmpty: { errorMessage: 'Image ID is required' },
        isMongoId: { errorMessage: 'Invalid image ID' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, getImage);

router.delete('/:id', checkSchema({
    id: {
        in: ['params'],
        notEmpty: { errorMessage: 'Image ID is required' },
        isMongoId: { errorMessage: 'Invalid image ID' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, deleteImage);

export default router;
