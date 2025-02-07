// /* The above code is a React component called `Notepad`. Here is a summary of what the code is doing: */
// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import {
//   databases,
//   account,
//   storage,
//   getUserFolders,
//   getFolderNotes,
// // } from '../utils/appwrite'
// import { Query } from 'appwrite'

// const Notepad = () => {
//   const [folders, setFolders] = useState([]) // State for folders
//   const [currentFolder, setCurrentFolder] = useState('')
//   const [notes, setNotes] = useState([])
//   const [currentNote, setCurrentNote] = useState('')
//   const [editingIndex, setEditingIndex] = useState(null)
//   const [userId, setUserId] = useState('')

//   // Check if the user is authenticated
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const user = await account.get()
//         setUserId(user.$id) // Set the authenticated user's ID
//         const userFolders = await getUserFolders(user.$id) // Fetch folders for the authenticated user
//         setFolders(userFolders)
//       } catch (error) {
//         console.error('User not authenticated:', error)
//         window.location.href = '/login' // Redirect to login page if not authenticated
//       }
//     }
//     checkAuth()
//   }, [])

//   // Load notes for the selected folder
//   useEffect(() => {
//     if (currentFolder) {
//       const fetchNotes = async () => {
//         try {
//           const folderNotes = await getFolderNotes(currentFolder) // Fetch notes for the selected folder
//           setNotes(folderNotes)
//         } catch (error) {
//           console.error('Error fetching notes:', error)
//           alert('Failed to fetch notes. Please try again.')
//         }
//       }
//       fetchNotes()
//     }
//   }, [currentFolder])

//   // Add a new folder
//   const handleAddFolder = async () => {
//     if (currentFolder.trim() === '') return
//     try {
//       const response = await databases.createDocument(
//         '679bdc95000e93686bfe', // Database ID
//         '67a104e90013e61181e9', // Folders Collection ID
//         'unique()', // Document ID
//         {
//           name: currentFolder,
//           userId,
//           createdAt: new Date().toISOString(), // Add createdAt field
//           updatedAt: new Date().toISOString(), // Add updatedAt field
//         }
//       )
//       setFolders([...folders, response])
//       setCurrentFolder('')
//     } catch (error) {
//       console.error('Error creating folder:', error)
//       alert('Failed to create folder. Please try again.')
//     }
//   }

//   // Add or update a note
//   const handleAddNote = async () => {
//     if (currentNote.trim() === '') return

//     try {
//       if (editingIndex !== null) {
//         // Update existing note
//         const updatedNotes = [...notes]
//         updatedNotes[editingIndex].content = currentNote
//         setNotes(updatedNotes)
//         await databases.updateDocument(
//           '679bdc95000e93686bfe', // Database ID
//           '67a1084f00029c4d87c9', // Notes Collection ID
//           notes[editingIndex].$id, // Document ID
//           {
//             content: currentNote,
//             updatedAt: new Date().toISOString(), // Update updatedAt field
//           }
//         )
//         setEditingIndex(null)
//       } else {
//         // Add new note
//         const response = await databases.createDocument(
//           '679bdc95000e93686bfe', // Database ID
//           '67a1084f00029c4d87c9', // Notes Collection ID
//           'unique()', // Document ID
//           {
//             content: currentNote,
//             folderId: currentFolder,
//             createdAt: new Date().toISOString(), // Add createdAt field
//             updatedAt: new Date().toISOString(), // Add updatedAt field
//           }
//         )
//         setNotes([...notes, response])
//       }
//       setCurrentNote('')
//     } catch (error) {
//       console.error('Error adding/updating note:', error)
//       alert('Failed to add/update note. Please try again.')
//     }
//   }

//   // Edit a note
//   const handleEditNote = (index) => {
//     setCurrentNote(notes[index].content)
//     setEditingIndex(index)
//   }

//   // Delete a note
//   const handleDeleteNote = async (index) => {
//     const noteId = notes[index].$id
//     try {
//       await databases.deleteDocument(
//         '679bdc95000e93686bfe', // Database ID
//         '67a1084f00029c4d87c9', // Notes Collection ID
//         noteId // Document ID
//       )
//       const filteredNotes = notes.filter((_, i) => i !== index)
//       setNotes(filteredNotes)
//     } catch (error) {
//       console.error('Error deleting note:', error)
//       alert('Failed to delete note. Please try again.')
//     }
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="container mx-auto p-6 bg-white shadow-lg rounded-lg"
//     >
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
//         Personal Notepad
//       </h2>

//       <div className="mb-4 flex">
//         <input
//           type="text"
//           value={currentFolder}
//           onChange={(e) => setCurrentFolder(e.target.value)}
//           placeholder="Enter folder name..."
//           className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
//         />
//         <button
//           onClick={handleAddFolder}
//           className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
//         >
//           Add Folder
//         </button>
//       </div>

//       <div className="mt-6">
//         {folders.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No folders yet. Start adding some!
//           </p>
//         ) : (
//           <ul className="space-y-3">
//             {folders.map((folder, index) => (
//               <li
//                 key={index}
//                 onClick={() => setCurrentFolder(folder.$id)}
//                 className="cursor-pointer hover:text-blue-500"
//               >
//                 {folder.name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Notes Section */}
//       <div className="mt-6">
//         {notes.length === 0 ? (
//           <p className="text-center text-gray-500">
//             No notes yet. Start adding some!
//           </p>
//         ) : (
//           <ul className="space-y-3">
//             {notes.map((note, index) => (
//               <motion.li
//                 key={index}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-gray-100 p-3 rounded-lg flex justify-between items-center shadow-sm"
//               >
//                 <span className="flex-grow mr-4">{note.content}</span>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleEditNote(index)}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteNote(index)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </motion.li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </motion.div>
//   )
// }

// export default Notepad
import React, { useState, useEffect } from 'react'
import { databases } from '../utils/appwrite'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import './Coffee.css'
import { Query } from 'appwrite'
const DATABASE_ID = '679bdc95000e93686bfe' // Replace with your database ID
const COLLECTION_ID = '67a11cfc001204a521d4' // Replace with your collection ID

const CoffeeCounter = ({ userId, setCupsLogged }) => {
  const [cups, setCups] = useState(0) // Number of cups to log
  const [coffeeLogs, setCoffeeLogs] = useState([]) // List of coffee logs

  // Fetch coffee logs from Appwrite
  const fetchCoffeeLogs = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('userId', userId), // Fetch logs for the current user
        ]
      )
      setCoffeeLogs(response.documents)
      // Update cupsLogged in Dashboard
      const totalCups = response.documents.reduce(
        (sum, log) => sum + log.cups,
        0
      )
      setCupsLogged(totalCups)
    } catch (error) {
      console.log('Error fetching coffee logs:', error)
    }
  }

  // Add a new coffee log
  const addCoffeeLog = async () => {
    if (cups > 0) {
      try {
        const log = {
          userId: userId,
          cups: cups,
          date: new Date().toISOString(),
        }

        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          'unique()',
          log
        )
        setCups(0) // Reset input
        fetchCoffeeLogs() // Refresh logs
      } catch (error) {
        console.log('Error adding coffee log:', error)
      }
    }
  }

  // Format data for the chart
  const formatChartData = () => {
    return coffeeLogs.map((log) => ({
      date: new Date(log.date).toLocaleDateString(), // Format date
      cups: log.cups,
    }))
  }

  useEffect(() => {
    if (userId) {
      fetchCoffeeLogs() // Fetch logs when the component mounts
    }
  }, [userId])

  return (
    <div className="coffee-counter-container">
      <h2>Coffee Counter</h2>

      {/* Input to log coffee */}
      <div className="coffee-input">
        <input
          type="number"
          value={cups}
          onChange={(e) => setCups(parseInt(e.target.value, 10))}
          placeholder="Cups of coffee"
          min="0"
        />
        <button onClick={addCoffeeLog}>Add</button>
      </div>

      {/* Graph to visualize coffee consumption */}
      <div className="coffee-chart">
        <BarChart
          width={600}
          height={300}
          data={formatChartData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cups" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Display coffee logs */}
      <div className="coffee-logs">
        <h3>Your Coffee Logs</h3>
        <ul>
          {coffeeLogs.map((log) => (
            <li key={log.$id}>
              {log.cups} cups on {new Date(log.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CoffeeCounter
