import React, { useState, useEffect, useRef } from 'react'
import {
  Clock,
  Plus,
  Trash,
  Check,
  Square,
  Bell,
  RotateCcw,
} from 'lucide-react'
import { databases, account } from '../utils/appwrite'
import { Client, Account, Databases, Query } from 'appwrite'
import './TaskManager.css'

const DATABASE_ID = '679bdc95000e93686bfe'
const COLLECTION_ID = '679bdd33001fe5ebc7bf'

const TaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [userId, setUserId] = useState('')
  const [activeTimers, setActiveTimers] = useState({})
  const [breakAlerts, setBreakAlerts] = useState({})

  // Ref to store break alert timeouts to clear them later
  const breakAlertTimeoutsRef = useRef({})

  useEffect(() => {
    const fetchUserAndTasks = () => {
      account
        .get()
        .then((user) => {
          setUserId(user.$id)
          fetchTasks(user.$id)
        })
        .catch((error) => {
          console.log('Error fetching user:', error)
        })
    }

    fetchUserAndTasks()
  }, [])

  const fetchTasks = (userId) => {
    databases
      .listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('userId', userId),
      ])
      .then((response) => {
        // Restart timers for tasks that were running before logout
        const tasksWithTimers = response.documents.map((task) => {
          if (task.timer === 'running') {
            startTimer(task.$id)
          }
          return task
        })
        setTasks(tasksWithTimers)
      })
      .catch((error) => {
        console.log('Error fetching tasks:', error)
      })
  }

  const addTask = async () => {
    if (newTask.trim() && userId) {
      try {
        const task = {
          name: newTask,
          Completed: false,
          timeSpent: 0,
          userId: userId,
          timer: 'stopped',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          'unique()',
          task
        )

        setTasks([...tasks, response])
        setNewTask('')
      } catch (error) {
        console.log('Error adding task:', error)
      }
    }
  }

  const deleteTask = async (id) => {
    try {
      // Clear any active timer or break alert for this task
      if (activeTimers[id]) {
        clearInterval(activeTimers[id])
      }
      if (breakAlertTimeoutsRef.current[id]) {
        clearTimeout(breakAlertTimeoutsRef.current[id])
      }

      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
      setTasks(tasks.filter((task) => task.$id !== id))

      // Clean up timers and alerts
      const newActiveTimers = { ...activeTimers }
      delete newActiveTimers[id]
      setActiveTimers(newActiveTimers)

      const newBreakAlerts = { ...breakAlerts }
      delete newBreakAlerts[id]
      setBreakAlerts(newBreakAlerts)
    } catch (error) {
      console.log('Error deleting task:', error)
    }
  }

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find((task) => task.$id === id)
      const updatedTask = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {
          Completed: !task.Completed,
          updatedAt: new Date().toISOString(),
        }
      )
      setTasks(tasks.map((t) => (t.$id === id ? updatedTask : t)))
    } catch (error) {
      console.log('Error toggling task completion:', error)
    }
  }

  const startTimer = (id) => {
    // Stop any other running timers
    Object.keys(activeTimers).forEach((timerId) => {
      if (timerId !== id && activeTimers[timerId]) {
        stopTimer(timerId)
      }
    })

    // Update task status in database
    databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
      timer: 'running',
      updatedAt: new Date().toISOString(),
    })

    // Start timer interval
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.$id === id
            ? {
                ...task,
                timeSpent: task.timeSpent + 1,
                timer: 'running',
              }
            : task
        )
      )
    }, 1000)

    // Set timer for break alert (1 hour = 3600 seconds)
    const breakAlertTimeout = setTimeout(() => {
      setBreakAlerts((prev) => ({
        ...prev,
        [id]: true,
      }))
    }, 3600000) // 1 hour in milliseconds

    // Store interval and timeout
    setActiveTimers((prev) => ({
      ...prev,
      [id]: interval,
    }))
    breakAlertTimeoutsRef.current[id] = breakAlertTimeout
  }

  const stopTimer = async (id) => {
    // Clear interval
    if (activeTimers[id]) {
      clearInterval(activeTimers[id])

      // Clear break alert timeout
      if (breakAlertTimeoutsRef.current[id]) {
        clearTimeout(breakAlertTimeoutsRef.current[id])
      }

      // Remove from active timers
      const newActiveTimers = { ...activeTimers }
      delete newActiveTimers[id]
      setActiveTimers(newActiveTimers)

      // Remove break alert
      const newBreakAlerts = { ...breakAlerts }
      delete newBreakAlerts[id]
      setBreakAlerts(newBreakAlerts)

      const task = tasks.find((task) => task.$id === id)
      try {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
          timeSpent: task.timeSpent,
          timer: 'stopped',
          updatedAt: new Date().toISOString(),
        })
      } catch (error) {
        console.log('Error stopping timer:', error)
      }
    }
  }

  const resetTimer = async (id) => {
    // Stop the timer if it's running
    if (activeTimers[id]) {
      stopTimer(id)
    }

    // Clear break alerts
    const newBreakAlerts = { ...breakAlerts }
    delete newBreakAlerts[id]
    setBreakAlerts(newBreakAlerts)

    // Reset time spent
    try {
      const updatedTask = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        {
          timeSpent: 0,
          timer: 'stopped',
          updatedAt: new Date().toISOString(),
        }
      )

      // Update local state
      setTasks(tasks.map((task) => (task.$id === id ? updatedTask : task)))
    } catch (error) {
      console.log('Error resetting timer:', error)
    }
  }

  const dismissBreakAlert = (id) => {
    const newBreakAlerts = { ...breakAlerts }
    delete newBreakAlerts[id]
    setBreakAlerts(newBreakAlerts)

    // Clear the break alert timeout
    if (breakAlertTimeoutsRef.current[id]) {
      clearTimeout(breakAlertTimeoutsRef.current[id])
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="task-manager-container">
      <div className="task-manager-card">
        <div className="p-6 md:p-8">
          <h2 className="task-manager-header">Task Manager</h2>

          <div className="flex mb-6 gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="task-input"
            />
            <button onClick={addTask} className="add-task-button">
              <Plus size={20} />
              <span className="hidden md:inline">Add Task</span>
            </button>
          </div>

          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.$id}
                className={`task-item ${task.Completed ? 'completed' : ''}`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleComplete(task.$id)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {task.Completed ? (
                        <Check size={24} className="text-green-500" />
                      ) : (
                        <Square size={24} />
                      )}
                    </button>
                    <span
                      className={`task-text ${
                        task.Completed ? 'line-through' : ''
                      }`}
                    >
                      {task.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatTime(task.timeSpent)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Start Button */}
                    <button
                      onClick={() => startTimer(task.$id)}
                      className="start-button timer-button"
                      disabled={task.timer === 'running'}
                    >
                      <Clock size={18} />
                      <span className="hidden sm:inline">Start</span>
                    </button>

                    {/* Stop Button */}
                    <button
                      onClick={() => stopTimer(task.$id)}
                      className="stop-button timer-button"
                      disabled={task.timer !== 'running'}
                    >
                      <Clock size={18} />
                      <span className="hidden sm:inline">Stop</span>
                    </button>

                    {/* Reset Button */}
                    <button
                      onClick={() => resetTimer(task.$id)}
                      className="reset-button timer-button"
                      disabled={task.timeSpent === 0}
                    >
                      <RotateCcw size={18} />
                      <span className="hidden sm:inline">Reset</span>
                    </button>

                    <button
                      onClick={() => deleteTask(task.$id)}
                      className="delete-button"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>

                {/* Break Alert */}
                {breakAlerts[task.$id] && (
                  <div className="break-alert">
                    <div className="break-alert-content">
                      <Bell size={24} className="text-yellow-500 mr-2" />
                      <span>
                        Time for a break! You've been working for 1 hour.
                      </span>
                      <button
                        onClick={() => dismissBreakAlert(task.$id)}
                        className="break-alert-dismiss"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {tasks.length === 0 && (
            <div className="no-tasks-message">
              No tasks yet. Add some tasks to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskManager
