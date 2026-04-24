import * as imageService from '../service/imageService.js';

const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { folderId } = req.body;
        const userId = req.body.userId || req.user?.id;

        if (!folderId) {
            return res.status(400).json({ error: 'Folder ID is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const image = await imageService.saveImage(req.file, folderId, userId);
        res.status(201).json({
            message: 'Image uploaded successfully',
            image
        });
    } catch (error) {
        next(error);
    }
};

const getImages = async (req, res, next) => {
    try {
        const { folderId } = req.params;

        if (!folderId) {
            return res.status(400).json({ error: 'Folder ID is required' });
        }

        const images = await imageService.getImagesByFolder(folderId);
        res.json(images);
    } catch (error) {
        next(error);
    }
};

const deleteImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const image = await imageService.deleteImage(id);
        res.json({ message: 'Image deleted successfully', image });
    } catch (error) {
        next(error);
    }
};

const getImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const image = await imageService.getImageById(id);

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.json(image);
    } catch (error) {
        next(error);
    }
};

export { uploadImage, getImages, deleteImage, getImage };
