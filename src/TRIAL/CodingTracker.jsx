import { useState, useEffect } from 'react'
import { Code, Trophy, Zap, ExternalLink } from 'lucide-react'
import { Chart, registerables } from 'chart.js'
import leetcode from './leetcode.json' // Import the JSON data
import Calendar from 'react-calendar' // Import react-calendar
import 'react-calendar/dist/Calendar.css' // Default calendar styles
import './Code.css'
Chart.register(...registerables)

const CodingQuestionTracker = () => {
  const [questions, setQuestions] = useState([])
  const [solvedQuestions, setSolvedQuestions] = useState([])
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState([])
  const [platform, setPlatform] = useState('leetcode') // Default platform
  const [language, setLanguage] = useState('Programming Language') // Default language
  const [difficulty, setDifficulty] = useState('easy') // Default difficulty
  const [topic, setTopic] = useState('Operators') // Default topic
  const [loading, setLoading] = useState(false)
  const [todaySolvedCount, setTodaySolvedCount] = useState(0)
  const [activityDates, setActivityDates] = useState([]) // Track dates of solved questions

  // Load today's solved questions from localStorage
  useEffect(() => {
    const storedCount = localStorage.getItem('todaySolvedCount')
    const lastUpdated = localStorage.getItem('lastUpdated')
    const storedActivityDates = JSON.parse(
      localStorage.getItem('activityDates') || '[]'
    )

    if (storedCount) {
      const now = new Date()
      const lastUpdatedDate = new Date(lastUpdated)

      // Reset count if more than 24 hours have passed
      if (now - lastUpdatedDate >= 24 * 60 * 60 * 1000) {
        localStorage.setItem('todaySolvedCount', '0')
        localStorage.setItem('lastUpdated', now.toISOString())
        setTodaySolvedCount(0)
      } else {
        setTodaySolvedCount(Number.parseInt(storedCount))
      }
    } else {
      localStorage.setItem('todaySolvedCount', '0')
      localStorage.setItem('lastUpdated', new Date().toISOString())
      setTodaySolvedCount(0)
    }

    // Load activity dates
    setActivityDates(storedActivityDates)
  }, [])

  // Fetch questions when platform, language, difficulty, or topic changes
  useEffect(() => {
    const loadQuestions = () => {
      setLoading(true)
      let fetchedQuestions = []
      if (language === 'Programming Language') {
        if (difficulty === 'easy') {
          fetchedQuestions =
            leetcode[platform]?.[language]?.[topic]?.[difficulty] || []
        } else {
          fetchedQuestions = leetcode[platform]?.[language]?.[difficulty] || []
        }
      } else {
        fetchedQuestions = leetcode[platform]?.[language]?.[difficulty] || []
      }
      console.log('Fetched Questions:', fetchedQuestions) // Debugging
      setQuestions(fetchedQuestions)
      setLoading(false)
    }
    loadQuestions()
  }, [platform, language, difficulty, topic])

  // Mark question as solved
  const markSolved = (id) => {
    if (!solvedQuestions.includes(id)) {
      setSolvedQuestions([...solvedQuestions, id])

      // Update today's solved count
      const newCount = todaySolvedCount + 1
      setTodaySolvedCount(newCount)

      // Update activity dates
      const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format
      const updatedActivityDates = [...activityDates, today]
      setActivityDates(updatedActivityDates)

      // Update localStorage
      localStorage.setItem('todaySolvedCount', newCount.toString())
      localStorage.setItem(
        'activityDates',
        JSON.stringify(updatedActivityDates)
      )

      checkAchievements()
      updateStreak()
    }
  }

  // Check for achievements
  const checkAchievements = () => {
    if (
      solvedQuestions.length + 1 === 10 &&
      !achievements.includes('Solved 10 Questions')
    ) {
      setAchievements([...achievements, 'Solved 10 Questions'])
      alert('Achievement Unlocked: Solved 10 Questions! 🎉')
    }
  }

  // Update streak
  const updateStreak = () => {
    setStreak((prev) => prev + 1)
  }

  // Custom tile content for react-calendar
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0]
      if (activityDates.includes(dateString)) {
        return <div className="react-calendar__tile--hasActive"></div>
      }
    }
    return null
  }

  return (
    <div className="w-7xl p-2">
      <div className="bg-gray-900 text-white p-9 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold flex items-center mb-4">
          <Code className="mr-2" /> Coding Question Tracker
        </h2>

        {/* Display total questions solved today */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 text-yellow-400" /> Total Questions Solved
            Today: {todaySolvedCount}
          </h3>
        </div>

        {/* Platform, Language, Difficulty, and Topic Selection */}
        <div className="flex space-x-4 mb-4">
          {/* Platform Filter */}
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="leetcode">LeetCode</option>
            <option value="hackerrank">HackerRank</option>
            <option value="codechef">CodeChef</option>
          </select>

          {/* Programming Language Filter */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="Programming Language">Programming Language</option>
            <option value="javascript">JavaScript</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Topic Filter - Only for Easy Mode and Programming Language */}
          {difficulty === 'easy' && language === 'Programming Language' && (
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            >
              <option value="Operators">Operators</option>
              <option value="Control-Statements">Control Statements</option>
              <option value="array_and_string">array_and_string</option>
              <option value="pointers">pointers</option>
              <option value="user_defined_datatypes">
                user_defined_datatypes
              </option>
            </select>
          )}
        </div>

        {/* Questions List */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 text-yellow-400" /> Questions
          </h3>
          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <ul>
              {questions.map((question) => (
                <li
                  key={question.id}
                  className="flex justify-between items-center mb-2"
                >
                  <div>
                    <span>{question.title}</span>
                    <a
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-400 hover:text-blue-600"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <button
                    onClick={() => markSolved(question.id)}
                    className={`px-2 py-1 rounded ${
                      solvedQuestions.includes(question.id)
                        ? 'bg-green-600'
                        : 'bg-blue-600'
                    }`}
                  >
                    {solvedQuestions.includes(question.id)
                      ? 'Solved'
                      : 'Mark as Solved'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Streak */}
        <div className="flex items-center mb-4">
          <span className="text-sm">🔥 {streak}-day streak!</span>
        </div>

        {/* Achievements */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Trophy className="mr-2 text-yellow-400" /> Achievements
          </h3>
          <ul>
            {achievements.map((achievement, index) => (
              <li key={index} className="text-sm">
                🏆 {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Custom Activity Calendar */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 text-green-400 my-8" /> Activity Calendar
          </h3>
          <Calendar
            tileContent={tileContent} // Highlight active dates
            className="custom-calendar bg-gray-800 text-white rounded-lg p-2"
          />
        </div>
      </div>
    </div>
  )
}

export default CodingQuestionTracker
