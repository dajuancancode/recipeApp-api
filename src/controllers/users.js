const sharp = require('sharp')
const User = require('../models/userModel')

const createUser = async (req, res) => {
  const user = new User(req.body)
  
  try {
    await user.save()
    const token = await user.generateAuthToken()
    
    res.status(201).send({user, token})
  } catch (e) {
    res.status(400).send()
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    const user = await User.findUser(email, password)
    const token = await user.generateAuthToken()
    
    res.send({user, token})
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const logoutUser = async (req, res) => {
  try {
    const user = req.user
    user.tokens = []
    user.save()
    res.send({user})
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const viewUser = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id})
    res.send(user)
  } catch (e) {
    res.status(400).send()
  }
}


const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({_id: req.user._id})
    res.send({user})
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const updateUser = async (req,res) => {
  const updates = Object.keys(req.body)
    
  try {
    updates.forEach(update => req.user[update] = req.body[update])
    req.user.save()
    res.send(req.user)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}


const uploadAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()

  req.user.avatar = buffer
  await req.user.save()
  res.send()
}

const deleteAvatar = async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
}

const fetchAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
}
module.exports = { createUser, loginUser, logoutUser, viewUser, deleteUser, updateUser, uploadAvatar, deleteAvatar, fetchAvatar }