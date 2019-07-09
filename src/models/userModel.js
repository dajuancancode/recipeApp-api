const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env

const socialSchema = mongoose.Schema({
  name: { type: String, trim: true},
  link: { type: String, trim: true}
})

const userSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true},
  email: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) { 
      if (!validator.isEmail(value)) {
        throw new Error('Must enter a valid email')
      }
    }
  },
  password: { type: String, required: true, trim: true},
  avatar: { type: Buffer },
  socials: [socialSchema], 
  tokens: [ { token: {type: String, required: true} } ]
}, {timestamps: true})

userSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'author'
})

userSchema.methods.generateAuthToken = async function () {
  const user = this

  const token = await jwt.sign({_id: user._id}, SECRET_KEY)
  user.tokens = user.tokens.concat({token})

  await user.save()
  return token
}

userSchema.statics.findUser = async function (email, password) {

  const user = await User.findOne({email})

  if (!user) {
    throw new Error('No user found with that email address')
  }

  const hashedPassword = await bcrypt.compare(password, user.password)
  
  if (!hashedPassword) {
    throw new Error('Invalid Password')
  }

  return user

}

userSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User