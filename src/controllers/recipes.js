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

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    
    if (!recipe) {
      res.status(404).send()
      return
    }

    res.send(recipe)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const editRecipe = async(req, res) => {
  const updates = Object.keys(req.body)

  try {
    const recipe = await Recipe.findOne({_id: req.params.id, creator: req.user._id})

    if (!recipe) {
      res.status(404).send()
      return
    }

    updates.forEach(update => {
      if (update === 'cuisines' || update === 'ingredients' || update === 'directions') {
        recipe[update] = recipe[update].concat(req.body[update])
      } else {
        recipe[update] = req.body[update]
      }
    })
    recipe.save()

    res.send({recipe})
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

const deleteRecipe = async(req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({_id: req.params.id, creator: req.user._id})
    !recipe ? res.status(404).send() : res.send(recipe)
  } catch (e) {
    console.log(e)
    res.status(400).send()
  }
}

module.exports = { createRecipe, getRecipe, editRecipe, deleteRecipe }