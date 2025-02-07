import React, { useState, useEffect } from 'react'
import TaskManager from './TaskManager'
import CodingQuestionTracker from './CodingQuestionTracker'
import AnimePoints from './AnimePoints'

const ParentComponent = () => {
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [totalQuestionsSolved, setTotalQuestionsSolved] = useState(0)

  // Function to calculate total time spent on tasks
  const calculateTotalTimeSpent = (tasks) => {
    return tasks.reduce((total, task) => total + task.timeSpent, 0)
  }

  // Function to calculate total questions solved
  const calculateTotalQuestionsSolved = (solvedQuestions) => {
    return solvedQuestions.length
  }

  return (
    <div>
      <TaskManager
        onTasksUpdate={(tasks) =>
          setTotalTimeSpent(calculateTotalTimeSpent(tasks))
        }
      />
      <CodingQuestionTracker
        onQuestionsSolved={(solvedQuestions) =>
          setTotalQuestionsSolved(
            calculateTotalQuestionsSolved(solvedQuestions)
          )
        }
      />
      <AnimePoints
        totalTimeSpent={totalTimeSpent}
        totalQuestionsSolved={totalQuestionsSolved}
      />
    </div>
  )
}

export default ParentComponent
