// import React, { useState, useEffect } from 'react'
// import { account } from '../utils/appwrite'
// import { useNavigate, Link, Routes, Route } from 'react-router-dom'
// import TaskManager from './TaskManager'
// import AnimePoints from './AnimePoints'
// import CoffeeCounter from './CoffeeCounter'
// import CodingTracker from './CodingTracker'
// import LogoutButton from './LogoutButton'

// const Dashboard = () => {
//   const [hoursLogged, setHoursLogged] = useState(0)
//   const [cupsLogged, setCupsLogged] = useState(0)
//   const [userId, setUserId] = useState('') // Add userId state
//   const navigate = useNavigate()

//   // Fetch the current user's ID on component mount
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const user = await account.get()
//         setUserId(user.$id) // Set the userId
//       } catch (error) {
//         console.log('Error fetching user:', error)
//         navigate('/') // Redirect to login if there's an error
//       }
//     }

//     fetchUser()
//   }, [navigate])

//   // Logout handler
//   const handleLogout = async () => {
//     await account.deleteSession('current')
//     navigate('/')
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//           <div className="flex space-x-4">
//             <Link
//               to="/dashboard/taskmanager"
//               className="text-blue-500 hover:text-blue-700"
//             >
//               Task Manager
//             </Link>
//             <Link
//               to="/dashboard/codingtracker"
//               className="text-blue-500 hover:text-blue-700"
//             >
//               Coding Tracker
//             </Link>
//             <Link
//               to="/dashboard/coffeecounter"
//               className="text-blue-500 hover:text-blue-700"
//             >
//               Coffee Counter
//             </Link>
//             <Link
//               to="/dashboard/animepoints"
//               className="text-blue-500 hover:text-blue-700"
//             >
//               Anime Points
//             </Link>
//             <LogoutButton onClick={handleLogout} />
//           </div>
//         </div>

//         {/* Full-Page Layout for Routes */}
//         <Routes>
//           <Route
//             path="taskmanager"
//             element={
//               <div className="w-full">
//                 <TaskManager />
//               </div>
//             }
//           />
//           <Route
//             path="codingtracker"
//             element={
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <CodingTracker
//                   hoursLogged={hoursLogged}
//                   setHoursLogged={setHoursLogged}
//                 />
//               </div>
//             }
//           />
//           <Route
//             path="coffeecounter"
//             element={
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <CoffeeCounter
//                   userId={userId} // Pass userId to CoffeeCounter
//                   setCupsLogged={setCupsLogged} // Pass setCupsLogged to update state
//                 />
//               </div>
//             }
//           />
//           <Route
//             path="animepoints"
//             element={
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <AnimePoints
//                   hoursLogged={hoursLogged}
//                   cupsLogged={cupsLogged}
//                 />
//               </div>
//             }
//           />
//         </Routes>
//       </div>
//     </div>
//   )
// }

// export default Dashboard
import React, { useState, useEffect } from 'react'
import { account } from '../utils/appwrite'
import { useNavigate, Link, Routes, Route } from 'react-router-dom'
import TaskManager from './TaskManager'
import AnimePoints from './AnimePoints'
import CoffeeCounter from './CoffeeCounter'
import CodingTracker from './CodingTracker'
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
    await account.deleteSession('current')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              to="/dashboard/taskmanager"
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              Task Manager
            </Link>
            <Link
              to="/dashboard/codingtracker"
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              Coding Tracker
            </Link>
            {/* <Link
              to="/dashboard/coffeecounter"
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              Coffee Counter
            </Link> */}
            <Link
              to="/dashboard/animepoints"
              className="text-blue-400 hover:text-blue-300 transition duration-300"
            >
              Anime
            </Link>
            <LogoutButton onClick={handleLogout} />
          </div>
        </div>

        {/* Full-Page Layout for Routes */}
        <Routes>
          <Route
            path="taskmanager"
            element={
              <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <TaskManager />
              </div>
            }
          />
          <Route
            path="codingtracker"
            element={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CodingTracker
                  hoursLogged={hoursLogged}
                  setHoursLogged={setHoursLogged}
                />
              </div>
            }
          />
          {/* <Route
            path="coffeecounter"
            element={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CoffeeCounter userId={userId} setCupsLogged={setCupsLogged} />
              </div>
            }
          /> */}
          <Route
            path="animepoints"
            element={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimePoints
                  hoursLogged={hoursLogged}
                  cupsLogged={cupsLogged}
                />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default Dashboard
