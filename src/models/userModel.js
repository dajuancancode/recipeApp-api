const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
}, {timestamps: true})

userSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'author'
})

userSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

module.exports = mongoose.model('User', userSchema)