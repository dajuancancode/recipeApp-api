require('dotenv').config()
require('./db/mongoose')

const express = require('express')

const userRouter = require('./routes/userRouter')
const recipeRouter = require('./routes/recipeRouter')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/users' , userRouter)
app.use('/recipes', recipeRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))