import PostMessage from '../models/PostMessage.js'
import mongoose from "mongoose";

class PostsController {
    async getPosts(req, res) {
        const {page} = req.query
        try {
            const limit = 4
            const startIndex = (Number(page) - 1) * limit
            const total = await PostMessage.countDocuments({})
            const posts = await PostMessage.find().sort({_id: -1}).limit(limit).skip(startIndex)
            res.status(200).json({data: posts, currentPage: Number(page), totalPagesCount: Math.ceil(total / limit)})
        } catch (e) {
            res.status(404).json({message: e.message})
        }
    }

    async getPost(req, res) {
        const {id} = req.params
        try {
            const post = await PostMessage.findById({_id: id})
            res.status(200).json(post)
        } catch (e) {
            res.status(404).json({message: e.message})
        }
    }

    async getPostsBySearch(req, res) {
        const {searchQuery, tags} = req.query
        try {
            const title = new RegExp(searchQuery, 'i')
            const posts = await PostMessage.find({$or: [{title}, {tags: {$in: tags.split(',')}}]})
            res.status(200).json(posts)
        } catch (e) {
            res.status(404).json({message: e.message})
        }
    }

    async createPost(req, res) {
        const post = req.body
        const newPost = new PostMessage({...post, tags: [...post.tags.join(',').replace(' ', '').split(',')], author: req.userId, createdAt: new Date().toISOString()})
        try {
            await newPost.save()
            res.status(201).json(newPost)
        } catch (e) {
            res.status(409).json({message: e.message})
        }
    }

    async updatePost(req, res) {
        const post = req.body
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
        try {
            const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
            res.status(200).json(updatedPost)
        } catch (e) {
            res.status(409).json({message: e.message})
        }
    }

    async deletePost(req, res) {
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
        try {
            await PostMessage.findByIdAndDelete(id)
            res.status(200).json('Post deleted')
        } catch (e) {
            res.status(409).json({message: e.message})
        }
    }

    async likePost(req, res) {
        const {id} = req.params
        if (!req.userId) res.json('Unauthorized.')
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
        try {
            const post = await PostMessage.findById(id)
            const index = post.likes.findIndex((id) => id === String(req.userId))
            if (index === -1) {
                post.likes.push(req.userId)
            } else {
                post.likes = post.likes.filter((id) => id !== String(req.userId))
            }
            const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
            res.status(200).json(updatedPost)
        } catch (e) {
            res.status(409).json({message: e.message})
        }
    }

    async commentPost(req, res) {
        const {id} = req.params
        const {comment} = req.body
        if (!req.userId) res.json('Unauthorized.')
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id')
        try {
            const post = await PostMessage.findById(id)
            post.comments.push(comment)
            const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})
            res.status(200).json(updatedPost)
        } catch (e) {
            res.status(409).json({message: e.message})
        }
    }
}

export default new PostsController()