const mongoose = require('mongoose')
const Question = require('./models/questionModel')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB for data import'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Function to process platform data
const processPlatformData = async (platformName, platformData) => {
  const operations = []

  // Process Programming Language questions
  if (platformData['Programming Language']) {
    const langData = platformData['Programming Language']

    for (const topic in langData) {
      for (const difficulty in langData[topic]) {
        const questions = langData[topic][difficulty]

        if (Array.isArray(questions)) {
          operations.push({
            updateOne: {
              filter: {
                platform: platformName,
                language: 'Programming Language',
                topic: topic,
                difficulty: difficulty,
              },
              update: {
                $setOnInsert: {
                  platform: platformName,
                  language: 'Programming Language',
                  topic: topic,
                  difficulty: difficulty,
                },
                $set: { questions: questions },
              },
              upsert: true,
            },
          })
        }
      }
    }
  }

  // Process other languages if they exist
  for (const language in platformData) {
    if (language !== 'Programming Language') {
      for (const difficulty in platformData[language]) {
        const questions = platformData[language][difficulty]

        if (Array.isArray(questions)) {
          operations.push({
            updateOne: {
              filter: {
                platform: platformName,
                language: language,
                topic: 'General', // Default topic for language-specific questions
                difficulty: difficulty,
              },
              update: {
                $setOnInsert: {
                  platform: platformName,
                  language: language,
                  topic: 'General',
                  difficulty: difficulty,
                },
                $set: { questions: questions },
              },
              upsert: true,
            },
          })
        }
      }
    }
  }

  if (operations.length > 0) {
    await Question.bulkWrite(operations)
  }
}

// Import data
const importData = async () => {
  try {
    console.log('Starting data import...')

    // Load JSON files
    const leetcode = require('./data/leetcode.json')
    const hackerrank = require('./data/hackerrank.json')
    const codechef = require('./data/codechef.json')

    // Process each platform
    await processPlatformData('leetcode', leetcode.leetcode)
    await processPlatformData('hackerrank', hackerrank.hackerrank)
    await processPlatformData('codechef', codechef.codechef)

    console.log('Data imported successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error importing data:', error)
    process.exit(1)
  }
}

importData()
