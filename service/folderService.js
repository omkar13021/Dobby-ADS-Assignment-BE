import Folder from '../model/folder.model.js';
import Image from '../model/image.model.js';

export const createFolder = async (name, parentId, userId) => {
    // Validate parentId if provided
    if (parentId) {
        const parentFolder = await Folder.findById(parentId);
        if (!parentFolder) {
            throw new Error('Parent folder not found');
        }
        if (parentFolder.userId.toString() !== userId.toString()) {
            throw new Error('Parent folder does not belong to this user');
        }
    }

    const folder = new Folder({
        name,
        parentId: parentId || null,
        userId
    });
    return await folder.save();
};

export const getFolderTree = async (userId) => {
    const folders = await Folder.find({ userId }).lean();
    return folders;
};

export const getFolderContents = async (userId, parentId = null) => {
    const query = { userId };
    
    if (parentId) {
        query.parentId = parentId;
    } else {
        query.parentId = null;
    }
    
    const folders = await Folder.find(query).lean();
    return folders;
};

export const getAllFolders = async (userId) => {
    return await Folder.find({ userId }).lean();
};

export const renameFolder = async (folderId, name) => {
    return await Folder.findByIdAndUpdate(
        folderId,
        { name },
        { new: true }
    );
};

export const deleteFolder = async (folderId) => {
    const folderIds = await getAllDescendantIds(folderId);
    folderIds.push(folderId);

    await Image.deleteMany({ folderId: { $in: folderIds } });
    await Folder.deleteMany({ _id: { $in: folderIds } });

    return { deletedFolders: folderIds.length };
};

const getAllDescendantIds = async (folderId) => {
    const allFolders = await Folder.find({}, '_id parentId').lean();
    const descendants = [];
    
    const findChildren = (parentId) => {
        allFolders.forEach(folder => {
            if (folder.parentId && folder.parentId.toString() === parentId.toString()) {
                descendants.push(folder._id);
                findChildren(folder._id);
            }
        });
    };
    
    findChildren(folderId);
    return descendants;
};

export const updateFolderSize = async (folderId, sizeChange) => {
    const folder = await Folder.findById(folderId);
    if (!folder) return;

    await Folder.findByIdAndUpdate(folderId, { $inc: { size: sizeChange } });

    if (folder.parentId) {
        await updateFolderSize(folder.parentId, sizeChange);
    }
};

export const getFolderById = async (folderId) => {
    return await Folder.findById(folderId);
};
