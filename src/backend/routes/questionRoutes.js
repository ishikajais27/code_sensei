const express = require('express')
const router = express.Router()
const Question = require('../models/questionModel')

// Get questions based on filters
router.get('/', async (req, res) => {
  try {
    const { platform, language, topic, difficulty } = req.query

    if (!platform || !language || !difficulty) {
      return res.status(400).json({
        message: 'Platform, language, and difficulty are required parameters',
      })
    }

    // Build query
    const query = {
      platform,
      language,
      difficulty,
    }

    // Add topic if specified and language is 'Programming Language'
    if (topic && language === 'Programming Language') {
      query.topic = topic
    } else {
      query.topic = 'General' // Default topic for language-specific questions
    }

    const result = await Question.findOne(query)

    if (!result) {
      return res.status(404).json({
        message: 'No questions found for the given criteria',
        query,
      })
    }

    res.json(result.questions)
  } catch (error) {
    console.error('Error fetching questions:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
