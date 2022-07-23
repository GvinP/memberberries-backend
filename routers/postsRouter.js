import express from 'express'
import postsController from '../controllers/postsController.js'
import auth from "../middleware/authMiddleware.js";

const router = express.Router()

router.get('/', postsController.getPosts)
router.get('/search', postsController.getPostsBySearch)
router.get('/:id', postsController.getPost)
router.post('/', auth, postsController.createPost)
router.patch('/:id', auth, postsController.updatePost)
router.delete('/:id', auth, postsController.deletePost)
router.patch('/:id/like', auth, postsController.likePost)
router.post('/:id/comment', auth, postsController.commentPost)

export default router