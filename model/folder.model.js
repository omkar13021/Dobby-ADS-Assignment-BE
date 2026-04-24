import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    },
    size: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

folderSchema.index({ userId: 1, parentId: 1 });

export default mongoose.model('Folder', folderSchema);