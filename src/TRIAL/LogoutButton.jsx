// src/components/LogoutButton.jsx
import React from 'react'
import { account } from '../utils/appwrite'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await account.deleteSession('current') // Delete the current session
      navigate('/') // Redirect to the sign-in page
    } catch (err) {
      console.error('Logout failed:', err.message)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  )
}

export default LogoutButton
