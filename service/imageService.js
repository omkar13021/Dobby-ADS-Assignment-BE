import Image from '../model/image.model.js';
import { updateFolderSize } from './folderService.js';
import fs from 'fs';
import path from 'path';

export const saveImage = async (file, folderId, userId) => {
    const image = new Image({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        size: file.size,
        folderId,
        userId
    });

    await image.save();
    await updateFolderSize(folderId, file.size);

    return image;
};

export const getImagesByFolder = async (folderId) => {
    return await Image.find({ folderId }).lean();
};

export const deleteImage = async (imageId) => {
    const image = await Image.findById(imageId);
    if (!image) {
        throw new Error('Image not found');
    }

    const filePath = path.join(process.cwd(), image.url);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    await updateFolderSize(image.folderId, -image.size);
    await Image.findByIdAndDelete(imageId);

    return image;
};

export const getImageById = async (imageId) => {
    return await Image.findById(imageId);
};
