import React, { useState, useEffect } from 'react'
import { account } from '../utils/appwrite'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './SignIn.css'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await account.get()
        if (user) {
          navigate('/dashboard')
        }
      } catch (err) {
        console.log('No active session:', err.message)
      }
    }
    checkSession()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignup) {
        // Create new account
        await account.create('unique()', email, password)
        await account.createEmailPasswordSession(email, password)
      } else {
        // Login existing user
        await account.createEmailPasswordSession(email, password)
      }
      navigate('/dashboard/taskmanager')
    } catch (err) {
      setError(err.message || 'Authentication failed')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2023/09/24/15/52/ai-generated-8273245_1280.jpg')",
        }}
      ></div>

      {/* Animated Heading */}
      <motion.h1
        className="absolute top-10 text-4xl md:text-5xl font-bold text-black shadow-lg p-4 rounded-lg heading"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 1 }}
      >
        GET STARTED!!
      </motion.h1>

      <div className="bg-black bg-opacity-70 p-6 md:p-8 rounded-lg shadow-lg w-11/12 md:w-96 z-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {isSignup ? 'Sign Up' : 'Sign In'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2 text-white"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2 text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:underline"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>

      {/* Floating animated images */}
      <motion.img
        src="https://cdn.pixabay.com/photo/2018/02/23/19/40/student-3176407_960_720.png" // Student Image
        alt="Student"
        className="sticker absolute top-[10%] left-[5%] md:left-[10%] animate-float"
        initial={{ y: -10 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.img
        src="https://cdn.pixabay.com/photo/2024/02/18/13/13/ai-generated-8581189_640.jpg" // AI Image
        alt="AI Generated"
        className="sticker absolute top-[30%] right-[5%] md:right-[15%] animate-float"
        initial={{ y: -10 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.img
        src="https://cdn.pixabay.com/photo/2024/06/14/12/15/developer-8829735_640.jpg" // Developer Image
        alt="Developer"
        className="sticker absolute bottom-[20%] left-[10%] md:left-[20%] animate-float"
        initial={{ y: -10 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.img
        src="https://media.istockphoto.com/id/1455863561/vector/business-school-professor-teaching-explaining-and-writing-formula-on-chalkboard-education.jpg?s=612x612&w=0&k=20&c=U04XyaC3vKTeFtnQOdGOi7-U07LwPTCQaccJReyPwTg="
        alt="Professor Teaching"
        className="sticker absolute top-[40%] left-[5%] animate-float"
        initial={{ y: -10 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.img
        src="https://media.istockphoto.com/id/526307519/vector/coffee.jpg?s=612x612&w=0&k=20&c=BSElmyCq5SGj2WXnnfqy3uJPoEHi9KEwn51Xl8ph7Vc="
        alt="Coffee"
        className="sticker absolute bottom-[10%] right-[10%] animate-float"
        initial={{ y: -10 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  )
}

export default SignIn
