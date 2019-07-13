require('dotenv').config()
require('./db/mongoose')

const express = require('express')
const userRouter = require('./routes/userRouter')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/users' , userRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))