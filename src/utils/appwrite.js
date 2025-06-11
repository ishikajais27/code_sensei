// import { Client, Account, Databases, Query } from 'appwrite'

// const client = new Client()
//   .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//   .setProject(import.meta.env.VITE_APPWRITE_PROJECT)

// export const account = new Account(client)
// export const databases = new Databases(client)

// // Helper function to get user-specific tasks
// export const getUserTasks = async (userId) => {
//   try {
//     const response = await databases.listDocuments(
//       import.meta.env.VITE_APPWRITE_DATABASE,
//       import.meta.env.VITE_APPWRITE_COLLECTION,
//       [Query.equal('userId', userId)]
//     )
//     return response.documents
//   } catch (error) {
//     console.error('Error fetching user tasks:', error)
//     return []
//   }
// }

// export default client
import { Client, Account, Databases, Query } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT)
  .setSelfSigned(true) // Only if using self-signed certificate

// Add global error interceptor
client.subscribe('response', (response) => {
  if (response.code >= 400) {
    console.error('Appwrite Error:', {
      code: response.code,
      message: response.message,
      type: response.type,
    })
  }
})

export const account = new Account(client)
export const databases = new Databases(client)

export const getUserTasks = async (userId) => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE,
      import.meta.env.VITE_APPWRITE_COLLECTION,
      [Query.equal('userId', userId)]
    )
    return response.documents
  } catch (error) {
    console.error('Appwrite Error Details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      response: error.response,
    })
    return []
  }
}

export default client
