export interface User {
  id: string
  username: string
  email: string
  userType: "candidate" | "company"
  company?: string
  createdAt: string
}

export interface CandidateProfile extends User {
  userType: "candidate"
  level: number
  xp: number
  rank: string
  badges: string[]
  streak: number
  totalSessions: number
}

export interface CompanyProfile extends User {
  userType: "company"
  company: string
  companySize?: string
}

const USERS_STORAGE_KEY = "weebot_users"
const CURRENT_USER_KEY = "weebot_current_user"
const GAMIFICATION_KEY = "weebot_gamification"

export function registerUser(
  username: string,
  email: string,
  password: string,
  userType: "candidate" | "company",
  company?: string,
): { success: boolean; error?: string } {
  const users = getAllUsers()

  if (users.some((u) => u.email === email)) {
    return { success: false, error: "Email already registered" }
  }

  if (users.some((u) => u.username === username)) {
    return { success: false, error: "Username already taken" }
  }

  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    username,
    email,
    userType,
    company: userType === "company" ? company || username : undefined,
    createdAt: new Date().toISOString(),
  }

  users.push({ ...newUser, password } as any)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

  // Initialize gamification profile for candidates
  if (userType === "candidate") {
    initializeGamification(newUser.id)
  }

  setCurrentUser(newUser)
  return { success: true }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers()
  const user = users.find((u) => u.email === email && (u as any).password === password)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  const { password: _, ...userWithoutPassword } = user as any
  setCurrentUser(userWithoutPassword as User)
  return { success: true, user: userWithoutPassword as User }
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function logoutUser() {
  setCurrentUser(null)
}

function getAllUsers(): User[] {
  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : []
}

export function initializeGamification(userId: string) {
  const gamification = getGamification()
  gamification[userId] = {
    level: 1,
    xp: 0,
    rank: "Novice",
    badges: [],
    streak: 0,
    totalSessions: 0,
  }
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(gamification))
}

export function getGamification(userId?: string) {
  const data = localStorage.getItem(GAMIFICATION_KEY)
  const gamification = data ? JSON.parse(data) : {}
  return userId ? gamification[userId] || null : gamification
}

export function addXP(userId: string, xpAmount: number) {
  const gamification = getGamification(userId)
  if (!gamification) return

  gamification.xp += xpAmount
  const xpPerLevel = 500
  const newLevel = Math.floor(gamification.xp / xpPerLevel) + 1

  if (newLevel > gamification.level) {
    gamification.level = newLevel
    gamification.badges = [...new Set([...gamification.badges, `Level ${newLevel}`])]
  }

  updateGamification(userId, gamification)
}

export function updateStreak(userId: string) {
  const gamification = getGamification(userId)
  if (!gamification) return

  gamification.streak = (gamification.streak || 0) + 1
  gamification.totalSessions = (gamification.totalSessions || 0) + 1

  const streakMilestones: { [key: number]: string } = {
    3: "3-Day Streak",
    7: "Week Warrior",
    14: "Fortnite Champion",
    30: "Monthly Master",
  }

  if (streakMilestones[gamification.streak]) {
    gamification.badges = [...new Set([...gamification.badges, streakMilestones[gamification.streak]])]
  }

  updateRank(gamification)
  updateGamification(userId, gamification)
}

function updateRank(gamification: any) {
  const ranks = ["Novice", "Apprentice", "Professional", "Expert", "Master", "Legend"]
  const rankIndex = Math.floor(gamification.level / 5)
  gamification.rank = ranks[Math.min(rankIndex, ranks.length - 1)]
}

function updateGamification(userId: string, data: any) {
  const gamification = getGamification()
  gamification[userId] = data
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(gamification))
}
