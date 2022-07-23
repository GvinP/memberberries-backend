import User from '../models/User.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


class UserController {
    async registration(req, res) {
        const {firstName, lastName, email, password, confirmPassword} = req.body
        try {
            const user = await User.findOne({email})
            if (user) res.status(400).json({message: 'User already exists.'})
            if (password !== confirmPassword) res.status(400).json({message: 'Passwords don\'t match.'})
            const hashedPassword = await bcrypt.hash(password, 12)
            const createdUser = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`})
            const token = jwt.sign({email: createdUser.email, id: createdUser._id}, process.env.SECRET, {expiresIn: '1h'})
            res.status(200).json({result: createdUser, token})
        } catch (e) {
            res.status(500).json({message: 'Something went wrong.'})
        }
    }

    async login(req, res) {
        const {email, password} = req.body
        try {
            const user = await User.findOne({email})
            if (!user) res.status(404).json({message: 'User doesn\'t exist.'})
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (!isPasswordCorrect) res.status(400).json({message: 'Invalid credentials.'})
            const token = jwt.sign({email: user.email, id: user._id}, process.env.SECRET, {expiresIn: '1h'})
            res.status(200).json({result: user, token})
        } catch (e) {
            res.status(500).json({message: 'Something went wrong.'})
        }
    }
}

export default new UserController()