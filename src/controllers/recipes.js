const Recipe = require('../models/recipeModel')

const createRecipe = async (req, res) => {
  const recipe = new Recipe({
    ...req.body,
    creator: req.user._id
  })

  try {
    await recipe.save()
    res.status(201).send({recipe})
  } catch (e) {
    res.status(400).send({msg: e.message})
  }
}

module.exports = { createRecipe }