const { Router } = require('express')
const multer = require('multer')
const authMiddleware = require('../middleware/authentication')

const { createRecipe, getRecipe, editRecipe, deleteRecipe, listRecipes } = require('../controllers/recipes')

const apiRouter = Router()

apiRouter.post('/create', authMiddleware, createRecipe)
apiRouter.get('/', listRecipes)

apiRouter.get('/:id', getRecipe)
apiRouter.patch('/:id', authMiddleware, editRecipe)
apiRouter.delete('/:id', authMiddleware, deleteRecipe)

module.exports = apiRouter