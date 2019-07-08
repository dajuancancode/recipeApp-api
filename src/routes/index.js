const { Router } = require('express')
const { createUser } = require('../controllers/users')

const apiRouter = Router()

apiRouter.post('/users/signup', createUser)


module.exports = apiRouter