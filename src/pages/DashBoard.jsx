import React, { useState, useEffect } from 'react'
import { account } from '../backend/utils/appwrite'
import { useNavigate, Link, Routes, Route } from 'react-router-dom'
import TaskManager from '../pages/TASKMANAGER/TaskManager'
import AnimePoints from '../pages/ANIME/AnimePoints'
import CoffeeCounter from '../TRIAL/CoffeeCounter'
import CodingTracker from '../pages/CODETRACKER/CodingTracker'
import LogoutButton from './LogoutButton'

const Dashboard = () => {
  const [hoursLogged, setHoursLogged] = useState(0)
  const [cupsLogged, setCupsLogged] = useState(0)
  const [userId, setUserId] = useState('')
  const navigate = useNavigate()

  // Fetch the current user's ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get()
        setUserId(user.$id)
      } catch (error) {
        console.log('Error fetching user:', error)
        navigate('/')
      }
    }

    fetchUser()
  }, [navigate])

  // Logout handler
  const handleLogout = async () => {
    try {
      await account.deleteSession('current')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <nav className="flex space-x-4">
            <Link
              to="/dashboard/taskmanager"
              className="text-blue-400 hover:text-blue-300 transition duration-300 px-3 py-2 rounded hover:bg-gray-700"
            >
              Task Manager
            </Link>
            <Link
              to="/dashboard/codingtracker"
              className="text-blue-400 hover:text-blue-300 transition duration-300 px-3 py-2 rounded hover:bg-gray-700"
            >
              Coding Tracker
            </Link>
            <Link
              to="/dashboard/animepoints"
              className="text-blue-400 hover:text-blue-300 transition duration-300 px-3 py-2 rounded hover:bg-gray-700"
            >
              Anime
            </Link>
            <LogoutButton onClick={handleLogout} />
          </nav>
        </div>

        {/* Routes Container */}
        <div className="w-full">
          <Routes>
            {/* Task Manager Route */}
            <Route
              path="taskmanager"
              element={
                <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                  <TaskManager />
                </div>
              }
            />

            {/* Coding Tracker Route - Fixed */}
            <Route
              path="codingtracker"
              element={
                <div className="w-full">
                  <CodingTracker />
                </div>
              }
            />

            {/* Anime Points Route */}
            <Route
              path="animepoints"
              element={
                <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                  <AnimePoints
                    hoursLogged={hoursLogged}
                    cupsLogged={cupsLogged}
                  />
                </div>
              }
            />

            {/* Default Route - Shows overview */}
            <Route
              path=""
              element={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Welcome Back!
                    </h3>
                    <p className="text-gray-300">
                      Select a tool from the navigation above to get started.
                    </p>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Quick Stats
                    </h3>
                    <p className="text-gray-300">Hours Logged: {hoursLogged}</p>
                    <p className="text-gray-300">Coffee Cups: {cupsLogged}</p>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Recent Activity
                    </h3>
                    <p className="text-gray-300">
                      Check your progress across all tools.
                    </p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
