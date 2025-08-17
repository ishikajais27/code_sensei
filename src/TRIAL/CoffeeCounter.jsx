import React, { useState, useEffect } from 'react'
import { databases } from '../../backend/utils/appwrite'
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
