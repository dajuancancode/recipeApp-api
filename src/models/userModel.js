const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const { JWT_SECRET_KEY } = process.env

const Recipe = require('./recipeModel')

const socialSchema = mongoose.Schema({
  name: { type: String, trim: true},
  link: { type: String, trim: true}
})

const userSchema = mongoose.Schema({
  name: { 
    type: String,
    required: true, 
    trim: true,
    validate(value) {
      if (value === '') {
        throw new Error('Please enter your name')
      }
    }
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) { 
      if (!validator.isEmail(value)) {
        throw new Error('Please enter a valid email')
      }
    }
  },
  password: { 
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }
    }
  },
  avatar: { type: Buffer },
  socials: [socialSchema], 
  tokens: [ { token: {type: String, required: true} } ],
  resetPasswordToken: String,
  resetPasswordExpires : Date
}, {timestamps: true})

userSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'creator'
})

userSchema.methods.generateAuthToken = async function () {
  const user = this

  const token = await jwt.sign({_id: user._id}, JWT_SECRET_KEY)
  user.tokens = user.tokens.concat({token})

  await user.save()
  return token
}

userSchema.methods.generateResetToken = async function () {
  const user = this
  
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  user.resetPasswordExpires = Date.now() + 60000

  await user.save()

  return user.resetPasswordToken
}

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.statics.findUser = async function(email, password) {
  const user = await User.findOne({email})

  if (!user) {
    throw new Error('No user with that email exists')
  }

  const isMatched = await bcrypt.compare(password, user.password)

  if (!isMatched) {
    throw new Error('Incorrect password, please try again')
  }

  return user
  
}

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email is already registered'));
  } else {
    next();
  }
});

userSchema.pre('remove', async function(next) {
  const user = this

  await Recipe.deleteMany({creator: user._id})

  next()
})

userSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User