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
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        required: false
    },
    images: [{
        imgName: {
            type: String,
            required: true
        },
        imgUrl: {
            type: String,
            required: true
        }
    }]
});

export default mongoose.model('Folder', folderSchema);