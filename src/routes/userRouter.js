const { Router } = require('express')
const authMiddleware = require('../middleware/authentication')

const { createUser, loginUser, logoutUser } = require('../controllers/users')

const apiRouter = Router()

apiRouter.post( '/signup', createUser )
apiRouter.post( '/login', loginUser )
apiRouter.post( '/logout', authMiddleware, logoutUser )



module.exports = apiRouter