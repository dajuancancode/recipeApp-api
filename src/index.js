require('dotenv').config()
require('./db/mongoose')

const express = require('express')
const apiRouter = require('./routes/index')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(apiRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))