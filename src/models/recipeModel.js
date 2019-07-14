const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  cuisines: [{
    cuisine: {
      type: String,
      trim: true
    }
  }],
  image: {
    type: Buffer
  },
  ingredients: [{
    ingredient: {
      type: String,
      trim: true
    },
    count: {
      type: Number
    }
  }],
  directions: [{
    direction: {
      type: String,
      trim: true
    }
  }],
  description: {
    type: String,
    trim: true
  },
  prepTime: {
    type: String,
    trim: true
  },
  cookTime: {
    type: String,
    trim: true
  }
}, {timestamps: true})

const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe