import mongoose from 'mongoose'

const PostMessage = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    author: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

export default mongoose.model('PostMessage', PostMessage)