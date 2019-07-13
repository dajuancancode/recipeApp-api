const { Router } = require('express')
const multer = require('multer')
const authMiddleware = require('../middleware/authentication')

const { createUser, loginUser, logoutUser, viewUser, deleteUser, updateUser, uploadAvatar, deleteAvatar, fetchAvatar} = require('../controllers/users')

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

apiRouter.post( '/signup', createUser )
apiRouter.post( '/login', loginUser )
apiRouter.post( '/logout', authMiddleware, logoutUser )

apiRouter.get('/profile/:id', viewUser)
apiRouter.patch('/profile', authMiddleware, updateUser)

apiRouter.delete('/delete', authMiddleware, deleteUser)

apiRouter.post('/me/avatar', authMiddleware, upload.single('avatar'), uploadAvatar, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

apiRouter.delete('/me/avatar', authMiddleware, deleteAvatar)
apiRouter.get('/:id/avatar', fetchAvatar)



module.exports = apiRouter