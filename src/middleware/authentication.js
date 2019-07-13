const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

const { JWT_SECRET_KEY } = process.env

passport.use(new BearerStrategy(
  async (token, done) => {
    try {
      const decoded = await jwt.verify(token, JWT_SECRET_KEY)
      const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
      if (!user) {
        return done(null, false)
      } else {
        return done(null, user)
      }
    } catch (err) {
      return done(err)
    }
  }
))

const authMiddleware = passport.authenticate('bearer', {session: false})
module.exports = authMiddleware