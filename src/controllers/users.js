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

module.exports = { createUser, loginUser, logoutUser }