import { Client, Account, Databases, Query } from 'appwrite'

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('679a68a50000913947d3')

export const account = new Account(client)
export const databases = new Databases(client)

// Optional: Helper function to get user-specific tasks
export const getUserTasks = async (userId) => {
  try {
    const response = await databases.listDocuments(
      '679bdc95000e93686bfe', // Your DATABASE_ID
      '679bdd33001fe5ebc7bf',
      '67a11cfc001204a521d4'[Query.equal('userId', userId)]
    )
    return response.documents
  } catch (error) {
    console.error('Error fetching user tasks:', error)
    return []
  }
}

export default client
