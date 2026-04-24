import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { createFolder, getFolders, renameFolder, deleteFolder, getFolder } from '../controller/folderController.js';

const router = express.Router();

router.post('/', checkSchema({
    name: {
        in: ['body'],
        notEmpty: { errorMessage: 'Folder name is required' },
        isString: { errorMessage: 'Folder name must be a string' },
        trim: true,
        isLength: { options: { min: 1, max: 100 }, errorMessage: 'Folder name must be 1-100 characters' }
    },
    parentId: {
        in: ['body'],
        optional: { options: { nullable: true } },
        isMongoId: { errorMessage: 'Invalid parent folder ID' }
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
}, createFolder);

router.get('/', checkSchema({
    userId: {
        in: ['query'],
        notEmpty: { errorMessage: 'User ID is required' },
        isMongoId: { errorMessage: 'Invalid user ID' }
    },
    parentId: {
        in: ['query'],
        optional: { options: { nullable: true, checkFalsy: true } },
        isMongoId: { errorMessage: 'Invalid parent folder ID' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, getFolders);

router.get('/:id', checkSchema({
    id: {
        in: ['params'],
        notEmpty: { errorMessage: 'Folder ID is required' },
        isMongoId: { errorMessage: 'Invalid folder ID' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, getFolder);

router.put('/:id', checkSchema({
    id: {
        in: ['params'],
        notEmpty: { errorMessage: 'Folder ID is required' },
        isMongoId: { errorMessage: 'Invalid folder ID' }
    },
    name: {
        in: ['body'],
        notEmpty: { errorMessage: 'Folder name is required' },
        isString: { errorMessage: 'Folder name must be a string' },
        trim: true,
        isLength: { options: { min: 1, max: 100 }, errorMessage: 'Folder name must be 1-100 characters' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, renameFolder);

router.delete('/:id', checkSchema({
    id: {
        in: ['params'],
        notEmpty: { errorMessage: 'Folder ID is required' },
        isMongoId: { errorMessage: 'Invalid folder ID' }
    }
}), (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    next();
}, deleteFolder);

export default router;