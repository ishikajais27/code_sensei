// import React from 'react'
// import ReactDOM from 'react-dom/client'
// // import App from './App'
// // import Main from './TRIAL/app'
// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import SignIn from './TRIAL/SignIn'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Router>
//       <Routes>
//         {/* <Route path="/" element={<App />} /> */}
//         <Route path="/signin" element={<SignIn />} />
//       </Routes>
//     </Router>
//     {/* <App />
//     <Main /> */}
//   </React.StrictMode>
// )
// src/Main.js
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './TRIAL/Main'

// Create a root for rendering
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)
