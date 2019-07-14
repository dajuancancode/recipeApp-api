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

const listRecipes = async(req, res) => {
  const matches = Object.keys(req.body)
  const possibleMatches = ['cusines.cuisine', 'dishType.dishTypes', 'name', 'diets.diet']

  const matchObject = {}
  const sort = {}

  matches.forEach(match => {
    if (possibleMatches.includes(match)) {
      matchObject[match] = req.body[match]
    }
  })
  
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  const options =  {
    limit: parseInt(req.query.limit),
    sort
  }

  try {
    const recipes = await Recipe.find(matchObject, null, options)
    res.send(recipes)
  } catch (e) {
    res.status(404).send()
  }
}

module.exports = { createRecipe, getRecipe, editRecipe, deleteRecipe, listRecipes }