// Mock base44 client for development
export const base44 = {
  auth: {
    me: async () => ({
      full_name: "Test User"
    })
  },
  entities: {
    MoodEntry: {
      list: async (order, limit) => {
        // Mock data
        return [
          {
            id: 1,
            emotion: "happy",
            transcript: "I'm feeling great today!",
            created_date: new Date().toISOString()
          }
        ];
      }
    },
    JournalEntry: {
      list: async (order, limit) => {
        // Mock data
        return [
          {
            id: 1,
            content: "Today was a good day",
            created_date: new Date().toISOString()
          }
        ];
      }
    }
  }
};