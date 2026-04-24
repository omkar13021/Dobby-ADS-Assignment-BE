import Folder from '../model/folder.model.js';
import Image from '../model/image.model.js';

export const createFolder = async (name, parentId, userId) => {
    const folder = new Folder({
        name,
        parentId: parentId || null,
        userId
    });
    return await folder.save();
};

export const getFolderTree = async (userId) => {
    const folders = await Folder.find({ userId }).lean();
    return buildTree(folders);
};

const buildTree = (folders) => {
    const map = {};
    const roots = [];

    folders.forEach(folder => {
        map[folder._id.toString()] = { ...folder, children: [] };
    });

    folders.forEach(folder => {
        const node = map[folder._id.toString()];
        if (folder.parentId) {
            const parent = map[folder.parentId.toString()];
            if (parent) {
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    });

    return roots;
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
