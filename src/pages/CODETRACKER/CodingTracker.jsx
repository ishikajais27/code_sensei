import React, { useState, useEffect } from 'react'
import { Code, Trophy, Zap, ExternalLink } from 'lucide-react'
import { Chart, registerables } from 'chart.js'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Code.css'
import axios from 'axios'

Chart.register(...registerables)

const CodingTracker = () => {
  const [questions, setQuestions] = useState([])
  const [solvedQuestions, setSolvedQuestions] = useState([])
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState([])
  const [platform, setPlatform] = useState('leetcode')
  const [language, setLanguage] = useState('Programming Language')
  const [difficulty, setDifficulty] = useState('easy')
  const [topic, setTopic] = useState('Operators')
  const [loading, setLoading] = useState(false)
  const [todaySolvedCount, setTodaySolvedCount] = useState(0)
  const [activityDates, setActivityDates] = useState([])

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      const storedCount = localStorage.getItem('todaySolvedCount')
      const lastUpdated = localStorage.getItem('lastUpdated')
      const storedActivityDates = JSON.parse(
        localStorage.getItem('activityDates') || '[]'
      )
      const storedSolvedQuestions = JSON.parse(
        localStorage.getItem('solvedQuestions') || '[]'
      )
      const storedStreak = localStorage.getItem('streak') || '0'
      const storedAchievements = JSON.parse(
        localStorage.getItem('achievements') || '[]'
      )

      // Handle today's solved count
      if (storedCount) {
        const now = new Date()
        const lastUpdatedDate = new Date(lastUpdated)

        if (now - lastUpdatedDate >= 24 * 60 * 60 * 1000) {
          localStorage.setItem('todaySolvedCount', '0')
          localStorage.setItem('lastUpdated', now.toISOString())
          setTodaySolvedCount(0)
        } else {
          setTodaySolvedCount(parseInt(storedCount))
        }
      } else {
        localStorage.setItem('todaySolvedCount', '0')
        localStorage.setItem('lastUpdated', new Date().toISOString())
        setTodaySolvedCount(0)
      }

      // Load other data
      setActivityDates(storedActivityDates)
      setSolvedQuestions(storedSolvedQuestions)
      setStreak(parseInt(storedStreak))
      setAchievements(storedAchievements)
    }

    loadUserData()
  }, [])

  // Fetch questions from backend API
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      try {
        const params = {
          platform,
          language,
          difficulty,
        }

        // Only add topic if language is 'Programming Language'
        if (language === 'Programming Language') {
          params.topic = topic
        }

        const response = await axios.get(
          'https://code-sensei-backend.onrender.com/api/questions',
          {
            params,
          }
        )

        setQuestions(response.data || [])
      } catch (error) {
        console.error('Error fetching questions:', error)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [platform, language, difficulty, topic])

  // Mark question as solved
  const markSolved = (id) => {
    if (!solvedQuestions.includes(id)) {
      const newSolvedQuestions = [...solvedQuestions, id]
      const newCount = todaySolvedCount + 1
      const today = new Date().toISOString().split('T')[0]
      const updatedActivityDates = [...new Set([...activityDates, today])]
      const newStreak = streak + 1

      // Update state
      setSolvedQuestions(newSolvedQuestions)
      setTodaySolvedCount(newCount)
      setActivityDates(updatedActivityDates)
      setStreak(newStreak)

      // Update localStorage
      localStorage.setItem('todaySolvedCount', newCount.toString())
      localStorage.setItem('lastUpdated', new Date().toISOString())
      localStorage.setItem(
        'activityDates',
        JSON.stringify(updatedActivityDates)
      )
      localStorage.setItem(
        'solvedQuestions',
        JSON.stringify(newSolvedQuestions)
      )
      localStorage.setItem('streak', newStreak.toString())

      // Check achievements
      checkAchievements(newSolvedQuestions.length)
    }
  }

  // Check for achievements
  const checkAchievements = (solvedCount) => {
    if (solvedCount >= 10 && !achievements.includes('Solved 10 Questions')) {
      const newAchievements = [...achievements, 'Solved 10 Questions']
      setAchievements(newAchievements)
      localStorage.setItem('achievements', JSON.stringify(newAchievements))
      alert('Achievement Unlocked: Solved 10 Questions! 🎉')
    }
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
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold flex items-center mb-4">
          <Code className="mr-2" /> Coding Question Tracker
        </h2>

        {/* Today's solved count */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 text-yellow-400" /> Total Questions Solved
            Today: {todaySolvedCount}
          </h3>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Platform Filter */}
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="leetcode">LeetCode</option>
            <option value="hackerrank">HackerRank</option>
            <option value="codechef">CodeChef</option>
          </select>

          {/* Language Filter */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="Programming Language">Programming Language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Topic Filter - Only for Programming Language */}
          {language === 'Programming Language' && (
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="Operators">Operators</option>
              <option value="Control-Statements">Control Statements</option>
              <option value="array_and_string">Array and String</option>
              <option value="pointers">Pointers</option>
              <option value="user_defined_datatypes">
                User Defined Datatypes
              </option>
            </select>
          )}
        </div>

        {/* Questions List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold flex items-center mb-3">
            <Zap className="mr-2 text-yellow-400" /> Questions
          </h3>
          {loading ? (
            <p className="text-gray-300">Loading questions...</p>
          ) : questions.length === 0 ? (
            <p className="text-gray-300">
              No questions available for this selection.
            </p>
          ) : (
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <span className="text-white">{question.title}</span>
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
                    disabled={solvedQuestions.includes(question.id)}
                    className={`px-4 py-2 rounded transition-colors ${
                      solvedQuestions.includes(question.id)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {solvedQuestions.includes(question.id)
                      ? 'Solved ✓'
                      : 'Mark as Solved'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="flex items-center mb-4">
          <span className="text-lg">🔥 {streak}-day streak!</span>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold flex items-center mb-3">
            <Trophy className="mr-2 text-yellow-400" /> Achievements
          </h3>
          {achievements.length === 0 ? (
            <p className="text-gray-300">
              No achievements unlocked yet. Keep solving!
            </p>
          ) : (
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-2 rounded flex items-center"
                >
                  <span className="text-yellow-400 mr-2">🏆</span>
                  <span className="text-white">{achievement}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Calendar */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Zap className="mr-2 text-green-400" /> Activity Calendar
          </h3>
          <div className="bg-gray-800 p-4 rounded-lg">
            <Calendar
              tileContent={tileContent}
              className="custom-calendar text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodingTracker
