// import React, { useState } from 'react'
// import TaskManager from './TaskManager'
// import CodingTracker from './AnimePoints'
// import CoffeeCounter from './CoffeeCounter'
// import AnimePoints from './CodingTracker'
// import SignIn from './SignIn'
// const Main = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [hoursLogged, setHoursLogged] = useState(0)
//   const [cupsLogged, setCupsLogged] = useState(0)

//   const handleLogin = () => {
//     setIsAuthenticated(true) // Update state on successful login
//   }

//   return (
//     <div>
//       {!isAuthenticated ? (
//         <SignIn onLogin={handleLogin} />
//       ) : (
//         <>
//           <TaskManager />
//           <CodingTracker
//             hoursLogged={hoursLogged}
//             setHoursLogged={setHoursLogged}
//           />
//           <CoffeeCounter
//             cupsLogged={cupsLogged}
//             setCupsLogged={setCupsLogged}
//           />
//           <AnimePoints hoursLogged={hoursLogged} cupsLogged={cupsLogged} />
//         </>
//       )}
//     </div>
//   )
// }

// export default Main
// src/App.jsx
import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import SignIn from './SignIn'
import Dashboard from './DashBoard'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
