export interface CommunicationSession {
  id: string
  type: "communication"
  date: string
  duration: number
  transcript: string
  questions: string[]
  questionsAnswered: number
  score?: number
  recordings?: Blob
}

export interface CodingSession {
  id: string
  type: "coding"
  date: string
  duration: number
  problemsSolved: number
  totalProblems: number
  accuracy: number
  score: number
}

export type Session = CommunicationSession | CodingSession

const STORAGE_KEY = "weebot_sessions"

export function getSessions(): Session[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error reading sessions from storage:", error)
    return []
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return

  try {
    const sessions = getSessions()
    sessions.push(session)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error("Error saving session to storage:", error)
  }
}

export function getSessionById(id: string): Session | null {
  const sessions = getSessions()
  return sessions.find((s) => s.id === id) || null
}

export function getSessionsByType(type: "communication" | "coding"): Session[] {
  const sessions = getSessions()
  return sessions.filter((s) => s.type === type)
}

export function deleteSession(id: string): void {
  if (typeof window === "undefined") return

  try {
    const sessions = getSessions()
    const filtered = sessions.filter((s) => s.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Error deleting session from storage:", error)
  }
}

export function getStats(type?: "communication" | "coding") {
  const sessions = type ? getSessionsByType(type) : getSessions()

  const totalSessions = sessions.length
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
  const averageScore =
    sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length) : 0

  return {
    totalSessions,
    totalDuration,
    averageScore,
  }
}
