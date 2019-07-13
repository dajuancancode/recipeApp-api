const { Router } = require('express')
const authMiddleware = require('../middleware/authentication')

const { createUser, loginUser, logoutUser, viewUser, deleteUser, updateUser } = require('../controllers/users')

const apiRouter = Router()

apiRouter.post( '/signup', createUser )
apiRouter.post( '/login', loginUser )
apiRouter.post( '/logout', authMiddleware, logoutUser )

apiRouter.get('/profile/:id', viewUser)
apiRouter.patch('/profile', authMiddleware, updateUser)

apiRouter.delete('/delete', authMiddleware, deleteUser)



module.exports = apiRouter