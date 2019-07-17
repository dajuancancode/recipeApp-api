const { Router } = require('express')
const multer = require('multer')
const authMiddleware = require('../middleware/authentication')

const users = require('../controllers/users')

const apiRouter = Router()

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error('Please upload a image'))
    }
    
    cb(undefined, true)
  }
})

apiRouter.post( '/signup',users.createUser )
apiRouter.post( '/login', users.loginUser )
apiRouter.post( '/logout', authMiddleware, users.logoutUser )

apiRouter.get('/profile/:id', users.viewUser)
apiRouter.patch('/profile', authMiddleware, users.updateUser)

apiRouter.delete('/delete', authMiddleware, users.deleteUser)

apiRouter.post('/me/avatar', authMiddleware, upload.single('avatar'), users.uploadAvatar, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

apiRouter.delete('/me/avatar', authMiddleware, users.deleteAvatar)
apiRouter.get('/:id/avatar', users.fetchAvatar)

apiRouter.post('/forget', users.forgotPassword)
apiRouter.post('/reset/:token', users.resetPassword)



module.exports = apiRouter