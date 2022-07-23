import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import postsRouter from './routers/postsRouter.js'
import userRouter from './routers/userRouter.js'

const app = express()
dotenv.config()

app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(cors())
app.use('/posts', postsRouter)
app.use('/user', userRouter)

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000

const start = () => {
    try {
        app.listen(PORT, async ()=>{
            mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
            console.log(`server started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e.message)
    }
}

start()