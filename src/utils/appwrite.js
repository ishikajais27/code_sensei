import { Client, Account, Databases, Query } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT)

export const account = new Account(client)
export const databases = new Databases(client)

// Helper function to get user-specific tasks
export const getUserTasks = async (userId) => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE,
      import.meta.env.VITE_APPWRITE_COLLECTION,
      [Query.equal('userId', userId)]
    )
    return response.documents
  } catch (error) {
    console.error('Error fetching user tasks:', error)
    return []
  }
}

export default client
