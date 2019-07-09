const { Router } = require('express')
const { createUser, loginUser } = require('../controllers/users')

const apiRouter = Router()

apiRouter.post('/users/signup', createUser)
apiRouter.post('/users/login', loginUser)


module.exports = apiRouter