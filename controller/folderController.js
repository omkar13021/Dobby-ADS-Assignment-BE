import * as folderService from '../service/folderService.js';
import * as imageService from '../service/imageService.js';

const createFolder = async (req, res, next) => {
    try {
        const { name, parentId } = req.body;
        const userId = req.body.userId || req.user?.id;
        
        if (!name) {
            return res.status(400).json({ error: 'Folder name is required' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const folder = await folderService.createFolder(name, parentId, userId);
        res.status(201).json(folder);
    } catch (error) {
        next(error);
    }
};

const getFolders = async (req, res, next) => {
    try {
        const userId = req.query.userId || req.user?.id;
        const rawParentId = req.query.parentId;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // If parentId query param exists, return contents of that folder
        if ('parentId' in req.query) {
            // Determine if root or specific folder
            const parentId = rawParentId && rawParentId.trim() !== '' ? rawParentId : null;
            
            // Validate folder exists if parentId is provided
            if (parentId) {
                const parentFolder = await folderService.getFolderById(parentId);
                if (!parentFolder) {
                    return res.status(404).json({ error: 'Folder not found' });
                }
                // Verify folder belongs to user
                if (parentFolder.userId.toString() !== userId) {
                    return res.status(403).json({ error: 'Access denied' });
                }
            }
            
            const folders = await folderService.getFolderContents(userId, parentId);
            const images = parentId 
                ? await imageService.getImagesByFolder(parentId)
                : [];
            
            res.json({ folders, images });
        } else {
            // Return all folders (for tree building)
            const allFolders = await folderService.getFolderTree(userId);
            res.json(allFolders);
        }
    } catch (error) {
        next(error);
    }
};

const renameFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'New folder name is required' });
        }

        const folder = await folderService.renameFolder(id, name);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        res.json(folder);
    } catch (error) {
        next(error);
    }
};

const deleteFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await folderService.deleteFolder(id);
        res.json({ message: 'Folder deleted successfully', ...result });
    } catch (error) {
        next(error);
    }
};

const getFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const folder = await folderService.getFolderById(id);
        
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        res.json(folder);
    } catch (error) {
        next(error);
    }
};

export { createFolder, getFolders, renameFolder, deleteFolder, getFolder };