const { Router } = require('express')
const multer = require('multer')
const authMiddleware = require('../middleware/authentication')

const { createRecipe } = require('../controllers/recipes')

const apiRouter = Router()

apiRouter.post('/create', authMiddleware, createRecipe)

module.exports = apiRouter