const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  language: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  questions: [
    {
      id: { type: Number, required: true },
      title: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
})

// Create index for faster querying
questionSchema.index({ platform: 1, language: 1, topic: 1, difficulty: 1 })

module.exports = mongoose.model('Question', questionSchema)
